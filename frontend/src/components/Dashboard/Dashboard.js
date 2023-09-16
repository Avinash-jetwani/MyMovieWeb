import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/dashboard')
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      // Handle error
    });
  }, []);

  return (
    <div>
      {/* Render your dashboard data here */}
    </div>
  );
}
