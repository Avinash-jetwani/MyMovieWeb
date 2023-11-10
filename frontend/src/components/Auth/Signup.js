import React, { useState } from 'react';
import axios from 'axios';
import Text from '../StyledComponents';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { countries } from 'countries-list'; 
import Select from 'react-select';

// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'black',
    color: 'white',
    width: '300px', // Adjust width as needed
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'gray' : 'black',
    color: 'white',
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
    backgroundColor: 'black',
    width: '300px', // Make sure this matches the width of the control
    // You can also add other styles here as needed
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
    });    
  };

  return (
    <div>
    <Text>This is some text.</Text>;
      <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value); setServerError(''); }} />
        {usernameError && <div className="error">{usernameError}</div>}
        
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        {emailError && <div className="error">{emailError}</div>}

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        {passwordError && <div className="error">{passwordError}</div>}

      <input type="date" placeholder="Date of Birth" onChange={(e) => setDob(e.target.value)} />
        {dobError && <div className="error">{dobError}</div>}

        <Select 
          options={countryOptions} 
          value={selectedCountry} 
          onChange={setSelectedCountry} 
          placeholder="Select Country"
          styles={customStyles}
        />
      {countryError && <div className="error">{countryError}</div>}

      <button onClick={registerUser}>Sign Up</button>
      <Link to="/login">Already have an account? Log in</Link>

      {serverError && <div className="error">{serverError}</div>}
    </div>
    
  );
};

export default Signup;
