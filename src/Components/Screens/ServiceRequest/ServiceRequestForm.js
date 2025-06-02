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




import React, { useEffect, useState, useContext } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './ServiceRequestForm.css';
import { AuthContext } from "../../AuthContext/AuthContext";

const ServiceRequestForm = () => {
  const { user } = useContext(AuthContext);
  // const userId = localStorage.getItem('userId'); // e.g., 'custid00066'
 const userId = user?.user_id; // Use optional chaining to avoid crash if user is null
const userName = user?.username;
console.log("from context data",userId,userName);
console.log("userdata",user);
  const [form, setForm] = useState({
    request_details: '',
    preferred_date: '',
    preferred_time: '',
    status: 'Unassigned', // required by API
    source_type: 'Machine Alert', // constant
    service_item: '', // matches API's `service_item` (was `serviceItemId`)
    customer: userId, // sent as part of payload
  });

  const [serviceItems, setServiceItems] = useState([]);
  

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch('http://175.29.21.7:8006/service-items/');
        if (response.ok) {
          const result = await response.json(); // `result` is the full response object
          const serviceItemsArray = result.data; // Access the actual array

          const filteredItems = serviceItemsArray.filter(item => item.user === userId);
          setServiceItems(filteredItems);
          console.log("Filtered Data:", filteredItems);
        } else {
          console.error('Failed to fetch service items');
        }

      } catch (error) {
        console.error('Error fetching service items:', error);
      }
    };

    fetchServiceItems();
  }, [userId]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    request_id: Math.floor(Math.random() * 1000000),
    ...form,
    status: 'Unassigned',
    source_type: 'Machine Alert',
    customer: user?.customer_id,
    created_by: "Customer",
    updated_by: "Customer",
    requested_by: user?.customer_id
  };

  try {
    const response = await fetch('http://175.29.21.7:8006/service-pools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('Service request submitted successfully!');
      setForm({
        request_details: '',
        preferred_date: '',
        preferred_time: '',
        status: 'Unassigned',
        source_type: 'Machine Alert',
        service_item: '',
        customer: user?.customer_id,
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
      <div className="customer-info">
  {/* <strong>Customer ID:</strong> {user?.customer_id || 'Loading...'} */}
</div>
      <form className="service-form" onSubmit={handleSubmit}>
       <div className="form-group select-wrapper">
  <label htmlFor="serviceItemId">Service Item ID</label>
 <select
  name="service_item"
  id="service_item"
  value={form.service_item}
  onChange={handleChange}
  className="form-control"
  required
>
  <option value="">Select Service Item</option>
  {serviceItems.length === 0 ? (
    <option value="" disabled>
      No service items found
    </option>
  ) : (
    serviceItems.map((item) => (
      <option key={item.service_item_id} value={item.service_item_id}>
        {item.service_item_id} - {item.serial_number}
      </option>
    ))
  )}
</select>
</div>


        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Date</label>
          <input
            type="date"
            name="preferred_date"
            id="preferred_date"
            value={form.preferred_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="preferredTime">Preferred Time</label>
          <input
            type="time"
            name="preferred_time"
            id="preferred_time"
            value={form.preferred_time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">Request Details</label>
          <textarea
            name="request_details"

            id="details"
            rows="4"
            value={form.request_details}
            onChange={handleChange}
            className="form-control"
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

