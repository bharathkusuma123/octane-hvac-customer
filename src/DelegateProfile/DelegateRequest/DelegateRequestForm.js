// import React, { useContext, useState, useEffect } from 'react';
// import { AuthContext } from "../../Components/AuthContext/AuthContext";
// import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
// import './DelegateRequestForm.css';
// import { useNavigate } from 'react-router-dom';
// import baseURL from '../../Components/ApiUrl/Apiurl';
// import { useDelegateServiceItems } from '../../Components/AuthContext/DelegateServiceItemContext';

// const DelegateRequestForm = () => {
//   const { user } = useContext(AuthContext);
//   const [delegateId, setDelegateId] = useState('');
//   const [company, setCompany] = useState('');
//   const [customer, setCustomer] = useState('');
//   const navigate = useNavigate();
//   const { selectedServiceItem, serviceItems } = useDelegateServiceItems();

//   const [formData, setFormData] = useState({
//     serviceItem: selectedServiceItem || '', // Set initial value from context
//     preferredDate: '',
//     preferredTime: '',
//     description: ''
//   });

//   // Update formData when selectedServiceItem changes
//   useEffect(() => {
//     if (selectedServiceItem) {
//       setFormData(prev => ({
//         ...prev,
//         serviceItem: selectedServiceItem
//       }));
//     }
//   }, [selectedServiceItem]);

//   useEffect(() => {
//     if (user?.delegate_id) {
//       setDelegateId(user.delegate_id);

//       // Fetch delegate details
//       fetch(`${baseURL}/delegates/`)
//         .then((res) => res.json())
//         .then((data) => {
//           const match = data?.data?.find(d => d.delegate_id === user.delegate_id);
//           if (match) {
//             setCompany(match.company || '');
//             setCustomer(match.customer || '');
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching delegate data:", err);
//         });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if service item is selected
//     if (!selectedServiceItem) {
//       alert("Please select a Service Item from the navbar dropdown first.");
//       return;
//     }

//     // Format preferred_time to "HH:mm:ss"
//     const preferredTimeFormatted = `${formData.preferredTime}:00`;

//     // Get current date and time for other datetime fields
//     const now = new Date().toISOString();

//     const payload = {
//       dynamics_service_order_no: "",
//       source_type: "Machine Alert",
//       request_details: formData.description,
//       alert_details: "",
//       requested_by: delegateId,
//       preferred_date: formData.preferredDate,
//       preferred_time: preferredTimeFormatted,
//       status: "Open",
//       estimated_completion_time: null,
//       estimated_price: "0",
//       est_start_datetime: now,
//       est_end_datetime: now,
//       act_start_datetime: now,
//       act_end_datetime: now,
//       act_material_cost: "0",
//       act_labour_hours: "0",
//       act_labour_cost: "0",
//       completion_notes: "",
//       created_by: delegateId,
//       updated_by: delegateId,
//       company: company,
//       service_item: formData.serviceItem, // This will be the selectedServiceItem
//       customer: customer,
//       pm_group: "",
//       assigned_engineer: "",
//       reopened_from: "",
//       user_id: customer,
//       company_id: company
//     };
//     console.log("payload", payload);

//     try {
//       const response = await fetch(`${baseURL}/service-pools/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (response.ok) {
//         alert("Service request submitted successfully!");
//         setFormData({
//           serviceItem: selectedServiceItem, // Keep the selected service item
//           preferredDate: '',
//           preferredTime: '',
//           description: ''
//         });
//       } else {
//         console.error("Failed response:", result);
//         alert("Submission failed: " + (result.message || "Please check the input."));
//       }
//       navigate('/delegate-display-request');

//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("Something went wrong while submitting the form.");
//     }
//   };

//   // Get service item name for display
//   const getServiceItemName = () => {
//     if (!selectedServiceItem) return 'Not Selected';
//     const item = serviceItems.find(item => item.service_item === selectedServiceItem);
//     return item ? item.service_item_name || selectedServiceItem : selectedServiceItem;
//   };

//   return (
//     <div className="form-container">
//       <DelegateNavbar />
//       <h3>Delegate Request Form</h3>

//       {/* Display selected service item information */}
//       <div className="service-item-info">
//         {!selectedServiceItem && (
//           <p className="warning-text">
//             ⚠️ Please select a Service Item from the navbar dropdown first.
//           </p>
//         )}
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Service Item Display (non-editable) */}
//         <label htmlFor="serviceItemDisplay">Service Item</label>
//         <input
//           type="text"
//           id="serviceItemDisplay"
//           value={getServiceItemName()}
//           disabled
//           className="disabled-field"
//           placeholder="Select a service item from navbar"
//         />

//         {/* Hidden field to store the actual service_item value */}
//         <input
//           type="hidden"
//           name="serviceItem"
//           value={selectedServiceItem}
//         />

//         <label htmlFor="preferredDate">Preferred Date</label>
//         <input
//           type="date"
//           name="preferredDate"
//           id="preferredDate"
//           value={formData.preferredDate}
//           onChange={handleChange}
//           required
//           disabled={!selectedServiceItem}
//         />

//         <label htmlFor="preferredTime">Preferred Time</label>
//         <input
//           type="time"
//           name="preferredTime"
//           id="preferredTime"
//           value={formData.preferredTime}
//           onChange={handleChange}
//           required
//           disabled={!selectedServiceItem}
//         />

//         <label htmlFor="description">Description</label>
//         <textarea
//           name="description"
//           id="description"
//           value={formData.description}
//           onChange={handleChange}
//           rows={4}
//           required
//           disabled={!selectedServiceItem}
//           placeholder={!selectedServiceItem ? "Please select a service item first" : ""}
//         />

//         <div className="button-group">
//           <button 
//             type="submit" 
//             disabled={!selectedServiceItem}
//             className={!selectedServiceItem ? 'disabled-button' : ''}
//           >
//             {!selectedServiceItem ? 'Select Service Item First' : 'Submit Request'}
//           </button>
//           {/* <button 
//             type="button"
//             onClick={() => navigate(-1)}
//             className="back-button"
//           >
//             Back
//           </button> */}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DelegateRequestForm;



// import React, { useContext, useState, useEffect } from 'react';
// import { AuthContext } from "../../Components/AuthContext/AuthContext";
// import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
// import './DelegateRequestForm.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import baseURL from '../../Components/ApiUrl/Apiurl';
// import { useDelegateServiceItems } from '../../Components/AuthContext/DelegateServiceItemContext';
// import Swal from 'sweetalert2';

// const DelegateRequestForm = () => {
//   const { user } = useContext(AuthContext);
//   const [delegateId, setDelegateId] = useState('');
//   const [company, setCompany] = useState('');
//   const [customer, setCustomer] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { selectedServiceItem, serviceItems } = useDelegateServiceItems();

//   // Check if we're in edit mode
//   const isEditMode = location.state?.editMode || false;
//   const existingRequest = location.state?.requestData || null;

//   const [formData, setFormData] = useState({
//     serviceItem: selectedServiceItem || '',
//     preferredDate: '',
//     preferredTime: '',
//     description: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Update formData when selectedServiceItem changes (only for create mode)
//   useEffect(() => {
//     if (selectedServiceItem && !isEditMode) {
//       setFormData(prev => ({
//         ...prev,
//         serviceItem: selectedServiceItem
//       }));
//     }
//   }, [selectedServiceItem, isEditMode]);

//   // Initialize form with existing data if in edit mode
//   useEffect(() => {
//     if (isEditMode && existingRequest) {
//       console.log('Editing request:', existingRequest);
//       setFormData({
//         serviceItem: existingRequest.service_item || '',
//         preferredDate: existingRequest.preferred_date || '',
//         preferredTime: existingRequest.preferred_time ? existingRequest.preferred_time.slice(0, 5) : '',
//         description: existingRequest.request_details || ''
//       });
      
//       // Set company and customer from existing request if available
//       if (existingRequest.company) setCompany(existingRequest.company);
//       if (existingRequest.customer) setCustomer(existingRequest.customer);
//     }
//   }, [isEditMode, existingRequest]);

//   useEffect(() => {
//     if (user?.delegate_id) {
//       setDelegateId(user.delegate_id);

//       // Fetch delegate details only if not in edit mode or if we need company/customer
//       if (!isEditMode || !company || !customer) {
//         fetch(`${baseURL}/delegates/`)
//           .then((res) => res.json())
//           .then((data) => {
//             const match = data?.data?.find(d => d.delegate_id === user.delegate_id);
//             if (match) {
//               setCompany(match.company || '');
//               setCustomer(match.customer || '');
//             }
//           })
//           .catch((err) => {
//             console.error("Error fetching delegate data:", err);
//           });
//       }
//     }
//   }, [user, isEditMode, company, customer]);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Check if service item is selected (only for create mode)
//     if (!isEditMode && !selectedServiceItem) {
//       await Swal.fire({
//         icon: 'warning',
//         title: 'Service Item Required',
//         text: "Please select a Service Item from the navbar dropdown first.",
//         confirmButtonColor: '#f8bb86',
//       });
//       setIsSubmitting(false);
//       return;
//     }

//     // Format preferred_time to "HH:mm:ss"
//     const preferredTimeFormatted = `${formData.preferredTime}:00`;

//     // Get current date and time for other datetime fields
//     const now = new Date().toISOString();

//     const payload = {
//       dynamics_service_order_no: isEditMode ? existingRequest.dynamics_service_order_no : "",
//       source_type: "Machine Alert",
//       request_details: formData.description,
//       alert_details: "",
//       requested_by: delegateId,
//       preferred_date: formData.preferredDate,
//       preferred_time: preferredTimeFormatted,
//       status: isEditMode ? existingRequest.status : "Open", // Keep existing status in edit mode
//       estimated_completion_time: null,
//       estimated_price: isEditMode ? existingRequest.estimated_price : "0",
//       est_start_datetime: now,
//       est_end_datetime: now,
//       act_start_datetime: isEditMode ? existingRequest.act_start_datetime : now,
//       act_end_datetime: isEditMode ? existingRequest.act_end_datetime : now,
//       act_material_cost: isEditMode ? existingRequest.act_material_cost : "0",
//       act_labour_hours: isEditMode ? existingRequest.act_labour_hours : "0",
//       act_labour_cost: isEditMode ? existingRequest.act_labour_cost : "0",
//       completion_notes: isEditMode ? existingRequest.completion_notes : "",
//       created_by: isEditMode ? existingRequest.created_by : delegateId,
//       updated_by: delegateId,
//       company: company,
//       service_item: formData.serviceItem,
//       customer: customer,
//       pm_group: isEditMode ? existingRequest.pm_group : "",
//       assigned_engineer: isEditMode ? existingRequest.assigned_engineer : "",
//       reopened_from: isEditMode ? existingRequest.reopened_from : "",
//       user_id: customer,
//       company_id: company
//     };

//     // For edit mode, we need to include the request_id
//     if (isEditMode) {
//       payload.request_id = existingRequest.request_id;
//     } else {
//       payload.request_id = Math.floor(Math.random() * 1000000).toString();
//     }

//     console.log("payload", payload);

//     try {
//       const url = isEditMode 
//         ? `${baseURL}/service-pools/${existingRequest.request_id}/` 
//         : `${baseURL}/service-pools/`;
      
//       const method = isEditMode ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (response.ok) {
//         await Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: `Service request ${isEditMode ? 'updated' : 'submitted'} successfully!`,
//           confirmButtonColor: '#3085d6',
//         });
        
//         // Reset form only for create mode
//         if (!isEditMode) {
//           setFormData({
//             serviceItem: selectedServiceItem,
//             preferredDate: '',
//             preferredTime: '',
//             description: ''
//           });
//         }
        
//         navigate('/delegate-display-request');
//       } else {
//         console.error("Failed response:", result);
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: `Submission failed: ${result.message || "Please check the input."}`,
//           confirmButtonColor: '#d33',
//         });
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: "Something went wrong while submitting the form.",
//         confirmButtonColor: '#d33',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/delegate-display-request');
//   };

//   // Get service item name for display
//   const getServiceItemName = () => {
//     if (isEditMode) {
//       const item = serviceItems.find(item => item.service_item === formData.serviceItem);
//       return item ? item.service_item_name || formData.serviceItem : formData.serviceItem;
//     }
    
//     if (!selectedServiceItem) return 'Not Selected';
//     const item = serviceItems.find(item => item.service_item === selectedServiceItem);
//     return item ? item.service_item_name || selectedServiceItem : selectedServiceItem;
//   };

//   // Determine if form should be disabled
//   const isFormDisabled = !isEditMode && !selectedServiceItem;

//   return (
//     <div className="form-container">
//       <DelegateNavbar />
//       <h3>{isEditMode ? 'Edit Service Request' : 'Delegate Request Form'}</h3>

//       {/* Display selected service item information */}
//       <div className="service-item-info">
//         {!isEditMode && !selectedServiceItem && (
//           <p className="warning-text">
//             ⚠️ Please select a Service Item from the navbar dropdown first.
//           </p>
//         )}
//         {isEditMode && (
//           <p className="info-text">
//             📝 Editing Request ID: <strong>{existingRequest?.request_id}</strong>
//           </p>
//         )}
//       </div>

//       <form onSubmit={handleSubmit}>
//         {/* Service Item Display */}
//         <label htmlFor="serviceItemDisplay">Service Item</label>
//         <input
//           type="text"
//           id="serviceItemDisplay"
//           value={getServiceItemName()}
//           disabled
//           className="disabled-field"
//           placeholder={isEditMode ? "Service Item (cannot be changed)" : "Select a service item from navbar"}
//         />

//         {/* Hidden field to store the actual service_item value */}
//         <input
//           type="hidden"
//           name="serviceItem"
//           value={isEditMode ? formData.serviceItem : selectedServiceItem}
//         />

//         <label htmlFor="preferredDate">Preferred Date</label>
//         <input
//           type="date"
//           name="preferredDate"
//           id="preferredDate"
//           value={formData.preferredDate}
//           onChange={handleChange}
//           required
//           disabled={isFormDisabled}
//         />

//         <label htmlFor="preferredTime">Preferred Time</label>
//         <input
//           type="time"
//           name="preferredTime"
//           id="preferredTime"
//           value={formData.preferredTime}
//           onChange={handleChange}
//           required
//           disabled={isFormDisabled}
//         />

//         <label htmlFor="description">Description</label>
//         <textarea
//           name="description"
//           id="description"
//           value={formData.description}
//           onChange={handleChange}
//           rows={4}
//           required
//           disabled={isFormDisabled}
//           placeholder={isFormDisabled ? "Please select a service item first" : "Enter request details"}
//         />

//         <div className="button-group">
//           <button 
//             type="button"
//             onClick={handleCancel}
//             className="btn-cancel"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//             disabled={isFormDisabled || isSubmitting}
//             className={isFormDisabled ? 'disabled-button' : 'btn-submit'}
//           >
//             {isSubmitting 
//               ? (isEditMode ? 'Updating...' : 'Submitting...') 
//               : (isEditMode ? 'Update Request' : 'Submit Request')
//             }
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DelegateRequestForm;


import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import './DelegateRequestForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import baseURL from '../../Components/ApiUrl/Apiurl';
import { useDelegateServiceItems } from '../../Components/AuthContext/DelegateServiceItemContext';
import Swal from 'sweetalert2';
import axios from 'axios';
const DelegateRequestForm = () => {
  const { user } = useContext(AuthContext);
  const [delegateId, setDelegateId] = useState('');
  const [company, setCompany] = useState('');
  const [customer, setCustomer] = useState('');
  const [serviceItemsList, setServiceItemsList] = useState([]); // NEW: Store service items from API
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedServiceItem, serviceItems } = useDelegateServiceItems();

  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const existingRequest = location.state?.requestData || null;

  const [formData, setFormData] = useState({
    serviceItem: selectedServiceItem || '',
    preferredDate: '',
    preferredTime: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: Fetch service items from API to get service_item_name
  useEffect(() => {
    if (user?.company_id && user?.delegate_id) {
      axios.get(`${baseURL}/service-items/?user_id=${user.delegate_id}&company_id=${user.company_id}`)
        .then((response) => {
          try {
            const data = Array.isArray(response.data) ? response.data : 
                        (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);
            setServiceItemsList(data);
          } catch (error) {
            console.error('Error processing service items data:', error);
            setServiceItemsList([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching service items:', error);
          setServiceItemsList([]);
        });
    }
  }, [user?.company_id, user?.delegate_id]);

  // Update formData when selectedServiceItem changes (only for create mode)
  useEffect(() => {
    if (selectedServiceItem && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        serviceItem: selectedServiceItem
      }));
    }
  }, [selectedServiceItem, isEditMode]);

  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode && existingRequest) {
      console.log('Editing request:', existingRequest);
      setFormData({
        serviceItem: existingRequest.service_item || '',
        preferredDate: existingRequest.preferred_date || '',
        preferredTime: existingRequest.preferred_time ? existingRequest.preferred_time.slice(0, 5) : '',
        description: existingRequest.request_details || ''
      });
      
      // Set company and customer from existing request if available
      if (existingRequest.company) setCompany(existingRequest.company);
      if (existingRequest.customer) setCustomer(existingRequest.customer);
    }
  }, [isEditMode, existingRequest]);

  useEffect(() => {
    if (user?.delegate_id) {
      setDelegateId(user.delegate_id);

      // Fetch delegate details only if not in edit mode or if we need company/customer
      if (!isEditMode || !company || !customer) {
        fetch(`${baseURL}/delegates/`)
          .then((res) => res.json())
          .then((data) => {
            const match = data?.data?.find(d => d.delegate_id === user.delegate_id);
            if (match) {
              setCompany(match.company || '');
              setCustomer(match.customer || '');
            }
          })
          .catch((err) => {
            console.error("Error fetching delegate data:", err);
          });
      }
    }
  }, [user, isEditMode, company, customer]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // UPDATED: Get service item name from service_item ID by matching with serviceItemsList
  const getServiceItemName = (serviceItemId) => {
    if (!serviceItemId) return 'Not Selected';
    
    // First check in the serviceItemsList from API
    const itemFromApi = serviceItemsList.find(item => item.service_item_id === serviceItemId);
    if (itemFromApi) {
      return itemFromApi.service_item_name || serviceItemId;
    }
    
    // Fallback to context service items
    const itemFromContext = serviceItems.find(item => item.service_item === serviceItemId);
    return itemFromContext ? itemFromContext.service_item_name || serviceItemId : serviceItemId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if service item is selected (only for create mode)
    if (!isEditMode && !selectedServiceItem) {
      await Swal.fire({
        icon: 'warning',
        title: 'Service Item Required',
        text: "Please select a Service Item from the navbar dropdown first.",
        confirmButtonColor: '#f8bb86',
      });
      setIsSubmitting(false);
      return;
    }

    // Format preferred_time to "HH:mm:ss"
    const preferredTimeFormatted = `${formData.preferredTime}:00`;

    // Get current date and time for other datetime fields
    const now = new Date().toISOString();

    const payload = {
      dynamics_service_order_no: isEditMode ? existingRequest.dynamics_service_order_no : "",
      source_type: "Machine Alert",
      request_details: formData.description,
      alert_details: "",
      requested_by: delegateId,
      preferred_date: formData.preferredDate,
      preferred_time: preferredTimeFormatted,
      status: isEditMode ? existingRequest.status : "Open", // Keep existing status in edit mode
      estimated_completion_time: null,
      estimated_price: isEditMode ? existingRequest.estimated_price : "0",
      est_start_datetime: now,
      est_end_datetime: now,
      act_start_datetime: isEditMode ? existingRequest.act_start_datetime : now,
      act_end_datetime: isEditMode ? existingRequest.act_end_datetime : now,
      act_material_cost: isEditMode ? existingRequest.act_material_cost : "0",
      act_labour_hours: isEditMode ? existingRequest.act_labour_hours : "0",
      act_labour_cost: isEditMode ? existingRequest.act_labour_cost : "0",
      completion_notes: isEditMode ? existingRequest.completion_notes : "",
      created_by: isEditMode ? existingRequest.created_by : delegateId,
      updated_by: delegateId,
      company: company,
      service_item: formData.serviceItem,
      customer: customer,
      pm_group: isEditMode ? existingRequest.pm_group : "",
      assigned_engineer: isEditMode ? existingRequest.assigned_engineer : "",
      reopened_from: isEditMode ? existingRequest.reopened_from : "",
      user_id: customer,
      company_id: company
    };

    // For edit mode, we need to include the request_id
    if (isEditMode) {
      payload.request_id = existingRequest.request_id;
    } else {
      payload.request_id = Math.floor(Math.random() * 1000000).toString();
    }

    console.log("payload", payload);

    try {
      const url = isEditMode 
        ? `${baseURL}/service-pools/${existingRequest.request_id}/` 
        : `${baseURL}/service-pools/`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Service request ${isEditMode ? 'updated' : 'submitted'} successfully!`,
          confirmButtonColor: '#3085d6',
        });
        
        // Reset form only for create mode
        if (!isEditMode) {
          setFormData({
            serviceItem: selectedServiceItem,
            preferredDate: '',
            preferredTime: '',
            description: ''
          });
        }
        
        navigate('/delegate-display-request');
      } else {
        console.error("Failed response:", result);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Submission failed: ${result.message || "Please check the input."}`,
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Something went wrong while submitting the form.",
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/delegate-display-request');
  };

  // Determine if form should be disabled
  const isFormDisabled = !isEditMode && !selectedServiceItem;

  return (
    <div className="form-container">
      <DelegateNavbar />
      <h3>{isEditMode ? 'Edit Service Request' : 'Delegate Request Form'}</h3>

      {/* Display selected service item information */}
      <div className="service-item-info">
        {!isEditMode && !selectedServiceItem && (
          <p className="warning-text">
            ⚠️ Please select a Service Item from the navbar dropdown first.
          </p>
        )}
        {isEditMode && (
          <p className="info-text">
            📝 Editing Request ID: <strong>{existingRequest?.request_id}</strong>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Service Item Display */}
        <label htmlFor="serviceItemDisplay">Service Item</label>
        <input
          type="text"
          id="serviceItemDisplay"
          value={getServiceItemName(isEditMode ? formData.serviceItem : selectedServiceItem)}
          disabled
          className="disabled-field"
          placeholder={isEditMode ? "Service Item (cannot be changed)" : "Select a service item from navbar"}
        />

        {/* Hidden field to store the actual service_item value */}
        <input
          type="hidden"
          name="serviceItem"
          value={isEditMode ? formData.serviceItem : selectedServiceItem}
        />

        <label htmlFor="preferredDate">Preferred Date</label>
        <input
          type="date"
          name="preferredDate"
          id="preferredDate"
          value={formData.preferredDate}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />

        <label htmlFor="preferredTime">Preferred Time</label>
        <input
          type="time"
          name="preferredTime"
          id="preferredTime"
          value={formData.preferredTime}
          onChange={handleChange}
          required
          disabled={isFormDisabled}
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          disabled={isFormDisabled}
          placeholder={isFormDisabled ? "Please select a service item first" : "Enter request details"}
        />

        <div className="button-group">
          <button 
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isFormDisabled || isSubmitting}
            className={isFormDisabled ? 'disabled-button' : 'btn-submit'}
          >
            {isSubmitting 
              ? (isEditMode ? 'Updating...' : 'Submitting...') 
              : (isEditMode ? 'Update Request' : 'Submit Request')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default DelegateRequestForm;