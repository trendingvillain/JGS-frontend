import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';

export default function ComRegister() {
  const [formData, setFormData] = useState({
    company_name: '',
    location: '',
  });
  const navigate = useNavigate();  // Hook to navigate programmatically

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
      const response = await fetch(`${API_BASE_URL}/companies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('Company registration successful!');
        console.log(data);
        // Navigate to the '/company' route after successful registration
        navigate('/company');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during company registration:", error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <Box sx={{ width: '300px', margin: 'auto', padding: 3 }}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>Register Company</Typography>

      <form onSubmit={handleSubmit}>
        {/* Company Name Input */}
        <TextField
          label="Company Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />

        {/* Location Input */}
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Register Company
        </Button>
      </form>
    </Box>
  );
}
