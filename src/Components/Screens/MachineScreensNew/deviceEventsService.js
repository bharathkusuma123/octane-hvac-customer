// deviceEventsService.js
// Single source of truth for reading device state from /events/filter/ and
// /connectivity-check/ — replaces the backend's /get-latest-data entirely.

const EVENTS_FILTER_API_URL = "https://mdata.air2o.net/events/filter/";
const CONNECTIVITY_CHECK_API_URL = "https://mdata.air2o.net/connectivity-check/";

// bit positions inside Batch 3's DS field (mirrors backend DS_FLAGS)
const DS_FLAGS = { EOF: 0, HORB: 1, HPHF: 2, CDF: 3, HPC: 4, HPS: 5, ISOC: 6 };

function detectBatchType(payload) {
  if (payload.startsWith("0xA1")) return "Batch 1";
  if (payload.startsWith("0xA2")) return "Batch 2";
  if (payload.startsWith("0xA3")) return "Batch 3";
  return null;
}

// Parses "0xA3,DI:2507GM0294,FS:2,MD:4,...,0xZA" into { DI, FS, MD, ... }
export function parseEventPayload(payloadStr) {
  if (!payloadStr || typeof payloadStr !== "string") return null;
  try {
    const result = {};
    payloadStr.split(",").forEach((part) => {
      const trimmed = part.trim();
      const sepIndex = trimmed.indexOf(":");
      if (sepIndex === -1) return; // skip header/footer tokens like "0xA3" / "0xZA"
      const key = trimmed.slice(0, sepIndex).trim();
      const value = trimmed.slice(sepIndex + 1).trim();
      if (key) result[key] = value;
    });
    return result;
  } catch (e) {
    console.error("❌ Failed to parse event payload:", e);
    return null;
  }
}

function decodeDS(dsValue) {
  const intVal = parseInt(dsValue, 10);
  if (isNaN(intVal)) return {};
  const flags = {};
  for (const [name, bit] of Object.entries(DS_FLAGS)) {
    flags[name] = (intVal >> bit) & 1;
  }
  return flags;
}

// ── Connectivity check — this is the REAL is_online source ──
// Returns a Map keyed by pcb_serial_number -> { is_online, last_seen, created_at }
export async function fetchConnectivityMap() {
  try {
    const response = await fetch(CONNECTIVITY_CHECK_API_URL);
    if (!response.ok) throw new Error(`Connectivity check failed: ${response.status}`);
    const data = await response.json();
    const rows = Array.isArray(data) ? data : data.results || data.data || [];

    const map = new Map();
    rows.forEach((row) => {
      if (row.pcb_serial_number) {
        map.set(row.pcb_serial_number, {
          is_online: !!row.is_online,
          last_seen: row.last_seen,
          created_at: row.created_at,
        });
      }
    });
    return map;
  } catch (err) {
    console.error("❌ Connectivity check fetch error:", err);
    return new Map(); // empty map — callers should treat missing entries as offline/unknown
  }
}

// Convenience single-device lookup (still hits the same endpoint — see the
// "N+1" note below if you're calling this in a loop)
export async function fetchConnectivityForDevice(pcbSerialNumber) {
  const map = await fetchConnectivityMap();
  return map.get(pcbSerialNumber) || { is_online: false, last_seen: null, created_at: null };
}

// Raw fetch shared by everything below — returns events newest-first,
// filtered to ones that actually carry this device's DI.
async function rawFetchEvents(pcbSerialNumber, limit = 30) {
  if (!pcbSerialNumber) return [];
  const url = `${EVENTS_FILTER_API_URL}?device_id=${encodeURIComponent(pcbSerialNumber)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
  const data = await response.json();
  const rawEvents = Array.isArray(data) ? data : data.results || data.data || [];

  const needle = `DI:${pcbSerialNumber}`;
  return rawEvents
    .filter((ev) => typeof ev.payload === "string" && ev.payload.includes(needle))
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, limit);
}

export async function fetchDeviceEvents(pcbSerialNumber, limit = 30) {
  try {
    return await rawFetchEvents(pcbSerialNumber, limit);
  } catch (err) {
    console.error(`❌ Event fetch error for ${pcbSerialNumber}:`, err);
    return [];
  }
}

// Only 0xA3 status records, parsed, newest first — used by the fast
// command-confirmation poll.
export async function fetchStatusEventsForPCB(pcbSerialNumber) {
  const events = await fetchDeviceEvents(pcbSerialNumber);
  if (!events.length) return [];

  const statusEvents = events.filter(
    (ev) => typeof ev.payload === "string" && ev.payload.trim().startsWith("0xA3")
  );
  const candidates = statusEvents.length ? statusEvents : events;

  return candidates
    .map((ev) => ({ id: ev.id, created_at: ev.created_at, parsed: parseEventPayload(ev.payload) }))
    .filter((ev) => ev.parsed !== null)
    .sort((a, b) => Number(b.id) - Number(a.id));
}

// Reduces mixed events + a known online flag into the /get-latest-data shape.
function buildSegregatedData(rawEvents, pcbSerialNumber, isOnline) {
  const latestByBatch = {};
  for (const ev of rawEvents) {
    const batchType = detectBatchType(ev.payload.trim());
    if (!batchType) continue;
    if (!latestByBatch[batchType] || Number(ev.id) > Number(latestByBatch[batchType].id)) {
      latestByBatch[batchType] = { ...ev, parsed: parseEventPayload(ev.payload) };
    }
  }

  const b1 = latestByBatch["Batch 1"]?.parsed || {};
  const b3 = latestByBatch["Batch 3"]?.parsed || {};
  const dsFlags = b3.DS !== undefined ? decodeDS(b3.DS) : {};

  const asValue = (v) => (v === undefined ? null : { value: v });

  return {
    pcb_serial_number: pcbSerialNumber,
    is_online: isOnline,

    outdoor_temperature: b1.ODT !== undefined ? { value: parseFloat(b1.ODT) / 10 } : null,
    room_humidity: asValue(b1.RH),
    room_temperature: b1.RT !== undefined ? { value: parseFloat(b1.RT) / 10 } : null,

    mode: asValue(b3.MD),
    fan_speed: asValue(b3.FS),
    set_temperature: b3.SRT !== undefined ? { value: parseInt(b3.SRT, 10) } : null,
    alarm_occurred: asValue(b3.LEU),

    hvac_on: dsFlags.HPS !== undefined ? { value: String(dsFlags.HPS) } : null,
    hvac_busy: dsFlags.HORB !== undefined ? { value: String(dsFlags.HORB) } : null,
    error_flag: dsFlags.EOF !== undefined ? { value: String(dsFlags.EOF) } : null,
  };
}

// Single device — replaces GET /get-latest-data/<pcb>/
// Hits both /events/filter/ and /connectivity-check/ for this one device.
export async function fetchSegregatedDeviceData(pcbSerialNumber) {
  const [events, connectivity] = await Promise.all([
    fetchDeviceEvents(pcbSerialNumber),
    fetchConnectivityForDevice(pcbSerialNumber),
  ]);
  if (!events.length && !connectivity) return null;
  return buildSegregatedData(events, pcbSerialNumber, connectivity.is_online);
}

// Multiple devices at once — replaces GET /get-latest-data/ (no pcb, all devices).
// Fetches connectivity ONCE (single request covers every device), then events
// per device in parallel — avoids hitting /connectivity-check/ N times.
export async function fetchAllDevicesSegregatedData(serviceItems) {
  const connectivityMap = await fetchConnectivityMap();

  const results = await Promise.all(
    serviceItems.map(async (item) => {
      if (!item.pcb_serial_number) return null;
      const events = await fetchDeviceEvents(item.pcb_serial_number);
      const conn = connectivityMap.get(item.pcb_serial_number) || { is_online: false };
      const data = buildSegregatedData(events, item.pcb_serial_number, conn.is_online);
      return { ...data, service_item_id: item.service_item_id };
    })
  );
  return results.filter(Boolean);
}