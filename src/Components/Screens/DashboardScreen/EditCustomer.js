import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import baseURL from "../../ApiUrl/Apiurl";
import "./EditCustomer.css";
import { AuthContext } from "../../AuthContext/AuthContext";

const EditCustomer = () => {
  const { user } = useContext(AuthContext);
  const company_id = user?.company_id;
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
    remarks: "",
  });

  useEffect(() => {
    axios.get(`${baseURL}/customers/${customer_id}/?user_id=${customer_id}&company_id=${company_id}`)
      .then((res) => {
        // Check if response data is an array or single object
        const customerData = Array.isArray(res.data.data) 
          ? res.data.data.find((u) => u.customer_id === customer_id)
          : res.data.data;
        
        if (customerData) {
          setFormData(customerData);
        } else {
          Swal.fire({
            icon: "error",
            title: "Customer Not Found",
            text: "The customer data could not be found.",
            confirmButtonColor: "#d33",
          });
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch customer data",
          confirmButtonColor: "#d33",
        });
      });
  }, [customer_id, navigate, company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${baseURL}/customers/${customer_id}/`, formData)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Customer updated successfully!",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          navigate("/dashboard");
        });
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = err.response?.data?.message || "Failed to update customer.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#d33",
        });
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
            { name: "mobile", label: "Mobile" },
            { name: "telephone", label: "Telephone" },
            { name: "city", label: "City" },
            { name: "country_code", label: "Country Code" },
            { name: "address", label: "Address" },
            { name: "customer_type", label: "Customer Type" },
            { name: "status", label: "Status" },
            { name: "remarks", label: "Remarks" },
          ].map(({ name, label, type = "text" }) => (
            <div className="form-group" key={name}>
              <label>{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                required={name === "full_name" || name === "email"}
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
            <button type="submit" className="submit-btn">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;