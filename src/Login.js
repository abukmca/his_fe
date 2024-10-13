import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// const BE_API_ROOT = "http://localhost:8000"
const BE_API_ROOT = "https://web-production-962f9.up.railway.app"


const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await axios.post(BE_API_ROOT+'/api/token', credentials);
          console.log(credentials)
          localStorage.setItem('authToken', response.data.access); 
          console.log(response)// Store the token
          navigate('/member'); // Redirect to the home page or any other page after login
      } catch (error) {
          // Log the entire error to understand its structure
          console.error('Error logging in:', error);
  
          // Check if the error has a response and data property
          if (error.response && error.response.data) {
              console.error('Error details:', error.response.data);
              alert(`Login failed: ${error.response.data.detail || 'Unknown error'}`);
          } else {
              alert('Login failed: Unable to connect to the server.');
          }
      }
  };
  

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;
