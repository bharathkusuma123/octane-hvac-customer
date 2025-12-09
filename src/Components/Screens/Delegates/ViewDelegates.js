// import React, { useEffect, useState, useContext } from 'react';
// import NavScreen from '../../../Components/Screens/Navbar/Navbar';
// import { FaUserPlus } from 'react-icons/fa';
// import { AuthContext } from "../../AuthContext/AuthContext";
// import { useNavigate } from 'react-router-dom';
// import './ViewDelegate.css';
// import baseURL from '../../ApiUrl/Apiurl';

// const AddDelegates = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.customer_id;
//   const navigate = useNavigate();

//   const [delegates, setDelegates] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchDelegates = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${baseURL}/delegates/?customer=${userId}`);
//       if (response.ok) {
//         const data = await response.json();
//         const filtered = (data.data || [])
//           .filter((d) => d.customer === userId)
//           .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));
//         setDelegates(filtered);
//       } else {
//         console.error('Failed to fetch delegates');
//       }
//     } catch (error) {
//       console.error('Error fetching delegates:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDelegates();
//   }, [userId]);

//   const handleAddDelegate = () => navigate('/add-delegates');
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };
//   const handleRowsPerPageChange = (e) => {
//     setRowsPerPage(parseInt(e.target.value));
//     setCurrentPage(1);
//   };

//   // Function to handle status change
//   const handleStatusChange = async (delegateId, newStatus) => {
//     try {
//       // First API call: Update delegate status
//       const putResponse = await fetch(`${baseURL}/delegates/${delegateId}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           status: newStatus
//         })
//       });

//       if (putResponse.ok) {
//         // Second API call: Create delegate history entry
//         const postResponse = await fetch(`${baseURL}/delegate-history/`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             action: newStatus,
//             delegate: delegateId
//           })
//         });

//         if (postResponse.ok) {
//           // Refresh the delegates list to show updated status
//           fetchDelegates();
//           alert(`Delegate status updated to ${newStatus} successfully!`);
//         } else {
//           console.error('Failed to create delegate history');
//           alert('Failed to create delegate history record');
//         }
//       } else {
//         console.error('Failed to update delegate status');
//         alert('Failed to update delegate status');
//       }
//     } catch (error) {
//       console.error('Error updating delegate status:', error);
//       alert('Error updating delegate status');
//     }
//   };

//   const filteredDelegates = delegates.filter((d) =>
//     Object.values(d).some((val) =>
//       val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const totalPages = Math.ceil(filteredDelegates.length / rowsPerPage);
//   const paginatedData = filteredDelegates.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div className="delegate-card-container">
//       <div className="delegate-card-header">
//         <h2 className="delegate-card-title">My Delegates</h2>
//         <button onClick={handleAddDelegate} className="delegate-card-add-btn">
//           <FaUserPlus className="delegate-card-add-icon" /> Add Delegate
//         </button>
//       </div>

//       <div className="delegate-card-search-container">
//         <input
//           type="text"
//           placeholder="Search delegates..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className="delegate-card-search-input"
//         />
//       </div>

//       <div className="delegate-card-grid">
//         {isLoading ? (
//           <div className="delegate-card-loading-message">Loading delegates...</div>
//         ) : paginatedData.length > 0 ? (
//           paginatedData.map((delegate, index) => (
//             <div key={delegate.delegate_id} className="delegate-card-item">
//               <div className="delegate-card-header-section">
//                 <span className="delegate-card-serial">
//                   {(currentPage - 1) * rowsPerPage + index + 1}
//                 </span>
//                 <span 
//                   className="delegate-card-id"
//                   onClick={() => navigate(`/delegate-service-items/${delegate.delegate_id}`)}
//                 >
//                   ID: {delegate.delegate_id}
//                 </span>
//               </div>
              
//               <div className="delegate-card-body-section">
//                 <div className="delegate-card-field">
//                   <span className="delegate-card-label">Name:</span>
//                   <span className="delegate-card-value">{delegate.delegate_name}</span>
//                 </div>
                
//                 <div className="delegate-card-field">
//                   <span className="delegate-card-label">Mobile:</span>
//                   <span className="delegate-card-value">{delegate.delegate_mobile}</span>
//                 </div>
                
//                 <div className="delegate-card-field">
//                   <span className="delegate-card-label">Status:</span>
//                   <span className={`delegate-card-status delegate-card-status-${delegate.status.toLowerCase()}`}>
//                     {delegate.status}
//                   </span>
//                 </div>
                
//                 <div className="delegate-card-field">
//                   <span className="delegate-card-label">Registered:</span>
//                   <span className="delegate-card-value">
//                     {new Date(delegate.registered_at).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
              
//               {/* Replace Recall button with status dropdown */}
//               <div className="delegate-card-footer">
//                 <select 
//                   value={delegate.status}
//                   onChange={(e) => handleStatusChange(delegate.delegate_id, e.target.value)}
//                   className="delegate-card-status-dropdown"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Recalled">Recalled</option>
//                 </select>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="delegate-card-empty-message">
//             {searchTerm ? 'No matching delegates found.' : 'No delegates found for your account.'}
//           </div>
//         )}
//       </div>

//       <NavScreen />
//     </div>
//   );
// };

// export default AddDelegates;

//==========================================================================

// After fixing filter -Global search issue 




import React, { useEffect, useState, useContext, useMemo } from 'react';
import NavScreen from '../../../Components/Screens/Navbar/Navbar';
import { FaUserPlus } from 'react-icons/fa';
import { AuthContext } from "../../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import './ViewDelegate.css';
import baseURL from '../../ApiUrl/Apiurl';

const AddDelegates = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.customer_id;
  const navigate = useNavigate();

  const [delegates, setDelegates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Additional data for global search
  const [customersData, setCustomersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [delegateHistoryData, setDelegateHistoryData] = useState([]);
  const [serviceItemsData, setServiceItemsData] = useState([]);

  // Fetch additional data for global search
  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        // Fetch users data
        const usersRes = await fetch(`${baseURL}/users/`);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData)) {
            setUsersData(usersData);
          }
        }

        // Fetch customers data
        const customersRes = await fetch(`${baseURL}/customers/`);
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          if (customersData.status === "success") {
            setCustomersData(customersData.data || []);
          }
        }

        // Fetch delegate history data
        const historyRes = await fetch(`${baseURL}/delegate-history/`);
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData.status === "success") {
            setDelegateHistoryData(historyData.data || []);
          }
        }

        // Fetch service items data
        const serviceItemsRes = await fetch(`${baseURL}/service-items/?customer=${userId}`);
        if (serviceItemsRes.ok) {
          const serviceItemsData = await serviceItemsRes.json();
          if (serviceItemsData.status === "success") {
            setServiceItemsData(serviceItemsData.data || []);
          }
        }

      } catch (error) {
        console.error("Error fetching data for global search:", error);
      }
    };

    fetchAdditionalData();
  }, [userId]);

  // Function to get username from user ID
  const getUsernameById = (userId) => {
    if (!userId || usersData.length === 0) return userId;
    
    const user = usersData.find(user => user.user_id === userId);
    return user ? user.username : userId;
  };

  // Function to get user search data (both ID and username)
  const getUserSearchData = (userId) => {
    if (!userId) return '';
    const user = usersData.find(user => user.user_id === userId);
    return user ? `${userId} ${user.username} ${user.email || ''}` : userId;
  };

  // Function to get customer name by customer ID
  const getCustomerName = (customerId) => {
    if (!customerId || customersData.length === 0) return customerId;
    
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer ? `${customer.full_name} (${customer.username})` : customerId;
  };

  // Function to get customer search data
  const getCustomerSearchData = (customerId) => {
    if (!customerId) return '';
    const customer = customersData.find(cust => cust.customer_id === customerId);
    return customer ? `${customerId} ${customer.username} ${customer.full_name} ${customer.email}` : customerId;
  };

  // Function to get service items assigned to delegate
  const getDelegateServiceItems = (delegateId) => {
    if (!delegateId || serviceItemsData.length === 0) return [];
    
    return serviceItemsData.filter(item => 
      item.delegate_id === delegateId || item.delegate === delegateId
    );
  };

  // Function to get delegate history data
  const getDelegateHistory = (delegateId) => {
    if (!delegateId || delegateHistoryData.length === 0) return [];
    
    return delegateHistoryData.filter(history => 
      history.delegate === delegateId
    );
  };

  // Function to format date as dd/mm/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to format date-time for detailed timestamps
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to format date in multiple formats for search
  const formatDateForSearch = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('en-IN', { month: 'long' });
    const monthShort = date.toLocaleString('en-IN', { month: 'short' });
    
    return [
      `${day}/${month}/${year}`,                    // DD/MM/YYYY
      `${month}/${day}/${year}`,                    // MM/DD/YYYY
      `${year}-${month}-${day}`,                    // YYYY-MM-DD
      `${year}${month}${day}`,                      // YYYYMMDD
      `${day}-${month}-${year}`,                    // DD-MM-YYYY
      monthName,                                    // January, February
      monthShort,                                   // Jan, Feb
      `${year}`,                                    // 2024
      `${month}/${year}`,                           // MM/YYYY
      `${day} ${monthName} ${year}`,               // 15 January 2024
      `${day} ${monthShort} ${year}`,              // 15 Jan 2024
    ].join(' ');
  };

  const fetchDelegates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/delegates/?customer=${userId}`);
      if (response.ok) {
        const data = await response.json();
        const filtered = (data.data || [])
          .filter((d) => d.customer === userId)
          .sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at));
        setDelegates(filtered);
      } else {
        console.error('Failed to fetch delegates');
      }
    } catch (error) {
      console.error('Error fetching delegates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, [userId]);

  // Enhanced global search functionality
  const enhancedFilteredDelegates = useMemo(() => {
    if (!searchTerm.trim()) {
      return delegates;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return delegates.filter((delegate) => {
      // Get user data for search
      const createdBySearch = getUserSearchData(delegate.created_by);
      const updatedBySearch = getUserSearchData(delegate.updated_by);
      
      // Get other relational data for search
      const customerSearch = getCustomerSearchData(delegate.customer);
      
      // Get service items for this delegate
      const delegateServiceItems = getDelegateServiceItems(delegate.delegate_id);
      const serviceItemsText = delegateServiceItems.map(item => 
        `${item.service_item_id} ${item.service_item_name || ''} ${item.serial_number || ''}`
      ).join(' ');
      
      // Get history for this delegate
      const delegateHistory = getDelegateHistory(delegate.delegate_id);
      const historyText = delegateHistory.map(history => 
        `${history.action} ${history.created_at}`
      ).join(' ');
      
      // Get dates in multiple formats for search
      const registeredDateFormats = formatDateForSearch(delegate.registered_at);
      const createdDateFormats = formatDateForSearch(delegate.created_at);
      const updatedDateFormats = formatDateForSearch(delegate.updated_at);
      
      // Create a comprehensive search string
      const searchableText = [
        // Raw delegate data
        delegate.delegate_id || '',
        delegate.delegate_name || '',
        delegate.delegate_mobile || '',
        delegate.delegate_email || '',
        delegate.address || '',
        delegate.city || '',
        delegate.state || '',
        delegate.country || '',
        delegate.zip_code || '',
        delegate.status || '',
        delegate.customer || '',
        delegate.created_by || '',
        delegate.updated_by || '',
        delegate.registered_at || '',
        delegate.created_at || '',
        delegate.updated_at || '',
        delegate.delegate_type || '',
        delegate.department || '',
        delegate.designation || '',
        delegate.notes || '',
        delegate.permissions || '',
        
        // Formatted relational data
        createdBySearch,
        updatedBySearch,
        customerSearch,
        
        // Service items data
        serviceItemsText,
        
        // History data
        historyText,
        
        // Dates in multiple formats
        registeredDateFormats,
        createdDateFormats,
        updatedDateFormats,
        
        // Display values (exactly as shown in cards)
        formatDateTime(delegate.registered_at),
        formatDateTime(delegate.created_at),
        formatDateTime(delegate.updated_at),
        getUsernameById(delegate.created_by),
        getUsernameById(delegate.updated_by),
        getCustomerName(delegate.customer),
        
        // Status variations for search
        delegate.status === 'Active' ? 'active working enabled approved' : '',
        delegate.status === 'Recalled' ? 'recalled revoked disabled removed cancelled' : '',
        delegate.status === 'Pending' ? 'pending waiting approval queued' : '',
        delegate.status === 'Suspended' ? 'suspended blocked banned temporary' : '',
        delegate.status === 'Expired' ? 'expired ended terminated' : '',
        
        // Delegate type variations
        delegate.delegate_type === 'Primary' ? 'primary main chief lead' : '',
        delegate.delegate_type === 'Secondary' ? 'secondary backup alternate assistant' : '',
        delegate.delegate_type === 'Temporary' ? 'temporary interim provisional' : '',
        delegate.delegate_type === 'Permanent' ? 'permanent permanent regular full-time' : '',
        
        // Department variations
        delegate.department === 'Operations' ? 'operations ops management' : '',
        delegate.department === 'Maintenance' ? 'maintenance service repair' : '',
        delegate.department === 'Administration' ? 'administration admin office' : '',
        delegate.department === 'Technical' ? 'technical tech engineering' : '',
        delegate.department === 'Customer Service' ? 'customer service support help' : '',
        
        // Designation variations
        delegate.designation === 'Manager' ? 'manager supervisor lead head' : '',
        delegate.designation === 'Engineer' ? 'engineer technician mechanic' : '',
        delegate.designation === 'Coordinator' ? 'coordinator organizer planner' : '',
        delegate.designation === 'Representative' ? 'representative agent associate' : '',
        
        // Phone number variations
        delegate.delegate_mobile ? `phone mobile contact number ${delegate.delegate_mobile}` : '',
        delegate.delegate_mobile ? delegate.delegate_mobile.replace(/\D/g, '') : '',
        
        // Email variations
        delegate.delegate_email ? `email mail contact ${delegate.delegate_email}` : '',
        
        // Address variations
        delegate.address ? `address location place ${delegate.address}` : '',
        delegate.city ? `city town ${delegate.city}` : '',
        delegate.state ? `state province region ${delegate.state}` : '',
        delegate.country ? `country nation ${delegate.country}` : '',
        delegate.zip_code ? `zip postal code pincode ${delegate.zip_code}` : '',
        
        // Permission variations
        delegate.permissions === 'Full Access' ? 'full access all permissions admin' : '',
        delegate.permissions === 'Limited Access' ? 'limited access restricted basic' : '',
        delegate.permissions === 'View Only' ? 'view only read only no-edit' : '',
        
        // Notes variations
        delegate.notes ? `notes comments remarks ${delegate.notes}` : '',
        
        // Add any other properties that might exist
        ...Object.values(delegate).filter(val => 
          val !== null && val !== undefined
        ).map(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return String(val);
          }
          if (typeof val === 'boolean') {
            return val ? 'true yes active' : 'false no inactive';
          }
          if (Array.isArray(val)) {
            return val.join(' ');
          }
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val);
          }
          return '';
        })
      ]
      .join(' ')                    // Combine into one string
      .toLowerCase()                // Make case-insensitive
      .replace(/\s+/g, ' ')         // Normalize spaces
      .trim();
      
      return searchableText.includes(searchLower);
    });
  }, [searchTerm, delegates, usersData, customersData, delegateHistoryData, serviceItemsData, userId]);

  const handleAddDelegate = () => navigate('/add-delegates');
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Function to handle status change
  const handleStatusChange = async (delegateId, newStatus) => {
    try {
      // First API call: Update delegate status
      const putResponse = await fetch(`${baseURL}/delegates/${delegateId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (putResponse.ok) {
        // Second API call: Create delegate history entry
        const postResponse = await fetch(`${baseURL}/delegate-history/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: newStatus,
            delegate: delegateId
          })
        });

        if (postResponse.ok) {
          // Refresh the delegates list to show updated status
          fetchDelegates();
          alert(`Delegate status updated to ${newStatus} successfully!`);
        } else {
          console.error('Failed to create delegate history');
          alert('Failed to create delegate history record');
        }
      } else {
        console.error('Failed to update delegate status');
        alert('Failed to update delegate status');
      }
    } catch (error) {
      console.error('Error updating delegate status:', error);
      alert('Error updating delegate status');
    }
  };

  const totalPages = Math.ceil(enhancedFilteredDelegates.length / rowsPerPage);
  const paginatedData = enhancedFilteredDelegates.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="delegate-card-container">
      <div className="delegate-card-header">
        <h2 className="delegate-card-title">My Delegates</h2>
        <button onClick={handleAddDelegate} className="delegate-card-add-btn">
          <FaUserPlus className="delegate-card-add-icon" /> Add Delegate
        </button>
      </div>

      <div className="delegate-card-search-container">
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="delegate-card-search-input"
          />
          {searchTerm && (
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="alert alert-info mb-3 py-2">
          <strong>Search Results:</strong> Found {enhancedFilteredDelegates.length} delegate(s) matching "{searchTerm}"
        </div>
      )}

      <div className="delegate-card-grid">
        {isLoading ? (
          <div className="delegate-card-loading-message">Loading delegates...</div>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((delegate, index) => (
            <div key={delegate.delegate_id} className="delegate-card-item">
              <div className="delegate-card-header-section">
                <span className="delegate-card-serial">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </span>
                <span 
                  className="delegate-card-id"
                  onClick={() => navigate(`/delegate-service-items/${delegate.delegate_id}`)}
                  style={{cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd'}}
                  title={`View Service Items for Delegate: ${delegate.delegate_id}`}
                >
                  ID: {delegate.delegate_id}
                </span>
              </div>
              
              <div className="delegate-card-body-section">
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Name:</span>
                  <span className="delegate-card-value">{delegate.delegate_name}</span>
                </div>
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Mobile:</span>
                  <span className="delegate-card-value">{delegate.delegate_mobile}</span>
                </div>
                
                {/* <div className="delegate-card-field">
                  <span className="delegate-card-label">Email:</span>
                  <span className="delegate-card-value">{delegate.delegate_email || 'N/A'}</span>
                </div> */}
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Status:</span>
                  <span className={`delegate-card-status delegate-card-status-${delegate.status.toLowerCase()}`}>
                    {delegate.status}
                  </span>
                </div>
                
                {/* <div className="delegate-card-field">
                  <span className="delegate-card-label">Type:</span>
                  <span className="delegate-card-value">{delegate.delegate_type || 'N/A'}</span>
                </div> */}
                
                <div className="delegate-card-field">
                  <span className="delegate-card-label">Registered:</span>
                  <span className="delegate-card-value" title={formatDateTime(delegate.registered_at)}>
                    {formatDate(delegate.registered_at)}
                  </span>
                </div>
                
                {delegate.department && (
                  <div className="delegate-card-field">
                    <span className="delegate-card-label">Department:</span>
                    <span className="delegate-card-value">{delegate.department}</span>
                  </div>
                )}
                
                {delegate.designation && (
                  <div className="delegate-card-field">
                    <span className="delegate-card-label">Designation:</span>
                    <span className="delegate-card-value">{delegate.designation}</span>
                  </div>
                )}
                
                {delegate.address && (
                  <div className="delegate-card-field">
                    <span className="delegate-card-label">Address:</span>
                    <span className="delegate-card-value" style={{fontSize: '0.9em'}}>
                      {delegate.address}, {delegate.city}, {delegate.state}, {delegate.country}
                    </span>
                  </div>
                )}
                
                {delegate.notes && (
                  <div className="delegate-card-field">
                    <span className="delegate-card-label">Notes:</span>
                    <span className="delegate-card-value" style={{fontSize: '0.9em', fontStyle: 'italic'}}>
                      {delegate.notes}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="delegate-card-footer">
                <select 
                  value={delegate.status}
                  onChange={(e) => handleStatusChange(delegate.delegate_id, e.target.value)}
                  className="delegate-card-status-dropdown"
                >
                  <option value="Active">Active</option>
                  <option value="Recalled">Recalled</option>
                  {/* <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option> */}
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="delegate-card-empty-message">
            {searchTerm 
              ? `No delegates found matching "${searchTerm}"` 
              : 'No delegates found for your account.'}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center mt-4 gap-3 flex-wrap">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-outline-primary"
        >
          Previous
        </button>
        <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn btn-outline-primary"
        >
          Next
        </button>
      </div>

      <NavScreen />
    </div>
  );
};

export default AddDelegates;