import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const username = localStorage.getItem('username'); // Retrieve username from local storage

  useEffect(() => {
    const token = localStorage.getItem('token');
    // If you're not using the response from this request, you can remove this axios call
    axios.get('http://localhost:3001/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, []);

  return (
    <div>
      <h2>On dashboard</h2>
      <h2>Welcome, {username}</h2> 
      <Link to="/profile">Edit Profile</Link>
      <Link to="/logout">Logout</Link>
    </div>
  );
}
