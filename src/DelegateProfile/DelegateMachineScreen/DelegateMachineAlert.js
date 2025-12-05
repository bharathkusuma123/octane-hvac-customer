// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import baseURL from "../../Components/ApiUrl/Apiurl";
// import { AuthContext } from "../../Components/AuthContext/AuthContext";


// const errorCodeToProblemType = {
//   1: "Water Leakage",
//   2: "Power Fault",
//   3: "Fan Not Working / Malfunctioning",
//   4: "Fan Not Working / Malfunctioning",
//   5: "Pump Not Working / Faulty",
//   6: "Others",
//   7: "Pump Not Working / Faulty",
//   8: "Pump Not Working / Faulty",
//   9: "Sensor Fault / Error Indication",
//   10: "Sensor Fault / Error Indication",
//   11: "Sensor Fault / Error Indication",
//   12: "Sensor Fault / Error Indication",
//   13: "Sensor Fault / Error Indication",
//   14: "Sensor Fault / Error Indication",
//   15: "Sensor Fault / Error Indication",
//   16: "Sensor Fault / Error Indication / Water Leakage",
//   17: "HVAC malfunction",
//   18: "HVAC malfunction",
//   19: "Water Leakage",
//   20: "Power Fault",
// };

// const DelegateMachineAlert = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useContext(AuthContext);

//   const userId = location.state?.userId || user?.delegate_id;
//   console.log("DelegateMachineAlert User ID:", userId);
//   const company_id = location.state?.company_id || user?.company_id;

//   const pcbSerialNumber = location.state?.pcb_serial_number;
//   const alarmData = location.state?.alarmData;

//   const autoDescription = location.state?.autoDescription || "";
//   const autoErrorCode = location.state?.autoErrorCode || "";

//   const [form, setForm] = useState({
//     service_item: "",
//     problem_type: "",
//     request_details: autoDescription
//   });

//   const [serviceItems, setServiceItems] = useState([]);
//   const [customer, setCustomer] = useState("");
//   const [problemTypes, setProblemTypes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Load Problem Types
//   useEffect(() => {
//     const loadProblemTypes = async () => {
//       try {
//         const res = await fetch(`${baseURL}/problem-types/`);
//         const data = await res.json();
//         if (data.status === "success") {
//           setProblemTypes(data.data);
//         }
//       } catch (error) {
//         console.error("Problem type load error:", error);
//       }
//     };
//     loadProblemTypes();
//   }, []);

//   // Auto-select problem type from error code
//   useEffect(() => {
//     if (!autoErrorCode || problemTypes.length === 0) return;

//     const name = errorCodeToProblemType[autoErrorCode];
//     const match = problemTypes.find(
//       (pt) => pt.name.toLowerCase() === name?.toLowerCase()
//     );

//     if (match) {
//       setForm((prev) => ({ ...prev, problem_type: match.problem_type_id }));
//     }
//   }, [autoErrorCode, problemTypes]);

//   // Load Service Items
//   useEffect(() => {
//     const loadServiceItems = async () => {
//       try {
//         const res = await fetch(
//           `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
//         );
//         const data = await res.json();

//         if (data.status === "success") {
//           setServiceItems(data.data);

//           const match = data.data.find(
//             (item) => item.pcb_serial_number === pcbSerialNumber
//           );

//           if (match) {
//             setForm((prev) => ({
//               ...prev,
//               service_item: match.service_item_id
//             }));
//             setCustomer(match.customer);
//           }
//         }
//       } catch (error) {
//         console.error("Service item load error:", error);
//       }
//     };

//     loadServiceItems();
//   }, [pcbSerialNumber, userId, company_id]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   console.log("🚀 Submitting delegate machine alert request...");
//   console.log("➡ Form State:", form);
//   console.log("➡ User ID:", userId);
//   console.log("➡ Company ID:", company_id);
//   console.log("➡ Customer:", customer);
//   console.log("➡ PCB Serial Number:", pcbSerialNumber);

//   try {
//     const payload = {
//       service_item: form.service_item,
//       problem_type: form.problem_type,
//       request_details: form.request_details,
//       user_id: userId,
//       requested_by: userId,
//       company_id: company_id,
//       company: company_id,
//       source_type: "Machine Alert",
//       status: "Open",
//       customer: customer || userId,
//       created_by: userId,
//       updated_by: userId
//     };

//     console.log("📦 Payload being sent:", payload);
//     console.log("🌐 API URL:", `${baseURL}/service-pools/`);

//     const response = await fetch(`${baseURL}/service-pools/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     console.log("📥 Raw Fetch Response:", response);

//     let result = {};
//     try {
//       result = await response.json();
//       console.log("📄 Parsed JSON Response:", result);
//     } catch (jsonError) {
//       console.error("❌ Error parsing JSON:", jsonError);
//       throw new Error("Invalid JSON returned from server");
//     }

//     if (response.ok) {
//       console.log("✅ API Success! Navigating back to Delegate-Alarms...");
//       alert("Machine alert request submitted!");

//       navigate("/delegate-Alarms", {
//         state: {
//           deviceId: pcbSerialNumber,
//           alarmData,
//           userId,
//           company_id
//         }
//       });
//     } else {
//       console.error("❌ API Error Status:", response.status);
//       console.error("❌ API Error Body:", result);
//       throw new Error(result.message || "Failed to submit machine alert");
//     }

//   } catch (err) {
//     console.error("🔥 Submission Error:", err);
//     alert("Failed: " + err.message);
//   }

//   console.log("🔚 Submit request finished.");
//   setIsSubmitting(false);
// };


//   return (
//     <div className="container mt-4">
//       <h3>Delegate Machine Alert Request</h3>

//       <form onSubmit={handleSubmit} className="card p-3 mt-3">
        
//         <p><strong>PCB Serial Number:</strong> {pcbSerialNumber}</p>
//         <p><strong>Error Code:</strong> {autoErrorCode}</p>

//         {/* Problem Type */}
//         <label className="fw-bold mt-3">Problem Type *</label>
//         <select
//           name="problem_type"
//           className="form-control"
//           required
//           value={form.problem_type}
//           onChange={handleChange}
//         >
//           <option value="">Select Problem Type</option>
//           {problemTypes.map((pt) => (
//             <option key={pt.problem_type_id} value={pt.problem_type_id}>
//               {pt.name}
//             </option>
//           ))}
//         </select>

//         {/* Description */}
//         <label className="fw-bold mt-3">Problem Description *</label>
//         <textarea
//           name="request_details"
//           className="form-control"
//           rows="5"
//           required
//           value={form.request_details}
//           onChange={handleChange}
//         />

//         <button
//           type="submit"
//           className="btn btn-primary mt-4"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Machine Alert"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DelegateMachineAlert;




import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import baseURL from "../../Components/ApiUrl/Apiurl";
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateMachineAlert.css';
const errorCodeToProblemType = {
  1: "Water Leakage",
  2: "Power Fault",
  3: "Fan Not Working / Malfunctioning",
  4: "Fan Not Working / Malfunctioning",
  5: "Pump Not Working / Faulty",
  6: "Others",
  7: "Pump Not Working / Faulty",
  8: "Pump Not Working / Faulty",
  9: "Sensor Fault / Error Indication",
  10: "Sensor Fault / Error Indication",
  11: "Sensor Fault / Error Indication",
  12: "Sensor Fault / Error Indication",
  13: "Sensor Fault / Error Indication",
  14: "Sensor Fault / Error Indication",
  15: "Sensor Fault / Error Indication",
  16: "Sensor Fault / Error Indication / Water Leakage",
  17: "HVAC malfunction",
  18: "HVAC malfunction",
  19: "Water Leakage",
  20: "Power Fault",
};

const DelegateMachineAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const userId = location.state?.userId || user?.delegate_id;
  const company_id = location.state?.company_id || user?.company_id;
  const pcbSerialNumber = location.state?.pcb_serial_number;
  const alarmData = location.state?.alarmData;
  const autoDescription = location.state?.autoDescription || "";
  const autoErrorCode = location.state?.autoErrorCode || "";

  const [form, setForm] = useState({
    service_item: "",
    problem_type: "",
    request_details: autoDescription
  });

  const [serviceItems, setServiceItems] = useState([]);
  const [customer, setCustomer] = useState("");
  const [problemTypes, setProblemTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Problem Types
  useEffect(() => {
    const loadProblemTypes = async () => {
      try {
        const res = await fetch(`${baseURL}/problem-types/`);
        const data = await res.json();
        if (data.status === "success") {
          setProblemTypes(data.data);
        }
      } catch (error) {
        console.error("Problem type load error:", error);
      }
    };
    loadProblemTypes();
  }, []);

  // Auto-select problem type from error code
  useEffect(() => {
    if (!autoErrorCode || problemTypes.length === 0) return;

    const name = errorCodeToProblemType[autoErrorCode];
    const match = problemTypes.find(
      (pt) => pt.name.toLowerCase() === name?.toLowerCase()
    );

    if (match) {
      setForm((prev) => ({ ...prev, problem_type: match.problem_type_id }));
    }
  }, [autoErrorCode, problemTypes]);

  // Load Service Items
  useEffect(() => {
    const loadServiceItems = async () => {
      try {
        const res = await fetch(
          `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setServiceItems(data.data);

          const match = data.data.find(
            (item) => item.pcb_serial_number === pcbSerialNumber
          );

          if (match) {
            setForm((prev) => ({
              ...prev,
              service_item: match.service_item_id
            }));
            setCustomer(match.customer);
          }
        }
      } catch (error) {
        console.error("Service item load error:", error);
      }
    };

    loadServiceItems();
  }, [pcbSerialNumber, userId, company_id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        service_item: form.service_item,
        problem_type: form.problem_type,
        request_details: form.request_details,
        user_id: userId,
        requested_by: userId,
        company_id: company_id,
        company: company_id,
        source_type: "Machine Alert",
        status: "Open",
        customer: customer || userId,
        created_by: userId,
        updated_by: userId
      };

      const response = await fetch(`${baseURL}/service-pools/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Machine alert request submitted!");
        navigate("/delegate-Alarms", {
          state: {
            deviceId: pcbSerialNumber,
            alarmData,
            userId,
            company_id
          }
        });
      } else {
        throw new Error(result.message || "Failed to submit machine alert");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-3  main-div-delegate-machine-alert">
      {/* Mobile-responsive header */}
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0" style={{ fontSize: "clamp(1.25rem, 5vw, 1.5rem)" }}>
          Delegate Machine Alert Request
        </h3>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
          style={{ whiteSpace: "nowrap" }}
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        {/* PCB Serial Number & Error Code - Mobile friendly layout */}
        <div className="row g-2 ">
          <div className="col-12 col-sm-6">
            <div className="bg-light p-2 rounded">
              <small className="text-muted d-block">PCB Serial Number:</small>
              <strong className="d-block text-truncate" title={pcbSerialNumber}>
                {pcbSerialNumber}
              </strong>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="bg-light p-2 rounded">
              <small className="text-muted d-block">Error Code:</small>
              <strong>{autoErrorCode}</strong>
            </div>
          </div>
        </div>

        {/* Service Item (if needed) */}
        {serviceItems.length > 0 && (
          <div className="mb-3">
            <label className="form-label fw-bold">Service Item</label>
            <select
              name="service_item"
              className="form-select"
              value={form.service_item}
              onChange={handleChange}
            >
              <option value="">Select Service Item</option>
              {serviceItems.map((item) => (
                <option key={item.service_item_id} value={item.service_item_id}>
                  {item.pcb_serial_number} - {item.customer}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Problem Type */}
        <div className="">
          <label className="form-label fw-bold">Problem Type *</label>
          <select
            name="problem_type"
            className="form-select"
            required
            value={form.problem_type}
            onChange={handleChange}
            style={{ 
              fontSize: "clamp(14px, 4vw, 16px)",
              padding: "12px"
            }}
          >
            <option value="">Select Problem Type</option>
            {problemTypes.map((pt) => (
              <option 
                key={pt.problem_type_id} 
                value={pt.problem_type_id}
                title={pt.name} // Shows full text on hover
              >
                <span className="text-truncate">
                  {pt.name}
                </span>
              </option>
            ))}
          </select>
        </div>

        {/* Problem Description */}
        <div className="">
          <label className="form-label fw-bold">Problem Description *</label>
          <textarea
            name="request_details"
            className="form-control"
            rows="4"
            required
            value={form.request_details}
            onChange={handleChange}
            placeholder="Describe the problem..."
            style={{
              fontSize: "clamp(14px, 4vw, 16px)",
              resize: "vertical",
              minHeight: "80px"
            }}
          />
         
        </div>

        {/* Submit Button - Fixed at bottom on mobile */}
        <div className="sticky-bottom bg-white mt-1" 
             style={{ 
               bottom: 0, 
               left: 0, 
               right: 0,
               margin: "-1rem",
               padding: "1rem",
               borderTop: "1px solid #dee2e6"
             }}>
          <button
            type="submit"
            className="btn btn-primary w-100 py-3"
            disabled={isSubmitting}
            style={{
              fontSize: "clamp(16px, 5vw, 18px)",
              fontWeight: "600"
            }}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              "Submit Machine Alert"
            )}
          </button>
        </div>
      </form>

      {/* Mobile-specific styles */}
      <style jsx="true">{`
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 10px;
            padding-right: 10px;
          }
          
          .card {
            border-radius: 12px;
            border: none;
          }
          
          .form-select, .form-control {
            border-radius: 8px;
            border: 2px solid #e9ecef;
          }
          
          .form-select:focus, .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
          
          /* Prevent text overflow in dropdown */
          select option {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          
          /* Better touch targets */
          .btn, .form-select, .form-control {
            min-height: 48px;
          }
        }
        
        @media (max-width: 576px) {
          h3 {
            font-size: 1.3rem !important;
          }
          
          .sticky-bottom {
            position: sticky;
            z-index: 1020;
          }
        }
      `}</style>
            <DelegateNavbar />


    </div>
  );
};

export default DelegateMachineAlert;