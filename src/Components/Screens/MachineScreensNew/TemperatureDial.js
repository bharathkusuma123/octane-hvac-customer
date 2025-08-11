import React, { useEffect, useState, useRef } from "react";

const MIN_TEMP = 18;
const MAX_TEMP = 30;
const START_ANGLE = -135;
const DEGREE_RANGE = 180;

const TemperatureDial = ({ onTempChange, fanSpeed }) => {
  const [angle, setAngle] = useState(START_ANGLE);
  const [temperature, setTemperature] = useState(MIN_TEMP);
  const dialRef = useRef(null);

  // Convert angle to temperature
  const angleToTemperature = (angle) => {
    const relative = Math.min(Math.max(angle - START_ANGLE, 0), DEGREE_RANGE);
    return ((relative / DEGREE_RANGE) * (MAX_TEMP - MIN_TEMP)) + MIN_TEMP;
  };

  // Convert temp to angle
  const temperatureToAngle = (temp) => {
    const clamped = Math.min(Math.max(temp, MIN_TEMP), MAX_TEMP);
    return ((clamped - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * DEGREE_RANGE + START_ANGLE;
  };

  const handleDrag = (event) => {
    event.preventDefault();

    const dial = dialRef.current;
    const rect = dial.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const radians = Math.atan2(dy, dx);
    let deg = radians * (180 / Math.PI);
    deg = (deg + 360) % 360;

    if (deg >= 135 && deg <= 405) {
      const newAngle = deg - 270; // Translate from 135–405 to -135–45
      const finalAngle = Math.min(Math.max(newAngle, START_ANGLE), START_ANGLE + DEGREE_RANGE);

      setAngle(finalAngle);

      const temp = angleToTemperature(finalAngle);
      const roundedTemp = Math.round(temp * 10) / 10;
      setTemperature(roundedTemp);
      onTempChange?.(roundedTemp);
    }
  };

  useEffect(() => {
    const handle = dialRef.current?.querySelector(".temp-control-handle");

    const start = (e) => {
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
       case '0': return ' Low';
      case '1': return 'Medium';
      case '2': return 'High';
      default: return 'High';
    }
  };
  return (
    <div className="temp-container" ref={dialRef}>
      <div className="temp-circle-control">
        <div className="temp-inner-circle">
          <svg className="temp-curve-arc" width="285" height="285" viewBox="0 0 285 285">
            <path
              d="M 142.5 32 A 110 110 0 0 1 252 142.5"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.7"
              strokeWidth="6"
            />
          </svg>
          <div className="temp-temperature">{temperature.toFixed(1)}°C</div>
          <div className="temp-fan-container">
            <div className="temp-fan-icon-container">
              <div className="temp-fan-bar1" />
              <div className="temp-fan-bar2" />
              <div className="temp-fan-bar3" />
            </div>
               <span className="temp-fan-speed">{getFanSpeedDescription(fanSpeed)}</span>
          </div>
          <div className="temp-fan-label">Fan Speed</div>
        </div>

        <div
          className="temp-control-handle"
          style={{
            transform: `rotate(${angle}deg) translateX(135px) rotate(-${angle}deg)`,
          }}
        ></div>

        {[...Array(48)].map((_, i) => (
          <div
            key={i}
            className="temp-tick"
            style={{
              transform: `rotate(${i * 7.5}deg) translateY(-135px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TemperatureDial;
