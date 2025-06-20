import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import FeedbackScreen from './Components/Screens/FeedbackScreen/Feedback';
import ServiceRequestForm from './Components/Screens/ServiceRequest/ServiceRequestForm';
import './App.css';
import ViewDelegates from './Components/Screens/Delegates/ViewDelegates';
import AddDelegates from './Components/Screens/Delegates/AddDelegates';
import { SnackbarProvider } from 'notistack'; 
function App() {
  return (
      <AuthProvider>
         <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={4000}
      >
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setpassword" element={<SetPasswordScreen />} />
          <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
          <Route path="/otp" element={<OTPVerificationScreen />} />
          <Route path="/security" element={<SecurityQuestionsScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/set-sign-password" element={<SignupSetPassword />} />
          <Route path="/customer-data" element={<CustomerData />} />
          <Route path="/customer-dashboard" element={<Dashboard />} />

<Route path="/navbar" element={<Navbar />} />

   <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/machine" element={<MachineScreen />} />
        <Route path="/request" element={<RequestScreen />} />
        <Route path="/feedback" element={<FeedbackScreen />} />
  <Route path="/service-form" element={<ServiceRequestForm />} />
 <Route path="/view-delegates" element={<ViewDelegates />} />
<Route path="/add-delegates" element={<AddDelegates />} />

        </Routes>
      </div>
    </Router>
    </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
