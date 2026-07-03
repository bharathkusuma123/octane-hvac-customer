// import React, { useEffect, useState, useRef } from "react";

// const MIN_TEMP = 18;
// const MAX_TEMP = 30;
// const START_ANGLE = -100;
// const DEGREE_RANGE = 102;
// const SIZE = 285;
// const ARC_RADIUS = 100;

// const TemperatureDial = ({ onTempChange, fanSpeed, onTempChangeEnd, initialTemperature }) => {
//   const [angle, setAngle] = useState(START_ANGLE);
//   const [temperature, setTemperature] = useState(initialTemperature || MIN_TEMP);
//   const dialRef = useRef(null);

//   useEffect(() => {
//     if (initialTemperature !== undefined) {
//       const tempValue =
//         typeof initialTemperature === "string"
//           ? parseFloat(initialTemperature)
//           : initialTemperature;

//       const roundedTemp = Math.round(tempValue);
//       setTemperature(roundedTemp);
//       setAngle(temperatureToAngle(roundedTemp));
//     }
//   }, [initialTemperature]);

//   const angleToTemperature = (ang) => {
//     const relative = Math.min(Math.max(ang - START_ANGLE, 0), DEGREE_RANGE);
//     return (relative / DEGREE_RANGE) * (MAX_TEMP - MIN_TEMP) + MIN_TEMP;
//   };

//   const temperatureToAngle = (temp) => {
//     const t = typeof temp === "string" ? parseFloat(temp) : temp;
//     const clamped = Math.min(Math.max(t, MIN_TEMP), MAX_TEMP);
//     return ((clamped - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * DEGREE_RANGE + START_ANGLE;
//   };

//   // 🔧 Updated: round to integer temperature
//   const handleDrag = (event) => {
//     event.preventDefault();

//     const rect = dialRef.current.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     const clientX = event.touches ? event.touches[0].clientX : event.clientX;
//     const clientY = event.touches ? event.touches[0].clientY : event.clientY;

//     const dx = clientX - centerX;
//     const dy = clientY - centerY;

//     let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
//     const clamped = Math.min(Math.max(deg, START_ANGLE), START_ANGLE + DEGREE_RANGE);

//     setAngle(clamped);
//     const temp = angleToTemperature(clamped);
//     const roundedTemp = Math.round(temp); // ✅ only whole numbers now
//     setTemperature(roundedTemp);
//     onTempChange?.(roundedTemp);
//   };

//   useEffect(() => {
//     const handle = dialRef.current?.querySelector(".temp-control-handle");

//     const start = () => {
//       window.addEventListener("mousemove", handleDrag);
//       window.addEventListener("mouseup", end);
//       window.addEventListener("touchmove", handleDrag, { passive: false });
//       window.addEventListener("touchend", end);
//     };

//     const end = () => {
//       window.removeEventListener("mousemove", handleDrag);
//       window.removeEventListener("mouseup", end);
//       window.removeEventListener("touchmove", handleDrag);
//       window.removeEventListener("touchend", end);
//     };

//     handle?.addEventListener("mousedown", start);
//     handle?.addEventListener("touchstart", start, { passive: false });

//     return () => {
//       handle?.removeEventListener("mousedown", start);
//       handle?.removeEventListener("touchstart", start);
//       end();
//     };
//   }, []);

//   const getFanSpeedDescription = (speed) => {
//     switch (speed) {
//       case 0:
//       case "0":
//         return "High";
//       case 1:
//       case "1":
//         return "Medium";
//       case 2:
//       case "2":
//         return "Low";
//       default:
//         return "High";
//     }
//   };

//   return (
//     <div
//       className="temp-container "
//       ref={dialRef}
//       style={{ position: "relative", width: SIZE, height: SIZE }}
//     >
//       <div
//         className="temp-circle-control"
//         style={{ position: "relative", width: "100%", height: "100%" }}
//       >
//         <svg
//           className="temp-curve-arc"
//           width={SIZE}
//           height={SIZE}
//           viewBox={`0 0 ${SIZE} ${SIZE}`}
//           style={{ position: "absolute", inset: 0 }}
//         >
//           <path
//             d="M 142.5 32 A 110 110 0 0 1 252 142.5"
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.7"
//             strokeWidth="8"
//             strokeLinecap="round"
//           />
//         </svg>

//         <div
//           className="temp-inner-circle"
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 180,
//             height: 180,
//             borderRadius: "50%",
//             background: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1,
//           }}
//         >
//           {/* 🔧 Changed: display without decimal */}
//           <div className="temp-display">
//   <div className="temp-temperature">{Math.round(temperature)}°C</div>
//   {/* <button className="apply-temp-btn" onClick={() => onTempChangeEnd(temperature)}>
//     ➡️
//   </button> */}
// </div>

//           <div className="temp-fan-container">
//             <div className="temp-fan-icon-container">
//               <div className="temp-fan-bar1" />
//               <div className="temp-fan-bar2" />
//               <div className="temp-fan-bar3" />
//               <div className="temp-fan-bar3" />

//             </div>
//             <span className="temp-fan-speed">{getFanSpeedDescription(fanSpeed)}</span>
//           </div>
//           <div className="temp-fan-label">Fan Speed</div>
//         </div>

//         <div
//           className="temp-control-handle"
//           style={{
//             position: "absolute",
//             left: "43%",
//             top: "47%",
//             width: 24,
//             height: 24,
//             borderRadius: "50%",
//             backgroundColor: "white",
//             border: "2px solid #2b7ed6",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
//             transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translate(0, -${ARC_RADIUS}px)`,
//             touchAction: "none",
//             cursor: "pointer",
//           }}
//           title="Drag to set temperature"
//         />

//         {[...Array(48)].map((_, i) => (
//           <div
//             key={i}
//             className="temp-tick"
//             style={{
//               position: "absolute",
//               left: "50%",
//               top: "50%",
//               width: 2,
//               height: 8,
//               background: "rgba(255,255,255,0.3)",
//               borderRadius: 2,
//               transform: `translate(-50%, -50%) rotate(${i * 7.5}deg) translate(0, -135px)`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemperatureDial;


//======================================================
// Below code changed as per the figma of the Octane Team 

// import React, { useEffect, useState, useRef } from "react";

// const MIN_TEMP = 18;
// const MAX_TEMP = 30;
// const START_ANGLE = -100;
// const DEGREE_RANGE = 102;
// const SIZE = 285;
// const ARC_RADIUS = 100;

// const TemperatureDial = ({ onTempChange, fanSpeed, onTempChangeEnd, initialTemperature }) => {
//   const [angle, setAngle] = useState(START_ANGLE);
//   const [temperature, setTemperature] = useState(initialTemperature || MIN_TEMP);
//   const dialRef = useRef(null);

//   useEffect(() => {
//     if (initialTemperature !== undefined) {
//       const tempValue =
//         typeof initialTemperature === "string"
//           ? parseFloat(initialTemperature)
//           : initialTemperature;

//       const roundedTemp = Math.round(tempValue);
//       setTemperature(roundedTemp);
//       setAngle(temperatureToAngle(roundedTemp));
//     }
//   }, [initialTemperature]);

//   const angleToTemperature = (ang) => {
//     const relative = Math.min(Math.max(ang - START_ANGLE, 0), DEGREE_RANGE);
//     return (relative / DEGREE_RANGE) * (MAX_TEMP - MIN_TEMP) + MIN_TEMP;
//   };

//   const temperatureToAngle = (temp) => {
//     const t = typeof temp === "string" ? parseFloat(temp) : temp;
//     const clamped = Math.min(Math.max(t, MIN_TEMP), MAX_TEMP);
//     return ((clamped - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * DEGREE_RANGE + START_ANGLE;
//   };

//   // 🔧 Updated: round to integer temperature
//   const handleDrag = (event) => {
//     event.preventDefault();

//     const rect = dialRef.current.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     const clientX = event.touches ? event.touches[0].clientX : event.clientX;
//     const clientY = event.touches ? event.touches[0].clientY : event.clientY;

//     const dx = clientX - centerX;
//     const dy = clientY - centerY;

//     let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
//     const clamped = Math.min(Math.max(deg, START_ANGLE), START_ANGLE + DEGREE_RANGE);

//     setAngle(clamped);
//     const temp = angleToTemperature(clamped);
//     const roundedTemp = Math.round(temp); // ✅ only whole numbers now
//     setTemperature(roundedTemp);
//     onTempChange?.(roundedTemp);
//   };

//   useEffect(() => {
//     const handle = dialRef.current?.querySelector(".temp-control-handle");

//     const start = () => {
//       window.addEventListener("mousemove", handleDrag);
//       window.addEventListener("mouseup", end);
//       window.addEventListener("touchmove", handleDrag, { passive: false });
//       window.addEventListener("touchend", end);
//     };

//     const end = () => {
//       window.removeEventListener("mousemove", handleDrag);
//       window.removeEventListener("mouseup", end);
//       window.removeEventListener("touchmove", handleDrag);
//       window.removeEventListener("touchend", end);
//     };

//     handle?.addEventListener("mousedown", start);
//     handle?.addEventListener("touchstart", start, { passive: false });

//     return () => {
//       handle?.removeEventListener("mousedown", start);
//       handle?.removeEventListener("touchstart", start);
//       end();
//     };
//   }, []);

//   const getFanSpeedDescription = (speed) => {
//     switch (speed) {
//       case 0:
//       case "0":
//         return "High";
//       case 1:
//       case "1":
//         return "Medium";
//       case 2:
//       case "2":
//         return "Low";
//       default:
//         return "High";
//     }
//   };

//   return (
//     <div
//       className="temp-container "
//       ref={dialRef}
//       style={{ position: "relative", width: SIZE, height: SIZE }}
//     >
//       <div
//         className="temp-circle-control"
//         style={{ position: "relative", width: "100%", height: "100%" }}
//       >
//         <svg
//           className="temp-curve-arc"
//           width={SIZE}
//           height={SIZE}
//           viewBox={`0 0 ${SIZE} ${SIZE}`}
//           style={{ position: "absolute", inset: 0 }}
//         >
//           {/* ONLY ADDED THIS CIRCLE - BACKGROUND FULL CIRCLE */}
//           <circle
//             cx={SIZE / 2}
//             cy={SIZE / 2}
//             r={110}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.4"
//             strokeWidth="10"
//           />
//           {/* EXISTING ARC - KEPT EXACTLY THE SAME */}
//           <path
//             d="M 142.5 32 A 110 110 0 0 1 252 142.5"
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="1"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />
//         </svg>

//         <div
//           className="temp-inner-circle"
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 180,
//             height: 180,
//             borderRadius: "50%",
//             background: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1,
//           }}
//         >
//           {/* 🔧 Changed: display without decimal */}
//           <div className="temp-display">
//   <div className="temp-temperature">{Math.round(temperature)}°C</div>
//   {/* <button className="apply-temp-btn" onClick={() => onTempChangeEnd(temperature)}>
//     ➡️
//   </button> */}
// </div>

//           <div className="temp-fan-container">
//             <div className="temp-fan-icon-container">
//               <div className="temp-fan-bar1" />
//               <div className="temp-fan-bar2" />
//               <div className="temp-fan-bar3" />
//               <div className="temp-fan-bar3" />

//             </div>
//             <span className="temp-fan-speed">{getFanSpeedDescription(fanSpeed)}</span>
//           </div>
//           <div className="temp-fan-label">Fan Speed</div>
//         </div>

//         <div
//           className="temp-control-handle"
//           style={{
//             position: "absolute",
//             left: "43%",
//             top: "47%",
//             width: 24,
//             height: 24,
//             borderRadius: "50%",
//             backgroundColor: "white",
//             border: "2px solid #2b7ed6",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
//             transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translate(0, -${ARC_RADIUS}px)`,
//             touchAction: "none",
//             cursor: "pointer",
//           }}
//           title="Drag to set temperature"
//         />

//         {[...Array(48)].map((_, i) => (
//           <div
//             key={i}
//             className="temp-tick"
//             style={{
//               position: "absolute",
//               left: "50%",
//               top: "50%",
//               width: 4,
//               height: 12,
//               background: "rgba(255, 255, 255, 0.47)",
//               borderRadius: 2,
//               transform: `translate(-50%, -50%) rotate(${i * 7.5}deg) translate(0, -135px)`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemperatureDial;

//  =============================================================
// Below code is after implementing the temperature for whole circle 


// import React, { useEffect, useState, useRef } from "react";

// const MIN_TEMP = 0;
// const MAX_TEMP = 30;
// const START_ANGLE = -90;  // Changed: 0°C at left side
// const DEGREE_RANGE = 360; // Changed: Full circle
// const SIZE = 280;
// const ARC_RADIUS = 100;

// // Temperature to angle mapping
// const temperatureToAngle = (temp) => {
//   const t = typeof temp === "string" ? parseFloat(temp) : temp;
//   const clamped = Math.min(Math.max(t, MIN_TEMP), MAX_TEMP);
  
//   if (clamped <= 18) {
//     // 0°C to 18°C maps from -90° to 0° (90 degrees)
//     const range = 18 - MIN_TEMP;
//     const angleRange = 90;
//     const progress = (clamped - MIN_TEMP) / range;
//     return START_ANGLE + (progress * angleRange);
//   } else {
//     // 18°C to 30°C maps from 0° to 270° (270 degrees)
//     const range = MAX_TEMP - 18;
//     const angleRange = 270;
//     const progress = (clamped - 18) / range;
//     return 0 + (progress * angleRange);
//   }
// };

// // Angle to temperature mapping
// const angleToTemperature = (ang) => {
//   let adjustedAngle = ang;
//   if (adjustedAngle < START_ANGLE) adjustedAngle += 360;
//   if (adjustedAngle > START_ANGLE + DEGREE_RANGE) adjustedAngle -= 360;
//   adjustedAngle = Math.min(Math.max(adjustedAngle, START_ANGLE), START_ANGLE + DEGREE_RANGE);
  
//   if (adjustedAngle <= 0) {
//     const angleRange = 90;
//     const progress = (adjustedAngle - START_ANGLE) / angleRange;
//     return MIN_TEMP + (progress * (18 - MIN_TEMP));
//   } else {
//     const angleRange = 270;
//     const progress = (adjustedAngle - 0) / angleRange;
//     return 18 + (progress * (MAX_TEMP - 18));
//   }
// };

// const TemperatureDial = ({ onTempChange, fanSpeed, onTempChangeEnd, initialTemperature }) => {
//   const [angle, setAngle] = useState(START_ANGLE);
//   const [temperature, setTemperature] = useState(initialTemperature || MIN_TEMP);
//   const dialRef = useRef(null);

//   useEffect(() => {
//     if (initialTemperature !== undefined) {
//       const tempValue =
//         typeof initialTemperature === "string"
//           ? parseFloat(initialTemperature)
//           : initialTemperature;

//       const roundedTemp = Math.round(tempValue);
//       setTemperature(roundedTemp);
//       setAngle(temperatureToAngle(roundedTemp));
//     }
//   }, [initialTemperature]);

//   const handleDrag = (event) => {
//     event.preventDefault();

//     const rect = dialRef.current.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     const clientX = event.touches ? event.touches[0].clientX : event.clientX;
//     const clientY = event.touches ? event.touches[0].clientY : event.clientY;

//     const dx = clientX - centerX;
//     const dy = clientY - centerY;

//     let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    
//     // Adjust to our coordinate system
//     if (deg < 0) deg += 360;
//     let mappedDeg = deg;
//     if (mappedDeg > 270) {
//       mappedDeg = mappedDeg - 360;
//     }
    
//     const clamped = Math.min(Math.max(mappedDeg, START_ANGLE), START_ANGLE + DEGREE_RANGE);

//     setAngle(clamped);
//     const temp = angleToTemperature(clamped);
//     const roundedTemp = Math.round(temp);
//     setTemperature(roundedTemp);
//     onTempChange?.(roundedTemp);
//   };

//   // Keep latest temperature available without forcing effect re-runs
// const temperatureRef = useRef(temperature);
// useEffect(() => {
//   temperatureRef.current = temperature;
// }, [temperature]);

// // Keep latest onTempChangeEnd available without forcing effect re-runs
// const onTempChangeEndRef = useRef(onTempChangeEnd);
// useEffect(() => {
//   onTempChangeEndRef.current = onTempChangeEnd;
// }, [onTempChangeEnd]);

// useEffect(() => {
//   const handle = dialRef.current?.querySelector(".temp-control-handle");
//   let isDragging = false;

//   const start = (e) => {
//     isDragging = true;
//     window.addEventListener("mousemove", handleDrag);
//     window.addEventListener("mouseup", end);
//     window.addEventListener("touchmove", handleDrag, { passive: false });
//     window.addEventListener("touchend", end);
//   };

//   const end = () => {
//     window.removeEventListener("mousemove", handleDrag);
//     window.removeEventListener("mouseup", end);
//     window.removeEventListener("touchmove", handleDrag);
//     window.removeEventListener("touchend", end);

//     // ✅ Only fire the callback if a real drag gesture happened
//     if (isDragging) {
//       isDragging = false;
//       onTempChangeEndRef.current?.(temperatureRef.current);
//     }
//   };

//   handle?.addEventListener("mousedown", start);
//   handle?.addEventListener("touchstart", start, { passive: false });

//   return () => {
//     handle?.removeEventListener("mousedown", start);
//     handle?.removeEventListener("touchstart", start);
//     // ⚠️ Cleanup: just remove any dangling window listeners, do NOT fire the callback
//     window.removeEventListener("mousemove", handleDrag);
//     window.removeEventListener("mouseup", end);
//     window.removeEventListener("touchmove", handleDrag);
//     window.removeEventListener("touchend", end);
//   };
// }, []); // ✅ empty deps — attach once, never re-run

//   const getFanSpeedDescription = (speed) => {
//     switch (speed) {
//       case 0:
//       case "0":
//         return "High";
//       case 1:
//       case "1":
//         return "Medium";
//       case 2:
//       case "2":
//         return "Low";
//       default:
//         return "High";
//     }
//   };

//   const getArcPath = () => {
//     const radius = 110;
//     const center = SIZE / 2;
    
//     const startRad = (START_ANGLE * Math.PI) / 180;
//     const currentRad = (angle * Math.PI) / 180;
    
//     const startX = center + radius * Math.cos(startRad);
//     const startY = center + radius * Math.sin(startRad);
//     const currentX = center + radius * Math.cos(currentRad);
//     const currentY = center + radius * Math.sin(currentRad);
    
//     const largeArcFlag = Math.abs(angle - START_ANGLE) > 180 ? 1 : 0;
    
//     return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${currentX} ${currentY}`;
//   };

//   return (
//     <div
//       className="temp-container "
//       ref={dialRef}
//       style={{ position: "relative", width: SIZE, height: SIZE }}
//     >
//       <div
//         className="temp-circle-control"
//         style={{ position: "relative", width: "100%", height: "100%" }}
//       >
//         <svg
//           className="temp-curve-arc"
//           width={SIZE}
//           height={SIZE}
//           viewBox={`0 0 ${SIZE} ${SIZE}`}
//           style={{ position: "absolute", inset: 0 }}
//         >
//           {/* ONLY ADDED THIS CIRCLE - BACKGROUND FULL CIRCLE */}
//           <circle
//             cx={SIZE / 2}
//             cy={SIZE / 2}
//             r={110}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.4"
//             strokeWidth="10"
//           />
//           {/* EXISTING ARC - KEPT EXACTLY THE SAME */}
//           <path
//             d={getArcPath()}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="1"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />
//         </svg>

//         <div
//           className="temp-inner-circle"
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 175,
//             height: 175,
//             borderRadius: "50%",
//             background: "#fff",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1,
//           }}
//         >
//           <div className="temp-display">
//             <div className="temp-temperature">{Math.round(temperature)}°C</div>
//           </div>

//           <div className="temp-fan-container">
//             <div className="temp-fan-icon-container">
//               <div className="temp-fan-bar1" />
//               <div className="temp-fan-bar2" />
//               <div className="temp-fan-bar3" />
//               <div className="temp-fan-bar3" />
//             </div>
//             <span className="temp-fan-speed">{getFanSpeedDescription(fanSpeed)}</span>
//           </div>
//           <div className="temp-fan-label">Fan Speed</div>
//         </div>

//         <div
//           className="temp-control-handle"
//           style={{
//             position: "absolute",
//             left: "43%",
//             top: "47%",
//             width: 24,
//             height: 24,
//             borderRadius: "50%",
//             backgroundColor: "white",
//             border: "2px solid #2b7ed6",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
//             transform: `translate(-50%, -50%) rotate(${angle + 90}deg) translate(0, -${ARC_RADIUS}px)`,
//             touchAction: "none",
//             cursor: "pointer",
//           }}
//           title="Drag to set temperature"
//         />

//         {[...Array(48)].map((_, i) => (
//           <div
//             key={i}
//             className="temp-tick"
//             style={{
//               position: "absolute",
//               left: "50%",
//               top: "50%",
//               width: 4,
//               height: 12,
//               background: "rgba(255, 255, 255, 0.47)",
//               borderRadius: 2,
//               transform: `translate(-50%, -50%) rotate(${i * 7.5}deg) translate(0, -135px)`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemperatureDial;




// import React, { useEffect, useState, useRef } from "react";

// const MIN_TEMP = 0;
// const MAX_TEMP = 30;
// const START_ANGLE = -90;
// const DEGREE_RANGE = 360;
// const SIZE = 280;
// const CENTER = SIZE / 2;  // 140
// const ARC_RADIUS = 110;
// const HANDLE_RADIUS = 12;

// // ─── Pure math helpers ────────────────────────────────────────────────────────

// const temperatureToAngle = (temp) => {
//   const t = typeof temp === "string" ? parseFloat(temp) : temp;
//   const clamped = Math.min(Math.max(isNaN(t) ? 0 : t, MIN_TEMP), MAX_TEMP);
//   if (clamped <= 18) {
//     const progress = (clamped - MIN_TEMP) / (18 - MIN_TEMP);
//     return START_ANGLE + progress * 90;   // -90° → 0°
//   } else {
//     const progress = (clamped - 18) / (MAX_TEMP - 18);
//     return progress * 270;               // 0° → 270°
//   }
// };

// const angleToTemperature = (ang) => {
//   let a = ang;
//   if (a < START_ANGLE) a += 360;
//   if (a > START_ANGLE + DEGREE_RANGE) a -= 360;
//   a = Math.min(Math.max(a, START_ANGLE), START_ANGLE + DEGREE_RANGE);
//   if (a <= 0) {
//     const progress = (a - START_ANGLE) / 90;
//     return MIN_TEMP + progress * (18 - MIN_TEMP);
//   } else {
//     const progress = a / 270;
//     return 18 + progress * (MAX_TEMP - 18);
//   }
// };

// const arcPoint = (angleDeg) => {
//   const rad = (angleDeg * Math.PI) / 180;
//   return {
//     x: CENTER + ARC_RADIUS * Math.cos(rad),
//     y: CENTER + ARC_RADIUS * Math.sin(rad),
//   };
// };

// const buildArcPath = (currentAngle) => {
//   const start = arcPoint(START_ANGLE);
//   const end   = arcPoint(currentAngle);
//   let delta = currentAngle - START_ANGLE;
//   if (delta < 0) delta += 360;
//   const largeArc = delta > 180 ? 1 : 0;
//   return `M ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
// };

// const getFanLabel = (s) => {
//   if (s === 0 || s === "0") return "High";
//   if (s === 1 || s === "1") return "Medium";
//   if (s === 2 || s === "2") return "Low";
//   return "High";
// };

// // ─── Component ────────────────────────────────────────────────────────────────

// const TemperatureDial = ({
//   onTempChange,
//   fanSpeed,
//   onTempChangeEnd,
//   initialTemperature,
//   disabled,
// }) => {
//   const [angle,       setAngle]       = useState(() => temperatureToAngle(initialTemperature ?? MIN_TEMP));
//   const [temperature, setTemperature] = useState(() => Math.round(initialTemperature ?? MIN_TEMP));

//   const containerRef  = useRef(null); // outer div — used for getBoundingClientRect
//   const isDraggingRef = useRef(false);

//   // Live refs — written every render, read inside event handlers (no stale closures)
//   const angleRef          = useRef(angle);
//   const tempRef           = useRef(temperature);
//   const disabledRef       = useRef(disabled);
//   const onTempChangeRef    = useRef(onTempChange);
//   const onTempChangeEndRef = useRef(onTempChangeEnd);

//   angleRef.current          = angle;
//   tempRef.current           = temperature;
//   disabledRef.current       = disabled;
//   onTempChangeRef.current    = onTempChange;
//   onTempChangeEndRef.current = onTempChangeEnd;

//   // ── Sync initialTemperature from parent (API poll etc.) ──────────────────
//   useEffect(() => {
//     if (initialTemperature == null) return;
//     const t = typeof initialTemperature === "string"
//       ? parseFloat(initialTemperature)
//       : initialTemperature;
//     if (isNaN(t)) return;
//     if (isDraggingRef.current) return; // don't override active drag
//     const rounded = Math.round(t);
//     setTemperature(rounded);
//     setAngle(temperatureToAngle(rounded));
//   }, [initialTemperature]);

//   // ── Single drag useEffect — attached once, reads live values via refs ─────
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // Convert a screen pointer position → SVG angle (degrees)
//     // Uses the container's bounding rect so CSS margins/transforms cancel out
//     const pointerToAngle = (clientX, clientY) => {
//       const rect = container.getBoundingClientRect();
//       const cx   = rect.left + rect.width  / 2;
//       const cy   = rect.top  + rect.height / 2;
//       const dx   = clientX - cx;
//       const dy   = clientY - cy;

//       let deg = (Math.atan2(dy, dx) * 180) / Math.PI; // [-180, 180]
//       if (deg < 0) deg += 360;                          // [0, 360)
//       if (deg > 270) deg -= 360;                        // remap dead-zone → [-90, 0)
//       return Math.min(Math.max(deg, START_ANGLE), START_ANGLE + DEGREE_RANGE);
//     };

//     // Check if a screen pointer is "on" the handle (within hit radius)
//     const isOnHandle = (clientX, clientY) => {
//       const rect   = container.getBoundingClientRect();
//       const scaleX = rect.width  / SIZE;   // CSS may scale the element
//       const scaleY = rect.height / SIZE;

//       const cx = rect.left + rect.width  / 2;
//       const cy = rect.top  + rect.height / 2;

//       // Handle centre in screen pixels
//       const currentAngle = angleRef.current;
//       const pt = arcPoint(currentAngle);
//       const hx = cx + (pt.x - CENTER) * scaleX;
//       const hy = cy + (pt.y - CENTER) * scaleY;

//       const hitRadius = (HANDLE_RADIUS + 10) * Math.max(scaleX, scaleY); // generous hit area
//       const dist = Math.hypot(clientX - hx, clientY - hy);
//       return dist <= hitRadius;
//     };

//     const onMove = (e) => {
//       if (!isDraggingRef.current) return;
//       e.preventDefault();
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;

//       const a       = pointerToAngle(clientX, clientY);
//       const temp    = angleToTemperature(a);
//       const rounded = Math.round(temp);

//       setAngle(a);
//       setTemperature(rounded);
//       onTempChangeRef.current?.(rounded);
//     };

//     const onUp = () => {
//       if (!isDraggingRef.current) return;
//       isDraggingRef.current = false;
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup",   onUp);
//       window.removeEventListener("touchmove", onMove);
//       window.removeEventListener("touchend",  onUp);
//       onTempChangeEndRef.current?.(tempRef.current);
//     };

//     const onDown = (e) => {
//       if (disabledRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       if (!isOnHandle(clientX, clientY)) return; // only start drag on handle
//       e.preventDefault();
//       isDraggingRef.current = true;
//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup",   onUp);
//       window.addEventListener("touchmove", onMove, { passive: false });
//       window.addEventListener("touchend",  onUp);
//     };

//     // Attach to the outer container div — much easier to hit than an SVG circle
//     container.addEventListener("mousedown",  onDown);
//     container.addEventListener("touchstart", onDown, { passive: false });

//     return () => {
//       container.removeEventListener("mousedown",  onDown);
//       container.removeEventListener("touchstart", onDown);
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup",   onUp);
//       window.removeEventListener("touchmove", onMove);
//       window.removeEventListener("touchend",  onUp);
//     };
//   }, []); // empty deps — defined once, refs keep everything fresh

//   // ── Render values ─────────────────────────────────────────────────────────
//   const handlePt = arcPoint(angle);
//   const arcPath  = buildArcPath(angle);

//   return (
//     <div
//       ref={containerRef}
//       className="temp-container"
//       style={{
//         position: "relative",
//         width: SIZE,
//         height: SIZE,
//         touchAction: "none",
//         userSelect: "none",
//       }}
//     >
//       <div
//         className="temp-circle-control"
//         style={{ position: "relative", width: "100%", height: "100%" }}
//       >
//         {/* ── SVG: background ring + progress arc + handle dot ── */}
//         <svg
//           width={SIZE}
//           height={SIZE}
//           viewBox={`0 0 ${SIZE} ${SIZE}`}
//           style={{ position: "absolute", inset: 0, overflow: "visible" }}
//         >
//           {/* Faint background ring */}
//           <circle
//             cx={CENTER} cy={CENTER} r={ARC_RADIUS}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.4"
//             strokeWidth="10"
//           />

//           {/* Progress arc */}
//           <path
//             d={arcPath}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="1"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />

//           {/*
//             Handle circle — sits exactly on the arc endpoint.
//             Uses pointer-events="none" because we handle touches on the
//             outer container div with an isOnHandle() proximity check.
//             This avoids SVG pointer-event quirks across browsers.
//           */}
//           <circle
//             cx={handlePt.x}
//             cy={handlePt.y}
//             r={HANDLE_RADIUS}
//             fill="white"
//             stroke="#2b7ed6"
//             strokeWidth="2.5"
//             pointerEvents="none"
//             style={{
//               filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
//             }}
//           />
//         </svg>

//         {/* ── Inner display circle ── */}
//         <div
//           className="temp-inner-circle"
//           style={{
//             position: "absolute",
//             left: "50%", top: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 175, height: 175,
//             borderRadius: "50%",
//             background: "#fff",
//             display: "flex", flexDirection: "column",
//             alignItems: "center", justifyContent: "center",
//             zIndex: 1,
//             pointerEvents: "none",
//           }}
//         >
//           <div className="temp-display">
//             <div className="temp-temperature">{temperature}°C</div>
//           </div>
//           <div className="temp-fan-container">
//             <div className="temp-fan-icon-container">
//               <div className="temp-fan-bar1" />
//               <div className="temp-fan-bar2" />
//               <div className="temp-fan-bar3" />
//               <div className="temp-fan-bar3" />
//             </div>
//             <span className="temp-fan-speed">{getFanLabel(fanSpeed)}</span>
//           </div>
//           <div className="temp-fan-label">Fan Speed</div>
//         </div>

//         {/* ── Tick marks ── */}
//         {Array.from({ length: 48 }, (_, i) => (
//           <div
//             key={i}
//             className="temp-tick"
//             style={{
//               position: "absolute",
//               left: "50%", top: "50%",
//               width: 4, height: 12,
//               background: "rgba(255,255,255,0.47)",
//               borderRadius: 2,
//               pointerEvents: "none",
//               transform: `translate(-50%,-50%) rotate(${i * 7.5}deg) translate(0,-135px)`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemperatureDial;


//  =============================================================


//  code changed as per the figma of the Octane Team  and also implemented the temperature from 18 to 30 in whole circle 
// import React, { useEffect, useState, useRef } from "react";

// // 👇 Keep MIN_TEMP as 0 for the background arc
// const MIN_TEMP = 0;
// const MAX_TEMP = 30;
// const START_ANGLE = -90;  // Keep -90 for 0°C position
// const DEGREE_RANGE = 360;
// const SIZE = 280;
// const CENTER = SIZE / 2;
// const ARC_RADIUS = 110;
// const HANDLE_RADIUS = 12;

// // ─── Pure math helpers ────────────────────────────────────────────────────────

// // 👇 This now handles 0°C to 30°C (for the background arc)
// const temperatureToAngle = (temp) => {
//   const t = typeof temp === "string" ? parseFloat(temp) : temp;
//   const clamped = Math.min(Math.max(isNaN(t) ? 0 : t, MIN_TEMP), MAX_TEMP);
//   if (clamped <= 18) {
//     const progress = (clamped - MIN_TEMP) / (18 - MIN_TEMP);
//     return START_ANGLE + progress * 90;   // -90° → 0°
//   } else {
//     const progress = (clamped - 18) / (MAX_TEMP - 18);
//     return 0 + progress * 270;            // 0° → 270°
//   }
// };

// // 👇 This still handles 18°C to 30°C for the draggable part
// const temperatureToAngleDraggable = (temp) => {
//   const t = typeof temp === "string" ? parseFloat(temp) : temp;
//   const clamped = Math.min(Math.max(isNaN(t) ? 18 : t, 18), MAX_TEMP);
//   const progress = (clamped - 18) / (MAX_TEMP - 18);
//   return 0 + progress * 270;  // 0° to 270° (18°C to 30°C)
// };

// const angleToTemperature = (ang) => {
//   let a = ang;
//   if (a < START_ANGLE) a += 360;
//   if (a > START_ANGLE + DEGREE_RANGE) a -= 360;
//   a = Math.min(Math.max(a, START_ANGLE), START_ANGLE + DEGREE_RANGE);
//   if (a <= 0) {
//     const progress = (a - START_ANGLE) / 90;
//     return MIN_TEMP + progress * (18 - MIN_TEMP);
//   } else {
//     const progress = a / 270;
//     return 18 + progress * (MAX_TEMP - 18);
//   }
// };

// const arcPoint = (angleDeg) => {
//   const rad = (angleDeg * Math.PI) / 180;
//   return {
//     x: CENTER + ARC_RADIUS * Math.cos(rad),
//     y: CENTER + ARC_RADIUS * Math.sin(rad),
//   };
// };

// // 👇 Build arc from START_ANGLE to currentAngle
// const buildArcPath = (startAngle, currentAngle) => {
//   const start = arcPoint(startAngle);
//   const end = arcPoint(currentAngle);
//   let delta = currentAngle - startAngle;
//   if (delta < 0) delta += 360;
//   const largeArc = delta > 180 ? 1 : 0;
//   return `M ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
// };

// const getFanLabel = (s) => {
//   if (s === 0 || s === "0") return "High";
//   if (s === 1 || s === "1") return "Medium";
//   if (s === 2 || s === "2") return "Low";
//   return "High";
// };

// // ─── Component ────────────────────────────────────────────────────────────────

// const TemperatureDial = ({
//   onTempChange,
//   fanSpeed,
//   onTempChangeEnd,
//   initialTemperature,
//   disabled,
// }) => {
//   // 👇 Start at 18°C
//   const [angle, setAngle] = useState(() => temperatureToAngleDraggable(initialTemperature ?? 18));
//   const [temperature, setTemperature] = useState(() => Math.round(initialTemperature ?? 18));

//   const containerRef = useRef(null);
//   const isDraggingRef = useRef(false);

//   const angleRef = useRef(angle);
//   const tempRef = useRef(temperature);
//   const disabledRef = useRef(disabled);
//   const onTempChangeRef = useRef(onTempChange);
//   const onTempChangeEndRef = useRef(onTempChangeEnd);

//   angleRef.current = angle;
//   tempRef.current = temperature;
//   disabledRef.current = disabled;
//   onTempChangeRef.current = onTempChange;
//   onTempChangeEndRef.current = onTempChangeEnd;

//   useEffect(() => {
//     if (initialTemperature == null) return;
//     const t = typeof initialTemperature === "string"
//       ? parseFloat(initialTemperature)
//       : initialTemperature;
//     if (isNaN(t)) return;
//     if (isDraggingRef.current) return;
//     const clamped = Math.min(Math.max(t, 18), MAX_TEMP);
//     const rounded = Math.round(clamped);
//     setTemperature(rounded);
//     setAngle(temperatureToAngleDraggable(rounded));
//   }, [initialTemperature]);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const pointerToAngle = (clientX, clientY) => {
//       const rect = container.getBoundingClientRect();
//       const cx = rect.left + rect.width / 2;
//       const cy = rect.top + rect.height / 2;
//       const dx = clientX - cx;
//       const dy = clientY - cy;

//       let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
//       if (deg < 0) deg += 360;
//       if (deg > 270) deg -= 360;
//       // 👇 Only allow 0° to 270° (18°C to 30°C)
//       return Math.min(Math.max(deg, 0), 270);
//     };

//     const isOnHandle = (clientX, clientY) => {
//       const rect = container.getBoundingClientRect();
//       const scaleX = rect.width / SIZE;
//       const scaleY = rect.height / SIZE;

//       const cx = rect.left + rect.width / 2;
//       const cy = rect.top + rect.height / 2;

//       const currentAngle = angleRef.current;
//       const pt = arcPoint(currentAngle);
//       const hx = cx + (pt.x - CENTER) * scaleX;
//       const hy = cy + (pt.y - CENTER) * scaleY;

//       const hitRadius = (HANDLE_RADIUS + 10) * Math.max(scaleX, scaleY);
//       const dist = Math.hypot(clientX - hx, clientY - hy);
//       return dist <= hitRadius;
//     };

//     const onMove = (e) => {
//       if (!isDraggingRef.current) return;
//       e.preventDefault();
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;

//       const a = pointerToAngle(clientX, clientY);
//       const temp = angleToTemperature(a);
//       const rounded = Math.round(temp);

//       setAngle(a);
//       setTemperature(rounded);
//       onTempChangeRef.current?.(rounded);
//     };

//     const onUp = () => {
//       if (!isDraggingRef.current) return;
//       isDraggingRef.current = false;
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//       window.removeEventListener("touchmove", onMove);
//       window.removeEventListener("touchend", onUp);
//       onTempChangeEndRef.current?.(tempRef.current);
//     };

//     const onDown = (e) => {
//       if (disabledRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       if (!isOnHandle(clientX, clientY)) return;
//       e.preventDefault();
//       isDraggingRef.current = true;
//       window.addEventListener("mousemove", onMove);
//       window.addEventListener("mouseup", onUp);
//       window.addEventListener("touchmove", onMove, { passive: false });
//       window.addEventListener("touchend", onUp);
//     };

//     container.addEventListener("mousedown", onDown);
//     container.addEventListener("touchstart", onDown, { passive: false });

//     return () => {
//       container.removeEventListener("mousedown", onDown);
//       container.removeEventListener("touchstart", onDown);
//       window.removeEventListener("mousemove", onMove);
//       window.removeEventListener("mouseup", onUp);
//       window.removeEventListener("touchmove", onMove);
//       window.removeEventListener("touchend", onUp);
//     };
//   }, []);

//   // 👇 Calculate BOTH arcs
//   const handlePt = arcPoint(angle);
  
//   // Arc 1: 0°C to 18°C (from -90° to 0°) - ALWAYS VISIBLE
//   const arcPath0to18 = buildArcPath(-90, 0);
  
//   // Arc 2: 18°C to current temperature (from 0° to current angle) - DRAGGABLE
//   const arcPath18toCurrent = buildArcPath(0, angle);

//   return (
//     <div
//       ref={containerRef}
//       className="temp-container"
//       style={{
//         position: "relative",
//         width: SIZE,
//         height: SIZE,
//         touchAction: "none",
//         userSelect: "none",
//       }}
//     >
//       <div
//         className="temp-circle-control"
//         style={{ position: "relative", width: "100%", height: "100%" }}
//       >
//         <svg
//           width={SIZE}
//           height={SIZE}
//           viewBox={`0 0 ${SIZE} ${SIZE}`}
//           style={{ position: "absolute", inset: 0, overflow: "visible" }}
//         >
//           {/* Background ring */}
//           <circle
//             cx={CENTER} cy={CENTER} r={ARC_RADIUS}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.4"
//             strokeWidth="10"
//           />

//           {/* 👇 NEW: Arc from 0°C to 18°C - Always visible (dimmer) */}
//           <path
//             d={arcPath0to18}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="1"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />

//           {/* 👇 Arc from 18°C to current temperature (bright, draggable) */}
//           <path
//             d={arcPath18toCurrent}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="1"
//             strokeWidth="10"
//             strokeLinecap="round"
//           />

//           {/* Handle circle */}
//           <circle
//             cx={handlePt.x}
//             cy={handlePt.y}
//             r={HANDLE_RADIUS}
//             fill="white"
//             stroke="#2b7ed6"
//             strokeWidth="2.5"
//             pointerEvents="none"
//             style={{
//               filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
//             }}
//           />
//         </svg>

//         <div
//           className="temp-inner-circle"
//           style={{
//             position: "absolute",
//             left: "50%", top: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 175, height: 175,
//             borderRadius: "50%",
//             background: "#fff",
//             display: "flex", flexDirection: "column",
//             alignItems: "center", justifyContent: "center",
//             zIndex: 1,
//             pointerEvents: "none",
//           }}
//         >
//           <div className="temp-display">
//             <div className="temp-temperature">{temperature}°C</div>
//           </div>
//           <div className="temp-fan-container">
//             <div className="temp-fan-icon-container">
//               <div className="temp-fan-bar1" />
//               <div className="temp-fan-bar2" />
//               <div className="temp-fan-bar3" />
//               <div className="temp-fan-bar3" />
//             </div>
//             <span className="temp-fan-speed">{getFanLabel(fanSpeed)}</span>
//           </div>
//           <div className="temp-fan-label">Fan Speed</div>
//         </div>

//         {Array.from({ length: 48 }, (_, i) => (
//           <div
//             key={i}
//             className="temp-tick"
//             style={{
//               position: "absolute",
//               left: "50%", top: "50%",
//               width: 4, height: 12,
//               background: "rgba(255,255,255,0.47)",
//               borderRadius: 2,
//               pointerEvents: "none",
//               transform: `translate(-50%,-50%) rotate(${i * 7.5}deg) translate(0,-135px)`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TemperatureDial;



// TemperatureDial.js - Updated version

import React, { useEffect, useState, useRef, memo } from "react";

const MIN_TEMP = 0;
const MAX_TEMP = 30;
const START_ANGLE = -90;
const DEGREE_RANGE = 360;
const SIZE = 280;
const CENTER = SIZE / 2;
const ARC_RADIUS = 110;
const HANDLE_RADIUS = 12;

const temperatureToAngleDraggable = (temp) => {
  const t = typeof temp === "string" ? parseFloat(temp) : temp;
  const clamped = Math.min(Math.max(isNaN(t) ? 18 : t, 18), MAX_TEMP);
  const progress = (clamped - 18) / (MAX_TEMP - 18);
  return 0 + progress * 270;
};

const angleToTemperature = (ang) => {
  let a = ang;
  if (a < START_ANGLE) a += 360;
  if (a > START_ANGLE + DEGREE_RANGE) a -= 360;
  a = Math.min(Math.max(a, START_ANGLE), START_ANGLE + DEGREE_RANGE);
  if (a <= 0) {
    const progress = (a - START_ANGLE) / 90;
    return MIN_TEMP + progress * (18 - MIN_TEMP);
  } else {
    const progress = a / 270;
    return 18 + progress * (MAX_TEMP - 18);
  }
};

const arcPoint = (angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + ARC_RADIUS * Math.cos(rad),
    y: CENTER + ARC_RADIUS * Math.sin(rad),
  };
};

const buildArcPath = (startAngle, currentAngle) => {
  const start = arcPoint(startAngle);
  const end = arcPoint(currentAngle);
  let delta = currentAngle - startAngle;
  if (delta < 0) delta += 360;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const getFanLabel = (s) => {
  if (s === 0 || s === "0") return "High";
  if (s === 1 || s === "1") return "Medium";
  if (s === 2 || s === "2") return "Low";
  return "High";
};

// Memoize the component to prevent unnecessary re-renders
const TemperatureDial = memo(({
  onTempChange,
  fanSpeed,
  onTempChangeEnd,
  initialTemperature,
  disabled,
}) => {
  // Local state for the dial - this won't trigger parent re-renders
  const [angle, setAngle] = useState(() => temperatureToAngleDraggable(initialTemperature ?? 18));
  const [temperature, setTemperature] = useState(() => Math.round(initialTemperature ?? 18));
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const angleRef = useRef(angle);
  const tempRef = useRef(temperature);
  const disabledRef = useRef(disabled);
  const onTempChangeRef = useRef(onTempChange);
  const onTempChangeEndRef = useRef(onTempChangeEnd);

  angleRef.current = angle;
  tempRef.current = temperature;
  disabledRef.current = disabled;
  onTempChangeRef.current = onTempChange;
  onTempChangeEndRef.current = onTempChangeEnd;

  // Only update when initialTemperature changes AND not dragging
  useEffect(() => {
    if (initialTemperature == null) return;
    if (isDraggingRef.current) return; // Don't update while dragging
    
    const t = typeof initialTemperature === "string"
      ? parseFloat(initialTemperature)
      : initialTemperature;
    if (isNaN(t)) return;
    
    const clamped = Math.min(Math.max(t, 18), MAX_TEMP);
    const rounded = Math.round(clamped);
    setTemperature(rounded);
    setAngle(temperatureToAngleDraggable(rounded));
  }, [initialTemperature]);

  // Handle pointer events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pointerToAngle = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (deg < 0) deg += 360;
      if (deg > 270) deg -= 360;
      return Math.min(Math.max(deg, 0), 270);
    };

    const isOnHandle = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const scaleX = rect.width / SIZE;
      const scaleY = rect.height / SIZE;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const currentAngle = angleRef.current;
      const pt = arcPoint(currentAngle);
      const hx = cx + (pt.x - CENTER) * scaleX;
      const hy = cy + (pt.y - CENTER) * scaleY;

      const hitRadius = (HANDLE_RADIUS + 10) * Math.max(scaleX, scaleY);
      const dist = Math.hypot(clientX - hx, clientY - hy);
      return dist <= hitRadius;
    };

    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const a = pointerToAngle(clientX, clientY);
      const temp = angleToTemperature(a);
      const rounded = Math.round(temp);

      // Update local state only - no parent re-render
      setAngle(a);
      setTemperature(rounded);
      
      // Call parent callback but don't trigger re-render through state
      // We're using a ref to call it, so it won't cause re-render cycles
      if (onTempChangeRef.current) {
        onTempChangeRef.current(rounded);
      }
    };

    const onUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      
      // Only call onTempChangeEnd when dragging actually happened
      if (onTempChangeEndRef.current) {
        onTempChangeEndRef.current(tempRef.current);
      }
    };

    const onDown = (e) => {
      if (disabledRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      if (!isOnHandle(clientX, clientY)) return;
      
      e.preventDefault();
      e.stopPropagation();
      isDraggingRef.current = true;
      setIsDragging(true);
      
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onUp);
    };

    container.addEventListener("mousedown", onDown);
    container.addEventListener("touchstart", onDown, { passive: false });

    return () => {
      container.removeEventListener("mousedown", onDown);
      container.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const handlePt = arcPoint(angle);
  const arcPath0to18 = buildArcPath(-90, 0);
  const arcPath18toCurrent = buildArcPath(0, angle);

  return (
    <div
      ref={containerRef}
      className="temp-container"
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        touchAction: "none",
        userSelect: "none",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <div
        className="temp-circle-control"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          <circle
            cx={CENTER} cy={CENTER} r={ARC_RADIUS}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="10"
          />

          <path
            d={arcPath0to18}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="1"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            d={arcPath18toCurrent}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="1"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <circle
            cx={handlePt.x}
            cy={handlePt.y}
            r={HANDLE_RADIUS}
            fill="white"
            stroke="#2b7ed6"
            strokeWidth="2.5"
            pointerEvents="none"
            style={{
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
              cursor: disabled ? "not-allowed" : "grab",
            }}
          />
        </svg>

        <div
          className="temp-inner-circle"
          style={{
            position: "absolute",
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 175, height: 175,
            borderRadius: "50%",
            background: "#fff",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <div className="temp-display">
            <div className="temp-temperature">{temperature}°C</div>
          </div>
          <div className="temp-fan-container">
            <div className="temp-fan-icon-container">
              <div className="temp-fan-bar1" />
              <div className="temp-fan-bar2" />
              <div className="temp-fan-bar3" />
              <div className="temp-fan-bar3" />
            </div>
            <span className="temp-fan-speed">{getFanLabel(fanSpeed)}</span>
          </div>
          <div className="temp-fan-label">Fan Speed</div>
        </div>

        {Array.from({ length: 48 }, (_, i) => (
          <div
            key={i}
            className="temp-tick"
            style={{
              position: "absolute",
              left: "50%", top: "50%",
              width: 4, height: 12,
              background: "rgba(255,255,255,0.47)",
              borderRadius: 2,
              pointerEvents: "none",
              transform: `translate(-50%,-50%) rotate(${i * 7.5}deg) translate(0,-135px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

TemperatureDial.displayName = 'TemperatureDial';

export default TemperatureDial;