import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, []);
   

  return (
    <div>
      <h2>On dashboard</h2>
      <Link to="/logout">Logout</Link>
    </div>
  );
}
