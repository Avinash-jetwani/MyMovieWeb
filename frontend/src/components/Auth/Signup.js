import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('');
  const [preferences, setPreferences] = useState({});

  const registerUser = () => {
    axios.post('http://localhost:3001/signup', {
      username,
      email,
      password,
      dob,
      country,
      preferences
    })
    .then(response => {
      // Handle success
    })
    .catch(error => {
      // Handle error
    });
  };

  return (
    <div>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="date" placeholder="Date of Birth" onChange={(e) => setDob(e.target.value)} />
      <input type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
      <button onClick={registerUser}>Sign Up</button>
    </div>
  );
};

export default Signup;
