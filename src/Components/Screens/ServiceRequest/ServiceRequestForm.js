// import React, { useState } from 'react';
// import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// import './ServiceRequestForm.css';

// const ServiceRequestForm = () => {
//   const [form, setForm] = useState({
//     serviceItemId: '',
//     preferredDate: '',
//     preferredTime: '',
//     details: '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', form);
//     alert('Service request submitted!');
//     // Here you can integrate Firestore or backend API call
//   };

//   return (
//     <div className="service-form-container">
//       <h2 className='sr-heading'>Service Request Form</h2>
//       <form className="service-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="serviceItemId">Service Item ID</label>
//           <input
//             type="text"
//             name="serviceItemId"
//             id="serviceItemId"
//             value={form.serviceItemId}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="preferredDate">Preferred Date</label>
//           <input
//             type="date"
//             name="preferredDate"
//             id="preferredDate"
//             value={form.preferredDate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="preferredTime">Preferred Time</label>
//           <input
//             type="time"
//             name="preferredTime"
//             id="preferredTime"
//             value={form.preferredTime}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="details">Request Details</label>
//           <textarea
//             name="details"
//             id="details"
//             rows="4"
//             value={form.details}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit">Submit</button>
//       </form>
//       <NavScreen />
//     </div>
//   );
// };

// export default ServiceRequestForm;




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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://175.29.21.7:8006/service-pools/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert('Service request submitted successfully!');
        setForm({
          serviceItemId: '',
          preferredDate: '',
          preferredTime: '',
          details: '',
        });
      } else {
        const errorData = await response.json();
        alert('Failed to submit request: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="service-form-container">
      <h2 className="sr-heading">Service Request Form</h2>
      <form className="service-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="serviceItemId">Service Item ID</label>
          <input
            type="text"
            name="serviceItemId"
            id="serviceItemId"
            value={form.serviceItemId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Date</label>
          <input
            type="date"
            name="preferredDate"
            id="preferredDate"
            value={form.preferredDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferredTime">Preferred Time</label>
          <input
            type="time"
            name="preferredTime"
            id="preferredTime"
            value={form.preferredTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">Request Details</label>
          <textarea
            name="details"
            id="details"
            rows="4"
            value={form.details}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
      <NavScreen />
    </div>
  );
};

export default ServiceRequestForm;
