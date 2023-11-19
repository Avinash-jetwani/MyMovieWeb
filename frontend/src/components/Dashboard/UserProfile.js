import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { countries } from 'countries-list';

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
      });
    };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        {errors.username && <div className="error">{errors.username}</div>}

        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        {errors.email && <div className="error">{errors.email}</div>}

        <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleInputChange}
            placeholder="Date of Birth"
        />
        {errors.dob && <div className="error">{errors.dob}</div>}


        <Select 
          options={countryOptions}
          value={countryOptions.find(option => option.label === userData.country)}
          onChange={handleCountryChange}
          placeholder="Select Country"
          styles={customStyles}
        />
        {errors.country && <div className="error">{errors.country}</div>}

        <button onClick={handleSubmit}>Save Changes</button>
        {serverError && <div className="error">{serverError}</div>}
      </form>
    </div>
  );
};

export default UserProfile;