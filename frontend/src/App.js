import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Dashboard from './components/Dashboard/Dashboard'; // Update the path
import Login from './components/Auth/Login'; // Update the path
import Signup from './components/Auth/Signup'; // Update the path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;


