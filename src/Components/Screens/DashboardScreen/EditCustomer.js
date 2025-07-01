import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../ApiUrl/Apiurl";
import "./EditCustomer.css"; // We'll define this next

const EditCustomer = () => {
  const { customer_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    telephone: "",
    city: "",
    country_code: "",
    address: "",
    customer_type: "",
    status: "",
    remarks: ""
  });

  useEffect(() => {
    axios.get(`${baseURL}/customers/`)
      .then((res) => {
        const user = res.data.data.find((u) => u.customer_id === customer_id);
        if (user) {
          setFormData(user);
        }
      })
      .catch((err) => console.error(err));
  }, [customer_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${baseURL}/customers/${customer_id}/`, formData)
      .then(() => {
        alert("Customer updated successfully!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update customer.");
      });
  };

  return (
    <div className="edit-customer-wrapper">
      <div className="edit-card">
        <h2>Edit Customer Details</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          {[
            { name: "full_name", label: "Full Name" },
            { name: "email", label: "Email", type: "email" },
            // { name: "mobile", label: "Mobile" },
            // { name: "telephone", label: "Telephone" },
            { name: "city", label: "City" },
            { name: "country_code", label: "Country Code" },
            { name: "address", label: "Address" },
            { name: "customer_type", label: "Customer Type" },
            { name: "status", label: "Status" },
            { name: "remarks", label: "Remarks" }
          ].map(({ name, label, type = "text" }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

           <div className="button-group">
             <button
    type="button"
    className="back-btn"
    onClick={() => navigate("/dashboard")}
  >
    Back
  </button>
  <button type="submit" className="submit-btn">Update</button>
 
</div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;
