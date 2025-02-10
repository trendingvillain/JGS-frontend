import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import API_BASE_URL from '../config/apiConfig';

export default function Register() {
  const navigate = useNavigate();  // Initialize navigate
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Employee',  // Role is now hardcoded as 'Employee'
    name: '',
    dob: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to the API
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registration successful!');
        console.log(data);
        // Navigate to /employee after successful registration
        navigate('/employee');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <Box sx={{ width: '300px', margin: 'auto', padding: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>Register</Typography>

      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Name Input */}
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Date of Birth Input */}
        <TextField
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        {/* Password Input */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Role is fixed as 'Employee' */}
        <input type="hidden" name="role" value="Employee" />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}
