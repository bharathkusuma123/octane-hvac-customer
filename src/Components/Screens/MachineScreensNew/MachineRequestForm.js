// MachineRequestForm.js (Updated for Problem Type + Auto Description + Hidden Date/Time)
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import baseURL from "../../ApiUrl/Apiurl";
import { AuthContext } from "../../AuthContext/AuthContext";
import NavScreen from "../../../Components/Screens/Navbar/Navbar";
import "./Newstyles.css";

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

const MachineRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const company_id = user?.company_id;
  const userId = user?.customer_id;

  const pcbSerialNumber = location.state?.pcb_serial_number;
  const source = location.state?.source;
  const alarmData = location.state?.alarmData;

  const autoDescription = location.state?.autoDescription || "";
  const autoErrorCode = location.state?.autoErrorCode || "";

  const [form, setForm] = useState({
    service_item: "",
    request_details: "",
    problem_type: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceItems, setServiceItems] = useState([]);
  const [matchedServiceItem, setMatchedServiceItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState("");

  const [problemTypes, setProblemTypes] = useState([]);

  // Fetch Problem Types
  useEffect(() => {
    const fetchProblemTypes = async () => {
      try {
        const res = await fetch(`${baseURL}/problem-types/`);
        const result = await res.json();

        if (result.status === "success") {
          setProblemTypes(result.data);
        }
      } catch (err) {
        console.error("Problem Types Fetch Error:", err);
      }
    };

    fetchProblemTypes();
  }, []);

  // Auto Select Problem Type + Auto Description
  useEffect(() => {
    if (autoErrorCode && problemTypes.length > 0) {
      const mappedName = errorCodeToProblemType[autoErrorCode];

      const matchedType = problemTypes.find(
        (pt) => pt.name.toLowerCase() === mappedName?.toLowerCase()
      );

      if (matchedType) {
        setForm((prev) => ({ ...prev, problem_type: matchedType.problem_type_id }));
      }
    }

    if (autoDescription) {
      setForm((prev) => ({ ...prev, request_details: autoDescription }));
    }
  }, [autoErrorCode, problemTypes, autoDescription]);

  // Fetch Service Items
  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setServiceItems(data.data);

          if (source !== "customer") {
            const matchedItem = data.data.find(
              (item) => item.pcb_serial_number === pcbSerialNumber
            );

            if (matchedItem) {
              setMatchedServiceItem(matchedItem);

              setForm((prev) => ({
                ...prev,
                service_item: matchedItem.service_item_id,
              }));

              setCustomer(matchedItem.customer);
            }
          } else {
            if (data.data.length > 0) {
              const defaultServiceItem = data.data[0];

              setForm((prev) => ({
                ...prev,
                service_item: defaultServiceItem.service_item_id,
              }));

              setCustomer(defaultServiceItem.customer);
            }
          }
        }
      } catch (error) {
        console.error("Service Items Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceItems();
  }, [company_id, userId, source, pcbSerialNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "service_item") {
      const selectedItem = serviceItems.find((item) => item.service_item_id === value);
      setCustomer(selectedItem?.customer || "");
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        service_item: form.service_item,
        request_details: form.request_details,
        problem_type: form.problem_type,
        user_id: userId,
        requested_by: userId,
        company_id,
        status: "Open",
        source_type: "Machine Alert",
        customer: customer || userId,
        company: company_id,
        created_by: userId,
        updated_by: userId,
      };

      const response = await fetch(`${baseURL}/service-pools/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Service request submitted successfully!");
        navigate("/alarms", {
          state: {
            deviceId: pcbSerialNumber,
            alarmData,
            userId,
            company_id,
          },
        });
      } else {
        throw new Error(result.message || "Failed to submit service request");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/alarms", {
      state: { deviceId: pcbSerialNumber, alarmData, userId, company_id },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container service-request-form new-styles">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5>{source === "customer" ? "Machine Alert Service Request" : "Service Request Form"}</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Problem Type */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Problem Type *</label>
                <select
                  name="problem_type"
                  value={form.problem_type}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Problem Type</option>
                  {problemTypes.map((pt) => (
                    <option key={pt.problem_type_id} value={pt.problem_type_id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-filled Description */}
              <div className="col-12">
                <label className="form-label fw-bold">Problem Description *</label>
                <textarea
                  name="request_details"
                  value={form.request_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="5"
                  required
                  placeholder="Describe the problem..."
                />
              </div>

              {/* Submit / Cancel */}
              <div className="d-flex justify-content-center mt-4 gap-3">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <NavScreen />
    </div>
  );
};

export default MachineRequestForm;
