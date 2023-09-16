import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Dashboard from './components/Dashboard/Dashboard'; 
import Login from './components/Auth/Login'; 
import Signup from './components/Auth/Signup'; 
import Logout from './components/Auth/Logout';
import ProtectedRoute from './components/Routes/ProtectedRoute'; // Correct the import path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;