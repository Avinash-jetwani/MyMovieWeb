import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { countries } from 'countries-list';
import { TailSpin } from 'react-loader-spinner'; 
import './UserProfile.css'; 

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


  const countryOptions = Object.entries(countries).map(([countryCode, countryData]) => {
    return {
      value: countryCode,
      label: countryData.name
    };
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    dob: '',
    country: ''
    // Add other fields as necessary
  });
  const [isLoading, setIsLoading] = useState(false);

  const [serverError, setServerError] = useState('');

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
        const formattedData = {
            ...response.data,
            dob: formatDateForInput(response.data.dob)
          };
      setUserData(formattedData);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      // Handle unauthorized access or other errors
    });
  }, []);  

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  const handleCountryChange = (selectedOption) => {
    setUserData({ ...userData, country: selectedOption.label });
  };

  const validateInput = () => {
    let isValid = true;
    let errors = {};
  
    if (!userData.username) {
      errors.username = 'Username is required';
      isValid = false;
    }
  
    if (!userData.email) {
      errors.email = 'Email is required';
      isValid = false;
    }
  
    if (!userData.dob) {
      errors.dob = 'Date of Birth is required';
      isValid = false;
    }
  
    if (!userData.country) {
      errors.country = 'Country is required';
      isValid = false;
    }
  
    setErrors(errors);
    return isValid;
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', userData); // Debugging log
    if (!validateInput()) {
      console.log('Validation failed'); // Debugging log
      return;
    }
    setIsLoading(true);
    axios.put('http://localhost:3001/user/profile', userData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        console.log('Update successful:', response); // Debugging log
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        if (error.response && error.response.status === 409) {
          setServerError('Username or email already exists');
        }
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
    };

  return (
    <div className="container">
    <div className="form-card">
      <h2 className='h2'>Edit Profile</h2>
      <form onSubmit={handleSubmit}>

      <div className="input-container">
        <input
          type="text"
          name="username"
          placeholder=" "
          value={userData.username}
          onChange={handleInputChange}
          className={`input-field ${userData.username ? 'not-empty' : 'empty'}`}
        />
         <label htmlFor="username" className="floating-label">Username</label>
        {errors.username && <div className="error">{errors.username}</div>}
      </div>

      <div className="input-container">
        <input
          type="email"
          name="email"
          placeholder=" "
          value={userData.email}
          onChange={handleInputChange}
          className={`input-field ${userData.email ? 'not-empty' : 'empty'}`}
        />
        <label htmlFor="email" className="floating-label">Email</label>
        {errors.email && <div className="error">{errors.email}</div>}
      </div>

      <div className="input-container">
        <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleInputChange}
            className={`input-field ${userData.dob ? 'not-empty' : ''}`}
        />
        <label htmlFor="dob" className="floating-label">Date of Birth</label>
        {errors.dob && <div className="error">{errors.dob}</div>}
      </div>

      <div className="input-container">
        <Select 
          options={countryOptions}
          value={countryOptions.find(option => option.label === userData.country)}
          onChange={handleCountryChange}
          placeholder="Select Country"
          styles={customStyles}
        />
        {errors.country && <div className="error">{errors.country}</div>}
      </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="button"
        >
          {isLoading ? <TailSpin color="#00BFFF" height={20} width={20} /> : 'Save Changes'}
        </button>

        <Link to="/dashboard" className="link">Back to dashboard!</Link>

        {serverError && <div className="error">{serverError}</div>}
      </form>
    </div>
  </div>
  );
};

export default UserProfile;