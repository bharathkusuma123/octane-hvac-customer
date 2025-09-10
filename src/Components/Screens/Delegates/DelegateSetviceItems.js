import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavScreen from '../Navbar/Navbar';
import './ViewDelegate.css';
import baseURL from '../../ApiUrl/Apiurl';

const DelegateServiceItems = () => {
  const { delegateId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${baseURL}/delegate-service-item-tasks/`);
        const data = await res.json();
        if (res.ok) {
          const filtered = data.data.filter(item => item.delegate === delegateId);
          setTasks(filtered);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [delegateId]);

  return (
    <div className="request-screen-wrapper">
      <h2>Delegate Service Items</h2>
      {/* <p><strong>Delegate ID:</strong> {delegateId}</p> */}

      <div className="table-container">
        {loading ? (
          <p className="p-3">Loading service items...</p>
        ) : tasks.length > 0 ? (
          <table className="table table-bordered mb-0">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item ID</th>
                <th>Service Item</th>
                <th>Raise Request</th>
                <th>Close Request</th>
                <th>CSAT Survey</th>
                <th>Customer Complaints</th>
                <th>Monitor Equipment</th>
                <th>Control Equipment</th>
               
              </tr>
            </thead>
            <tbody>
              {tasks.map((item, index) => (
                <tr key={item.item_id}>
                  <td>{index + 1}</td>
                  <td>{item.item_id}</td>
                  <td>{item.service_item}</td>
                  <td>{item.can_raise_service_request ? "✅" : "❌"}</td>
                  <td>{item.can_close_service_request ? "✅" : "❌"}</td>
                  <td>{item.can_submit_customer_satisfaction_survey ? "✅" : "❌"}</td>
                  <td>{item.can_log_customer_complaints ? "✅" : "❌"}</td>
                  <td>{item.can_monitor_equipment ? "✅" : "❌"}</td>
                  <td>{item.can_control_equipment ? "✅" : "❌"}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-3">No service items assigned to this delegate.</p>
        )}
      </div>

      <NavScreen />
    </div>
  );
};

export default DelegateServiceItems;
