import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import baseURL from "../../Components/ApiUrl/Apiurl";
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateMachineAlert.css';
import { useDelegateServiceItems } from "../../Components/AuthContext/DelegateServiceItemContext";

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

    const { 
      selectedServiceItem, 
      serviceItems, 
      serviceItemPermissions,
      loading: serviceItemsLoading 
    } = useDelegateServiceItems();

  const userId = location.state?.userId || user?.delegate_id;
  const company_id = location.state?.company_id || user?.company_id;
  const pcbSerialNumber = location.state?.pcb_serial_number;
  const alarmData = location.state?.alarmData;
  const autoDescription = location.state?.autoDescription || "";
  const autoErrorCode = location.state?.autoErrorCode || "";

    const canRaiseServiceRequest = serviceItemPermissions?.can_raise_service_request;
    console.log("Service Item Permissions:", serviceItemPermissions);
    console.log("Can Raise Service Request:", canRaiseServiceRequest);

  const [form, setForm] = useState({
    problem_type: "",
    request_details: autoDescription
  });

  
  // Auto Date/Time
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toISOString().slice(11, 16);

  const [serviceItemss, setServiceItems] = useState([]);
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
    console.log("=== SUBMIT DEBUG LOGS START ===");

    console.log("Selected Service Item:", selectedServiceItem);
    console.log("Service Item Permissions:", serviceItemPermissions);
    console.log("Can Raise Service Request:", serviceItemPermissions?.can_raise_service_request);

    console.log("User ID:", userId);
    console.log("Company ID:", company_id);
    console.log("Customer:", customer);

    const payload = {
      service_item: selectedServiceItem, 
      service_item_id: selectedServiceItem,    // <-- using navbar-selected ID
      problem_type: form.problem_type,
      request_details: form.request_details,
      user_id: userId,
      requested_by: userId,
      company_id: company_id,
      company: company_id,
      source_type: "Machine Alert",
      status: "Open",
       preferred_date: getTodayDate(),
      preferred_time: getCurrentTime(),
      customer: customer || userId,
      created_by: userId,
      updated_by: userId
    };

    console.log("Final Payload Being Sent:", payload);

    const response = await fetch(`${baseURL}/service-pools/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Response Status:", response.status);

    let textResponse = await response.text();
    console.log("Raw Response Text:", textResponse);

    // Try JSON parse
    let result;
    try {
      result = JSON.parse(textResponse);
    } catch (e) {
      result = textResponse;
    }

    console.log("Parsed Response:", result);

    console.log("=== SUBMIT DEBUG LOGS END ===");

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

         {canRaiseServiceRequest ? (
          <div className="sticky-bottom bg-white mt-1"
              style={{ bottom: 0, left: 0, right: 0, margin: "-1rem", padding: "1rem", borderTop: "1px solid #dee2e6" }}>
            <button
              type="submit"
              className="btn btn-primary w-100 py-3"
              disabled={isSubmitting}
              style={{ fontSize: "clamp(16px, 5vw, 18px)", fontWeight: "600" }}
            >
              {isSubmitting ? "Submitting..." : "Submit Machine Alert"}
            </button>
          </div>
        ) : (
          <div className="alert alert-warning mt-3">
            You do not have permission to raise a service request.
          </div>
        )}
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