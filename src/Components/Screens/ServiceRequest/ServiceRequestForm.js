import React, { useState } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './ServiceRequestForm.css';

const ServiceRequestForm = () => {
  const [form, setForm] = useState({
    serviceItemId: '',
    preferredDate: '',
    preferredTime: '',
    details: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    alert('Service request submitted!');
    // Here you can integrate Firestore or backend API call
  };

  return (
   <div className="service-form-container">
  <h2>Service Request Form</h2>
  <form className="service-form" onSubmit={handleSubmit}>
    <input
      type="text"
      name="serviceItemId"
      placeholder="Service Item ID"
      value={form.serviceItemId}
      onChange={handleChange}
      required
    />
    <input
      type="date"
      name="preferredDate"
      value={form.preferredDate}
      onChange={handleChange}
      required
    />
    <input
      type="time"
      name="preferredTime"
      value={form.preferredTime}
      onChange={handleChange}
      required
    />
    <textarea
      name="details"
      placeholder="Request Details"
      rows="4"
      value={form.details}
      onChange={handleChange}
      required
    />
    <button type="submit">Submit</button>
  </form>
  <NavScreen />
</div>

  );
};

export default ServiceRequestForm;
