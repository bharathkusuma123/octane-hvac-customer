// // import React, { useState } from 'react';
// // import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// // import './ServiceRequestForm.css';

// // const ServiceRequestForm = () => {
// //   const [form, setForm] = useState({
// //     serviceItemId: '',
// //     preferredDate: '',
// //     preferredTime: '',
// //     details: '',
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log('Form submitted:', form);
// //     alert('Service request submitted!');
// //     // Here you can integrate Firestore or backend API call
// //   };

// //   return (
// //     <div className="service-form-container">
// //       <h2 className='sr-heading'>Service Request Form</h2>
// //       <form className="service-form" onSubmit={handleSubmit}>
// //         <div className="form-group">
// //           <label htmlFor="serviceItemId">Service Item ID</label>
// //           <input
// //             type="text"
// //             name="serviceItemId"
// //             id="serviceItemId"
// //             value={form.serviceItemId}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="preferredDate">Preferred Date</label>
// //           <input
// //             type="date"
// //             name="preferredDate"
// //             id="preferredDate"
// //             value={form.preferredDate}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="preferredTime">Preferred Time</label>
// //           <input
// //             type="time"
// //             name="preferredTime"
// //             id="preferredTime"
// //             value={form.preferredTime}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="details">Request Details</label>
// //           <textarea
// //             name="details"
// //             id="details"
// //             rows="4"
// //             value={form.details}
// //             onChange={handleChange}
// //             required
// //           />
// //         </div>

// //         <button type="submit">Submit</button>
// //       </form>
// //       <NavScreen />
// //     </div>
// //   );
// // };

// // export default ServiceRequestForm;




// // import React, { useEffect, useState, useContext } from 'react';
// // import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// // import './ServiceRequestForm.css';
// // import { AuthContext } from "../../AuthContext/AuthContext";
// // import baseURL from '../../ApiUrl/Apiurl';
// // import Notification_Url from "../../ApiUrl/PushNotificanURL";

// // const ServiceRequestForm = () => {
// //   const { user } = useContext(AuthContext);
// //   // const userId = localStorage.getItem('userId'); // e.g., 'custid00066'
// //  const userId = user?.user_id; // Use optional chaining to avoid crash if user is null
// // const userName = user?.username;
// // console.log("from context data",userId,userName);
// // console.log("userdata",user);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [form, setForm] = useState({
// //     request_details: '',
// //     preferred_date: '',
// //     preferred_time: '',
// //     status: 'Unassigned', // required by API
// //     source_type: 'Machine Alert', // constant
// //     service_item: '', // matches API's `service_item` (was `serviceItemId`)
// //     customer: userId, // sent as part of payload
// //   });

// //   const [serviceItems, setServiceItems] = useState([]);
  

// // useEffect(() => {
// //   const fetchServiceItems = async () => {
// //     try {
// //       const response = await fetch(`${baseURL}/service-items/`);
// //       if (response.ok) {
// //         const result = await response.json();
// //         const serviceItemsArray = result.data;

// //         // Find the service item that matches the user's customer_id
// //         const userServiceItem = serviceItemsArray.find(item => item.customer === user?.customer_id);
        
// //         if (userServiceItem) {
// //           // Set the company from the service item
// //           setSelectedCompany(userServiceItem.company);
          
// //           // Filter items for display if needed
// //           const filteredItems = serviceItemsArray.filter(item => item.customer === user?.customer_id);
// //           setServiceItems(filteredItems);
// //           console.log("Filtered Data:", filteredItems);
// //         }
// //       } else {
// //         console.error('Failed to fetch service items');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching service items:', error);
// //     }
// //   };

// //   fetchServiceItems();
// // }, [userId]);


// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   const payload = {
// //     request_id: Math.floor(Math.random() * 1000000),
// //     ...form,
// //     status: 'Unassigned',
// //     source_type: 'Machine Alert',
// //     customer: user?.customer_id,
// //     created_by: "Customer",
// //     updated_by: "Customer",
// //     requested_by: user?.customer_id,
// //     company: selectedCompany, 
// //   };

// //   try {
// //     // Step 1: Submit service request
// //     const response = await fetch(`${baseURL}/service-pools/`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(payload),
// //     });

// //     if (response.ok) {
// //       alert('Service request submitted successfully!');

// //       // Reset form
// //       setForm({
// //         request_details: '',
// //         preferred_date: '',
// //         preferred_time: '',
// //         status: 'Unassigned',
// //         source_type: 'Machine Alert',
// //         service_item: '',
// //         customer: user?.customer_id,
// //       });

// //       // Step 2: Fetch all users to find Service Manager
// //       const userResponse = await fetch(`${baseURL}/users/`);
// //       const users = await userResponse.json();

// //       const serviceManager = users.find(u => u.role === 'Service Manager' && u.fcm_token);

// //       if (serviceManager) {
// //         // Step 3: Send push notification
// //         const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           body: JSON.stringify({
// //             token: serviceManager.fcm_token,
// //             title: 'New Service Request',
// //             body: `Service request raised by ${user?.customer_id}`,
// //           }),
// //         });

// //         const notifyData = await notifyResponse.json();

// //         if (notifyResponse.ok) {
// //           console.log('Notification sent successfully:', notifyData);
// //         } else {
// //           console.error('Failed to send notification:', notifyData);
// //         }
// //       } else {
// //         console.warn('No Service Manager with FCM token found.');
// //       }
// //     } else {
// //       const errorData = await response.json();
// //       alert('Failed to submit request: ' + JSON.stringify(errorData));
// //     }
// //   } catch (error) {
// //     console.error('Error submitting form:', error);
// //     alert('An error occurred. Please try again later.');
// //   }
// // };


// //   return (
// //     <div className="service-form-container">
      
// //       <h2 className="sr-heading">Service Request Form</h2>
// //       <div className="customer-info">
// //   {/* <strong>Customer ID:</strong> {user?.customer_id || 'Loading...'} */}
// // </div>
// //       <form className="service-form" onSubmit={handleSubmit}>
// //        <div className="form-group select-wrapper">
// //   <label htmlFor="serviceItemId">Service Item ID</label>
// //  <select
// //   name="service_item"
// //   id="service_item"
// //   value={form.service_item}
// //   onChange={handleChange}
// //   className="form-control"
// //   required
// // >
// //   <option value="">Select Service Item</option>
// //   {serviceItems.length === 0 ? (
// //     <option value="" disabled>
// //       No service items found
// //     </option>
// //   ) : (
// //     serviceItems.map((item) => (
// //       <option key={item.service_item_id} value={item.service_item_id}>
// //         {item.service_item_id} - {item.serial_number}
// //       </option>
// //     ))
// //   )}
// // </select>
// // </div>


// //         <div className="form-group">
// //           <label htmlFor="preferredDate">Preferred Date</label>
// //           <input
// //             type="date"
// //             name="preferred_date"
// //             id="preferred_date"
// //             value={form.preferred_date}
// //             onChange={handleChange}
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="preferredTime">Preferred Time</label>
// //           <input
// //             type="time"
// //             name="preferred_time"
// //             id="preferred_time"
// //             value={form.preferred_time}
// //             onChange={handleChange}
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="details">Request Details</label>
// //           <textarea
// //             name="request_details"

// //             id="details"
// //             rows="4"
// //             value={form.request_details}
// //             onChange={handleChange}
// //             className="form-control"
// //             required
// //           />
// //         </div>

// //         <button type="submit">Submit</button>
// //       </form>
// //       <NavScreen />
// //     </div>
// //   );
// // };

// // export default ServiceRequestForm;




// // import React, { useEffect, useState, useContext } from 'react';
// // import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// // import './ServiceRequestForm.css';
// // import { AuthContext } from '../../AuthContext/AuthContext';
// // import baseURL from '../../ApiUrl/Apiurl';
// // import Notification_Url from '../../ApiUrl/PushNotificanURL';

// // const ServiceRequestForm = () => {
// //   const { user } = useContext(AuthContext);
// //   const userId = user?.user_id;
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [form, setForm] = useState({
// //     request_details: '',
// //     preferred_date: '',
// //     preferred_time: '',
// //     status: 'Unassigned',
// //     source_type: 'Machine Alert',
// //     service_item: '',
// //     customer: userId,
// //   });

// //   const [serviceItems, setServiceItems] = useState([]);

// //   useEffect(() => {
// //     const fetchServiceItems = async () => {
// //       try {
// //         const response = await fetch(`${baseURL}/service-items/`);
// //         if (response.ok) {
// //           const result = await response.json();
// //           const serviceItemsArray = result.data;

// //           const userServiceItem = serviceItemsArray.find(
// //             (item) => item.customer === user?.customer_id
// //           );

// //           if (userServiceItem) {
// //             setSelectedCompany(userServiceItem.company);
// //             const filteredItems = serviceItemsArray.filter(
// //               (item) => item.customer === user?.customer_id
// //             );
// //             setServiceItems(filteredItems);
// //           }
// //         } else {
// //           console.error('Failed to fetch service items');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching service items:', error);
// //       }
// //     };

// //     fetchServiceItems();
// //   }, [userId]);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const payload = {
// //       request_id: Math.floor(Math.random() * 1000000),
// //       ...form,
// //       status: 'Unassigned',
// //       source_type: 'Machine Alert',
// //       customer: user?.customer_id,
// //       created_by: 'Customer',
// //       updated_by: 'Customer',
// //       requested_by: user?.customer_id,
// //       company: selectedCompany,
// //     };

// //     try {
// //       const response = await fetch(`${baseURL}/service-pools/`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       if (response.ok) {
// //         alert('Service request submitted successfully!');
// //         setForm({
// //           request_details: '',
// //           preferred_date: '',
// //           preferred_time: '',
// //           status: 'Unassigned',
// //           source_type: 'Machine Alert',
// //           service_item: '',
// //           customer: user?.customer_id,
// //         });

// //         const userResponse = await fetch(`${baseURL}/users/`);
// //         const users = await userResponse.json();

// //         const serviceManager = users.find(
// //           (u) => u.role === 'Service Manager' && u.fcm_token
// //         );

// //         if (serviceManager) {
// //           const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({
// //               token: serviceManager.fcm_token,
// //               title: 'New Service Request',
// //               body: `Service request raised by ${user?.customer_id}`,
// //             }),
// //           });

// //           const notifyData = await notifyResponse.json();
// //           if (!notifyResponse.ok) {
// //             console.error('Notification failed:', notifyData);
// //           }
// //         }
// //       } else {
// //         const errorData = await response.json();
// //         alert('Failed to submit request: ' + JSON.stringify(errorData));
// //       }
// //     } catch (error) {
// //       console.error('Error submitting form:', error);
// //       alert('An error occurred. Please try again later.');
// //     }
// //   };

// //   return (
// //     <div className="container  service-request-form">
// //       <div className="card">
// //         <div className="card-header">
// //           <h5 className="mb-1">Service Request Form</h5>
// //           <h6 className="text" style={{ color: 'white' }}>
// //             Please fill in the service request details
// //           </h6>
// //         </div>
// //         <div className="card-body">
// //           <form onSubmit={handleSubmit}>
// //             <div className="row g-3">
// //               <div className="col-md-6">
// //                 <label className=" formlabel" style={{marginLeft:'-155px'}}>Service Item ID</label>
// //                 <select
// //                   name="service_item"
// //                   value={form.service_item}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   required
// //                 >
// //                   <option value="">Select Service Item</option>
// //                   {serviceItems.length === 0 ? (
// //                     <option value="" disabled>
// //                       No service items found
// //                     </option>
// //                   ) : (
// //                     serviceItems.map((item) => (
// //                       <option key={item.service_item_id} value={item.service_item_id}>
// //                         {item.service_item_id} - {item.serial_number}
// //                       </option>
// //                     ))
// //                   )}
// //                 </select>
// //               </div>

// //               <div className="col-md-6">
// //                 <label className=" formlabel"  style={{marginLeft:'-155px'}}>Preferred Date</label>
// //                 <input
// //                   type="date"
// //                   name="preferred_date"
// //                   value={form.preferred_date}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   required
// //                 />
// //               </div>

// //               <div className="col-md-6">
// //                 <label className=" formlabel" style={{marginLeft:'-152px'}}>Preferred Time</label>
// //                 <input
// //                   type="time"
// //                   name="preferred_time"
// //                   value={form.preferred_time}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   required
// //                 />
// //               </div>

// //               <div className="col-12">
// //                 <label className=" formlabel" style={{marginLeft:'-137px'}}>Request Details</label>
// //                 <textarea
// //                   name="request_details"
// //                   value={form.request_details}
// //                   onChange={handleChange}
// //                   className="form-control"
// //                   rows="4"
// //                   required
// //                 />
// //               </div>

// //               <div className="d-flex justify-content-center mt-3 gap-3">
// //                 <button type="submit" className="submit-btn">
// //                   Submit
// //                 </button>
// //               </div>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //       <NavScreen />
// //     </div>
// //   );
// // };

// // export default ServiceRequestForm;

// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// import './ServiceRequestForm.css';
// import { AuthContext } from '../../AuthContext/AuthContext';
// import baseURL from '../../ApiUrl/Apiurl';
// import Notification_Url from '../../ApiUrl/PushNotificanURL';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const ServiceRequestForm = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const company_id = user?.company_id;
//   console.log("User ID from context:", userId);
//   console.log("Company ID from context:", company_id);
//   const [isSubmitting, setIsSubmitting] = useState(false);
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
//         const response = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`);
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
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Failed to load service items',
//             confirmButtonColor: '#d33',
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching service items:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Something went wrong while loading service items.',
//           confirmButtonColor: '#d33',
//         });
//       }
//     };

//     fetchServiceItems();
//   }, [userId]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setIsSubmitting(true);

//   //   const selectedItem = serviceItems.find(
//   //     (item) => item.service_item_id === form.service_item
//   //   );

//   //   if (!selectedItem) {
//   //     Swal.fire({
//   //       icon: 'warning',
//   //       title: 'Invalid Input',
//   //       text: 'Please select a valid service item.',
//   //       confirmButtonColor: '#f8bb86',
//   //     });
//   //     setIsSubmitting(false);
//   //     return;
//   //   }

//   //   const payload = {
//   //     request_id: Math.floor(Math.random() * 1000000).toString(),
//   //     dynamics_service_order_no: "string",
//   //     source_type: "Machine Alert",
//   //     request_details: form.request_details || "Service required",
//   //     alert_details: "string",
//   //     requested_by: user?.customer_id || "unknown",
//   //     preferred_date: form.preferred_date,
//   //     preferred_time: `${form.preferred_time}:00`,
//   //     status: "Open",
//   //     estimated_completion_time: `${form.preferred_time}:00`,
//   //     estimated_price: "0.00",
//   //     est_start_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//   //     est_end_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//   //     act_start_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//   //     act_end_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//   //     act_material_cost: "0.00",
//   //     act_labour_hours: "0.00",
//   //     act_labour_cost: "0.00",
//   //     completion_notes: "Not yet completed",
//   //     created_by: "Customer",
//   //     updated_by: "Customer",
//   //     company: selectedCompany || "unknown",
//   //     service_item: form.service_item,
//   //     customer: user?.customer_id || "unknown",
//   //     pm_group: selectedItem?.pm_group || "default-pm",
//   //     assigned_engineer: "",
//   //     reopened_from: ""
//   //   };

//   //   try {
//   //     const response = await fetch(`${baseURL}/service-pools/`, {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     const contentType = response.headers.get('content-type');

//   //     if (response.ok) {
//   //       Swal.fire({
//   //         icon: 'success',
//   //         title: 'Success',
//   //         text: 'Service request submitted successfully!',
//   //         confirmButtonColor: '#3085d6',
//   //       }).then(() => {
//   //         navigate('/request');
//   //       });

//   //       setForm({
//   //         request_details: '',
//   //         preferred_date: '',
//   //         preferred_time: '',
//   //         status: 'Unassigned',
//   //         source_type: 'Machine Alert',
//   //         service_item: '',
//   //         customer: user?.customer_id,
//   //       });

//   //       const userResponse = await fetch(`${baseURL}/users/`);
//   //       const users = await userResponse.json();

//   //       const serviceManager = users.find(
//   //         (u) => u.role === 'Service Manager' && u.fcm_token
//   //       );

//   //       if (serviceManager) {
//   //         const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
//   //           method: 'POST',
//   //           headers: { 'Content-Type': 'application/json' },
//   //           body: JSON.stringify({
//   //             token: serviceManager.fcm_token,
//   //             title: 'New Service Request',
//   //             body: `Service request raised by ${user?.customer_id}`,
//   //           }),
//   //         });

//   //         if (!notifyResponse.ok) {
//   //           Swal.fire({
//   //             icon: 'warning',
//   //             title: 'Notification Failed',
//   //             text: 'Service manager notification could not be delivered.',
//   //             confirmButtonColor: '#f8bb86',
//   //           });
//   //         }
//   //       }
//   //     } else {
//   //       let errorData = {};
//   //       try {
//   //         if (contentType?.includes('application/json')) {
//   //           errorData = await response.json();
//   //         } else {
//   //           const text = await response.text();
//   //           errorData.message = `Non-JSON error: ${text.slice(0, 100)}...`;
//   //         }
//   //       } catch (err) {
//   //         errorData.message = 'Failed to parse error response.';
//   //       }

//   //       Swal.fire({
//   //         icon: 'error',
//   //         title: 'Error',
//   //         text: errorData.message || 'Failed to submit request.',
//   //         confirmButtonColor: '#d33',
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error('Error submitting form:', error);
//   //     Swal.fire({
//   //       icon: 'error',
//   //       title: 'Error',
//   //       text: 'An error occurred while submitting. Please try again later.',
//   //       confirmButtonColor: '#d33',
//   //     });
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   const selectedItem = serviceItems.find(
//     (item) => item.service_item_id === form.service_item
//   );

//   if (!selectedItem) {
//     Swal.fire({
//       icon: 'warning',
//       title: 'Invalid Input',
//       text: 'Please select a valid service item.',
//       confirmButtonColor: '#f8bb86',
//     });
//     setIsSubmitting(false);
//     return;
//   }

//   const payload = {
//     request_id: Math.floor(Math.random() * 1000000).toString(),
//     dynamics_service_order_no: "string",
//     source_type: "Machine Alert",
//     request_details: form.request_details || "Service required",
//     alert_details: "string",
//     requested_by: user?.customer_id || "unknown",
//     preferred_date: form.preferred_date,
//     preferred_time: `${form.preferred_time}:00`,
//     status: "Open",
//     estimated_completion_time: null,
//     estimated_price: "0.00",
//     est_start_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//     est_end_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//     act_start_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//     act_end_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
//     act_material_cost: "0.00",
//     act_labour_hours: "0.00",
//     act_labour_cost: "0.00",
//     completion_notes: "Not yet completed",
//     created_by: "Customer",
//     updated_by: "Customer",
//     company: selectedCompany || "unknown",
//     service_item: form.service_item,
//     customer: user?.customer_id || "unknown",
//     pm_group: selectedItem?.pm_group || "default-pm",
//     assigned_engineer: "",
//     reopened_from: "",
//     company_id: selectedCompany || "unknown", // Ensure company_id is included
//     user_id: userId, // Include user_id for tracking
//   };
//   console.log("Payload being sent:", JSON.stringify(payload, null, 2));

//   try {
//     const response = await fetch(`${baseURL}/service-pools/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//       const data = await response.json(); // Parse the response data
      
//       // Only show success if the response is truly successful
//       await Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: 'Service request submitted successfully!',
//         confirmButtonColor: '#3085d6',
//       });
      
//       navigate('/request');

//       setForm({
//         request_details: '',
//         preferred_date: '',
//         preferred_time: '',
//         status: 'Unassigned',
//         source_type: 'Machine Alert',
//         service_item: '',
//         customer: user?.customer_id,
//       });

//       try {
//         const userResponse = await fetch(`${baseURL}/users/`);
//         if (userResponse.ok) {
//           const users = await userResponse.json();
//           const serviceManager = users.find(
//             (u) => u.role === 'Service Manager' && u.fcm_token
//           );

//           if (serviceManager) {
//             const notifyResponse = await fetch(`${Notification_Url}/send-notification`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 token: serviceManager.fcm_token,
//                 title: 'New Service Request',
//                 body: `Service request raised by ${user?.customer_id}`,
//               }),
//             });

//             if (!notifyResponse.ok) {
//               console.warn('Notification failed to send');
//             }
//           }
//         }
//       } catch (notificationError) {
//         console.error('Notification error:', notificationError);
//       }
//     } else {
//       let errorMessage = 'Failed to submit request.';
//       try {
//         const errorData = await response.json();
//          console.error("Backend returned 400:", errorData); // 👈 Log full error response
//         errorMessage = errorData.message || errorMessage;
//       // If backend returns specific validation errors
//     if (errorData.errors) {
//       console.table(errorData.errors); // Optional: show tabular error messages if array/object
//     }

//     errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage;
//   } catch (parseError) {
//     console.error('Error parsing backend error response:', parseError);
//   }

//       await Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: errorMessage,
//         confirmButtonColor: '#d33',
//       });
//     }
//   } catch (error) {
//     console.error('Error submitting form:', error);
//     await Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: 'An error occurred while submitting. Please try again later.',
//       confirmButtonColor: '#d33',
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="container service-request-form">
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
//                 <label className="formlabel" style={{ marginLeft: '-155px' }}>Service Item ID</label>
//                 <select
//                   name="service_item"
//                   value={form.service_item}
//                   onChange={handleChange}
//                   className="form-control"
//                   required
//                 >
//                   <option value="">Select Service Item</option>
//                   {serviceItems.length === 0 ? (
//                     <option value="" disabled>No service items found</option>
//                   ) : (
//                     serviceItems.map((item) => (
//                       <option key={item.service_item_id} value={item.service_item_id}>
//                         {item.service_item_name} - {item.service_item_id}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               <div className="col-md-6">
//                 <label className="formlabel" style={{ marginLeft: '-85px' }}>Preferred Service Date</label>
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
//                 <label className="formlabel" style={{ marginLeft: '-85px' }}>Preferred Service Time</label>
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
//                 <label className="formlabel" style={{ marginLeft: '-137px' }}>Request Details</label>
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
//                 <button type="submit" className="submit-btn" disabled={isSubmitting}>
//                   {isSubmitting ? 'Submitting...' : 'Submit'}
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
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTimes, FaUpload, FaImage, FaVideo } from 'react-icons/fa';

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const company_id = user?.company_id;
  
  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const existingRequest = location.state?.requestData || null;
  
  console.log("User ID from context:", userId);
  console.log("Company ID from context:", company_id);
  console.log("Edit mode:", isEditMode);
  console.log("Existing request:", existingRequest);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({
    request_details: '',
    preferred_date: '',
    preferred_time: '',
    status: 'Unassigned',
    source_type: 'Customer Request',
    service_item: '',
    customer: userId,
  });

  const [serviceItems, setServiceItems] = useState([]);

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && existingRequest) {
      setForm({
        request_details: existingRequest.request_details || '',
        preferred_date: existingRequest.preferred_date || '',
        preferred_time: existingRequest.preferred_time ? existingRequest.preferred_time.slice(0, 5) : '',
        status: existingRequest.status || 'Unassigned',
        source_type: existingRequest.source_type || 'Customer Request',
        service_item: existingRequest.service_item || '',
        customer: existingRequest.customer || userId,
      });
      setSelectedCompany(existingRequest.company || null);
    }
  }, [isEditMode, existingRequest, userId]);

  useEffect(() => {
    const fetchServiceItems = async () => {
      try {
        const response = await fetch(`${baseURL}/service-items/?user_id=${userId}&company_id=${company_id}`);
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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load service items',
            confirmButtonColor: '#d33',
          });
        }
      } catch (error) {
        console.error('Error fetching service items:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong while loading service items.',
          confirmButtonColor: '#d33',
        });
      }
    };

    fetchServiceItems();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: `${file.name} is not a valid image or video file.`,
          confirmButtonColor: '#f8bb86',
        });
        return false;
      }
      
      if (!isValidSize) {
        Swal.fire({
          icon: 'warning',
          title: 'File Too Large',
          text: `${file.name} exceeds 50MB size limit.`,
          confirmButtonColor: '#f8bb86',
        });
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset file input
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload media files to the service request
  const uploadMediaFiles = async (requestId, serviceItemId) => {
    if (selectedFiles.length === 0) return true;

    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('company_id', company_id);
      formData.append('service_item_id', serviceItemId);

      // Append all files
      selectedFiles.forEach(file => {
        formData.append('file', file);
      });

      const mediaUrl = `${baseURL}/service-pools/${requestId}/media/`;
      
      const response = await fetch(mediaUrl, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header for FormData, browser will set it automatically with boundary
      });

      if (response.ok) {
        console.log('Media files uploaded successfully');
        return true;
      } else {
        const errorData = await response.json();
        console.error('Media upload failed:', errorData);
        throw new Error(errorData.message || 'Media upload failed');
      }
    } catch (error) {
      console.error('Error uploading media files:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedItem = serviceItems.find(
      (item) => item.service_item_id === form.service_item
    );

    if (!selectedItem) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please select a valid service item.',
        confirmButtonColor: '#f8bb86',
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      request_id: isEditMode ? existingRequest.request_id : Math.floor(Math.random() * 1000000).toString(),
      dynamics_service_order_no: isEditMode ? existingRequest.dynamics_service_order_no : "string",
      source_type: form.source_type,
      request_details: form.request_details || "Service required",
      alert_details: isEditMode ? existingRequest.alert_details : "string",
      requested_by: user?.customer_id || "unknown",
      preferred_date: form.preferred_date,
      preferred_time: `${form.preferred_time}:00`,
      status: isEditMode ? existingRequest.status : "Open", // Keep existing status in edit mode
      estimated_completion_time: isEditMode ? existingRequest.estimated_completion_time : null,
      estimated_price: isEditMode ? existingRequest.estimated_price : "0.00",
      est_start_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
      est_end_datetime: `${form.preferred_date}T${form.preferred_time}:00Z`,
      act_start_datetime: isEditMode ? existingRequest.act_start_datetime : `${form.preferred_date}T${form.preferred_time}:00Z`,
      act_end_datetime: isEditMode ? existingRequest.act_end_datetime : `${form.preferred_date}T${form.preferred_time}:00Z`,
      act_material_cost: isEditMode ? existingRequest.act_material_cost : "0.00",
      act_labour_hours: isEditMode ? existingRequest.act_labour_hours : "0.00",
      act_labour_cost: isEditMode ? existingRequest.act_labour_cost : "0.00",
      completion_notes: isEditMode ? existingRequest.completion_notes : "Not yet completed",
      created_by: isEditMode ? existingRequest.created_by : "Customer",
      updated_by: "Customer",
      company: selectedCompany || "unknown",
      service_item: form.service_item,
      customer: user?.customer_id || "unknown",
      pm_group: selectedItem?.pm_group || "default-pm",
      assigned_engineer: isEditMode ? existingRequest.assigned_engineer : "",
      reopened_from: isEditMode ? existingRequest.reopened_from : "",
      company_id: selectedCompany || "unknown",
      user_id: userId,
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const url = isEditMode 
        ? `${baseURL}/service-pools/${existingRequest.request_id}/` 
        : `${baseURL}/service-pools/`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const requestId = data.data?.request_id || existingRequest?.request_id;

        // Upload media files if any (only for new requests or if files are selected in edit mode)
        if (selectedFiles.length > 0 && requestId) {
          try {
            await uploadMediaFiles(requestId, form.service_item);
          } catch (mediaError) {
            // Even if media upload fails, we still show success for the main request
            console.warn('Media upload failed but request was created:', mediaError);
          }
        }

        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Service request ${isEditMode ? 'updated' : 'submitted'} successfully!${selectedFiles.length > 0 ? ' Media files uploaded.' : ''}`,
          confirmButtonColor: '#3085d6',
        });
        
        navigate('/request');

        // Reset form only if not in edit mode
        if (!isEditMode) {
          setForm({
            request_details: '',
            preferred_date: '',
            preferred_time: '',
            status: 'Unassigned',
            source_type: 'Customer Request',
            service_item: '',
            customer: user?.customer_id,
          });
          setSelectedFiles([]);
        }

        // Send notification only for new requests
        if (!isEditMode) {
          try {
            const userResponse = await fetch(`${baseURL}/users/`);
            if (userResponse.ok) {
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

                if (!notifyResponse.ok) {
                  console.warn('Notification failed to send');
                }
              }
            }
          } catch (notificationError) {
            console.error('Notification error:', notificationError);
          }
        }
      } else {
        let errorMessage = `Failed to ${isEditMode ? 'update' : 'submit'} request.`;
        try {
          const errorData = await response.json();
          console.error("Backend returned error:", errorData);
          if (errorData.errors) {
            console.table(errorData.errors);
          }
          errorMessage = errorData.message || JSON.stringify(errorData) || errorMessage;
        } catch (parseError) {
          console.error('Error parsing backend error response:', parseError);
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting. Please try again later.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/request');
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container service-request-form">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-1">{isEditMode ? 'Edit Service Request' : 'Service Request Form'}</h5>
          <h6 className="text" style={{ color: 'white' }}>
            {isEditMode ? 'Update the service request details' : 'Please fill in the service request details'}
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
                  disabled={isEditMode}
                >
                  <option value="">Select Service Item</option>
                  {serviceItems.length === 0 ? (
                    <option value="" disabled>No service items found</option>
                  ) : (
                    serviceItems.map((item) => (
                      <option key={item.service_item_id} value={item.service_item_id}>
                        {item.service_item_name} - {item.service_item_id}
                      </option>
                    ))
                  )}
                </select>
                {isEditMode && (
                  <small className="text-muted">Service item cannot be changed</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="formlabel" style={{ marginLeft: '-85px' }}>Preferred Service Date</label>
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
                <label className="formlabel" style={{ marginLeft: '-85px' }}>Preferred Service Time</label>
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

              {/* File Upload Section */}
              <div className="col-12">
                <label className="formlabel" style={{ marginLeft: '-137px' }}>
                  Upload Images & Videos (Optional)
                </label>
                <div className="file-upload-section">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                      <FaUpload className="me-2" />
                      Choose Images & Videos
                    </label>
                    <small className="text-muted d-block mt-2">
                      Supported formats: JPG, PNG, GIF, MP4, AVI, MOV. Max file size: 50MB
                    </small>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="selected-files mt-3">
                      <h6>Selected Files ({selectedFiles.length}):</h6>
                      <div className="file-list">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="file-item">
                            <div className="file-info">
                              {file.type.startsWith('image/') ? (
                                <FaImage className="file-icon text-primary" />
                              ) : (
                                <FaVideo className="file-icon text-danger" />
                              )}
                              <div className="file-details">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatFileSize(file.size)}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeFile(index)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-center mt-3 gap-3">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (isEditMode ? 'Updating...' : 'Submitting...') 
                    : (isEditMode ? 'Update Request' : 'Submit Request')
                  }
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