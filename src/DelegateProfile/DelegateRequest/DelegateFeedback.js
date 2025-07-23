import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DelegateNavbar from "../DelegateNavbar/DelegateNavbar";
import axios from 'axios';
import { AuthContext } from "../../Components/AuthContext/AuthContext";
import { useParams } from 'react-router-dom';
import baseURL from '../../Components/ApiUrl/Apiurl';

// Star Rating Component
// Star Rating Component (unchanged)
const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(null);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            color: star <= (hover || value) ? '#ffc107' : '#e4e5e9',
          }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const DelegateFeedback = () => {
   const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { requestId } = useParams();
  const location = useLocation();
  const [customerId, setCustomerId] = useState('');
  
  // Get passed parameters
  const { delegateId } = location.state || {};
  
  // Use these in your component logic
  const userId = delegateId;
  const company_id = user?.company_id;
  
  const [formData, setFormData] = useState({
    service_request: '',
    responses: []
  });

  const [serviceRequests, setServiceRequests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both endpoints in parallel
        const [requestsResponse, questionsResponse] = await Promise.all([
          axios.get(`${baseURL}/service-pools/?user_id=${userId}&company_id=${company_id}`),
          axios.get(`${baseURL}/survey-questions/`)
        ]);

        if (!isMounted) return;

        // Process service requests
        const requestsData = Array.isArray(requestsResponse.data) 
          ? requestsResponse.data 
          : requestsResponse.data?.results || requestsResponse.data?.data || [];

        const closedRequests = requestsData.filter(request => {
          const status = request.status || request.request_status || request.state || request.ServiceStatus;
          return String(status).toLowerCase() === 'closed';
        });

        // Process questions
        const questionsData = Array.isArray(questionsResponse.data)
          ? questionsResponse.data
          : questionsResponse.data?.results || questionsResponse.data?.data || [];

        // Update state
        setServiceRequests(closedRequests);
        setQuestions(questionsData);
        
        // Initialize responses
        setFormData(prev => ({
          ...prev,
          responses: questionsData.map(question => ({
            question: question.question_text,
            rating_response: '',
            reason: '',
            created_by: userId,
            updated_by: userId
          }))
        }));

      } catch (err) {
        if (isMounted) {
          console.error('API Error:', err);
          setError(`Failed to load data: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (userId && company_id) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [userId, company_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedResponses = [...formData.responses];
    updatedResponses[index] = {
      ...updatedResponses[index],
      [name]: value
    };
    setFormData(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  // Special handler for star ratings
  const handleStarRating = (index, rating) => {
    const updatedResponses = [...formData.responses];
    updatedResponses[index] = {
      ...updatedResponses[index],
      rating_response: rating.toString()
    };
    setFormData(prev => ({
      ...prev,
      responses: updatedResponses
    }));
  };

  useEffect(() => {
  const fetchDelegateData = async () => {
    try {
      const response = await axios.get(`${baseURL}/delegates/`);
      const delegateData = response.data?.data || response.data;
      
      if (Array.isArray(delegateData)) {
        const currentDelegate = delegateData.find(d => d.delegate_id === delegateId);
        if (currentDelegate) {
          setCustomerId(currentDelegate.customer);
          console.log("customer", currentDelegate.customer);
        }
      }
    } catch (error) {
      console.error('Error fetching delegate data:', error);
    }
  };

  if (delegateId) {
    fetchDelegateData();
  }
}, [delegateId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate at least one response is filled
      const hasResponses = formData.responses.some(r => r.rating_response);
      if (!hasResponses) {
        throw new Error('Please answer at least one survey question');
      }

      // Get the selected service request
      const selectedRequest = serviceRequests.find(req => req.request_id === formData.service_request);
      if (!selectedRequest) {
        throw new Error('Please select a valid service request');
      }

      // Prepare the payload according to Django model expectations
      const payload = {
        user_id: userId,
        company_id: company_id,
        company: company_id,
        service_request: selectedRequest.request_id,
         customer: customerId, // Now using dynamic customerId
        service_engineer: selectedRequest.assigned_engineer,
        delegate_id: delegateId, // Include delegate_id in the payload
        suggestions: '',
        created_by: userId,
        updated_by: userId,
        responses: formData.responses
          .filter(r => r.rating_response)
          .map((response, index) => {
            // Get the corresponding question from the questions array
            const question = questions[index];
            if (!question) {
              throw new Error(`Missing question for response index ${index}`);
            }
            
            return {
              question: question.question_id, // Use question_id instead of question_text
              rating_response: response.rating_response.toString(),
              reason: response.reason || '',
              created_by: userId,
              updated_by: userId
            };
          })
      };

      console.log('Final payload before submission:', JSON.stringify(payload, null, 2));

      const response = await axios.post(`${baseURL}/customer-surveys/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Submission successful:', response.data);
      alert('Feedback submitted successfully!');
      navigate('/delegate-display-request');

    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });

      let errorMessage = 'Error submitting feedback';
      if (error.response?.data) {
        // Handle Django validation errors
        if (typeof error.response.data === 'object') {
          errorMessage = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
        } else {
          errorMessage = error.response.data;
        }
      }
      alert(errorMessage);
    }
  };

  useEffect(() => {
    if (requestId && serviceRequests.length > 0) {
      const matched = serviceRequests.find(req => req.request_id === requestId);
      if (matched) {
        setFormData(prev => ({
          ...prev,
          service_request: matched.request_id
        }));
      }
    }
  }, [requestId, serviceRequests]);

  if (loading) {
    return (
      <div style={{ 
        paddingTop: '60px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)'
      }}>
        <DelegateNavbar />
        <p>Loading survey form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        paddingTop: '60px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)'
      }}>
        <DelegateNavbar />
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ paddingTop: '60px', textAlign: 'center' }}>
        <DelegateNavbar />
        <p>No survey questions available</p>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: '60px', 
      paddingBottom: '60px', 
      maxWidth: '800px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 120px)'
    }}>
      <DelegateNavbar />
      <div style={{ padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Customer Satisfaction Survey</h2>
        
        <form onSubmit={handleSubmit} style={{ 
          backgroundColor: '#d9e0e7ff', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
         <div style={{ marginBottom: '25px' }}>
  <label style={{ fontWeight: '600', color: '#444' }}>
    Service Request ID:
  </label>
  <div style={{ 
    padding: '12px', 
    backgroundColor: '#f5f5f5', 
    borderRadius: '6px', 
    border: '1px solid #ddd',
    marginTop: '8px',
    fontSize: '16px'
  }}>
    {formData.service_request}
  </div>
</div>

          
          {/* Survey Questions */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              marginBottom: '15px', 
              borderBottom: '1px solid #ddd', 
              paddingBottom: '5px',
              color: '#333'
            }}>
              Please rate your experience
            </h3>
            
           {questions.map((question, index) => (
    <div key={question.question_id} style={{ 
      marginBottom: '20px', 
      padding: '20px', 
      backgroundColor: '#fff', 
      borderRadius: '6px', 
      border: '1px solid #eee',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <p style={{ 
        fontWeight: '600', 
        marginBottom: '15px',
        color: '#222',
        fontSize: '17px',
        textAlign: 'center'
      }}>
        {question.question_text}
      </p>
      
      {question.rating_type === 'Rating' && (
        <div style={{ marginBottom: '15px' }}>
          <StarRating 
            value={parseInt(formData.responses[index]?.rating_response) || 0}
            onChange={(rating) => handleStarRating(index, rating)}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '5px',
            fontSize: '12px',
            color: '#666'
          }}>
            {/* <span>Poor</span>
            <span>Excellent</span> */}
          </div>
        </div>
      )}
      
      {question.rating_type === 'YesNo' && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            justifyContent: 'center'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="rating_response"
                value="Y"
                checked={formData.responses[index]?.rating_response === 'Y'}
                onChange={(e) => handleResponseChange(index, e)}
                style={{ 
                  marginRight: '8px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
                required
              />
              <span>Yes</span>
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="rating_response"
                value="N"
                checked={formData.responses[index]?.rating_response === 'N'}
                onChange={(e) => handleResponseChange(index, e)}
                style={{ 
                  marginRight: '8px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span>No</span>
            </label>
          </div>
        </div>
      )}
      
      {question.rating_type === 'Scale' && (
        <div style={{ marginBottom: '15px' }}>
          <input
            type="range"
            name="rating_response"
            min="1"
            max="10"
            value={formData.responses[index]?.rating_response || '5'}
            onChange={(e) => handleResponseChange(index, e)}
            style={{ 
              width: '100%', 
              padding: '0',
              height: '8px',
              borderRadius: '5px',
              background: '#ddd',
              outline: 'none'
            }}
            required
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '5px',
            fontSize: '12px',
            color: '#666'
          }}>
            <span>1 (Poor)</span>
            <span>{formData.responses[index]?.rating_response || '5'}</span>
            <span>10 (Excellent)</span>
          </div>
        </div>
      )}
      
      <div style={{ marginBottom: '10px' }}>
        <textarea
          name="reason"
          value={formData.responses[index]?.reason || ''}
          onChange={(e) => handleResponseChange(index, e)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '6px', 
            border: '1px solid #ddd', 
            minHeight: '100px',
            fontSize: '16px'
          }}
          placeholder="Additional comments (optional)..."
        />
      </div>
    </div>
  ))}
          </div>
          
          {/* Submit Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="submit"
              disabled={serviceRequests.length === 0}
              style={{
                backgroundColor: serviceRequests.length === 0 ? '#cccccc' : '#4CAF50',
                color: 'white',
                padding: '14px 24px',
                border: 'none',
                borderRadius: '6px',
                cursor: serviceRequests.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                width: '100%',
                maxWidth: '300px',
                transition: 'background-color 0.3s'
              }}
            >
              Submit Feedback
            </button>
            {serviceRequests.length === 0 && (
              <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                You need at least one closed service request to submit feedback
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DelegateFeedback;