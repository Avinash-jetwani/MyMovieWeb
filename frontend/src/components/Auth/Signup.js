import React, { useState } from 'react';
import axios from 'axios';
import Text from '../StyledComponents';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const navigate = useNavigate();

  const registerUser = () => {
    axios.post('http://localhost:3001/signup', {
      username,
      email,
      password,
      dob,
      country
    })
    .then(response => {
      navigate('/login');
    })
    .catch(error => {
      // Handle error
    });
  };

  return (
    <div>
    <Text>This is some text.</Text>;
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="date" placeholder="Date of Birth" onChange={(e) => setDob(e.target.value)} />
      <input type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
      <button onClick={registerUser}>Sign Up</button>
      <Link to="/login">Already have an account? Log in</Link>
    </div>
  );
};

export default Signup;
