import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Dashboard from './components/Dashboard/Dashboard'; 
import Login from './components/Auth/Login'; 
import Signup from './components/Auth/Signup'; 
import Logout from './components/Auth/Logout';
import UserProfile from './components/Dashboard/UserProfile'; 
import ProtectedRoute from './components/Routes/ProtectedRoute'; 
import React from 'react';
import GlobalStyle from './GlobalStyle';
import LandingPage from './components/LandingPage/LandingPage'; 

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<ProtectedRoute component={UserProfile} />} /> 
      </Routes>
    </Router>
  );
}

export default App;