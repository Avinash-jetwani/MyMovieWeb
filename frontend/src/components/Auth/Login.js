import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = () => (
  <TailSpin color="#00BFFF" height={100} width={100} />
);


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
    <div>
      <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value); setServerError(''); }} />
      {usernameError && <div className="error">{usernameError}</div>}

      <input type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); setServerError(''); }} />
      {passwordError && <div className="error">{passwordError}</div>}

      {isLoading && <LoadingSpinner />}
      <button onClick={loginUser} disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {serverError && <div className="error">{serverError}</div>}

      <Link to="/signup">Don't have an account? Sign up</Link>
    </div>
  );
};

export default Login;
