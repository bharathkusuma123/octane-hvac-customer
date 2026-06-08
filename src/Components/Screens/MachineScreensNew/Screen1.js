// // Screen1.js — ALL FIXES (Fix1 + Fix2 repositioned banner + Fix3)
// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   FiPower,
//   FiWind,
//   FiClock,
//   FiWatch,
//   FiSettings,
//   FiZap,
//   FiLogOut,
//   FiSun,
//   FiDroplet,
//   FiThermometer,
//   FiRefreshCw,
//   FiChevronDown,
// } from "react-icons/fi";
// import { FaFan } from "react-icons/fa";
// import "./Screen1.css";
// import AIROlogo from "./Images/AIRO.png";
// import greenAire from "./Images/greenAire.png";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../AuthContext/AuthContext";
// import TemperatureDial from "./TemperatureDial";
// import baseURL from "../../ApiUrl/Apiurl";
// import NoServiceItems from "./NoServiceItems";
// import Loading from "./Loading";

// // Constants
// const MODE_MAP = {
//   1: "IDEC",
//   2: "Auto",
//   3: "Fan",
//   4: "Indirect",
//   5: "Direct",
// };

// const PULL_THRESHOLD = 80;
// const MAX_PULL = 120;

// // ✅ FIX 3: Progressive messages every 10s
// const PROCESSING_MESSAGES = [
//   "Sending command...",
//   "Almost done, please wait...",
//   "Waiting for device response...",
// ];

// const getStoredService = () => {
//   try {
//     const stored = localStorage.getItem("selectedService");
//     return stored ? JSON.parse(stored) : null;
//   } catch (e) {
//     return null;
//   }
// };

// const formatTemp = (temp) => {
//   if (temp == null) return "0.0";
//   const num = parseFloat(temp);
//   return isNaN(num) ? "0.0" : num.toFixed(1);
// };

// const sendRefreshCommand = async (pcbSerialNumber, sensorData) => {
//   const payload = {
//     Header: "0xAA",
//     DI: pcbSerialNumber || "2411GM-0102",
//     MD: sensorData.mode || "3",
//     FS: sensorData.fanSpeed || "0",
//     SRT: sensorData.temperature || 25,
//     HVAC: "3",
//     Footer: "0xZX",
//   };
//   console.group("🔁 REFRESH COMMAND");
//   console.log("📦 Payload:", payload);
//   console.groupEnd();
//   try {
//     const response = await fetch("https://mdata.air2o.net/controllers/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     let responseBody;
//     try {
//       responseBody = await response.json();
//     } catch {
//       responseBody = await response.text();
//     }
//     if (!response.ok) {
//       return {
//         success: false,
//         error: responseBody?.error || responseBody?.message || "Command rejected by server",
//         status: response.status,
//       };
//     }
//     return { success: true, data: responseBody };
//   } catch (error) {
//     return { success: false, error: "Network error or server unreachable" };
//   }
// };

// const Screen1 = () => {
//   const { user, logout } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [pullToRefresh, setPullToRefresh] = useState({
//     isPulling: false,
//     pullDistance: 0,
//     isRefreshing: false,
//   });

//   const touchStartY = useRef(0);
//   const containerRef = useRef(null);

//   // ✅ FIX 1: Single interval, PCB switching via ref
//   const activePCBRef = useRef(null);
//   const fetchIntervalRef = useRef(null);

//   // ✅ FIX 3: Processing message cycling refs
//   const processingTimerRef = useRef(null);
//   const processingMsgIndexRef = useRef(0);
//   const hardStopTimerRef = useRef(null);

//   const [serviceItems, setServiceItems] = useState([]);
//   const [selectedService, setSelectedService] = useState(getStoredService());
//   const [showServiceDropdown, setShowServiceDropdown] = useState(false);
//   const [processing, setProcessing] = useState({ status: false, message: "" });
//   const [errorCount, setErrorCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [refreshStatus, setRefreshStatus] = useState({
//     sending: false,
//     success: false,
//     message: "",
//   });
//   const [dropdownAlarmCount, setDropdownAlarmCount] = useState(0);

//   // Add this alongside your other refs
// const processingStartTimeRef = useRef(null);
// const MIN_PROCESSING_TIME = 5000; // 5 seconds minimum before poll can clear it

//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: "0",
//     temperature: 25,
//     powerStatus: "off",
//     mode: "3",
//     errorFlag: "0",
//     hvacBusy: "0",
//     deviceId: "",
//     alarmOccurred: "0",
//     isOnline: true,
//   });

//   useEffect(() => {
//     if (selectedService) {
//       localStorage.setItem("selectedService", JSON.stringify(selectedService));
//     }
//   }, [selectedService]);

//   // ✅ FIX 3: Start progressive message cycle
//  const startProcessingCycle = () => {
//   processingMsgIndexRef.current = 0;
//   processingStartTimeRef.current = Date.now(); // ← ADD THIS LINE
//   setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

//   processingTimerRef.current = setInterval(() => {
//     processingMsgIndexRef.current += 1;
//     const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
//     if (nextMsg) {
//       setProcessing({ status: true, message: nextMsg });
//     }
//   }, 10000);

//   hardStopTimerRef.current = setTimeout(() => {
//     stopProcessing();
//   }, 25000);
// };

//   const stopProcessing = () => {
//     if (processingTimerRef.current) {
//       clearInterval(processingTimerRef.current);
//       processingTimerRef.current = null;
//     }
//     if (hardStopTimerRef.current) {
//       clearTimeout(hardStopTimerRef.current);
//       hardStopTimerRef.current = null;
//     }
//     setProcessing({ status: false, message: "" });
//   };

//   // Called when polling detects hvac_busy flipped to 0
//  const clearProcessingIfDone = () => {
//   if (processingTimerRef.current || hardStopTimerRef.current) {
//     const elapsed = Date.now() - (processingStartTimeRef.current || 0);
//     if (elapsed >= MIN_PROCESSING_TIME) {  // ← GUARD: only clear after 5s
//       stopProcessing();
//     }
//     // else: too soon, keep showing messages — next poll will check again
//   }
// };

//   useEffect(() => {
//     return () => {
//       if (processingTimerRef.current) clearInterval(processingTimerRef.current);
//       if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
//     };
//   }, []);

//    useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await fetch(
//           `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch service items");

//         const data = await response.json();
//         setServiceItems(data.data || []);

//         if (data.data?.length > 0 && !selectedService) {
//           const first = data.data[0];
//           setSelectedService(first);
//           activePCBRef.current = first.pcb_serial_number;
//         }

//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       } catch (error) {
//         console.error("Error fetching service items:", error);
//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       }
//     };

//     fetchServiceItems();
//   }, [manualRefresh]);

//   // ✅ FIX 1: Single polling interval started once on mount
 
//     const fetchData = async () => {
//       const pcbSerialNumber = activePCBRef.current;
//       if (!pcbSerialNumber) return;

//       try {
//         const response = await fetch(
//           `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`
//         );
//         if (!response.ok) throw new Error("Network response was not ok");

//         const data = await response.json();
//         if (data.status !== "success" || !data.data) return;

//         // Guard: ignore stale responses from a previous PCB
//         if (activePCBRef.current !== pcbSerialNumber) return;

//         const deviceData = data.data;
//         const isOnline = deviceData.is_online;

//         setSensorData({
//           // ✅ FIX 2: Null out values when offline so UI shows "—"
//           outsideTemp: isOnline ? deviceData.outdoor_temperature?.value : null,
//           humidity: isOnline ? deviceData.room_humidity?.value : null,
//           roomTemp: isOnline ? deviceData.room_temperature?.value : null,
//           fanSpeed: isOnline ? deviceData.fan_speed?.value : "0",
//           temperature: isOnline ? deviceData.set_temperature?.value : 25,
//           powerStatus: isOnline && deviceData.hvac_on?.value == "1" ? "on" : "off",
//           mode: deviceData.mode?.value,
//           errorFlag: isOnline ? deviceData.error_flag?.value : "0",
//           hvacBusy: isOnline ? deviceData.hvac_busy?.value : "0",
//           deviceId: pcbSerialNumber,
//           alarmOccurred: deviceData.alarm_occurred?.value,
//           isOnline: isOnline,
//         });

//         const alarmValue = deviceData.alarm_occurred?.value;
//         setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

//         // ✅ FIX 3: Early exit from processing if hvac responded
//         if (deviceData.hvac_busy?.value == "0") {
//           clearProcessingIfDone();
//         }
//       } catch (err) {
//         console.error("❌ Fetch error:", err);
//       }
//     };

//     const fetchAllAlarms = async () => {
//   try {
//     const response = await fetch(
//       `${baseURL}/get-latest-data/?user_id=${userId}&company_id=${company_id}`
//     );

//     if (!response.ok) throw new Error("Failed to fetch all alarms");

//     const data = await response.json();

//     if (data.status !== "success" || !data.data) return;

//     // 🔴 Count alarms across ALL devices
//     const alarmCount = data.data.reduce((count, item) => {
//       const val = item.alarm_occurred?.value;

//       if (val && val !== "0") {
//         return count + Number(val);
//       }
//       return count;
//     }, 0);

//     setDropdownAlarmCount(alarmCount);
//   } catch (err) {
//     console.error("Dropdown alarm fetch error:", err);
//   }
// };

//  useEffect(() => {
//   fetchData();
//   fetchAllAlarms(); // 🔴 NEW

//   fetchIntervalRef.current = setInterval(() => {
//     fetchData(); 
//     fetchAllAlarms(); // 🔴 keep updating badge
//   }, 1000);

//   return () => {
//     if (fetchIntervalRef.current) {
//       clearInterval(fetchIntervalRef.current);
//       fetchIntervalRef.current = null;
//     }
//   };
// }, []);

//   // ✅ FIX 1: Just update the ref, no interval restart
//   useEffect(() => {
//     if (selectedService?.pcb_serial_number) {
//       console.log("🔄 Switching active PCB to:", selectedService.pcb_serial_number);
//       activePCBRef.current = selectedService.pcb_serial_number;
//     }
//   }, [selectedService?.pcb_serial_number]);

 

//   const sendRefreshToController = async () => {
//     if (!selectedService?.pcb_serial_number) {
//       setRefreshStatus({ sending: false, success: false, message: "No device selected" });
//       return { success: false };
//     }
//     try {
//       const result = await sendRefreshCommand(selectedService.pcb_serial_number, sensorData);
//       if (result.success) {
//         setRefreshStatus({ sending: false, success: true, message: "Refresh sent successfully" });
//         setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 3000);
//         return result;
//       }
//       const msg = result?.error || result?.message || "Failed to send refresh command";
//       setRefreshStatus({ sending: false, success: false, message: msg });
//       setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 2000);
//       return result;
//     } catch (error) {
//       setRefreshStatus({ sending: false, success: false, message: error.message || "Unexpected error" });
//       return { success: false };
//     }
//   };

//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.touches[0].clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleTouchEnd = async () => {
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleMouseDown = (e) => {
//     touchStartY.current = e.clientY;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleMouseUp = async () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const handlePowerToggle = async () => {
//     try {
//       if (processing.status || sensorData.hvacBusy == "1") {
//         const msg = sensorData.hvacBusy == "1" ? "System is busy, please wait..." : "Please wait...";
//         setProcessing({ status: true, message: msg });
//         return;
//       }

//       // ✅ FIX 3: Start cycling messages
//       startProcessingCycle();

//       const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";
//       const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: isShutdown ? "3" : sensorData.mode,
//         FS: isShutdown ? "0" : sensorData.fanSpeed,
//         SRT: sensorData.temperature,
//         HVAC: newHvacValue,
//         Footer: "0xZX",
//       };

//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error("❌ API error:", response.status);
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }

//       const result = await response.text();
//       console.log("✅ Command sent:", result);
//       // Don't stop here — polling will detect hvac_busy=0 and stop automatically
//     } catch (error) {
//       console.error("🔥 Power toggle error:", error.message);
//       stopProcessing();
//     }
//   };

//   const handleNavigation = (path) => {
//     if (!processing.status) navigate(path);
//   };

//   // ✅ FIX 1: Update ref instantly on service change
//   const handleServiceSelect = (item) => {
//     setSelectedService(item);
//     activePCBRef.current = item.pcb_serial_number;
//     setShowServiceDropdown(false);
//   };

//   const handleTempChange = (newTemp) => {
//     console.log("Temperature changed:", newTemp);
//   };

//   const handleManualRefresh = async () => {
//     if (!pullToRefresh.isRefreshing && !processing.status && !refreshStatus.sending) {
//       setPullToRefresh((prev) => ({ ...prev, isRefreshing: true }));
//       await sendRefreshToController();
//       setManualRefresh(true);
//     }
//   };

//   const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;
//   const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
//   const getModeDescription = (code) => MODE_MAP[code] || "Fan";

//   const pullProgress = Math.min(pullToRefresh.pullDistance / PULL_THRESHOLD, 1);
//   const indicatorRotation = pullProgress * 360;
//   const indicatorOpacity = pullProgress;

//   if (loading && !manualRefresh) return <Loading onLogout={handleLogout} />;

//   if (!loading && serviceItems.length === 0 && !manualRefresh) {
//     return <NoServiceItems onLogout={handleLogout} onNavigateHome={() => navigate("/home")} />;
//   }

//   return (
//     <div
//       className="mainmain-container"
//       style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)", touchAction: "pan-y" }}
//       ref={containerRef}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onMouseDown={handleMouseDown}
//     >
//       {/* Pull-to-refresh indicator */}
//       <div
//         className="screen1-pull-refresh"
//         style={{
//           height: `${pullToRefresh.pullDistance}px`,
//           opacity: pullToRefresh.isPulling || pullToRefresh.isRefreshing ? 1 : 0,
//           transform: `translateY(${pullToRefresh.isPulling ? 0 : -30}px)`,
//           transition: pullToRefresh.isPulling ? "none" : "all 0.3s ease",
//         }}
//       >
//         <div className="screen1-refresh-content">
//           {!pullToRefresh.isRefreshing && (
//             <>
//               <FiRefreshCw
//                 size={24}
//                 style={{
//                   transform: `rotate(${indicatorRotation}deg)`,
//                   transition: "transform 0.2s ease",
//                   opacity: indicatorOpacity,
//                 }}
//               />
//               <span>
//                 {pullToRefresh.pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
//               </span>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main-container">
//         {/* Refresh status toast */}
//         {refreshStatus.message && (
//           <div className={`screen1-refresh-status ${refreshStatus.success ? "success" : "error"}`}>
//             {refreshStatus.message}
//           </div>
//         )}

//     {/* Header: Service Dropdown + Power Button Row */}
// <div className="header-controls-row">
//   {/* Service Dropdown */}
//   <div className="service-dropdown-wrapper">
//     <div className="service-dropdown-container">
//       <div
//         className="service-dropdown-header"
//         onClick={() => setShowServiceDropdown(!showServiceDropdown)}
//         style={{ position: "relative" }}
//       >
//         <span>
//           {selectedService ? selectedService.service_item_name : "Select Service"}
//         </span>

//         {/* 🔴 GLOBAL ALARM BADGE */}
//         {dropdownAlarmCount > 0 && (
//           <span
//             style={{
//               position: "absolute",
//               top: "0px",
//               right: "28px",
//               backgroundColor: "red",
//               color: "white",
//               borderRadius: "50%",
//               width: "18px",
//               height: "18px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "10px",
//               fontWeight: "bold",
//             }}
//           >
//             {dropdownAlarmCount}
//           </span>
//         )}

//         <FiChevronDown size={18} />
//       </div>
//       {showServiceDropdown && (
//         <div className="service-dropdown-list">
//           {serviceItems.map((item) => (
//             <div
//               key={item.service_item_id}
//               className="service-dropdown-item"
//               onClick={() => handleServiceSelect(item)}
//             >
//               {item.service_item_name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   </div>

//   {/* Power Button */}
//   <div style={{ position: "relative" }}>
//     <button
//       className={`screen1-power-button ${processing.status ? "processing" : ""}`}
//       onClick={handlePowerToggle}
//       disabled={processing.status || !sensorData.isOnline}
//       style={{
//         backgroundColor: !sensorData.isOnline
//           ? "#808080"
//           : sensorData.powerStatus == "on"
//           ? "#5adb5eff"
//           : "#c80000f5",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         border: "none",
//         height: "48px",
//         width: "48px",
//         borderRadius: "20px",
//         padding: "8px",
//         cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//         fontWeight: "bold",
//         opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//       }}
//     >
//       <FiPower size={24} color="#fff" />
//       {processing.status && <span className="screen1-processing-indicator"></span>}
//     </button>
//     {sensorData.errorFlag == "1" && <div className="error-indicator" />}
//   </div>
// </div>

// {/* Logo below the row */}
// <div className="logo-container">
//   <img
//     src={AIROlogo}
//     alt="AIRO Logo"
//     className="logo-image"
//   />
// </div>
//         {/* ✅ FIX 2: Offline banner positioned BETWEEN header and temperature dial */}
//         {!sensorData.isOnline && (
//           <div
//             style={{
//               backgroundColor: "rgba(0,0,0,0.55)",
//               color: "#fff",
//               textAlign: "center",
//               padding: "10px 20px",
//               borderRadius: "10px",
//               margin: "12px 20px 4px 20px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               letterSpacing: "0.5px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             <span>📴</span>
//             <span>System is Offline</span>
//           </div>
//         )}

//         {/* Status messages */}
//         {processing.status && (
//           <div className="screen1-processing-message">{processing.message}</div>
//         )}

//         {sensorData.errorFlag == "1" && (
//           <div className="screen1-error-message">⚠️ System Error Detected</div>
//         )}

//         {sensorData.hvacBusy == "1" && !processing.status && (
//           <div className="screen1-busy-message">⏳ System is currently busy</div>
//         )}

//         {/* Temperature Dial — dimmed when offline */}
//         <div style={{ pointerEvents: "none", opacity: sensorData.isOnline ? 1 : 0.35 }}>
//           <TemperatureDial
//             sensorData={sensorData}
//             onTempChange={handleTempChange}
//             fanSpeed={fanPosition}
//             initialTemperature={sensorData.temperature ?? 25}
//           />
//         </div>

//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.outsideTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.roomTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Room Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.humidity)}%` : "—"}
//             </div>
//             <div className="env-label">Humidity</div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer-container">
//         <div className="control-buttons">
//           <button
//             className={`control-btn ${!hasValidPCBSerial ? "screen1-disabled-btn" : ""}`}
//             onClick={() => {
//               if (hasValidPCBSerial) {
//                 navigate("/machinescreen2", {
//                   state: { sensorData, selectedService, userId, company_id },
//                 });
//               }
//             }}
//             disabled={!hasValidPCBSerial}
//             title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
//           >
//             <FiWind size={20} />
//             <span>Modes</span>
//             <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
//           </button>

//           <button
//             className="control-btn"
//             onClick={() =>
//               navigate("/alarms", {
//                 state: {
//                   alarmData: {
//                     alarmOccurred: sensorData.alarmOccurred,
//                     errorCount: errorCount,
//                     deviceId: sensorData.deviceId,
//                   },
//                   userId: userId,
//                   company_id: company_id,
//                 },
//               })
//             }
//           >
//             <div style={{ position: "relative" }}>
//               <FiClock size={20} />
//               {errorCount > 0 && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-23px",
//                     backgroundColor: "red",
//                     color: "white",
//                     borderRadius: "50%",
//                     width: "18px",
//                     height: "18px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {errorCount}
//                 </span>
//               )}
//             </div>
//             <span>Alarms</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/timers")}>
//             <FiWatch size={20} />
//             <span>Timers</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/settings")}>
//             <FiSettings size={20} />
//             <span>Settings</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/machine")}>
//             <FiZap size={20} />
//             <span>Services</span>
//           </button>

//           <button className="control-btn" onClick={handleLogout}>
//             <FiLogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>

//         <div className="footer-logo">
//           <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{ marginTop: "-12px" }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen1;



// // Screen1.js — ALL FIXES (Fix1 + Fix2 repositioned banner + Fix3 + Modes section in footer)
// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   FiPower,
//   FiWind,
//   FiClock,
//   FiWatch,
//   FiSettings,
//   FiZap,
//   FiLogOut,
//   FiSun,
//   FiDroplet,
//   FiThermometer,
//   FiRefreshCw,
//   FiChevronDown,
// } from "react-icons/fi";
// import { FaFan } from "react-icons/fa";
// import "./Screen1.css";
// import "./Screen2.css";
// import AIROlogo from "./Images/AIRO.png";
// import greenAire from "./Images/greenAire.png";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../AuthContext/AuthContext";
// import TemperatureDial from "./TemperatureDial";
// import baseURL from "../../ApiUrl/Apiurl";
// import NoServiceItems from "./NoServiceItems";
// import Loading from "./Loading";

// // Constants
// const MODE_MAP = {
//   1: "IDEC",
//   2: "Auto",
//   3: "Fan",
//   4: "Indirect",
//   5: "Direct",
// };

// const MODE_CODE_MAP = {
//   IDEC: 1,
//   Auto: 2,
//   Fan: 3,
//   Indirect: 4,
//   Direct: 5,
// };

// const PULL_THRESHOLD = 80;
// const MAX_PULL = 120;

// // ✅ FIX 3: Progressive messages every 10s
// const PROCESSING_MESSAGES = [
//   "Sending command...",
//   "Almost done, please wait...",
//   "Waiting for device response...",
// ];

// const getStoredService = () => {
//   try {
//     const stored = localStorage.getItem("selectedService");
//     return stored ? JSON.parse(stored) : null;
//   } catch (e) {
//     return null;
//   }
// };

// const formatTemp = (temp) => {
//   if (temp == null) return "0.0";
//   const num = parseFloat(temp);
//   return isNaN(num) ? "0.0" : num.toFixed(1);
// };

// const sendRefreshCommand = async (pcbSerialNumber, sensorData) => {
//   const payload = {
//     Header: "0xAA",
//     DI: pcbSerialNumber || "2411GM-0102",
//     MD: sensorData.mode || "3",
//     FS: sensorData.fanSpeed || "0",
//     SRT: sensorData.temperature || 25,
//     HVAC: "3",
//     Footer: "0xZX",
//   };
//   console.group("🔁 REFRESH COMMAND");
//   console.log("📦 Payload:", payload);
//   console.groupEnd();
//   try {
//     const response = await fetch("https://mdata.air2o.net/controllers/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     let responseBody;
//     try {
//       responseBody = await response.json();
//     } catch {
//       responseBody = await response.text();
//     }
//     if (!response.ok) {
//       return {
//         success: false,
//         error: responseBody?.error || responseBody?.message || "Command rejected by server",
//         status: response.status,
//       };
//     }
//     return { success: true, data: responseBody };
//   } catch (error) {
//     return { success: false, error: "Network error or server unreachable" };
//   }
// };

// const Screen1 = () => {
//   const { user, logout } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [pullToRefresh, setPullToRefresh] = useState({
//     isPulling: false,
//     pullDistance: 0,
//     isRefreshing: false,
//   });

//   const touchStartY = useRef(0);
//   const containerRef = useRef(null);

//   // ✅ FIX 1: Single interval, PCB switching via ref
//   const activePCBRef = useRef(null);
//   const fetchIntervalRef = useRef(null);

//   // ✅ FIX 3: Processing message cycling refs
//   const processingTimerRef = useRef(null);
//   const processingMsgIndexRef = useRef(0);
//   const hardStopTimerRef = useRef(null);

//   const [serviceItems, setServiceItems] = useState([]);
//   const [selectedService, setSelectedService] = useState(getStoredService());
//   const [showServiceDropdown, setShowServiceDropdown] = useState(false);
//   const [processing, setProcessing] = useState({ status: false, message: "" });
//   const [errorCount, setErrorCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [refreshStatus, setRefreshStatus] = useState({
//     sending: false,
//     success: false,
//     message: "",
//   });
//   const [dropdownAlarmCount, setDropdownAlarmCount] = useState(0);

//   // Add this alongside your other refs
//   const processingStartTimeRef = useRef(null);
//   const MIN_PROCESSING_TIME = 5000; // 5 seconds minimum before poll can clear it

//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: "0",
//     temperature: 25,
//     powerStatus: "off",
//     mode: "3",
//     errorFlag: "0",
//     hvacBusy: "0",
//     deviceId: "",
//     alarmOccurred: "0",
//     isOnline: true,
//   });

//   // Display data for local changes
//   const [displayData, setDisplayData] = useState({
//     fanSpeed: "0",
//     temperature: 25,
//     mode: "3",
//     powerStatus: "off",
//   });

//   useEffect(() => {
//     // Sync displayData with sensorData
//     setDisplayData({
//       fanSpeed: sensorData.fanSpeed,
//       temperature: sensorData.temperature,
//       mode: sensorData.mode,
//       powerStatus: sensorData.powerStatus,
//     });
//   }, [sensorData]);

//   useEffect(() => {
//     if (selectedService) {
//       localStorage.setItem("selectedService", JSON.stringify(selectedService));
//     }
//   }, [selectedService]);

//   // Get current mode description
//   const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";

//  // Handle mode change
// const handleModeChange = async (newMode) => {
//   if (processing.status || !sensorData.isOnline) return;
  
//   const newModeCode = MODE_CODE_MAP[newMode] || 1;
//   setDisplayData((prev) => ({ ...prev, mode: newModeCode.toString() }));
  
//   // Send command to device if power is on
//   if (displayData.powerStatus === "on") {
//     await sendModeCommand(newModeCode.toString(), newMode);
//   }
// };

// // Send mode command
// const sendModeCommand = async (modeCode, modeName) => {
//   try {
//     startProcessingCycle();
    
//     const payload = {
//       Header: "0xAA",
//       DI: selectedService?.pcb_serial_number || "2411GM-0102",
//       MD: parseInt(modeCode) || 3,
//       FS: parseInt(displayData.fanSpeed) || 0,
//       SRT: parseInt(displayData.temperature) || 25,
//       HVAC: displayData.powerStatus === "on" ? "1" : "0",
//       Footer: "0xZX",
//     };
    
//     const response = await fetch("https://mdata.air2o.net/controllers/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
    
//     if (!response.ok) {
//       stopProcessing();
//       throw new Error("Failed to send command");
//     }
    
//     console.log("✅ Mode command sent:", modeName);
//   } catch (error) {
//     console.error("Error sending mode command:", error);
//     stopProcessing();
//   }
// };

//   // ✅ FIX 3: Start progressive message cycle
//   const startProcessingCycle = () => {
//     processingMsgIndexRef.current = 0;
//     processingStartTimeRef.current = Date.now();
//     setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

//     processingTimerRef.current = setInterval(() => {
//       processingMsgIndexRef.current += 1;
//       const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
//       if (nextMsg) {
//         setProcessing({ status: true, message: nextMsg });
//       }
//     }, 10000);

//     hardStopTimerRef.current = setTimeout(() => {
//       stopProcessing();
//     }, 25000);
//   };

//   const stopProcessing = () => {
//     if (processingTimerRef.current) {
//       clearInterval(processingTimerRef.current);
//       processingTimerRef.current = null;
//     }
//     if (hardStopTimerRef.current) {
//       clearTimeout(hardStopTimerRef.current);
//       hardStopTimerRef.current = null;
//     }
//     setProcessing({ status: false, message: "" });
//   };

//   // Called when polling detects hvac_busy flipped to 0
//   const clearProcessingIfDone = () => {
//     if (processingTimerRef.current || hardStopTimerRef.current) {
//       const elapsed = Date.now() - (processingStartTimeRef.current || 0);
//       if (elapsed >= MIN_PROCESSING_TIME) {
//         stopProcessing();
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (processingTimerRef.current) clearInterval(processingTimerRef.current);
//       if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await fetch(
//           `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch service items");

//         const data = await response.json();
//         setServiceItems(data.data || []);

//         if (data.data?.length > 0 && !selectedService) {
//           const first = data.data[0];
//           setSelectedService(first);
//           activePCBRef.current = first.pcb_serial_number;
//         }

//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       } catch (error) {
//         console.error("Error fetching service items:", error);
//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       }
//     };

//     fetchServiceItems();
//   }, [manualRefresh]);

//   const fetchData = async () => {
//     const pcbSerialNumber = activePCBRef.current;
//     if (!pcbSerialNumber) return;

//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`
//       );
//       if (!response.ok) throw new Error("Network response was not ok");

//       const data = await response.json();
//       if (data.status !== "success" || !data.data) return;

//       if (activePCBRef.current !== pcbSerialNumber) return;

//       const deviceData = data.data;
//       const isOnline = deviceData.is_online;

//       setSensorData({
//         outsideTemp: isOnline ? deviceData.outdoor_temperature?.value : null,
//         humidity: isOnline ? deviceData.room_humidity?.value : null,
//         roomTemp: isOnline ? deviceData.room_temperature?.value : null,
//         fanSpeed: isOnline ? deviceData.fan_speed?.value : "0",
//         temperature: isOnline ? deviceData.set_temperature?.value : 25,
//         powerStatus: isOnline && deviceData.hvac_on?.value == "1" ? "on" : "off",
//         mode: deviceData.mode?.value,
//         errorFlag: isOnline ? deviceData.error_flag?.value : "0",
//         hvacBusy: isOnline ? deviceData.hvac_busy?.value : "0",
//         deviceId: pcbSerialNumber,
//         alarmOccurred: deviceData.alarm_occurred?.value,
//         isOnline: isOnline,
//       });

//       const alarmValue = deviceData.alarm_occurred?.value;
//       setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

//       if (deviceData.hvac_busy?.value == "0") {
//         clearProcessingIfDone();
//       }
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     }
//   };

//   const fetchAllAlarms = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/?user_id=${userId}&company_id=${company_id}`
//       );

//       if (!response.ok) throw new Error("Failed to fetch all alarms");

//       const data = await response.json();

//       if (data.status !== "success" || !data.data) return;

//       const alarmCount = data.data.reduce((count, item) => {
//         const val = item.alarm_occurred?.value;
//         if (val && val !== "0") {
//           return count + Number(val);
//         }
//         return count;
//       }, 0);

//       setDropdownAlarmCount(alarmCount);
//     } catch (err) {
//       console.error("Dropdown alarm fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllAlarms();

//     fetchIntervalRef.current = setInterval(() => {
//       fetchData();
//       fetchAllAlarms();
//     }, 1000);

//     return () => {
//       if (fetchIntervalRef.current) {
//         clearInterval(fetchIntervalRef.current);
//         fetchIntervalRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedService?.pcb_serial_number) {
//       console.log("🔄 Switching active PCB to:", selectedService.pcb_serial_number);
//       activePCBRef.current = selectedService.pcb_serial_number;
//     }
//   }, [selectedService?.pcb_serial_number]);

//   const sendRefreshToController = async () => {
//     if (!selectedService?.pcb_serial_number) {
//       setRefreshStatus({ sending: false, success: false, message: "No device selected" });
//       return { success: false };
//     }
//     try {
//       const result = await sendRefreshCommand(selectedService.pcb_serial_number, sensorData);
//       if (result.success) {
//         setRefreshStatus({ sending: false, success: true, message: "Refresh sent successfully" });
//         setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 3000);
//         return result;
//       }
//       const msg = result?.error || result?.message || "Failed to send refresh command";
//       setRefreshStatus({ sending: false, success: false, message: msg });
//       setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 2000);
//       return result;
//     } catch (error) {
//       setRefreshStatus({ sending: false, success: false, message: error.message || "Unexpected error" });
//       return { success: false };
//     }
//   };

//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.touches[0].clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleTouchEnd = async () => {
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleMouseDown = (e) => {
//     touchStartY.current = e.clientY;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleMouseUp = async () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const handlePowerToggle = async () => {
//     try {
//       if (processing.status || sensorData.hvacBusy == "1") {
//         const msg = sensorData.hvacBusy == "1" ? "System is busy, please wait..." : "Please wait...";
//         setProcessing({ status: true, message: msg });
//         return;
//       }

//       startProcessingCycle();

//       const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";
//       const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: isShutdown ? "3" : sensorData.mode,
//         FS: isShutdown ? "0" : sensorData.fanSpeed,
//         SRT: sensorData.temperature,
//         HVAC: newHvacValue,
//         Footer: "0xZX",
//       };

//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error("❌ API error:", response.status);
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }

//       const result = await response.text();
//       console.log("✅ Command sent:", result);
//     } catch (error) {
//       console.error("🔥 Power toggle error:", error.message);
//       stopProcessing();
//     }
//   };

//   const handleNavigation = (path) => {
//     if (!processing.status) navigate(path);
//   };

//   const handleServiceSelect = (item) => {
//     setSelectedService(item);
//     activePCBRef.current = item.pcb_serial_number;
//     setShowServiceDropdown(false);
//   };

//   const handleTempChange = (newTemp) => {
//     console.log("Temperature changed:", newTemp);
//   };

//   const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;
//   const fanPosition = ["0", "1", "2"].indexOf(sensorData.fanSpeed);
//   const getModeDescription = (code) => MODE_MAP[code] || "Fan";

//   const pullProgress = Math.min(pullToRefresh.pullDistance / PULL_THRESHOLD, 1);
//   const indicatorRotation = pullProgress * 360;
//   const indicatorOpacity = pullProgress;

//   if (loading && !manualRefresh) return <Loading onLogout={handleLogout} />;

//   if (!loading && serviceItems.length === 0 && !manualRefresh) {
//     return <NoServiceItems onLogout={handleLogout} onNavigateHome={() => navigate("/home")} />;
//   }

//   return (
//     <div
//       className="mainmain-container"
//       style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)", touchAction: "pan-y" }}
//       ref={containerRef}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onMouseDown={handleMouseDown}
//     >
//       {/* Pull-to-refresh indicator */}
//       <div
//         className="screen1-pull-refresh"
//         style={{
//           height: `${pullToRefresh.pullDistance}px`,
//           opacity: pullToRefresh.isPulling || pullToRefresh.isRefreshing ? 1 : 0,
//           transform: `translateY(${pullToRefresh.isPulling ? 0 : -30}px)`,
//           transition: pullToRefresh.isPulling ? "none" : "all 0.3s ease",
//         }}
//       >
//         <div className="screen1-refresh-content">
//           {!pullToRefresh.isRefreshing && (
//             <>
//               <FiRefreshCw
//                 size={24}
//                 style={{
//                   transform: `rotate(${indicatorRotation}deg)`,
//                   transition: "transform 0.2s ease",
//                   opacity: indicatorOpacity,
//                 }}
//               />
//               <span>
//                 {pullToRefresh.pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
//               </span>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main-container">
//         {/* Refresh status toast */}
//         {refreshStatus.message && (
//           <div className={`screen1-refresh-status ${refreshStatus.success ? "success" : "error"}`}>
//             {refreshStatus.message}
//           </div>
//         )}

//         {/* Header: Service Dropdown + Power Button Row */}
//         <div className="header-controls-row">
//           {/* Service Dropdown */}
//           <div className="service-dropdown-wrapper">
//             <div className="service-dropdown-container">
//               <div
//                 className="service-dropdown-header"
//                 onClick={() => setShowServiceDropdown(!showServiceDropdown)}
//                 style={{ position: "relative" }}
//               >
//                 <span>
//                   {selectedService ? selectedService.service_item_name : "Select Service"}
//                 </span>

//                 {/* 🔴 GLOBAL ALARM BADGE */}
//                 {dropdownAlarmCount > 0 && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: "0px",
//                       right: "28px",
//                       backgroundColor: "red",
//                       color: "white",
//                       borderRadius: "50%",
//                       width: "18px",
//                       height: "18px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {dropdownAlarmCount}
//                   </span>
//                 )}

//                 <FiChevronDown size={18} />
//               </div>
//               {showServiceDropdown && (
//                 <div className="service-dropdown-list">
//                   {serviceItems.map((item) => (
//                     <div
//                       key={item.service_item_id}
//                       className="service-dropdown-item"
//                       onClick={() => handleServiceSelect(item)}
//                     >
//                       {item.service_item_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Power Button */}
//           <div style={{ position: "relative" }}>
//             <button
//               className={`screen1-power-button ${processing.status ? "processing" : ""}`}
//               onClick={handlePowerToggle}
//               disabled={processing.status || !sensorData.isOnline}
//               style={{
//                 backgroundColor: !sensorData.isOnline
//                   ? "#808080"
//                   : sensorData.powerStatus == "on"
//                   ? "#5adb5eff"
//                   : "#c80000f5",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 border: "none",
//                 height: "48px",
//                 width: "48px",
//                 borderRadius: "20px",
//                 padding: "8px",
//                 cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 fontWeight: "bold",
//                 opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//               }}
//             >
//               <FiPower size={24} color="#fff" />
//               {processing.status && <span className="screen1-processing-indicator"></span>}
//             </button>
//             {sensorData.errorFlag == "1" && <div className="error-indicator" />}
//           </div>
//         </div>

//         {/* Logo below the row */}
//         <div className="logo-container">
//           <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//         </div>

//         {/* ✅ FIX 2: Offline banner positioned BETWEEN header and temperature dial */}
//         {!sensorData.isOnline && (
//           <div
//             style={{
//               backgroundColor: "rgba(0,0,0,0.55)",
//               color: "#fff",
//               textAlign: "center",
//               padding: "10px 20px",
//               borderRadius: "10px",
//               margin: "12px 20px 4px 20px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               letterSpacing: "0.5px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             <span>📴</span>
//             <span>System is Offline</span>
//           </div>
//         )}

//         {/* Status messages */}
//         {processing.status && (
//           <div className="screen1-processing-message">{processing.message}</div>
//         )}

//         {sensorData.errorFlag == "1" && (
//           <div className="screen1-error-message">⚠️ System Error Detected</div>
//         )}

//         {sensorData.hvacBusy == "1" && !processing.status && (
//           <div className="screen1-busy-message">⏳ System is currently busy</div>
//         )}

//         {/* Temperature Dial — dimmed when offline */}
//         <div style={{ pointerEvents: "none", opacity: sensorData.isOnline ? 1 : 0.35 }}>
//           <TemperatureDial
//             sensorData={sensorData}
//             onTempChange={handleTempChange}
//             fanSpeed={fanPosition}
//             initialTemperature={sensorData.temperature ?? 25}
//           />
//         </div>

//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.outsideTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.roomTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Room Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.humidity)}%` : "—"}
//             </div>
//             <div className="env-label">Humidity</div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer-container">
//         {/* ==================== MODES SECTION ADDED HERE ==================== */}
//         <div className="modes-section-in-footer">
//           <h3 className="modes-heading">Modes</h3>
//           <div className="modes-row">
//             {Object.values(MODE_MAP).map((mode) => (
//               <button
//                 key={mode}
//                 onClick={() => handleModeChange(mode)}
//                 className={`modes-button ${
//                   currentModeDescription === mode ? "modes-button-selected" : ""
//                 }`}
//                 disabled={processing.status || !sensorData.isOnline}
//                 style={{
//                   opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//                   cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 }}
//               >
//                 <span
//                   className={`modes-text ${
//                     currentModeDescription === mode ? "modes-text-selected" : ""
//                   }`}
//                 >
//                   {mode}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//         {/* ==================== END OF MODES SECTION ==================== */}

//         <div className="control-buttons">
//           <button
//             className={`control-btn ${!hasValidPCBSerial ? "screen1-disabled-btn" : ""}`}
//             onClick={() => {
//               if (hasValidPCBSerial) {
//                 navigate("/machinescreen2", {
//                   state: { sensorData, selectedService, userId, company_id },
//                 });
//               }
//             }}
//             disabled={!hasValidPCBSerial}
//             title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
//           >
//             <FiWind size={20} />
//             <span>Modes</span>
//             <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
//           </button>

//           <button
//             className="control-btn"
//             onClick={() =>
//               navigate("/alarms", {
//                 state: {
//                   alarmData: {
//                     alarmOccurred: sensorData.alarmOccurred,
//                     errorCount: errorCount,
//                     deviceId: sensorData.deviceId,
//                   },
//                   userId: userId,
//                   company_id: company_id,
//                 },
//               })
//             }
//           >
//             <div style={{ position: "relative" }}>
//               <FiClock size={20} />
//               {errorCount > 0 && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-23px",
//                     backgroundColor: "red",
//                     color: "white",
//                     borderRadius: "50%",
//                     width: "18px",
//                     height: "18px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {errorCount}
//                 </span>
//               )}
//             </div>
//             <span>Alarms</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/timers")}>
//             <FiWatch size={20} />
//             <span>Timers</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/settings")}>
//             <FiSettings size={20} />
//             <span>Settings</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/machine")}>
//             <FiZap size={20} />
//             <span>Services</span>
//           </button>

//           <button className="control-btn" onClick={handleLogout}>
//             <FiLogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>

//         <div className="footer-logo">
//           <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{ marginTop: "-12px" }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen1;




// Screen1.js — ALL FIXES (Fix1 + Fix2 repositioned banner + Fix3 + Modes + Fan Speed sections in footer)
// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   FiPower,
//   FiWind,
//   FiClock,
//   FiWatch,
//   FiSettings,
//   FiZap,
//   FiLogOut,
//   FiSun,
//   FiDroplet,
//   FiThermometer,
//   FiRefreshCw,
//   FiChevronDown,
// } from "react-icons/fi";
// import { FaFan } from "react-icons/fa";
// import "./Screen1.css";
// import AIROlogo from "./Images/AIRO.png";
// import greenAire from "./Images/greenAire.png";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../AuthContext/AuthContext";
// import TemperatureDial from "./TemperatureDial";
// import baseURL from "../../ApiUrl/Apiurl";
// import NoServiceItems from "./NoServiceItems";
// import Loading from "./Loading";

// // Constants
// const MODE_MAP = {
//   1: "IDEC",
//   2: "Auto",
//   3: "Fan",
//   4: "Indirect",
//   5: "Direct",
// };

// const MODE_CODE_MAP = {
//   IDEC: 1,
//   Auto: 2,
//   Fan: 3,
//   Indirect: 4,
//   Direct: 5,
// };

// const FAN_SPEEDS = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
// const FAN_LABELS = ["High", "Medium", "Low"];

// const PULL_THRESHOLD = 80;
// const MAX_PULL = 120;

// // ✅ FIX 3: Progressive messages every 10s
// const PROCESSING_MESSAGES = [
//   "Sending command...",
//   "Almost done, please wait...",
//   "Waiting for device response...",
// ];

// const getStoredService = () => {
//   try {
//     const stored = localStorage.getItem("selectedService");
//     return stored ? JSON.parse(stored) : null;
//   } catch (e) {
//     return null;
//   }
// };

// const formatTemp = (temp) => {
//   if (temp == null) return "0.0";
//   const num = parseFloat(temp);
//   return isNaN(num) ? "0.0" : num.toFixed(1);
// };

// const sendRefreshCommand = async (pcbSerialNumber, sensorData) => {
//   const payload = {
//     Header: "0xAA",
//     DI: pcbSerialNumber || "2411GM-0102",
//     MD: sensorData.mode || "3",
//     FS: sensorData.fanSpeed || "0",
//     SRT: sensorData.temperature || 25,
//     HVAC: "3",
//     Footer: "0xZX",
//   };
//   console.group("🔁 REFRESH COMMAND");
//   console.log("📦 Payload:", payload);
//   console.groupEnd();
//   try {
//     const response = await fetch("https://mdata.air2o.net/controllers/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     let responseBody;
//     try {
//       responseBody = await response.json();
//     } catch {
//       responseBody = await response.text();
//     }
//     if (!response.ok) {
//       return {
//         success: false,
//         error: responseBody?.error || responseBody?.message || "Command rejected by server",
//         status: response.status,
//       };
//     }
//     return { success: true, data: responseBody };
//   } catch (error) {
//     return { success: false, error: "Network error or server unreachable" };
//   }
// };

// const Screen1 = () => {
//   const { user, logout } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [pullToRefresh, setPullToRefresh] = useState({
//     isPulling: false,
//     pullDistance: 0,
//     isRefreshing: false,
//   });

//   const touchStartY = useRef(0);
//   const containerRef = useRef(null);

//   // ✅ FIX 1: Single interval, PCB switching via ref
//   const activePCBRef = useRef(null);
//   const fetchIntervalRef = useRef(null);

//   // ✅ FIX 3: Processing message cycling refs
//   const processingTimerRef = useRef(null);
//   const processingMsgIndexRef = useRef(0);
//   const hardStopTimerRef = useRef(null);

//   const [serviceItems, setServiceItems] = useState([]);
//   const [selectedService, setSelectedService] = useState(getStoredService());
//   const [showServiceDropdown, setShowServiceDropdown] = useState(false);
//   const [processing, setProcessing] = useState({ status: false, message: "" });
//   const [errorCount, setErrorCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [refreshStatus, setRefreshStatus] = useState({
//     sending: false,
//     success: false,
//     message: "",
//   });
//   const [dropdownAlarmCount, setDropdownAlarmCount] = useState(0);

//   // Add this alongside your other refs
//   const processingStartTimeRef = useRef(null);
//   const MIN_PROCESSING_TIME = 5000; // 5 seconds minimum before poll can clear it

//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: "0",
//     temperature: 25,
//     powerStatus: "off",
//     mode: "3",
//     errorFlag: "0",
//     hvacBusy: "0",
//     deviceId: "",
//     alarmOccurred: "0",
//     isOnline: true,
//   });

//   // Display data for local changes
//   const [displayData, setDisplayData] = useState({
//     fanSpeed: "0",
//     temperature: 25,
//     mode: "3",
//     powerStatus: "off",
//   });

//   useEffect(() => {
//     // Sync displayData with sensorData
//     setDisplayData({
//       fanSpeed: sensorData.fanSpeed,
//       temperature: sensorData.temperature,
//       mode: sensorData.mode,
//       powerStatus: sensorData.powerStatus,
//     });
//   }, [sensorData]);

//   useEffect(() => {
//     if (selectedService) {
//       localStorage.setItem("selectedService", JSON.stringify(selectedService));
//     }
//   }, [selectedService]);

//   // Get current mode description
//   const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";
  
//   // Get fan position for slider
//   const fanPosition = FAN_SPEEDS.indexOf(displayData.fanSpeed);
//   const fanPercentage = fanPosition * 50;

//   // Handle mode change
//   const handleModeChange = async (newMode) => {
//     if (processing.status || !sensorData.isOnline) return;
    
//     const newModeCode = MODE_CODE_MAP[newMode] || 1;
//     setDisplayData((prev) => ({ ...prev, mode: newModeCode.toString() }));
    
//     // Send command to device if power is on
//     if (displayData.powerStatus === "on") {
//       await sendModeCommand(newModeCode.toString(), newMode);
//     }
//   };

//   // Send mode command
//   const sendModeCommand = async (modeCode, modeName) => {
//     try {
//       startProcessingCycle();
      
//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: parseInt(modeCode) || 3,
//         FS: parseInt(displayData.fanSpeed) || 0,
//         SRT: parseInt(displayData.temperature) || 25,
//         HVAC: displayData.powerStatus === "on" ? "1" : "0",
//         Footer: "0xZX",
//       };
      
//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
      
//       if (!response.ok) {
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }
      
//       console.log("✅ Mode command sent:", modeName);
//     } catch (error) {
//       console.error("Error sending mode command:", error);
//       stopProcessing();
//     }
//   };

//   // Handle fan speed change
// // Handle fan speed change - ALWAYS update display and send if power is on
// const handleFanSpeedChange = async (newPosition) => {
//   if (processing.status || !sensorData.isOnline) return;
  
//   const newSpeed = FAN_SPEEDS[newPosition];
  
//   // Always update display immediately for UI feedback
//   setDisplayData((prev) => ({ ...prev, fanSpeed: newSpeed }));
  
//   // Only send command to device if power is ON
//   if (displayData.powerStatus === "on") {
//     await sendFanCommand(newSpeed);
//   } else {
//     // If power is OFF, just update the local state
//     // The value will be used when power turns ON
//     console.log(`Fan speed set to ${newSpeed} (will apply when power turns on)`);
//   }
// };
//   // Send fan command
//   const sendFanCommand = async (fanSpeed) => {
//     try {
//       startProcessingCycle();
      
//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: parseInt(displayData.mode) || 3,
//         FS: parseInt(fanSpeed) || 0,
//         SRT: parseInt(displayData.temperature) || 25,
//         HVAC: displayData.powerStatus === "on" ? "1" : "0",
//         Footer: "0xZX",
//       };
      
//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
      
//       if (!response.ok) {
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }
      
//       console.log("✅ Fan command sent:", fanSpeed);
//     } catch (error) {
//       console.error("Error sending fan command:", error);
//       stopProcessing();
//     }
//   };

//   // Handle fan click on slider
//   const handleFanClick = (e) => {
//     if (processing.status || !sensorData.isOnline) return;
//     const containerWidth = e.currentTarget.offsetWidth;
//     const clickPosition = e.nativeEvent.offsetX;
//     const segmentWidth = containerWidth / 3;
//     const newPosition = Math.min(2, Math.floor(clickPosition / segmentWidth));
//     handleFanSpeedChange(newPosition);
//   };

//   // ✅ FIX 3: Start progressive message cycle
//   const startProcessingCycle = () => {
//     processingMsgIndexRef.current = 0;
//     processingStartTimeRef.current = Date.now();
//     setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

//     processingTimerRef.current = setInterval(() => {
//       processingMsgIndexRef.current += 1;
//       const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
//       if (nextMsg) {
//         setProcessing({ status: true, message: nextMsg });
//       }
//     }, 10000);

//     hardStopTimerRef.current = setTimeout(() => {
//       stopProcessing();
//     }, 25000);
//   };

//   const stopProcessing = () => {
//     if (processingTimerRef.current) {
//       clearInterval(processingTimerRef.current);
//       processingTimerRef.current = null;
//     }
//     if (hardStopTimerRef.current) {
//       clearTimeout(hardStopTimerRef.current);
//       hardStopTimerRef.current = null;
//     }
//     setProcessing({ status: false, message: "" });
//   };

//   // Called when polling detects hvac_busy flipped to 0
//   const clearProcessingIfDone = () => {
//     if (processingTimerRef.current || hardStopTimerRef.current) {
//       const elapsed = Date.now() - (processingStartTimeRef.current || 0);
//       if (elapsed >= MIN_PROCESSING_TIME) {
//         stopProcessing();
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (processingTimerRef.current) clearInterval(processingTimerRef.current);
//       if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await fetch(
//           `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch service items");

//         const data = await response.json();
//         setServiceItems(data.data || []);

//         if (data.data?.length > 0 && !selectedService) {
//           const first = data.data[0];
//           setSelectedService(first);
//           activePCBRef.current = first.pcb_serial_number;
//         }

//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       } catch (error) {
//         console.error("Error fetching service items:", error);
//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       }
//     };

//     fetchServiceItems();
//   }, [manualRefresh]);

//   const fetchData = async () => {
//     const pcbSerialNumber = activePCBRef.current;
//     if (!pcbSerialNumber) return;

//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`
//       );
//       if (!response.ok) throw new Error("Network response was not ok");

//       const data = await response.json();
//       if (data.status !== "success" || !data.data) return;

//       if (activePCBRef.current !== pcbSerialNumber) return;

//       const deviceData = data.data;
//       const isOnline = deviceData.is_online;

//       setSensorData({
//         outsideTemp: isOnline ? deviceData.outdoor_temperature?.value : null,
//         humidity: isOnline ? deviceData.room_humidity?.value : null,
//         roomTemp: isOnline ? deviceData.room_temperature?.value : null,
//         fanSpeed: isOnline ? deviceData.fan_speed?.value : "0",
//         temperature: isOnline ? deviceData.set_temperature?.value : 25,
//         powerStatus: isOnline && deviceData.hvac_on?.value == "1" ? "on" : "off",
//         mode: deviceData.mode?.value,
//         errorFlag: isOnline ? deviceData.error_flag?.value : "0",
//         hvacBusy: isOnline ? deviceData.hvac_busy?.value : "0",
//         deviceId: pcbSerialNumber,
//         alarmOccurred: deviceData.alarm_occurred?.value,
//         isOnline: isOnline,
//       });

//       const alarmValue = deviceData.alarm_occurred?.value;
//       setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

//       if (deviceData.hvac_busy?.value == "0") {
//         clearProcessingIfDone();
//       }
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     }
//   };

//   const fetchAllAlarms = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/?user_id=${userId}&company_id=${company_id}`
//       );

//       if (!response.ok) throw new Error("Failed to fetch all alarms");

//       const data = await response.json();

//       if (data.status !== "success" || !data.data) return;

//       const alarmCount = data.data.reduce((count, item) => {
//         const val = item.alarm_occurred?.value;
//         if (val && val !== "0") {
//           return count + Number(val);
//         }
//         return count;
//       }, 0);

//       setDropdownAlarmCount(alarmCount);
//     } catch (err) {
//       console.error("Dropdown alarm fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllAlarms();

//     fetchIntervalRef.current = setInterval(() => {
//       fetchData();
//       fetchAllAlarms();
//     }, 1000);

//     return () => {
//       if (fetchIntervalRef.current) {
//         clearInterval(fetchIntervalRef.current);
//         fetchIntervalRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedService?.pcb_serial_number) {
//       console.log("🔄 Switching active PCB to:", selectedService.pcb_serial_number);
//       activePCBRef.current = selectedService.pcb_serial_number;
//     }
//   }, [selectedService?.pcb_serial_number]);

//   const sendRefreshToController = async () => {
//     if (!selectedService?.pcb_serial_number) {
//       setRefreshStatus({ sending: false, success: false, message: "No device selected" });
//       return { success: false };
//     }
//     try {
//       const result = await sendRefreshCommand(selectedService.pcb_serial_number, sensorData);
//       if (result.success) {
//         setRefreshStatus({ sending: false, success: true, message: "Refresh sent successfully" });
//         setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 3000);
//         return result;
//       }
//       const msg = result?.error || result?.message || "Failed to send refresh command";
//       setRefreshStatus({ sending: false, success: false, message: msg });
//       setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 2000);
//       return result;
//     } catch (error) {
//       setRefreshStatus({ sending: false, success: false, message: error.message || "Unexpected error" });
//       return { success: false };
//     }
//   };

//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.touches[0].clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleTouchEnd = async () => {
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleMouseDown = (e) => {
//     touchStartY.current = e.clientY;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleMouseUp = async () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const handlePowerToggle = async () => {
//     try {
//       if (processing.status || sensorData.hvacBusy == "1") {
//         const msg = sensorData.hvacBusy == "1" ? "System is busy, please wait..." : "Please wait...";
//         setProcessing({ status: true, message: msg });
//         return;
//       }

//       startProcessingCycle();

//       const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";
//       const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: isShutdown ? "3" : sensorData.mode,
//         FS: isShutdown ? "0" : sensorData.fanSpeed,
//         SRT: sensorData.temperature,
//         HVAC: newHvacValue,
//         Footer: "0xZX",
//       };

//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error("❌ API error:", response.status);
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }

//       const result = await response.text();
//       console.log("✅ Command sent:", result);
//     } catch (error) {
//       console.error("🔥 Power toggle error:", error.message);
//       stopProcessing();
//     }
//   };

//   const handleNavigation = (path) => {
//     if (!processing.status) navigate(path);
//   };

//   const handleServiceSelect = (item) => {
//     setSelectedService(item);
//     activePCBRef.current = item.pcb_serial_number;
//     setShowServiceDropdown(false);
//   };

//   const handleTempChange = (newTemp) => {
//     console.log("Temperature changed:", newTemp);
//   };

//   const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;
//   const getModeDescription = (code) => MODE_MAP[code] || "Fan";

//   const pullProgress = Math.min(pullToRefresh.pullDistance / PULL_THRESHOLD, 1);
//   const indicatorRotation = pullProgress * 360;
//   const indicatorOpacity = pullProgress;

//   if (loading && !manualRefresh) return <Loading onLogout={handleLogout} />;

//   if (!loading && serviceItems.length === 0 && !manualRefresh) {
//     return <NoServiceItems onLogout={handleLogout} onNavigateHome={() => navigate("/home")} />;
//   }

//   return (
//     <div
//       className="mainmain-container"
//       style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)", touchAction: "pan-y" }}
//       ref={containerRef}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onMouseDown={handleMouseDown}
//     >
//       {/* Pull-to-refresh indicator */}
//       <div
//         className="screen1-pull-refresh"
//         style={{
//           height: `${pullToRefresh.pullDistance}px`,
//           opacity: pullToRefresh.isPulling || pullToRefresh.isRefreshing ? 1 : 0,
//           transform: `translateY(${pullToRefresh.isPulling ? 0 : -30}px)`,
//           transition: pullToRefresh.isPulling ? "none" : "all 0.3s ease",
//         }}
//       >
//         <div className="screen1-refresh-content">
//           {!pullToRefresh.isRefreshing && (
//             <>
//               <FiRefreshCw
//                 size={24}
//                 style={{
//                   transform: `rotate(${indicatorRotation}deg)`,
//                   transition: "transform 0.2s ease",
//                   opacity: indicatorOpacity,
//                 }}
//               />
//               <span>
//                 {pullToRefresh.pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
//               </span>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main-container">
//         {/* Refresh status toast */}
//         {refreshStatus.message && (
//           <div className={`screen1-refresh-status ${refreshStatus.success ? "success" : "error"}`}>
//             {refreshStatus.message}
//           </div>
//         )}

//         {/* Header: Service Dropdown + Power Button Row */}
//         <div className="header-controls-row">
//           {/* Service Dropdown */}
//           <div className="service-dropdown-wrapper">
//             <div className="service-dropdown-container">
//               <div
//                 className="service-dropdown-header"
//                 onClick={() => setShowServiceDropdown(!showServiceDropdown)}
//                 style={{ position: "relative" }}
//               >
//                 <span>
//                   {selectedService ? selectedService.service_item_name : "Select Service"}
//                 </span>

//                 {/* 🔴 GLOBAL ALARM BADGE */}
//                 {dropdownAlarmCount > 0 && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: "0px",
//                       right: "28px",
//                       backgroundColor: "red",
//                       color: "white",
//                       borderRadius: "50%",
//                       width: "18px",
//                       height: "18px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {dropdownAlarmCount}
//                   </span>
//                 )}

//                 <FiChevronDown size={18} />
//               </div>
//               {showServiceDropdown && (
//                 <div className="service-dropdown-list">
//                   {serviceItems.map((item) => (
//                     <div
//                       key={item.service_item_id}
//                       className="service-dropdown-item"
//                       onClick={() => handleServiceSelect(item)}
//                     >
//                       {item.service_item_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Power Button */}
//           <div style={{ position: "relative" }}>
//             <button
//               className={`screen1-power-button ${processing.status ? "processing" : ""}`}
//               onClick={handlePowerToggle}
//               disabled={processing.status || !sensorData.isOnline}
//               style={{
//                 backgroundColor: !sensorData.isOnline
//                   ? "#808080"
//                   : sensorData.powerStatus == "on"
//                   ? "#5adb5eff"
//                   : "#c80000f5",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 border: "none",
//                 height: "48px",
//                 width: "48px",
//                 borderRadius: "20px",
//                 padding: "8px",
//                 cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 fontWeight: "bold",
//                 opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//               }}
//             >
//               <FiPower size={24} color="#fff" />
//               {processing.status && <span className="screen1-processing-indicator"></span>}
//             </button>
//             {sensorData.errorFlag == "1" && <div className="error-indicator" />}
//           </div>
//         </div>

//         {/* Logo below the row */}
//         <div className="logo-container">
//           <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//         </div>

     
//         {/* Temperature Dial — dimmed when offline */}
//         <div style={{ pointerEvents: "none", opacity: sensorData.isOnline ? 1 : 0.35 }}>
//           <TemperatureDial
//             sensorData={sensorData}
//             onTempChange={handleTempChange}
//             fanSpeed={fanPosition}
//             initialTemperature={sensorData.temperature ?? 25}
//           />
//         </div>


//            {/* ✅ FIX 2: Offline banner positioned BETWEEN header and temperature dial */}
//         {!sensorData.isOnline && (
//           <div
//             style={{
//               // backgroundColor: "rgba(0,0,0,0.55)",
//               // color: "#fff",
//                  color: "rgba(0,0,0,0.55)",
//               backgroundColor: "#fff",
//               textAlign: "center",
//               padding: "10px 20px",
//               borderRadius: "10px",
//               margin: "12px 20px 4px 20px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               letterSpacing: "0.5px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             <span>📴</span>
//             <span>System is Offline</span>
//           </div>
//         )}

//         {/* Status messages */}
//         {processing.status && (
//           <div className="screen1-processing-message">{processing.message}</div>
//         )}

//         {sensorData.errorFlag == "1" && (
//           <div className="screen1-error-message">⚠️ System Error Detected</div>
//         )}

//         {sensorData.hvacBusy == "1" && !processing.status && (
//           <div className="screen1-busy-message">⏳ System is currently busy</div>
//         )}


//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.outsideTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.roomTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Room Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.humidity)}%` : "—"}
//             </div>
//             <div className="env-label">Humidity</div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer-container">
//         {/* ==================== MODES SECTION ==================== */}
//         <div className="modes-section-in-footer">
//           <h3 className="modes-heading">Modes</h3>
//           <div className="modes-row">
//             {Object.values(MODE_MAP).map((mode) => (
//               <button
//                 key={mode}
//                 onClick={() => handleModeChange(mode)}
//                 className={`modes-button ${
//                   currentModeDescription === mode ? "modes-button-selected" : ""
//                 }`}
//                 disabled={processing.status || !sensorData.isOnline}
//                 style={{
//                   opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//                   cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 }}
//               >
//                 <span
//                   className={`modes-text ${
//                     currentModeDescription === mode ? "modes-text-selected" : ""
//                   }`}
//                 >
//                   {mode}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ==================== FAN SPEED SECTION ==================== */}
//       {/* ==================== FAN SPEED SECTION (BUTTONS STYLE) ==================== */}
// <div className="fan-speed-section-in-footer">
//   <h3 className="fan-speed-heading">Fan Speed</h3>
//   <div className="fan-speed-buttons-row">
//     {FAN_LABELS.map((label, index) => (
//       <button
//         key={label}
//         onClick={() => handleFanSpeedChange(index)}
//         className={`fan-speed-button ${
//           fanPosition === index ? "fan-speed-button-selected" : ""
//         }`}
//         disabled={processing.status || !sensorData.isOnline}
//         style={{
//           opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//           cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//         }}
//       >
//         <span
//           className={`fan-speed-text ${
//             fanPosition === index ? "fan-speed-text-selected" : ""
//           }`}
//         >
//           {label}
//         </span>
//       </button>
//     ))}
//   </div>
// </div>

//         {/* Control Buttons */}
//         <div className="control-buttons">
//           <button
//             className={`control-btn ${!hasValidPCBSerial ? "screen1-disabled-btn" : ""}`}
//             // onClick={() => {
//             //   if (hasValidPCBSerial) {
//             //     navigate("/machinescreen2", {
//             //       state: { sensorData, selectedService, userId, company_id },
//             //     });
//             //   }
//             // }}
//             disabled={!hasValidPCBSerial}
//             title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
//           >
//             <FiWind size={20} />
//             <span>Modes</span>
//             <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
//           </button>

//           <button
//             className="control-btn"
//             onClick={() =>
//               navigate("/alarms", {
//                 state: {
//                   alarmData: {
//                     alarmOccurred: sensorData.alarmOccurred,
//                     errorCount: errorCount,
//                     deviceId: sensorData.deviceId,
//                   },
//                   userId: userId,
//                   company_id: company_id,
//                 },
//               })
//             }
//           >
//             <div style={{ position: "relative" }}>
//               <FiClock size={20} />
//               {errorCount > 0 && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-23px",
//                     backgroundColor: "red",
//                     color: "white",
//                     borderRadius: "50%",
//                     width: "18px",
//                     height: "18px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {errorCount}
//                 </span>
//               )}
//             </div>
//             <span>Alarms</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/timers")}>
//             <FiWatch size={20} />
//             <span>Timers</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/settings")}>
//             <FiSettings size={20} />
//             <span>Settings</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/machine")}>
//             <FiZap size={20} />
//             <span>Services</span>
//           </button>

//           <button className="control-btn" onClick={handleLogout}>
//             <FiLogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>

//         <div className="footer-logo">
//           <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{ marginTop: "-12px" }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen1;


// =============================
// implemented switching 
// import React, { useState, useEffect, useContext, useRef } from "react";
// import {
//   FiPower,
//   FiWind,
//   FiClock,
//   FiWatch,
//   FiSettings,
//   FiZap,
//   FiLogOut,
//   FiSun,
//   FiDroplet,
//   FiThermometer,
//   FiRefreshCw,
//   FiChevronDown,
// } from "react-icons/fi";
// import { FaFan } from "react-icons/fa";
// import "./Screen1.css";
// import AIROlogo from "./Images/AIRO.png";
// import greenAire from "./Images/greenAire.png";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../AuthContext/AuthContext";
// import TemperatureDial from "./TemperatureDial";
// import baseURL from "../../ApiUrl/Apiurl";
// import NoServiceItems from "./NoServiceItems";
// import Loading from "./Loading";

// // Constants
// const MODE_MAP = {
//   1: "IDEC",
//   2: "Auto",
//   3: "Fan",
//   4: "Indirect",
//   5: "Direct",
// };

// const MODE_CODE_MAP = {
//   IDEC: 1,
//   Auto: 2,
//   Fan: 3,
//   Indirect: 4,
//   Direct: 5,
// };

// const FAN_SPEEDS = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
// const FAN_LABELS = ["High", "Medium", "Low"];

// const PULL_THRESHOLD = 80;
// const MAX_PULL = 120;

// // ✅ FIX 3: Progressive messages every 10s
// const PROCESSING_MESSAGES = [
//   "Sending command...",
//   "Almost done, please wait...",
//   "Waiting for device response...",
// ];

// const getStoredService = () => {
//   try {
//     const stored = localStorage.getItem("selectedService");
//     return stored ? JSON.parse(stored) : null;
//   } catch (e) {
//     return null;
//   }
// };

// const formatTemp = (temp) => {
//   if (temp == null) return "0.0";
//   const num = parseFloat(temp);
//   return isNaN(num) ? "0.0" : num.toFixed(1);
// };

// const sendRefreshCommand = async (pcbSerialNumber, sensorData) => {
//   const payload = {
//     Header: "0xAA",
//     DI: pcbSerialNumber || "2411GM-0102",
//     MD: sensorData.mode || "3",
//     FS: sensorData.fanSpeed || "0",
//     SRT: sensorData.temperature || 25,
//     HVAC: "3",
//     Footer: "0xZX",
//   };
//   console.group("🔁 REFRESH COMMAND");
//   console.log("📦 Payload:", payload);
//   console.groupEnd();
//   try {
//     const response = await fetch("https://mdata.air2o.net/controllers/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     let responseBody;
//     try {
//       responseBody = await response.json();
//     } catch {
//       responseBody = await response.text();
//     }
//     if (!response.ok) {
//       return {
//         success: false,
//         error: responseBody?.error || responseBody?.message || "Command rejected by server",
//         status: response.status,
//       };
//     }
//     return { success: true, data: responseBody };
//   } catch (error) {
//     return { success: false, error: "Network error or server unreachable" };
//   }
// };

// const Screen1 = () => {
//   const { user, logout } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   const navigate = useNavigate();

//   const [pullToRefresh, setPullToRefresh] = useState({
//     isPulling: false,
//     pullDistance: 0,
//     isRefreshing: false,
//   });

//   const touchStartY = useRef(0);
//   const containerRef = useRef(null);

//   // ✅ FIX 1: Single interval, PCB switching via ref
//   const activePCBRef = useRef(null);
//   const fetchIntervalRef = useRef(null);

//   // ✅ FIX 3: Processing message cycling refs
//   const processingTimerRef = useRef(null);
//   const processingMsgIndexRef = useRef(0);
//   const hardStopTimerRef = useRef(null);

//   const [serviceItems, setServiceItems] = useState([]);
//   const [selectedService, setSelectedService] = useState(getStoredService());
//   const [showServiceDropdown, setShowServiceDropdown] = useState(false);
//   const [processing, setProcessing] = useState({ status: false, message: "" });
//   const [errorCount, setErrorCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [manualRefresh, setManualRefresh] = useState(false);
//   const [refreshStatus, setRefreshStatus] = useState({
//     sending: false,
//     success: false,
//     message: "",
//   });
//   const [dropdownAlarmCount, setDropdownAlarmCount] = useState(0);

//   // Add this alongside your other refs
//   const processingStartTimeRef = useRef(null);
//   const MIN_PROCESSING_TIME = 5000; // 5 seconds minimum before poll can clear it

//   const [sensorData, setSensorData] = useState({
//     outsideTemp: 0,
//     humidity: 0,
//     roomTemp: 0,
//     fanSpeed: "0",
//     temperature: 25,
//     powerStatus: "off",
//     mode: "3",
//     errorFlag: "0",
//     hvacBusy: "0",
//     deviceId: "",
//     alarmOccurred: "0",
//     isOnline: true,
//   });

//   // Display data for local changes
//   const [displayData, setDisplayData] = useState({
//     fanSpeed: "0",
//     temperature: 25,
//     mode: "3",
//     powerStatus: "off",
//   });

//   // Service switching states
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [pendingService, setPendingService] = useState(null);
//   const [switchingService, setSwitchingService] = useState(false);
//   const [loadingMessage, setLoadingMessage] = useState("");
//   const [switchNotification, setSwitchNotification] = useState({ show: false, message: "" });

//   useEffect(() => {
//     // Sync displayData with sensorData
//     setDisplayData({
//       fanSpeed: sensorData.fanSpeed,
//       temperature: sensorData.temperature,
//       mode: sensorData.mode,
//       powerStatus: sensorData.powerStatus,
//     });
//   }, [sensorData]);

//   useEffect(() => {
//     if (selectedService) {
//       localStorage.setItem("selectedService", JSON.stringify(selectedService));
//     }
//   }, [selectedService]);

//   // Get current mode description
//   const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";
  
//   // Get fan position for slider
//   const fanPosition = FAN_SPEEDS.indexOf(displayData.fanSpeed);
//   const fanPercentage = fanPosition * 50;

//   // Handle mode change
//   const handleModeChange = async (newMode) => {
//     if (processing.status || !sensorData.isOnline) return;
    
//     const newModeCode = MODE_CODE_MAP[newMode] || 1;
//     setDisplayData((prev) => ({ ...prev, mode: newModeCode.toString() }));
    
//     // Send command to device if power is on
//     if (displayData.powerStatus === "on") {
//       await sendModeCommand(newModeCode.toString(), newMode);
//     }
//   };

//   // Send mode command
//   const sendModeCommand = async (modeCode, modeName) => {
//     try {
//       startProcessingCycle();
      
//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: parseInt(modeCode) || 3,
//         FS: parseInt(displayData.fanSpeed) || 0,
//         SRT: parseInt(displayData.temperature) || 25,
//         HVAC: displayData.powerStatus === "on" ? "1" : "0",
//         Footer: "0xZX",
//       };
      
//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
      
//       if (!response.ok) {
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }
      
//       console.log("✅ Mode command sent:", modeName);
//     } catch (error) {
//       console.error("Error sending mode command:", error);
//       stopProcessing();
//     }
//   };

//   // Handle fan speed change - ALWAYS update display and send if power is on
//   const handleFanSpeedChange = async (newPosition) => {
//     if (processing.status || !sensorData.isOnline) return;
    
//     const newSpeed = FAN_SPEEDS[newPosition];
    
//     // Always update display immediately for UI feedback
//     setDisplayData((prev) => ({ ...prev, fanSpeed: newSpeed }));
    
//     // Only send command to device if power is ON
//     if (displayData.powerStatus === "on") {
//       await sendFanCommand(newSpeed);
//     } else {
//       // If power is OFF, just update the local state
//       // The value will be used when power turns ON
//       console.log(`Fan speed set to ${newSpeed} (will apply when power turns on)`);
//     }
//   };

//   // Send fan command
//   const sendFanCommand = async (fanSpeed) => {
//     try {
//       startProcessingCycle();
      
//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: parseInt(displayData.mode) || 3,
//         FS: parseInt(fanSpeed) || 0,
//         SRT: parseInt(displayData.temperature) || 25,
//         HVAC: displayData.powerStatus === "on" ? "1" : "0",
//         Footer: "0xZX",
//       };
      
//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
      
//       if (!response.ok) {
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }
      
//       console.log("✅ Fan command sent:", fanSpeed);
//     } catch (error) {
//       console.error("Error sending fan command:", error);
//       stopProcessing();
//     }
//   };

//   // Handle fan click on slider
//   const handleFanClick = (e) => {
//     if (processing.status || !sensorData.isOnline) return;
//     const containerWidth = e.currentTarget.offsetWidth;
//     const clickPosition = e.nativeEvent.offsetX;
//     const segmentWidth = containerWidth / 3;
//     const newPosition = Math.min(2, Math.floor(clickPosition / segmentWidth));
//     handleFanSpeedChange(newPosition);
//   };

//   // ✅ FIX 3: Start progressive message cycle
//   const startProcessingCycle = () => {
//     processingMsgIndexRef.current = 0;
//     processingStartTimeRef.current = Date.now();
//     setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

//     processingTimerRef.current = setInterval(() => {
//       processingMsgIndexRef.current += 1;
//       const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
//       if (nextMsg) {
//         setProcessing({ status: true, message: nextMsg });
//       }
//     }, 10000);

//     hardStopTimerRef.current = setTimeout(() => {
//       stopProcessing();
//     }, 25000);
//   };

//   const stopProcessing = () => {
//     if (processingTimerRef.current) {
//       clearInterval(processingTimerRef.current);
//       processingTimerRef.current = null;
//     }
//     if (hardStopTimerRef.current) {
//       clearTimeout(hardStopTimerRef.current);
//       hardStopTimerRef.current = null;
//     }
//     setProcessing({ status: false, message: "" });
//   };

//   // Called when polling detects hvac_busy flipped to 0
//   const clearProcessingIfDone = () => {
//     if (processingTimerRef.current || hardStopTimerRef.current) {
//       const elapsed = Date.now() - (processingStartTimeRef.current || 0);
//       if (elapsed >= MIN_PROCESSING_TIME) {
//         stopProcessing();
//       }
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (processingTimerRef.current) clearInterval(processingTimerRef.current);
//       if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await fetch(
//           `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch service items");

//         const data = await response.json();
//         setServiceItems(data.data || []);

//         if (data.data?.length > 0 && !selectedService) {
//           const first = data.data[0];
//           setSelectedService(first);
//           activePCBRef.current = first.pcb_serial_number;
//         }

//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       } catch (error) {
//         console.error("Error fetching service items:", error);
//         setLoading(false);
//         setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
//         setManualRefresh(false);
//       }
//     };

//     fetchServiceItems();
//   }, [manualRefresh]);

//   const fetchData = async () => {
//     const pcbSerialNumber = activePCBRef.current;
//     if (!pcbSerialNumber) return;

//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`
//       );
//       if (!response.ok) throw new Error("Network response was not ok");

//       const data = await response.json();
//       if (data.status !== "success" || !data.data) return;

//       if (activePCBRef.current !== pcbSerialNumber) return;

//       const deviceData = data.data;
//       const isOnline = deviceData.is_online;

//       setSensorData({
//         outsideTemp: isOnline ? deviceData.outdoor_temperature?.value : null,
//         humidity: isOnline ? deviceData.room_humidity?.value : null,
//         roomTemp: isOnline ? deviceData.room_temperature?.value : null,
//         fanSpeed: isOnline ? deviceData.fan_speed?.value : "0",
//         temperature: isOnline ? deviceData.set_temperature?.value : 25,
//         powerStatus: isOnline && deviceData.hvac_on?.value == "1" ? "on" : "off",
//         mode: deviceData.mode?.value,
//         errorFlag: isOnline ? deviceData.error_flag?.value : "0",
//         hvacBusy: isOnline ? deviceData.hvac_busy?.value : "0",
//         deviceId: pcbSerialNumber,
//         alarmOccurred: deviceData.alarm_occurred?.value,
//         isOnline: isOnline,
//       });

//       const alarmValue = deviceData.alarm_occurred?.value;
//       setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

//       if (deviceData.hvac_busy?.value == "0") {
//         clearProcessingIfDone();
//       }
//     } catch (err) {
//       console.error("❌ Fetch error:", err);
//     }
//   };

//   const fetchAllAlarms = async () => {
//     try {
//       const response = await fetch(
//         `${baseURL}/get-latest-data/?user_id=${userId}&company_id=${company_id}`
//       );

//       if (!response.ok) throw new Error("Failed to fetch all alarms");

//       const data = await response.json();

//       if (data.status !== "success" || !data.data) return;

//       const alarmCount = data.data.reduce((count, item) => {
//         const val = item.alarm_occurred?.value;
//         if (val && val !== "0") {
//           return count + Number(val);
//         }
//         return count;
//       }, 0);

//       setDropdownAlarmCount(alarmCount);
//     } catch (err) {
//       console.error("Dropdown alarm fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchAllAlarms();

//     fetchIntervalRef.current = setInterval(() => {
//       fetchData();
//       fetchAllAlarms();
//     }, 1000);

//     return () => {
//       if (fetchIntervalRef.current) {
//         clearInterval(fetchIntervalRef.current);
//         fetchIntervalRef.current = null;
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedService?.pcb_serial_number) {
//       console.log("🔄 Switching active PCB to:", selectedService.pcb_serial_number);
//       activePCBRef.current = selectedService.pcb_serial_number;
//     }
//   }, [selectedService?.pcb_serial_number]);

//   const sendRefreshToController = async () => {
//     if (!selectedService?.pcb_serial_number) {
//       setRefreshStatus({ sending: false, success: false, message: "No device selected" });
//       return { success: false };
//     }
//     try {
//       const result = await sendRefreshCommand(selectedService.pcb_serial_number, sensorData);
//       if (result.success) {
//         setRefreshStatus({ sending: false, success: true, message: "Refresh sent successfully" });
//         setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 3000);
//         return result;
//       }
//       const msg = result?.error || result?.message || "Failed to send refresh command";
//       setRefreshStatus({ sending: false, success: false, message: msg });
//       setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 2000);
//       return result;
//     } catch (error) {
//       setRefreshStatus({ sending: false, success: false, message: error.message || "Unexpected error" });
//       return { success: false };
//     }
//   };

//   const handleTouchStart = (e) => {
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.touches[0].clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleTouchEnd = async () => {
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleMouseDown = (e) => {
//     touchStartY.current = e.clientY;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleMouseMove = (e) => {
//     if (containerRef.current && containerRef.current.scrollTop > 0) return;
//     const pullDistance = e.clientY - touchStartY.current;
//     if (pullDistance > 0) {
//       e.preventDefault();
//       setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
//     }
//   };

//   const handleMouseUp = async () => {
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
//       await sendRefreshToController();
//       setManualRefresh(true);
//     } else {
//       setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const handlePowerToggle = async () => {
//     try {
//       if (processing.status || sensorData.hvacBusy == "1") {
//         const msg = sensorData.hvacBusy == "1" ? "System is busy, please wait..." : "Please wait...";
//         setProcessing({ status: true, message: msg });
//         return;
//       }

//       startProcessingCycle();

//       const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";
//       const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

//       const payload = {
//         Header: "0xAA",
//         DI: selectedService?.pcb_serial_number || "2411GM-0102",
//         MD: isShutdown ? "3" : sensorData.mode,
//         FS: isShutdown ? "0" : sensorData.fanSpeed,
//         SRT: sensorData.temperature,
//         HVAC: newHvacValue,
//         Footer: "0xZX",
//       };

//       const response = await fetch("https://mdata.air2o.net/controllers/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         console.error("❌ API error:", response.status);
//         stopProcessing();
//         throw new Error("Failed to send command");
//       }

//       const result = await response.text();
//       console.log("✅ Command sent:", result);
//     } catch (error) {
//       console.error("🔥 Power toggle error:", error.message);
//       stopProcessing();
//     }
//   };

//   const handleNavigation = (path) => {
//     if (!processing.status) navigate(path);
//   };

//   // Updated handleServiceSelect with confirmation
//   const handleServiceSelect = (item) => {
//     // Don't allow switching to the same service
//     if (selectedService?.service_item_id === item.service_item_id) {
//       setShowServiceDropdown(false);
//       return;
//     }
    
//     // Show confirmation dialog before switching
//     setPendingService(item);
//     setShowConfirmDialog(true);
//     setShowServiceDropdown(false);
//   };

//   // Confirm service switch
//   const confirmServiceSwitch = () => {
//     if (!pendingService) return;
    
//     setShowConfirmDialog(false);
//     setSwitchingService(true);
//     setLoadingMessage(`Switching to ${pendingService.service_item_name}...`);
    
//     // Update the service after a short delay for UX
//     setTimeout(() => {
//       setSelectedService(pendingService);
//       activePCBRef.current = pendingService.pcb_serial_number;
      
//       // Show success notification
//       setSwitchNotification({ 
//         show: true, 
//         message: `Successfully switched to ${pendingService.service_item_name}` 
//       });
      
//       // Hide notification after 3 seconds
//       setTimeout(() => {
//         setSwitchNotification({ show: false, message: "" });
//       }, 3000);
      
//       // Clear loading state
//       setTimeout(() => {
//         setSwitchingService(false);
//         setLoadingMessage("");
//       }, 1500);
//     }, 500);
//   };

//   // Cancel service switch
//   const cancelServiceSwitch = () => {
//     setShowConfirmDialog(false);
//     setPendingService(null);
//   };

//   const handleTempChange = (newTemp) => {
//     console.log("Temperature changed:", newTemp);
//   };

//   const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;
//   const getModeDescription = (code) => MODE_MAP[code] || "Fan";

//   const pullProgress = Math.min(pullToRefresh.pullDistance / PULL_THRESHOLD, 1);
//   const indicatorRotation = pullProgress * 360;
//   const indicatorOpacity = pullProgress;

//   if (loading && !manualRefresh) return <Loading onLogout={handleLogout} />;

//   if (!loading && serviceItems.length === 0 && !manualRefresh) {
//     return <NoServiceItems onLogout={handleLogout} onNavigateHome={() => navigate("/home")} />;
//   }

//   return (
//     <div
//       className="mainmain-container"
//       style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)", touchAction: "pan-y" }}
//       ref={containerRef}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onMouseDown={handleMouseDown}
//     >
//       {/* Pull-to-refresh indicator */}
//       <div
//         className="screen1-pull-refresh"
//         style={{
//           height: `${pullToRefresh.pullDistance}px`,
//           opacity: pullToRefresh.isPulling || pullToRefresh.isRefreshing ? 1 : 0,
//           transform: `translateY(${pullToRefresh.isPulling ? 0 : -30}px)`,
//           transition: pullToRefresh.isPulling ? "none" : "all 0.3s ease",
//         }}
//       >
//         <div className="screen1-refresh-content">
//           {!pullToRefresh.isRefreshing && (
//             <>
//               <FiRefreshCw
//                 size={24}
//                 style={{
//                   transform: `rotate(${indicatorRotation}deg)`,
//                   transition: "transform 0.2s ease",
//                   opacity: indicatorOpacity,
//                 }}
//               />
//               <span>
//                 {pullToRefresh.pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
//               </span>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="main-container">
//         {/* Refresh status toast */}
//         {refreshStatus.message && (
//           <div className={`screen1-refresh-status ${refreshStatus.success ? "success" : "error"}`}>
//             {refreshStatus.message}
//           </div>
//         )}

//         {/* Success Notification Toast */}
//         {switchNotification.show && (
//           <div className="switch-notification">
//             <span>✅</span>
//             <span>{switchNotification.message}</span>
//           </div>
//         )}

//         {/* Confirmation Dialog */}
//         {showConfirmDialog && (
//           <div className="confirm-dialog-overlay">
//             <div className="confirm-dialog">
//               <div className="confirm-dialog-content">
//                 <h3>Switch Service?</h3>
//                 <p>Are you sure you want to switch to <strong>{pendingService?.service_item_name}</strong>?</p>
//                 <div className="confirm-dialog-buttons">
//                   <button 
//                     className="confirm-dialog-btn confirm-btn-yes"
//                     onClick={confirmServiceSwitch}
//                   >
//                     Yes, Switch
//                   </button>
//                   <button 
//                     className="confirm-dialog-btn confirm-btn-no"
//                     onClick={cancelServiceSwitch}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Loading Overlay for Service Switching */}
//         {switchingService && (
//           <div className="service-switching-overlay">
//             <div className="service-switching-content">
//               <div className="switching-spinner"></div>
//               <p>{loadingMessage}</p>
//               <div className="switching-progress-bar">
//                 <div className="switching-progress-fill"></div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header: Service Dropdown + Power Button Row */}
//         <div className="header-controls-row">
//           {/* Service Dropdown */}
//           <div className="service-dropdown-wrapper">
//             <div className="service-dropdown-container">
//               <div
//                 className="service-dropdown-header"
//                 onClick={() => setShowServiceDropdown(!showServiceDropdown)}
//                 style={{ position: "relative" }}
//               >
//                 <span>
//                   {selectedService ? selectedService.service_item_name : "Select Service"}
//                 </span>

//                 {/* 🔴 GLOBAL ALARM BADGE */}
//                 {dropdownAlarmCount > 0 && (
//                   <span
//                     style={{
//                       position: "absolute",
//                       top: "0px",
//                       right: "28px",
//                       backgroundColor: "red",
//                       color: "white",
//                       borderRadius: "50%",
//                       width: "18px",
//                       height: "18px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "10px",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {dropdownAlarmCount}
//                   </span>
//                 )}

//                 <FiChevronDown size={18} />
//               </div>
//               {showServiceDropdown && (
//                 <div className="service-dropdown-list">
//                   {serviceItems.map((item) => (
//                     <div
//                       key={item.service_item_id}
//                       className="service-dropdown-item"
//                       onClick={() => handleServiceSelect(item)}
//                     >
//                       {item.service_item_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Power Button */}
//           <div style={{ position: "relative" }}>
//             <button
//               className={`screen1-power-button ${processing.status ? "processing" : ""}`}
//               onClick={handlePowerToggle}
//               disabled={processing.status || !sensorData.isOnline}
//               style={{
//                 backgroundColor: !sensorData.isOnline
//                   ? "#808080"
//                   : sensorData.powerStatus == "on"
//                   ? "#5adb5eff"
//                   : "#c80000f5",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 border: "none",
//                 height: "48px",
//                 width: "48px",
//                 borderRadius: "20px",
//                 padding: "8px",
//                 cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 fontWeight: "bold",
//                 opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//               }}
//             >
//               <FiPower size={24} color="#fff" />
//               {processing.status && <span className="screen1-processing-indicator"></span>}
//             </button>
//             {sensorData.errorFlag == "1" && <div className="error-indicator" />}
//           </div>
//         </div>

//         {/* Logo below the row */}
//         <div className="logo-container">
//           <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
//         </div>

     
//         {/* Temperature Dial — dimmed when offline */}
//         <div style={{ pointerEvents: "none", opacity: sensorData.isOnline ? 1 : 0.35 }}>
//           <TemperatureDial
//             sensorData={sensorData}
//             onTempChange={handleTempChange}
//             fanSpeed={fanPosition}
//             initialTemperature={sensorData.temperature ?? 25}
//           />
//         </div>


//            {/* ✅ FIX 2: Offline banner positioned BETWEEN header and temperature dial */}
//         {!sensorData.isOnline && (
//           <div
//             style={{
//               color: "rgba(0,0,0,0.55)",
//               backgroundColor: "#fff",
//               textAlign: "center",
//               padding: "10px 20px",
//               borderRadius: "10px",
//               margin: "12px 20px 4px 20px",
//               fontSize: "14px",
//               fontWeight: "bold",
//               letterSpacing: "0.5px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             <span>📴</span>
//             <span>System is Offline</span>
//           </div>
//         )}

//         {/* Status messages */}
//         {processing.status && (
//           <div className="screen1-processing-message">{processing.message}</div>
//         )}

//         {sensorData.errorFlag == "1" && (
//           <div className="screen1-error-message">⚠️ System Error Detected</div>
//         )}

//         {sensorData.hvacBusy == "1" && !processing.status && (
//           <div className="screen1-busy-message">⏳ System is currently busy</div>
//         )}


//         {/* Environment Info */}
//         <div className="env-info">
//           <div className="env-item">
//             <FiSun className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.outsideTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Outside Temp</div>
//           </div>
//           <div className="env-item">
//             <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.roomTemp)}°C` : "—"}
//             </div>
//             <div className="env-label">Room Temp</div>
//           </div>
//           <div className="env-item">
//             <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
//             <div className="env-value">
//               {sensorData.isOnline ? `${formatTemp(sensorData.humidity)}%` : "—"}
//             </div>
//             <div className="env-label">Humidity</div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer-container">
//         {/* ==================== MODES SECTION ==================== */}
//         <div className="modes-section-in-footer">
//           <h3 className="modes-heading">Modes</h3>
//           <div className="modes-row">
//             {Object.values(MODE_MAP).map((mode) => (
//               <button
//                 key={mode}
//                 onClick={() => handleModeChange(mode)}
//                 className={`modes-button ${
//                   currentModeDescription === mode ? "modes-button-selected" : ""
//                 }`}
//                 disabled={processing.status || !sensorData.isOnline}
//                 style={{
//                   opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//                   cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 }}
//               >
//                 <span
//                   className={`modes-text ${
//                     currentModeDescription === mode ? "modes-text-selected" : ""
//                   }`}
//                 >
//                   {mode}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ==================== FAN SPEED SECTION (BUTTONS STYLE) ==================== */}
//         <div className="fan-speed-section-in-footer">
//           <h3 className="fan-speed-heading">Fan Speed</h3>
//           <div className="fan-speed-buttons-row">
//             {FAN_LABELS.map((label, index) => (
//               <button
//                 key={label}
//                 onClick={() => handleFanSpeedChange(index)}
//                 className={`fan-speed-button ${
//                   fanPosition === index ? "fan-speed-button-selected" : ""
//                 }`}
//                 disabled={processing.status || !sensorData.isOnline}
//                 style={{
//                   opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
//                   cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
//                 }}
//               >
//                 <span
//                   className={`fan-speed-text ${
//                     fanPosition === index ? "fan-speed-text-selected" : ""
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Control Buttons */}
//         <div className="control-buttons">
//           <button
//             className={`control-btn ${!hasValidPCBSerial ? "screen1-disabled-btn" : ""}`}
//             disabled={!hasValidPCBSerial}
//             title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
//           >
//             <FiWind size={20} />
//             <span>Modes</span>
//             <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
//           </button>

//           <button
//             className="control-btn"
//             onClick={() =>
//               navigate("/alarms", {
//                 state: {
//                   alarmData: {
//                     alarmOccurred: sensorData.alarmOccurred,
//                     errorCount: errorCount,
//                     deviceId: sensorData.deviceId,
//                   },
//                   userId: userId,
//                   company_id: company_id,
//                 },
//               })
//             }
//           >
//             <div style={{ position: "relative" }}>
//               <FiClock size={20} />
//               {errorCount > 0 && (
//                 <span
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-23px",
//                     backgroundColor: "red",
//                     color: "white",
//                     borderRadius: "50%",
//                     width: "18px",
//                     height: "18px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: "10px",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {errorCount}
//                 </span>
//               )}
//             </div>
//             <span>Alarms</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/timers")}>
//             <FiWatch size={20} />
//             <span>Timers</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/settings")}>
//             <FiSettings size={20} />
//             <span>Settings</span>
//           </button>

//           <button className="control-btn" onClick={() => handleNavigation("/machine")}>
//             <FiZap size={20} />
//             <span>Services</span>
//           </button>

//           <button className="control-btn" onClick={handleLogout}>
//             <FiLogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>

//         <div className="footer-logo">
//           <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{ marginTop: "-12px" }} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Screen1;


import React, { useState, useEffect, useContext, useRef } from "react";
import {
  FiPower,
  FiWind,
  FiClock,
  FiWatch,
  FiSettings,
  FiZap,
  FiLogOut,
  FiSun,
  FiDroplet,
  FiThermometer,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import { FaFan } from "react-icons/fa";
import "./Screen1.css";
import AIROlogo from "./Images/AIRO.png";
import greenAire from "./Images/greenAire.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import TemperatureDial from "./TemperatureDial";
import baseURL from "../../ApiUrl/Apiurl";
import NoServiceItems from "./NoServiceItems";
import Loading from "./Loading";

// Constants
const MODE_MAP = {
  1: "IDEC",
  2: "Auto",
  3: "Fan",
  4: "Indirect",
  5: "Direct",
};

const MODE_CODE_MAP = {
  IDEC: 1,
  Auto: 2,
  Fan: 3,
  Indirect: 4,
  Direct: 5,
};

const FAN_SPEEDS = ["0", "1", "2"]; // 0=High, 1=Medium, 2=Low
const FAN_LABELS = ["High", "Medium", "Low"];

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

// ✅ FIX 3: Progressive messages every 10s
const PROCESSING_MESSAGES = [
  "Sending command...",
  "Almost done, please wait...",
  "Waiting for device response...",
];

const getStoredService = () => {
  try {
    const stored = localStorage.getItem("selectedService");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

const formatTemp = (temp) => {
  if (temp == null) return "0.0";
  const num = parseFloat(temp);
  return isNaN(num) ? "0.0" : num.toFixed(1);
};

const sendRefreshCommand = async (pcbSerialNumber, sensorData) => {
  const payload = {
    Header: "0xAA",
    DI: pcbSerialNumber || "2411GM-0102",
    MD: sensorData.mode || "3",
    FS: sensorData.fanSpeed || "0",
    SRT: sensorData.temperature || 25,
    HVAC: "3",
    Footer: "0xZX",
  };
  console.group("🔁 REFRESH COMMAND");
  console.log("📦 Payload:", payload);
  console.groupEnd();
  try {
    const response = await fetch("https://mdata.air2o.net/controllers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = await response.text();
    }
    if (!response.ok) {
      return {
        success: false,
        error: responseBody?.error || responseBody?.message || "Command rejected by server",
        status: response.status,
      };
    }
    return { success: true, data: responseBody };
  } catch (error) {
    return { success: false, error: "Network error or server unreachable" };
  }
};

const Screen1 = () => {
  const { user, logout } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  const navigate = useNavigate();

  const [pullToRefresh, setPullToRefresh] = useState({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });

  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  // ✅ FIX 1: Single interval, PCB switching via ref
  const activePCBRef = useRef(null);
  const fetchIntervalRef = useRef(null);

  // ✅ FIX 3: Processing message cycling refs
  const processingTimerRef = useRef(null);
  const processingMsgIndexRef = useRef(0);
  const hardStopTimerRef = useRef(null);

  const [serviceItems, setServiceItems] = useState([]);
  const [selectedService, setSelectedService] = useState(getStoredService());
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [processing, setProcessing] = useState({ status: false, message: "" });
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [manualRefresh, setManualRefresh] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState({
    sending: false,
    success: false,
    message: "",
  });
  const [dropdownAlarmCount, setDropdownAlarmCount] = useState(0);

  // Add this alongside your other refs
  const processingStartTimeRef = useRef(null);
  const MIN_PROCESSING_TIME = 5000; // 5 seconds minimum before poll can clear it

  const [sensorData, setSensorData] = useState({
    outsideTemp: 0,
    humidity: 0,
    roomTemp: 0,
    fanSpeed: "0",
    temperature: 25,
    powerStatus: "off",
    mode: "3",
    errorFlag: "0",
    hvacBusy: "0",
    deviceId: "",
    alarmOccurred: "0",
    isOnline: true,
  });

  // Display data for local changes
  const [displayData, setDisplayData] = useState({
    fanSpeed: "0",
    temperature: 25,
    mode: "3",
    powerStatus: "off",
  });

  // ✅ Temperature dragging state
  const [isDraggingTemp, setIsDraggingTemp] = useState(false);

  // Service switching states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingService, setPendingService] = useState(null);
  const [switchingService, setSwitchingService] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [switchNotification, setSwitchNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    // Sync displayData with sensorData
    setDisplayData({
      fanSpeed: sensorData.fanSpeed,
      temperature: sensorData.temperature,
      mode: sensorData.mode,
      powerStatus: sensorData.powerStatus,
    });
  }, [sensorData]);

  useEffect(() => {
    if (selectedService) {
      localStorage.setItem("selectedService", JSON.stringify(selectedService));
    }
  }, [selectedService]);

  // Get current mode description
  const currentModeDescription = MODE_MAP[displayData.mode] || "Fan";
  
  // Get fan position for slider
  const fanPosition = FAN_SPEEDS.indexOf(displayData.fanSpeed);
  const fanPercentage = fanPosition * 50;

  // ✅ NEW: Send temperature command to device
  const sendTemperatureCommand = async (temperature) => {
    try {
      startProcessingCycle();
      
      const payload = {
        Header: "0xAA",
        DI: selectedService?.pcb_serial_number || "2411GM-0102",
        MD: parseInt(displayData.mode) || 3,
        FS: parseInt(displayData.fanSpeed) || 0,
        SRT: parseInt(temperature) || 25,
        HVAC: displayData.powerStatus === "on" ? "1" : "0",
        Footer: "0xZX",
      };
      
      console.log("🌡️ Sending temperature command:", payload);
      
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        stopProcessing();
        throw new Error("Failed to send temperature command");
      }
      
      console.log("✅ Temperature command sent:", temperature);
    } catch (error) {
      console.error("Error sending temperature command:", error);
      stopProcessing();
    }
  };

  // ✅ UPDATED: Handle temperature change during drag
  const handleTempChange = (newTemp) => {
    // Update display immediately for smooth UI feedback
    setDisplayData((prev) => ({ ...prev, temperature: newTemp }));
    setIsDraggingTemp(true);
    
    // If power is OFF, just store the value locally
    if (displayData.powerStatus === "off") {
      console.log(`Temperature set to ${newTemp}°C (will apply when power turns on)`);
    }
  };

  // ✅ NEW: Handle when user finishes dragging temperature
  const handleTempChangeEnd = async (newTemp) => {
    setIsDraggingTemp(false);
    
    // Only send command if power is ON
    if (displayData.powerStatus === "on") {
      await sendTemperatureCommand(newTemp);
    }
  };

  // Handle mode change
  const handleModeChange = async (newMode) => {
    if (processing.status || !sensorData.isOnline) return;
    
    const newModeCode = MODE_CODE_MAP[newMode] || 1;
    setDisplayData((prev) => ({ ...prev, mode: newModeCode.toString() }));
    
    // Send command to device if power is on
    if (displayData.powerStatus === "on") {
      await sendModeCommand(newModeCode.toString(), newMode);
    }
  };

  // Send mode command
  const sendModeCommand = async (modeCode, modeName) => {
    try {
      startProcessingCycle();
      
      const payload = {
        Header: "0xAA",
        DI: selectedService?.pcb_serial_number || "2411GM-0102",
        MD: parseInt(modeCode) || 3,
        FS: parseInt(displayData.fanSpeed) || 0,
        SRT: parseInt(displayData.temperature) || 25,
        HVAC: displayData.powerStatus === "on" ? "1" : "0",
        Footer: "0xZX",
      };
      
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        stopProcessing();
        throw new Error("Failed to send command");
      }
      
      console.log("✅ Mode command sent:", modeName);
    } catch (error) {
      console.error("Error sending mode command:", error);
      stopProcessing();
    }
  };

  // Handle fan speed change - ALWAYS update display and send if power is on
  const handleFanSpeedChange = async (newPosition) => {
    if (processing.status || !sensorData.isOnline) return;
    
    const newSpeed = FAN_SPEEDS[newPosition];
    
    // Always update display immediately for UI feedback
    setDisplayData((prev) => ({ ...prev, fanSpeed: newSpeed }));
    
    // Only send command to device if power is ON
    if (displayData.powerStatus === "on") {
      await sendFanCommand(newSpeed);
    } else {
      // If power is OFF, just update the local state
      // The value will be used when power turns ON
      console.log(`Fan speed set to ${newSpeed} (will apply when power turns on)`);
    }
  };

  // Send fan command
  const sendFanCommand = async (fanSpeed) => {
    try {
      startProcessingCycle();
      
      const payload = {
        Header: "0xAA",
        DI: selectedService?.pcb_serial_number || "2411GM-0102",
        MD: parseInt(displayData.mode) || 3,
        FS: parseInt(fanSpeed) || 0,
        SRT: parseInt(displayData.temperature) || 25,
        HVAC: displayData.powerStatus === "on" ? "1" : "0",
        Footer: "0xZX",
      };
      
      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        stopProcessing();
        throw new Error("Failed to send command");
      }
      
      console.log("✅ Fan command sent:", fanSpeed);
    } catch (error) {
      console.error("Error sending fan command:", error);
      stopProcessing();
    }
  };

  // Handle fan click on slider
  const handleFanClick = (e) => {
    if (processing.status || !sensorData.isOnline) return;
    const containerWidth = e.currentTarget.offsetWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const segmentWidth = containerWidth / 3;
    const newPosition = Math.min(2, Math.floor(clickPosition / segmentWidth));
    handleFanSpeedChange(newPosition);
  };

  // ✅ FIX 3: Start progressive message cycle
  const startProcessingCycle = () => {
    processingMsgIndexRef.current = 0;
    processingStartTimeRef.current = Date.now();
    setProcessing({ status: true, message: PROCESSING_MESSAGES[0] });

    processingTimerRef.current = setInterval(() => {
      processingMsgIndexRef.current += 1;
      const nextMsg = PROCESSING_MESSAGES[processingMsgIndexRef.current];
      if (nextMsg) {
        setProcessing({ status: true, message: nextMsg });
      }
    }, 10000);

    hardStopTimerRef.current = setTimeout(() => {
      stopProcessing();
    }, 25000);
  };

  const stopProcessing = () => {
    if (processingTimerRef.current) {
      clearInterval(processingTimerRef.current);
      processingTimerRef.current = null;
    }
    if (hardStopTimerRef.current) {
      clearTimeout(hardStopTimerRef.current);
      hardStopTimerRef.current = null;
    }
    setProcessing({ status: false, message: "" });
  };

  // Called when polling detects hvac_busy flipped to 0
  const clearProcessingIfDone = () => {
    if (processingTimerRef.current || hardStopTimerRef.current) {
      const elapsed = Date.now() - (processingStartTimeRef.current || 0);
      if (elapsed >= MIN_PROCESSING_TIME) {
        stopProcessing();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearInterval(processingTimerRef.current);
      if (hardStopTimerRef.current) clearTimeout(hardStopTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch(
          `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
        );
        if (!response.ok) throw new Error("Failed to fetch service items");

        const data = await response.json();
        setServiceItems(data.data || []);

        if (data.data?.length > 0 && !selectedService) {
          const first = data.data[0];
          setSelectedService(first);
          activePCBRef.current = first.pcb_serial_number;
        }

        setLoading(false);
        setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
        setManualRefresh(false);
      } catch (error) {
        console.error("Error fetching service items:", error);
        setLoading(false);
        setPullToRefresh((prev) => ({ ...prev, isRefreshing: false }));
        setManualRefresh(false);
      }
    };

    fetchServiceItems();
  }, [manualRefresh]);

  const fetchData = async () => {
    const pcbSerialNumber = activePCBRef.current;
    if (!pcbSerialNumber) return;

    try {
      const response = await fetch(
        `${baseURL}/get-latest-data/${pcbSerialNumber}/?user_id=${userId}&company_id=${company_id}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (data.status !== "success" || !data.data) return;

      if (activePCBRef.current !== pcbSerialNumber) return;

      const deviceData = data.data;
      const isOnline = deviceData.is_online;

      setSensorData({
        outsideTemp: isOnline ? deviceData.outdoor_temperature?.value : null,
        humidity: isOnline ? deviceData.room_humidity?.value : null,
        roomTemp: isOnline ? deviceData.room_temperature?.value : null,
        fanSpeed: isOnline ? deviceData.fan_speed?.value : "0",
        temperature: isOnline ? deviceData.set_temperature?.value : 25,
        powerStatus: isOnline && deviceData.hvac_on?.value == "1" ? "on" : "off",
        mode: deviceData.mode?.value,
        errorFlag: isOnline ? deviceData.error_flag?.value : "0",
        hvacBusy: isOnline ? deviceData.hvac_busy?.value : "0",
        deviceId: pcbSerialNumber,
        alarmOccurred: deviceData.alarm_occurred?.value,
        isOnline: isOnline,
      });

      const alarmValue = deviceData.alarm_occurred?.value;
      setErrorCount(alarmValue && alarmValue !== "0" ? Number(alarmValue) : 0);

      if (deviceData.hvac_busy?.value == "0") {
        clearProcessingIfDone();
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const fetchAllAlarms = async () => {
    try {
      const response = await fetch(
        `${baseURL}/get-latest-data/?user_id=${userId}&company_id=${company_id}`
      );

      if (!response.ok) throw new Error("Failed to fetch all alarms");

      const data = await response.json();

      if (data.status !== "success" || !data.data) return;

      const alarmCount = data.data.reduce((count, item) => {
        const val = item.alarm_occurred?.value;
        if (val && val !== "0") {
          return count + Number(val);
        }
        return count;
      }, 0);

      setDropdownAlarmCount(alarmCount);
    } catch (err) {
      console.error("Dropdown alarm fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllAlarms();

    fetchIntervalRef.current = setInterval(() => {
      fetchData();
      fetchAllAlarms();
    }, 1000);

    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
        fetchIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedService?.pcb_serial_number) {
      console.log("🔄 Switching active PCB to:", selectedService.pcb_serial_number);
      activePCBRef.current = selectedService.pcb_serial_number;
    }
  }, [selectedService?.pcb_serial_number]);

  const sendRefreshToController = async () => {
    if (!selectedService?.pcb_serial_number) {
      setRefreshStatus({ sending: false, success: false, message: "No device selected" });
      return { success: false };
    }
    try {
      const result = await sendRefreshCommand(selectedService.pcb_serial_number, sensorData);
      if (result.success) {
        setRefreshStatus({ sending: false, success: true, message: "Refresh sent successfully" });
        setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 3000);
        return result;
      }
      const msg = result?.error || result?.message || "Failed to send refresh command";
      setRefreshStatus({ sending: false, success: false, message: msg });
      setTimeout(() => setRefreshStatus({ sending: false, success: false, message: "" }), 2000);
      return result;
    } catch (error) {
      setRefreshStatus({ sending: false, success: false, message: error.message || "Unexpected error" });
      return { success: false };
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (containerRef.current && containerRef.current.scrollTop > 0) return;
    const pullDistance = e.touches[0].clientY - touchStartY.current;
    if (pullDistance > 0) {
      e.preventDefault();
      setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
    }
  };

  const handleTouchEnd = async () => {
    if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
      setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
      await sendRefreshToController();
      setManualRefresh(true);
    } else {
      setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
    }
  };

  const handleMouseDown = (e) => {
    touchStartY.current = e.clientY;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current && containerRef.current.scrollTop > 0) return;
    const pullDistance = e.clientY - touchStartY.current;
    if (pullDistance > 0) {
      e.preventDefault();
      setPullToRefresh({ isPulling: true, pullDistance: Math.min(pullDistance, MAX_PULL), isRefreshing: false });
    }
  };

  const handleMouseUp = async () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (pullToRefresh.pullDistance >= PULL_THRESHOLD && !pullToRefresh.isRefreshing) {
      setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: true });
      await sendRefreshToController();
      setManualRefresh(true);
    } else {
      setPullToRefresh({ isPulling: false, pullDistance: 0, isRefreshing: false });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePowerToggle = async () => {
    try {
      if (processing.status || sensorData.hvacBusy == "1") {
        const msg = sensorData.hvacBusy == "1" ? "System is busy, please wait..." : "Please wait...";
        setProcessing({ status: true, message: msg });
        return;
      }

      startProcessingCycle();

      const newHvacValue = sensorData.powerStatus == "on" ? "0" : "1";
      const isShutdown = sensorData?.fanSpeed == 3 || sensorData?.mode == 0;

      const payload = {
        Header: "0xAA",
        DI: selectedService?.pcb_serial_number || "2411GM-0102",
        MD: isShutdown ? "3" : sensorData.mode,
        FS: isShutdown ? "0" : sensorData.fanSpeed,
        SRT: sensorData.temperature,
        HVAC: newHvacValue,
        Footer: "0xZX",
      };

      const response = await fetch("https://mdata.air2o.net/controllers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("❌ API error:", response.status);
        stopProcessing();
        throw new Error("Failed to send command");
      }

      const result = await response.text();
      console.log("✅ Command sent:", result);
    } catch (error) {
      console.error("🔥 Power toggle error:", error.message);
      stopProcessing();
    }
  };

  const handleNavigation = (path) => {
    if (!processing.status) navigate(path);
  };

  // Updated handleServiceSelect with confirmation
  const handleServiceSelect = (item) => {
    // Don't allow switching to the same service
    if (selectedService?.service_item_id === item.service_item_id) {
      setShowServiceDropdown(false);
      return;
    }
    
    // Show confirmation dialog before switching
    setPendingService(item);
    setShowConfirmDialog(true);
    setShowServiceDropdown(false);
  };

  // Confirm service switch
  const confirmServiceSwitch = () => {
    if (!pendingService) return;
    
    setShowConfirmDialog(false);
    setSwitchingService(true);
    setLoadingMessage(`Switching to ${pendingService.service_item_name}...`);
    
    // Update the service after a short delay for UX
    setTimeout(() => {
      setSelectedService(pendingService);
      activePCBRef.current = pendingService.pcb_serial_number;
      
      // Show success notification
      setSwitchNotification({ 
        show: true, 
        message: `Successfully switched to ${pendingService.service_item_name}` 
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setSwitchNotification({ show: false, message: "" });
      }, 3000);
      
      // Clear loading state
      setTimeout(() => {
        setSwitchingService(false);
        setLoadingMessage("");
      }, 1500);
    }, 500);
  };

  // Cancel service switch
  const cancelServiceSwitch = () => {
    setShowConfirmDialog(false);
    setPendingService(null);
  };

  const hasValidPCBSerial = selectedService && selectedService.pcb_serial_number;
  const getModeDescription = (code) => MODE_MAP[code] || "Fan";

  const pullProgress = Math.min(pullToRefresh.pullDistance / PULL_THRESHOLD, 1);
  const indicatorRotation = pullProgress * 360;
  const indicatorOpacity = pullProgress;

  if (loading && !manualRefresh) return <Loading onLogout={handleLogout} />;

  if (!loading && serviceItems.length === 0 && !manualRefresh) {
    return <NoServiceItems onLogout={handleLogout} onNavigateHome={() => navigate("/home")} />;
  }

  return (
    <div
      className="mainmain-container"
      style={{ backgroundImage: "linear-gradient(to bottom, #3E99ED, #2B7ED6)", touchAction: "pan-y" }}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="screen1-pull-refresh"
        style={{
          height: `${pullToRefresh.pullDistance}px`,
          opacity: pullToRefresh.isPulling || pullToRefresh.isRefreshing ? 1 : 0,
          transform: `translateY(${pullToRefresh.isPulling ? 0 : -30}px)`,
          transition: pullToRefresh.isPulling ? "none" : "all 0.3s ease",
        }}
      >
        <div className="screen1-refresh-content">
          {!pullToRefresh.isRefreshing && (
            <>
              <FiRefreshCw
                size={24}
                style={{
                  transform: `rotate(${indicatorRotation}deg)`,
                  transition: "transform 0.2s ease",
                  opacity: indicatorOpacity,
                }}
              />
              <span>
                {pullToRefresh.pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="main-container">
        {/* Refresh status toast */}
        {refreshStatus.message && (
          <div className={`screen1-refresh-status ${refreshStatus.success ? "success" : "error"}`}>
            {refreshStatus.message}
          </div>
        )}

        {/* Success Notification Toast */}
        {switchNotification.show && (
          <div className="switch-notification">
            <span>✅</span>
            <span>{switchNotification.message}</span>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
              <div className="confirm-dialog-content">
                <h3>Switch Service?</h3>
                <p>Are you sure you want to switch to <strong>{pendingService?.service_item_name}</strong>?</p>
                <div className="confirm-dialog-buttons">
                  <button 
                    className="confirm-dialog-btn confirm-btn-yes"
                    onClick={confirmServiceSwitch}
                  >
                    Yes, Switch
                  </button>
                  <button 
                    className="confirm-dialog-btn confirm-btn-no"
                    onClick={cancelServiceSwitch}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay for Service Switching */}
        {switchingService && (
          <div className="service-switching-overlay">
            <div className="service-switching-content">
              <div className="switching-spinner"></div>
              <p>{loadingMessage}</p>
              <div className="switching-progress-bar">
                <div className="switching-progress-fill"></div>
              </div>
            </div>
          </div>
        )}

        {/* Header: Service Dropdown + Power Button Row */}
        <div className="header-controls-row">
          {/* Service Dropdown */}
          <div className="service-dropdown-wrapper">
            <div className="service-dropdown-container">
              <div
                className="service-dropdown-header"
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                style={{ position: "relative" }}
              >
                <span>
                  {selectedService ? selectedService.service_item_name : "Select Service"}
                </span>

                {/* 🔴 GLOBAL ALARM BADGE */}
                {dropdownAlarmCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "28px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {dropdownAlarmCount}
                  </span>
                )}

                <FiChevronDown size={18} />
              </div>
              {showServiceDropdown && (
                <div className="service-dropdown-list">
                  {serviceItems.map((item) => (
                    <div
                      key={item.service_item_id}
                      className="service-dropdown-item"
                      onClick={() => handleServiceSelect(item)}
                    >
                      {item.service_item_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Power Button */}
          <div style={{ position: "relative" }}>
            <button
              className={`screen1-power-button ${processing.status ? "processing" : ""}`}
              onClick={handlePowerToggle}
              disabled={processing.status || !sensorData.isOnline}
              style={{
                backgroundColor: !sensorData.isOnline
                  ? "#808080"
                  : sensorData.powerStatus == "on"
                  ? "#5adb5eff"
                  : "#c80000f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                height: "48px",
                width: "48px",
                borderRadius: "20px",
                padding: "8px",
                cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
                fontWeight: "bold",
                opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
              }}
            >
              <FiPower size={24} color="#fff" />
              {processing.status && <span className="screen1-processing-indicator"></span>}
            </button>
            {sensorData.errorFlag == "1" && <div className="error-indicator" />}
          </div>
        </div>

        {/* Logo below the row */}
        <div className="logo-container">
          <img src={AIROlogo} alt="AIRO Logo" className="logo-image" />
        </div>

        {/* ✅ UPDATED: Temperature Dial with full functionality */}
        <div style={{ 
          pointerEvents: sensorData.isOnline && !processing.status ? "auto" : "none", 
          opacity: sensorData.isOnline ? 1 : 0.35 
        }}>
          <TemperatureDial
            onTempChange={handleTempChange}
            onTempChangeEnd={handleTempChangeEnd}
            fanSpeed={fanPosition}
            initialTemperature={displayData.temperature ?? 25}
            disabled={processing.status || !sensorData.isOnline}
          />
        </div>

        {/* ✅ FIX 2: Offline banner positioned BETWEEN header and temperature dial */}
        {!sensorData.isOnline && (
          <div
            style={{
              color: "rgba(0,0,0,0.55)",
              backgroundColor: "#fff",
              textAlign: "center",
              padding: "10px 20px",
              borderRadius: "10px",
              margin: "12px 20px 4px 20px",
              fontSize: "14px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span>📴</span>
            <span>System is Offline</span>
          </div>
        )}

        {/* Status messages */}
        {processing.status && (
          <div className="screen1-processing-message">{processing.message}</div>
        )}

        {sensorData.errorFlag == "1" && (
          <div className="screen1-error-message">⚠️ System Error Detected</div>
        )}

        {sensorData.hvacBusy == "1" && !processing.status && (
          <div className="screen1-busy-message">⏳ System is currently busy</div>
        )}

        {/* Environment Info */}
        <div className="env-info">
          <div className="env-item">
            <FiSun className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {sensorData.isOnline ? `${formatTemp(sensorData.outsideTemp)}°C` : "—"}
            </div>
            <div className="env-label">Outside Temp</div>
          </div>
          <div className="env-item">
            <FiThermometer className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {sensorData.isOnline ? `${formatTemp(sensorData.roomTemp)}°C` : "—"}
            </div>
            <div className="env-label">Room Temp</div>
          </div>
          <div className="env-item">
            <FiDroplet className="env-icon" size={20} color="#FFFFFF" />
            <div className="env-value">
              {sensorData.isOnline ? `${formatTemp(sensorData.humidity)}%` : "—"}
            </div>
            <div className="env-label">Humidity</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-container">
        {/* ==================== MODES SECTION ==================== */}
        <div className="modes-section-in-footer">
          <h3 className="modes-heading">Modes</h3>
          <div className="modes-row">
            {Object.values(MODE_MAP).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`modes-button ${
                  currentModeDescription === mode ? "modes-button-selected" : ""
                }`}
                disabled={processing.status || !sensorData.isOnline}
                style={{
                  opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
                  cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
                }}
              >
                <span
                  className={`modes-text ${
                    currentModeDescription === mode ? "modes-text-selected" : ""
                  }`}
                >
                  {mode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== FAN SPEED SECTION (BUTTONS STYLE) ==================== */}
        <div className="fan-speed-section-in-footer">
          <h3 className="fan-speed-heading">Fan Speed</h3>
          <div className="fan-speed-buttons-row">
            {FAN_LABELS.map((label, index) => (
              <button
                key={label}
                onClick={() => handleFanSpeedChange(index)}
                className={`fan-speed-button ${
                  fanPosition === index ? "fan-speed-button-selected" : ""
                }`}
                disabled={processing.status || !sensorData.isOnline}
                style={{
                  opacity: processing.status || !sensorData.isOnline ? 0.6 : 1,
                  cursor: processing.status || !sensorData.isOnline ? "not-allowed" : "pointer",
                }}
              >
                <span
                  className={`fan-speed-text ${
                    fanPosition === index ? "fan-speed-text-selected" : ""
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          <button
            className={`control-btn ${!hasValidPCBSerial ? "screen1-disabled-btn" : ""}`}
            disabled={!hasValidPCBSerial}
            title={!hasValidPCBSerial ? "Modes unavailable - No PCB serial number assigned to this machine" : ""}
          >
            <FiWind size={20} />
            <span>Modes</span>
            <span><strong>{getModeDescription(sensorData.mode)}</strong></span>
          </button>

          <button
            className="control-btn"
            onClick={() =>
              navigate("/alarms", {
                state: {
                  alarmData: {
                    alarmOccurred: sensorData.alarmOccurred,
                    errorCount: errorCount,
                    deviceId: sensorData.deviceId,
                  },
                  userId: userId,
                  company_id: company_id,
                },
              })
            }
          >
            <div style={{ position: "relative" }}>
              <FiClock size={20} />
              {errorCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-23px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {errorCount}
                </span>
              )}
            </div>
            <span>Alarms</span>
          </button>

          <button className="control-btn" onClick={() => handleNavigation("/timers")}>
            <FiWatch size={20} />
            <span>Timers</span>
          </button>

          <button className="control-btn" onClick={() => handleNavigation("/settings")}>
            <FiSettings size={20} />
            <span>Settings</span>
          </button>

          <button className="control-btn" onClick={() => handleNavigation("/machine")}>
            <FiZap size={20} />
            <span>Services</span>
          </button>

          <button className="control-btn" onClick={handleLogout}>
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        <div className="footer-logo">
          <img src={greenAire} alt="GreenAire Logo" className="logo-image" style={{ marginTop: "-12px" }} />
        </div>
      </div>
    </div>
  );
};

export default Screen1;