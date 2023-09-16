import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate

  const loginUser = () => {
    axios.post('http://localhost:3001/login', {
      username,
      password
    })
    .then(response => {
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');  // Navigate to Dashboard
    })
    .catch(error => {
      // Handle error
    });
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default Login;
