import React, { useEffect, useState, useRef } from "react";

const MIN_TEMP = 18;
const MAX_TEMP = 30;
const START_ANGLE = -100;  // 18°C
const DEGREE_RANGE = 102;  // sweep to +45° (30°C)
const SIZE = 285;          // dial size
const ARC_RADIUS = 100;    // must match SVG path radius

const TemperatureDial = ({ onTempChange, fanSpeed, initialTemperature }) => {
  const [angle, setAngle] = useState(START_ANGLE);
  const [temperature, setTemperature] = useState(initialTemperature || MIN_TEMP);
  const dialRef = useRef(null);

  // Sync with prop changes
  useEffect(() => {
    if (initialTemperature !== undefined) {
      const tempValue =
        typeof initialTemperature === "string"
          ? parseFloat(initialTemperature)
          : initialTemperature;

      setTemperature(tempValue);
      setAngle(temperatureToAngle(tempValue));
    }
  }, [initialTemperature]);

  // Convert angle to temperature
  const angleToTemperature = (ang) => {
    const relative = Math.min(Math.max(ang - START_ANGLE, 0), DEGREE_RANGE);
    return (relative / DEGREE_RANGE) * (MAX_TEMP - MIN_TEMP) + MIN_TEMP;
  };

  // Convert temp to angle
  const temperatureToAngle = (temp) => {
    const t = typeof temp === "string" ? parseFloat(temp) : temp;
    const clamped = Math.min(Math.max(t, MIN_TEMP), MAX_TEMP);
    return ((clamped - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * DEGREE_RANGE + START_ANGLE;
  };

  // Drag logic
  const handleDrag = (event) => {
    event.preventDefault();

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..+180
    const clamped = Math.min(Math.max(deg, START_ANGLE), START_ANGLE + DEGREE_RANGE);

    setAngle(clamped);
    const temp = angleToTemperature(clamped);
    const roundedTemp = Math.round(temp * 10) / 10;
    setTemperature(roundedTemp);
    onTempChange?.(roundedTemp);
  };

  useEffect(() => {
    const handle = dialRef.current?.querySelector(".temp-control-handle");

    const start = () => {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", end);
      window.addEventListener("touchmove", handleDrag, { passive: false });
      window.addEventListener("touchend", end);
    };

    const end = () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", end);
    };

    handle?.addEventListener("mousedown", start);
    handle?.addEventListener("touchstart", start, { passive: false });

    return () => {
      handle?.removeEventListener("mousedown", start);
      handle?.removeEventListener("touchstart", start);
      end();
    };
  }, []);

  // Fan speed text
  const getFanSpeedDescription = (speed) => {
    switch (speed) {
      case 0:
      case "0":
        return "High";
      case 1:
      case "1":
        return "Medium";
      case 2:
      case "2":
        return "Low";
      default:
        return "High";
    }
  };

  return (
    <div
      className="temp-container"
      ref={dialRef}
      style={{ position: "relative", width: SIZE, height: SIZE }}
    >
      <div
        className="temp-circle-control"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {/* Arc Path */}
        <svg
          className="temp-curve-arc"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d="M 142.5 32 A 110 110 0 0 1 252 142.5"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.7"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        {/* INNER WHITE CIRCLE, perfectly centered */}
        <div
          className="temp-inner-circle"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <div
            className="temp-temperature"
            style={{ fontSize: 32, fontWeight: 700, color: "#000", lineHeight: 1 }}
          >
            {typeof temperature === "string"
              ? parseFloat(temperature).toFixed(1)
              : temperature.toFixed(1)}
            °C
          </div>

          <div className="temp-fan-container" style={{ marginTop: 6, textAlign: "center" }}>
            <div
              className="temp-fan-icon-container"
              style={{ display: "flex", gap: 4, justifyContent: "center" }}
            >
              <div style={{ width: 6, height: 14, background: "#000", opacity: 0.5 }} />
              <div style={{ width: 6, height: 18, background: "#000", opacity: 0.8 }} />
              <div style={{ width: 6, height: 22, background: "#000" }} />
            </div>
            <span className="temp-fan-speed" style={{ display: "block", color: "#000" }}>
              {getFanSpeedDescription(fanSpeed)}
            </span>
            <div className="temp-fan-label" style={{ fontSize: 12, color: "#000" }}>
              Fan Speed
            </div>
          </div>
        </div>

        {/* HANDLE: rides on arc */}
        <div
          className="temp-control-handle"
          style={{
            position: "absolute",
            left: "43%",
            top: "47%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: "white",
            border: "2px solid #2b7ed6",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translate(0, -${ARC_RADIUS}px)`,
            touchAction: "none",
            cursor: "pointer",
          }}
          title="Drag to set temperature"
        />

        {/* Ticks (unchanged) */}
        {[...Array(48)].map((_, i) => (
          <div
            key={i}
            className="temp-tick"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 2,
              height: 8,
              background: "rgba(255,255,255,0.3)",
              borderRadius: 2,
              transform: `translate(-50%, -50%) rotate(${i * 7.5}deg) translate(0, -135px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TemperatureDial;
