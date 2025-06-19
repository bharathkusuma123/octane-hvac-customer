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




// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// import './ServiceRequestForm.css';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import baseURL from '../../ApiUrl/Apiurl';
// import Notification_Url from "../../ApiUrl/PushNotificanURL";

// const ServiceRequestForm = () => {
//   const { user } = useContext(AuthContext);
//   // const userId = localStorage.getItem('userId'); // e.g., 'custid00066'
//  const userId = user?.user_id; // Use optional chaining to avoid crash if user is null
// const userName = user?.username;
// console.log("from context data",userId,userName);
// console.log("userdata",user);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [form, setForm] = useState({
//     request_details: '',
//     preferred_date: '',
//     preferred_time: '',
//     status: 'Unassigned', // required by API
//     source_type: 'Machine Alert', // constant
//     service_item: '', // matches API's `service_item` (was `serviceItemId`)
//     customer: userId, // sent as part of payload
//   });

//   const [serviceItems, setServiceItems] = useState([]);
  

// useEffect(() => {
//   const fetchServiceItems = async () => {
//     try {
//       const response = await fetch(`${baseURL}/service-items/`);
//       if (response.ok) {
//         const result = await response.json();
//         const serviceItemsArray = result.data;

//         // Find the service item that matches the user's customer_id
//         const userServiceItem = serviceItemsArray.find(item => item.customer === user?.customer_id);
        
//         if (userServiceItem) {
//           // Set the company from the service item
//           setSelectedCompany(userServiceItem.company);
          
//           // Filter items for display if needed
//           const filteredItems = serviceItemsArray.filter(item => item.customer === user?.customer_id);
//           setServiceItems(filteredItems);
//           console.log("Filtered Data:", filteredItems);
//         }
//       } else {
//         console.error('Failed to fetch service items');
//       }
//     } catch (error) {
//       console.error('Error fetching service items:', error);
//     }
//   };

//   fetchServiceItems();
// }, [userId]);


//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const payload = {
//     request_id: Math.floor(Math.random() * 1000000),
//     ...form,
//     status: 'Unassigned',
//     source_type: 'Machine Alert',
//     customer: user?.customer_id,
//     created_by: "Customer",
//     updated_by: "Customer",
//     requested_by: user?.customer_id,
//     company: selectedCompany, 
//   };

//   try {
//     // Step 1: Submit service request
//     const response = await fetch(`${baseURL}/service-pools/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//       alert('Service request submitted successfully!');

//       // Reset form
//       setForm({
//         request_details: '',
//         preferred_date: '',
//         preferred_time: '',
//         status: 'Unassigned',
//         source_type: 'Machine Alert',
//         service_item: '',
//         customer: user?.customer_id,
//       });

//       // Step 2: Fetch all users to find Service Manager
//       const userResponse = await fetch('http://175.29.21.7:8006/users/');
//       const users = await userResponse.json();

//       const serviceManager = users.find(u => u.role === 'Service Manager' && u.fcm_token);

//       if (serviceManager) {
//         // Step 3: Send push notification
//         const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             token: serviceManager.fcm_token,
//             title: 'New Service Request',
//             body: `Service request raised by ${user?.customer_id}`,
//           }),
//         });

//         const notifyData = await notifyResponse.json();

//         if (notifyResponse.ok) {
//           console.log('Notification sent successfully:', notifyData);
//         } else {
//           console.error('Failed to send notification:', notifyData);
//         }
//       } else {
//         console.warn('No Service Manager with FCM token found.');
//       }
//     } else {
//       const errorData = await response.json();
//       alert('Failed to submit request: ' + JSON.stringify(errorData));
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     alert('An error occurred. Please try again later.');
//   }
// };


//   return (
//     <div className="service-form-container">
      
//       <h2 className="sr-heading">Service Request Form</h2>
//       <div className="customer-info">
//   {/* <strong>Customer ID:</strong> {user?.customer_id || 'Loading...'} */}
// </div>
//       <form className="service-form" onSubmit={handleSubmit}>
//        <div className="form-group select-wrapper">
//   <label htmlFor="serviceItemId">Service Item ID</label>
//  <select
//   name="service_item"
//   id="service_item"
//   value={form.service_item}
//   onChange={handleChange}
//   className="form-control"
//   required
// >
//   <option value="">Select Service Item</option>
//   {serviceItems.length === 0 ? (
//     <option value="" disabled>
//       No service items found
//     </option>
//   ) : (
//     serviceItems.map((item) => (
//       <option key={item.service_item_id} value={item.service_item_id}>
//         {item.service_item_id} - {item.serial_number}
//       </option>
//     ))
//   )}
// </select>
// </div>


//         <div className="form-group">
//           <label htmlFor="preferredDate">Preferred Date</label>
//           <input
//             type="date"
//             name="preferred_date"
//             id="preferred_date"
//             value={form.preferred_date}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="preferredTime">Preferred Time</label>
//           <input
//             type="time"
//             name="preferred_time"
//             id="preferred_time"
//             value={form.preferred_time}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="details">Request Details</label>
//           <textarea
//             name="request_details"

//             id="details"
//             rows="4"
//             value={form.request_details}
//             onChange={handleChange}
//             className="form-control"
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




// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// import './ServiceRequestForm.css';
// import { AuthContext } from '../../AuthContext/AuthContext';
// import baseURL from '../../ApiUrl/Apiurl';
// import Notification_Url from '../../ApiUrl/PushNotificanURL';

// const ServiceRequestForm = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.user_id;
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [form, setForm] = useState({
//     request_details: '',
//     preferred_date: '',
//     preferred_time: '',
//     status: 'Unassigned',
//     source_type: 'Machine Alert',
//     service_item: '',
//     customer: userId,
//   });

//   const [serviceItems, setServiceItems] = useState([]);

//   useEffect(() => {
//     const fetchServiceItems = async () => {
//       try {
//         const response = await fetch(`${baseURL}/service-items/`);
//         if (response.ok) {
//           const result = await response.json();
//           const serviceItemsArray = result.data;

//           const userServiceItem = serviceItemsArray.find(
//             (item) => item.customer === user?.customer_id
//           );

//           if (userServiceItem) {
//             setSelectedCompany(userServiceItem.company);
//             const filteredItems = serviceItemsArray.filter(
//               (item) => item.customer === user?.customer_id
//             );
//             setServiceItems(filteredItems);
//           }
//         } else {
//           console.error('Failed to fetch service items');
//         }
//       } catch (error) {
//         console.error('Error fetching service items:', error);
//       }
//     };

//     fetchServiceItems();
//   }, [userId]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       request_id: Math.floor(Math.random() * 1000000),
//       ...form,
//       status: 'Unassigned',
//       source_type: 'Machine Alert',
//       customer: user?.customer_id,
//       created_by: 'Customer',
//       updated_by: 'Customer',
//       requested_by: user?.customer_id,
//       company: selectedCompany,
//     };

//     try {
//       const response = await fetch(`${baseURL}/service-pools/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert('Service request submitted successfully!');
//         setForm({
//           request_details: '',
//           preferred_date: '',
//           preferred_time: '',
//           status: 'Unassigned',
//           source_type: 'Machine Alert',
//           service_item: '',
//           customer: user?.customer_id,
//         });

//         const userResponse = await fetch('http://175.29.21.7:8006/users/');
//         const users = await userResponse.json();

//         const serviceManager = users.find(
//           (u) => u.role === 'Service Manager' && u.fcm_token
//         );

//         if (serviceManager) {
//           const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               token: serviceManager.fcm_token,
//               title: 'New Service Request',
//               body: `Service request raised by ${user?.customer_id}`,
//             }),
//           });

//           const notifyData = await notifyResponse.json();
//           if (!notifyResponse.ok) {
//             console.error('Notification failed:', notifyData);
//           }
//         }
//       } else {
//         const errorData = await response.json();
//         alert('Failed to submit request: ' + JSON.stringify(errorData));
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('An error occurred. Please try again later.');
//     }
//   };

//   return (
//     <div className="container  service-request-form">
//       <div className="card">
//         <div className="card-header">
//           <h5 className="mb-1">Service Request Form</h5>
//           <h6 className="text" style={{ color: 'white' }}>
//             Please fill in the service request details
//           </h6>
//         </div>
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="row g-3">
//               <div className="col-md-6">
//                 <label className=" formlabel" style={{marginLeft:'-155px'}}>Service Item ID</label>
//                 <select
//                   name="service_item"
//                   value={form.service_item}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 >
//                   <option value="">Select Service Item</option>
//                   {serviceItems.length === 0 ? (
//                     <option value="" disabled>
//                       No service items found
//                     </option>
//                   ) : (
//                     serviceItems.map((item) => (
//                       <option key={item.service_item_id} value={item.service_item_id}>
//                         {item.service_item_id} - {item.serial_number}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               <div className="col-md-6">
//                 <label className=" formlabel"  style={{marginLeft:'-155px'}}>Preferred Date</label>
//                 <input
//                   type="date"
//                   name="preferred_date"
//                   value={form.preferred_date}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>

//               <div className="col-md-6">
//                 <label className=" formlabel" style={{marginLeft:'-152px'}}>Preferred Time</label>
//                 <input
//                   type="time"
//                   name="preferred_time"
//                   value={form.preferred_time}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 />
//               </div>

//               <div className="col-12">
//                 <label className=" formlabel" style={{marginLeft:'-137px'}}>Request Details</label>
//                 <textarea
//                   name="request_details"
//                   value={form.request_details}
//                   onChange={handleChange}
//                   className="form-control"
//                   rows="4"
//                   required
//                 />
//               </div>

//               <div className="d-flex justify-content-center mt-3 gap-3">
//                 <button type="submit" className="submit-btn">
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//       <NavScreen />
//     </div>
//   );
// };

// export default ServiceRequestForm;

import React, { useEffect, useState, useContext } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import './ServiceRequestForm.css';
import { AuthContext } from '../../AuthContext/AuthContext';
import baseURL from '../../ApiUrl/Apiurl';
import Notification_Url from '../../ApiUrl/PushNotificanURL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceRequestForm = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.user_id;
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form, setForm] = useState({
    request_details: '',
    preferred_date: '',
    preferred_time: '',
    status: 'Unassigned',
    source_type: 'Machine Alert',
    service_item: '',
    customer: userId,
  });

  const [serviceItems, setServiceItems] = useState([]);

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch(`${baseURL}/service-items/`);
        if (response.ok) {
          const result = await response.json();
          const serviceItemsArray = result.data;

          const userServiceItem = serviceItemsArray.find(
            (item) => item.customer === user?.customer_id
          );

          if (userServiceItem) {
            setSelectedCompany(userServiceItem.company);
            const filteredItems = serviceItemsArray.filter(
              (item) => item.customer === user?.customer_id
            );
            setServiceItems(filteredItems);
          }
        } else {
          console.error('Failed to fetch service items');
          toast.error('Failed to load service items');
        }
      } catch (error) {
        console.error('Error fetching service items:', error);
        toast.error('Error loading service items');
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
      created_by: 'Customer',
      updated_by: 'Customer',
      requested_by: user?.customer_id,
      company: selectedCompany,
    };

    try {
      const response = await fetch(`${baseURL}/service-pools/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Service request submitted successfully!', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        setForm({
          request_details: '',
          preferred_date: '',
          preferred_time: '',
          status: 'Unassigned',
          source_type: 'Machine Alert',
          service_item: '',
          customer: user?.customer_id,
        });

        const userResponse = await fetch('http://175.29.21.7:8006/users/');
        const users = await userResponse.json();

        const serviceManager = users.find(
          (u) => u.role === 'Service Manager' && u.fcm_token
        );

        if (serviceManager) {
          const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token: serviceManager.fcm_token,
              title: 'New Service Request',
              body: `Service request raised by ${user?.customer_id}`,
            }),
          });

          const notifyData = await notifyResponse.json();
          if (!notifyResponse.ok) {
            console.error('Notification failed:', notifyData);
            toast.warning('Service manager notification failed');
          }
        }
      } else {
        const errorData = await response.json();
        toast.error(`Failed to submit request: ${errorData.message || 'Unknown error'}`, {
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again later.', {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="container service-request-form">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">Service Request Form</h5>
          <h6 className="text" style={{ color: 'white' }}>
            Please fill in the service request details
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-155px' }}>Service Item ID</label>
                <select
                  name="service_item"
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

              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-155px' }}>Preferred Date</label>
                <input
                  type="date"
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-152px' }}>Preferred Time</label>
                <input
                  type="time"
                  name="preferred_time"
                  value={form.preferred_time}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12">
                <label className="formlabel" style={{ marginLeft: '-137px' }}>Request Details</label>
                <textarea
                  name="request_details"
                  value={form.request_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                />
              </div>

              <div className="d-flex justify-content-center mt-3 gap-3">
                <button type="submit" className="submit-btn">
                  Submit
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

export default ServiceRequestForm;