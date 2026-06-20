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
//       className="temp-container del-temp-container"
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

//             {/* ONLY ADDED THIS CIRCLE - BACKGROUND FULL CIRCLE */}
//           <circle
//             cx={SIZE / 2}
//             cy={SIZE / 2}
//             r={110}
//             fill="none"
//             stroke="#ffffff"
//             strokeOpacity="0.4"
//             strokeWidth="10"
//           />
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
//                width: 4,
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


import React, { useEffect, useState, useRef } from "react";

const MIN_TEMP = 0;  // Changed from 18 to 0
const MAX_TEMP = 30;
const START_ANGLE = -100;
const DEGREE_RANGE = 102;
const SIZE = 285;
const ARC_RADIUS = 100;

const TemperatureDial = ({ onTempChange, fanSpeed, onTempChangeEnd, initialTemperature }) => {
  const [angle, setAngle] = useState(START_ANGLE);
  const [temperature, setTemperature] = useState(initialTemperature || MIN_TEMP);
  const dialRef = useRef(null);

  useEffect(() => {
    if (initialTemperature !== undefined) {
      const tempValue =
        typeof initialTemperature === "string"
          ? parseFloat(initialTemperature)
          : initialTemperature;

      const roundedTemp = Math.round(tempValue);
      setTemperature(roundedTemp);
      setAngle(temperatureToAngle(roundedTemp));
    }
  }, [initialTemperature]);

  // UPDATED: Angle to temperature mapping with 0-30°C range
  // 0°C at START_ANGLE (-100°)
  // 18°C at START_ANGLE + (DEGREE_RANGE * 0.25) = -100 + 25.5 = -74.5°
  // 30°C at START_ANGLE + DEGREE_RANGE = 2°
  const angleToTemperature = (ang) => {
    const relative = Math.min(Math.max(ang - START_ANGLE, 0), DEGREE_RANGE);
    
    // First 25% of the arc (0 to 25.5 degrees) maps to 0-18°C
    if (relative <= DEGREE_RANGE * 0.25) {
      const progress = relative / (DEGREE_RANGE * 0.25);
      return MIN_TEMP + (progress * (18 - MIN_TEMP));
    } 
    // Remaining 75% of the arc maps to 18-30°C
    else {
      const progress = (relative - (DEGREE_RANGE * 0.25)) / (DEGREE_RANGE * 0.75);
      return 18 + (progress * (MAX_TEMP - 18));
    }
  };

  // UPDATED: Temperature to angle mapping with 0-30°C range
  const temperatureToAngle = (temp) => {
    const t = typeof temp === "string" ? parseFloat(temp) : temp;
    const clamped = Math.min(Math.max(t, MIN_TEMP), MAX_TEMP);
    
    if (clamped <= 18) {
      // 0°C to 18°C maps to first 1/4 of the arc
      const range = 18 - MIN_TEMP; // 18 degrees
      const angleRange = DEGREE_RANGE * 0.25; // 25.5 degrees
      const progress = (clamped - MIN_TEMP) / range;
      return START_ANGLE + (progress * angleRange);
    } else {
      // 18°C to 30°C maps to remaining 3/4 of the arc
      const range = MAX_TEMP - 18; // 12 degrees
      const angleRange = DEGREE_RANGE * 0.75; // 76.5 degrees
      const progress = (clamped - 18) / range;
      return START_ANGLE + (DEGREE_RANGE * 0.25) + (progress * angleRange);
    }
  };

  // 🔧 Updated: round to integer temperature
  const handleDrag = (event) => {
    event.preventDefault();

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    const clamped = Math.min(Math.max(deg, START_ANGLE), START_ANGLE + DEGREE_RANGE);

    setAngle(clamped);
    const temp = angleToTemperature(clamped);
    const roundedTemp = Math.round(temp); // ✅ only whole numbers now
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
      className="temp-container del-temp-container"
      ref={dialRef}
      style={{ position: "relative", width: SIZE, height: SIZE }}
    >
      <div
        className="temp-circle-control"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <svg
          className="temp-curve-arc"
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{ position: "absolute", inset: 0 }}
        >

            {/* ONLY ADDED THIS CIRCLE - BACKGROUND FULL CIRCLE */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={110}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="10"
          />
          <path
            d="M 142.5 32 A 110 110 0 0 1 252 142.5"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="1"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </svg>





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
          {/* 🔧 Changed: display without decimal */}
          <div className="temp-display">
  <div className="temp-temperature">{Math.round(temperature)}°C</div>
  {/* <button className="apply-temp-btn" onClick={() => onTempChangeEnd(temperature)}>
    ➡️
  </button> */}
</div>

          <div className="temp-fan-container">
            <div className="temp-fan-icon-container">
              <div className="temp-fan-bar1" />
              <div className="temp-fan-bar2" />
              <div className="temp-fan-bar3" />
              <div className="temp-fan-bar3" />
            </div>
            <span className="temp-fan-speed">{getFanSpeedDescription(fanSpeed)}</span>
          </div>
          <div className="temp-fan-label">Fan Speed</div>
        </div>

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

        {[...Array(48)].map((_, i) => (
          <div
            key={i}
            className="temp-tick"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
               width: 4,
              height: 12,
              background: "rgba(255, 255, 255, 0.47)",
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