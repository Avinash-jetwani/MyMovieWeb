import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import './Login.css'; 


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  
  const validateUsername = () => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const loginUser = () => {
    if (!validateUsername() || !validatePassword()) {
      return;
    }
    setIsLoading(true); // Start loading
    axios.post('http://localhost:3001/login', {
      username,
      password
    })
    .then(response => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    })
    .catch(error => {
      if (error.response && error.response.data) {
        setServerError(error.response.data.error);
      } else {
        setServerError('An unexpected error occurred');
      }
    })
    .finally(() => {
      setIsLoading(false); // Stop loading
    });
  };  

  return (
  <div className="container">
    <div className="form-card">
      <h2 className='h2'>Log in</h2>

      <div className="input-container">
          <input 
            type="text"
            id="username"
            placeholder=" "
            value={username}
            onChange={(e) => { setUsername(e.target.value); setServerError(''); }}
            className={`input-field ${username ? 'not-empty' : 'empty'}`}
          />
          <label htmlFor="username" className="floating-label">Username</label>
          {usernameError && <div className="error">{usernameError}</div>}
      </div>

      <div className="input-container">
          <input 
            type="password"
            id="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setServerError(''); }}
            className={`input-field ${password ? 'not-empty' : 'empty'}`}
          />
          <label htmlFor="password" className="floating-label">Password</label>
          {passwordError && <div className="error">{passwordError}</div>}
      </div>

      <button 
        onClick={loginUser} 
        disabled={isLoading}
        className="button"
        >
        {isLoading ? <TailSpin color="#00BFFF" height={20} width={20} /> :  'Log in'}
      </button>
      {serverError && <div className="error">{serverError}</div>}

      <Link to="/signup" className="link">Don't have an account? Sign up</Link>
    </div>
  </div>
  );
};

export default Login;


