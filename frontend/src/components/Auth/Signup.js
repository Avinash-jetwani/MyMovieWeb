import React, { useState } from 'react';
import axios from 'axios';
import Text from '../StyledComponents';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list'; 
import Select from 'react-select';
import { TailSpin } from 'react-loader-spinner';
import './Signup.css'; 
// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent', // Set to transparent instead of white
    borderColor: 'var(--gray)', // Use the gray color variable
    borderWidth: '2px',
    boxShadow: 'none', // Removes any existing shadows
    '&:hover': {
      borderColor: 'var(--primary)', // On hover, use the primary color
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'gray' : 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: 'gray',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: 'var(--gray)',
    borderWidth: '2px',
    borderRadius: '4px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden', // Prevents the border from being cut off
  }),
};


// Convert countries to an array suitable for react-select
const countryOptions = Object.entries(countries).map(([countryCode, countryData]) => {
  return {
    value: countryCode,
    label: countryData.name
  };
});

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);

  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [dobError, setDobError] = useState('');
  const [countryError, setCountryError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = () => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    setEmailError('');
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

  const validateDob = () => {
    if (!dob) {
      setDobError('Date of Birth is required');
      return false;
    }
    setDobError('');
    return true;
  };

  const validateCountry = () => {
    if (!selectedCountry) {
      setCountryError('Country is required');
      return false;
    }
    setCountryError('');
    return true;
  };

  const registerUser = () => {
    if (!validateUsername() || !validateEmail() || !validatePassword() || !validateDob() || !validateCountry()) {
      return; 
    }
    setIsLoading(true);
    axios.post('http://localhost:3001/signup', {
      username,
      email,
      password,
      dob,
      country: selectedCountry ? selectedCountry.label : ''
    })
    .then(response => {
      navigate('/login');
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
        <h2 className='h2'>Sign Up</h2>

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
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setServerError(''); }}
            className={`input-field ${email ? 'not-empty' : 'empty'}`}
          />
          <label htmlFor="email" className="floating-label">Email</label>
          {emailError && <div className="error">{emailError}</div>}
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

        <div className="input-container">
          <input 
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => { setDob(e.target.value); setServerError(''); }}
            className={`input-field ${dob ? 'not-empty' : ''}`}
          />
          <label htmlFor="dob" className="floating-label">Date of Birth</label>
          {dobError && <div className="error">{dobError}</div>}
        </div>

        <div className="input-container">
          <Select 
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Select Country"
            styles={customStyles}
            className={`input-field ${selectedCountry ? 'not-empty' : ''}`}
          />
          {countryError && <div className="error">{countryError}</div>}
        </div>

        <button 
          onClick={registerUser} 
          disabled={isLoading}
          className="button"
        >
          {isLoading ? <TailSpin color="#00BFFF" height={20} width={20} /> : 'Sign Up'}
        </button>

        <Link to="/login" className="link">Already have an account? Log in</Link>

        {serverError && <div className="error">{serverError}</div>}
      </div>
    </div> 
  );
};


export default Signup;
