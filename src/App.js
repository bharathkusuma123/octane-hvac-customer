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

import './App.css';

function App() {
  return (
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



        </Routes>
      </div>
    </Router>
  );
}

export default App;
