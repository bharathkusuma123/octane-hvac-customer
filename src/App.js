import React ,{useEffect}from 'react';
import { BrowserRouter as Router, Routes, Route ,useNavigate} from 'react-router-dom';
import SetPasswordScreen from './Components/LoginSreens/SetPasswordScreen';
import Login from './Components/LoginSreens/Login';
import ForgotPasswordScreen from './Components/LoginSreens/ForgotPasswordScreen';
import OTPVerificationScreen from './Components/LoginSreens/OTPVerificationScreen';
import SecurityQuestionsScreen from './Components/LoginSreens/SecurityQuestionsScreen';
import SignUpScreen from './Components/LoginSreens/SignUpScreen'
import SignupSetPassword from './Components/LoginSreens/SignupSetPassword';
import CustomerData from './Components/LoginSreens/CusotmerData'
import Dashboard from './Components/Screens/Dashboard'
import Navbar from './Components/Screens/Navbar/Navbar';
import AuthProvider from "./Components/AuthContext/AuthContext";
import DashboardScreen from './Components/Screens/DashboardScreen/Dashboard';
import MachineScreen from './Components/Screens/MachineScreen/Machine';
import RequestScreen from './Components/Screens/RequestScreen/Request';
import ComplaintForm from "./Components/Screens/Complaints/ComplaintsForm"
import ComplaintDetails from "./Components/Screens/Complaints/ComplaintDetails"

import FeedbackScreen from './Components/Screens/FeedbackScreen/Feedback';
import FeedbackDetails from './Components/Screens/FeedbackScreen/FeedbackDetails';
import ServiceRequestForm from './Components/Screens/ServiceRequest/ServiceRequestForm';
import './App.css';
import ViewDelegates from './Components/Screens/Delegates/ViewDelegates';
import AddDelegates from './Components/Screens/Delegates/AddDelegates';
import { SnackbarProvider } from 'notistack';
import Home from './DashboardReport/Home';
import EditCustomer from "./Components/Screens/DashboardScreen/EditCustomer";
import MachineDetails from "./Components/Screens/MachineScreen/MachineDetails";
import DelegateSetviceItems from './Components/Screens/Delegates/DelegateSetviceItems';
import DelegateHome from "./DelegateProfile/DelegateHome/DelegateHome";
import DelegateRequestForm from './DelegateProfile/DelegateRequest/DelegateRequestForm';
import DelegateSurveyForm from './DelegateProfile/DelegateSurvey/DelegateSurveyForm';
import { DelegateServiceItemProvider } from "./Components/AuthContext/DelegateServiceItemContext";
import Connect from './Components/Screens/Connect/Connect';
import { db, auth, storage } from "./Firebase/Firebase";
import DisplayFeedback from './Components/Screens/FeedbackScreen/DisplayFeedback';
import RequestScreenDelegate from './DelegateProfile/DelegateRequest/RequestScreenDelegate';
import DelegateFeedback from './DelegateProfile/DelegateRequest/DelegateFeedback';
import DelegateData from './Components/LoginSreens/DelegateData';
import DelegateSignup from './Components/LoginSreens/DelegateSignup';
import DelegateProfileDetails from './DelegateProfile/DelegateProfileDetails/ProfileDetails'
import DelegateComplaintsForm from './DelegateProfile/DelegateRequest/DelegateComplaintsForm'
import Screen1 from './Components/Screens/MachineScreensNew/Screen1';
import Screen2 from './Components/Screens/MachineScreensNew/Screen2';
import AlarmsPage from './Components/Screens/MachineScreensNew/AlarmsPage';
import Settings from './Components/Screens/MachineScreensNew/Settings';
import Timers from './Components/Screens/MachineScreensNew/Timers';
import Contact from './Components/LoginSreens/Contact';
import DelegateScreen1 from './DelegateProfile/DelegateMachineScreen/DelegateScreen1';
import DelegateScreen2 from './DelegateProfile/DelegateMachineScreen/DelegateScreen2';
import DelegateAlarmsPage from './DelegateProfile/DelegateMachineScreen/DelegateAlarmPage';

// 🔹 Wrapper component to handle auto-login check
function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/machinescreen1");  // ✅ Redirect to dashboard
    }
  }, [navigate]);

  return <Login />;
}


function App() {
  return (
    <AuthProvider>
      <DelegateServiceItemProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          autoHideDuration={4000}
        >
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<AppWrapper />} />
                <Route path="/machinescreen1" element={<Screen1 />} />
                <Route path="/machinescreen2" element={<Screen2 />} />
                <Route path="/alarms" element={<AlarmsPage />} />
                <Route path="/timers" element={<Timers />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="/setpassword" element={<SetPasswordScreen />} />
                <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
                <Route path="/otp" element={<OTPVerificationScreen />} />
                <Route path="/security" element={<SecurityQuestionsScreen />} />
                <Route path="/signup" element={<SignUpScreen />} />
                <Route path="/set-sign-password" element={<SignupSetPassword />} />
                <Route path="/set-delegate-sign-password" element={<DelegateSignup />} />
                <Route path="/customer-data" element={<CustomerData />} />
                <Route path="/delegate-data" element={<DelegateData />} />
                <Route path="/customer-dashboard" element={<Dashboard />} />

                <Route path="/navbar" element={<Navbar />} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/dashboard" element={<DashboardScreen />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/machine" element={<MachineScreen />} />
                <Route path="/request" element={<RequestScreen />} />
                <Route path="/complaint-form" element={<ComplaintForm />} />
                <Route path="/complaint-details" element={<ComplaintDetails />} />

                <Route path="/feedback/:requestId" element={<FeedbackScreen />} />
                <Route path="/feedback-details" element={<FeedbackDetails />} />
                <Route path="/delegate-feedback/:requestId" element={<DelegateFeedback />} />

                <Route path="/display-feedback" element={<DisplayFeedback />} />
                <Route path="/service-form" element={<ServiceRequestForm />} />
                <Route path="/view-delegates" element={<ViewDelegates />} />
                <Route path="/add-delegates" element={<AddDelegates />} />
                <Route path="/home" element={<Home />} />
                <Route path="/edit-customer/:customer_id" element={<EditCustomer />} />
                <Route path="/machines/:serviceItemId" element={<MachineDetails />} />
                <Route path="/delegate-service-items/:delegateId" element={<DelegateSetviceItems />} />
                <Route path="/delegate-home" element={<DelegateHome />} />
                 <Route path="/delegate-machinescreen1" element={<DelegateScreen1 />} />
                  <Route path="/delegate-machinescreen2" element={<DelegateScreen2 />} />
                  <Route path="/delegate-alarms" element={<DelegateAlarmsPage />} />
                <Route path="/delegate-request" element={<DelegateRequestForm />} />
                <Route path="/delegate-display-request" element={<RequestScreenDelegate />} />
                <Route path="/delegate-survey" element={<DelegateSurveyForm />} />
            
               <Route path="/delegate-profile-details" element={<DelegateProfileDetails />} />
                <Route path="/delegate-complaint-form" element={<DelegateComplaintsForm />} />


              </Routes>
            </div>
          </Router>
        </SnackbarProvider>
      </DelegateServiceItemProvider>
    </AuthProvider>
  );
}

export default App;
