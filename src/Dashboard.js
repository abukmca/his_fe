import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const Dashboard = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let accessToken = localStorage.getItem('accessToken');
      if (isTokenExpired(accessToken)) {
        // Refresh the token if it’s expired
        await refreshToken();
        accessToken = localStorage.getItem('accessToken');
      }
      const response = await axios.get('http://localhost:8000/api/protected/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setData(response.data);
    };

    fetchData();
  }, []);

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('accessToken', response.data.access);
  };

  return <div>{data ? `Protected Data: ${data}` : 'Loading...'}</div>;
};

export default Dashboard;
