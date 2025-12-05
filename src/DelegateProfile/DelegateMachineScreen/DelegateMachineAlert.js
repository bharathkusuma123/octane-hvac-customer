import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import baseURL from "../../Components/ApiUrl/Apiurl";
import { AuthContext } from "../../Components/AuthContext/AuthContext";


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
  console.log("DelegateMachineAlert User ID:", userId);
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

  console.log("🚀 Submitting delegate machine alert request...");
  console.log("➡ Form State:", form);
  console.log("➡ User ID:", userId);
  console.log("➡ Company ID:", company_id);
  console.log("➡ Customer:", customer);
  console.log("➡ PCB Serial Number:", pcbSerialNumber);

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

    console.log("📦 Payload being sent:", payload);
    console.log("🌐 API URL:", `${baseURL}/service-pools/`);

    const response = await fetch(`${baseURL}/service-pools/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("📥 Raw Fetch Response:", response);

    let result = {};
    try {
      result = await response.json();
      console.log("📄 Parsed JSON Response:", result);
    } catch (jsonError) {
      console.error("❌ Error parsing JSON:", jsonError);
      throw new Error("Invalid JSON returned from server");
    }

    if (response.ok) {
      console.log("✅ API Success! Navigating back to Delegate-Alarms...");
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
      console.error("❌ API Error Status:", response.status);
      console.error("❌ API Error Body:", result);
      throw new Error(result.message || "Failed to submit machine alert");
    }

  } catch (err) {
    console.error("🔥 Submission Error:", err);
    alert("Failed: " + err.message);
  }

  console.log("🔚 Submit request finished.");
  setIsSubmitting(false);
};


  return (
    <div className="container mt-4">
      <h3>Delegate Machine Alert Request</h3>

      <form onSubmit={handleSubmit} className="card p-3 mt-3">
        
        <p><strong>PCB Serial Number:</strong> {pcbSerialNumber}</p>
        <p><strong>Error Code:</strong> {autoErrorCode}</p>

        {/* Problem Type */}
        <label className="fw-bold mt-3">Problem Type *</label>
        <select
          name="problem_type"
          className="form-control"
          required
          value={form.problem_type}
          onChange={handleChange}
        >
          <option value="">Select Problem Type</option>
          {problemTypes.map((pt) => (
            <option key={pt.problem_type_id} value={pt.problem_type_id}>
              {pt.name}
            </option>
          ))}
        </select>

        {/* Description */}
        <label className="fw-bold mt-3">Problem Description *</label>
        <textarea
          name="request_details"
          className="form-control"
          rows="5"
          required
          value={form.request_details}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Machine Alert"}
        </button>
      </form>
    </div>
  );
};

export default DelegateMachineAlert;
