import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('dob', data.user.dob);
        localStorage.setItem('token', data.token);

        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: '#fff',
          // Additional custom styling for a professional look:
          border: '1px solid #e0e0e0',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          JGS Auto Mech
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            textAlign: 'center',
            color: '#777',
          }}
        >
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#2c3e50',
              '&:hover': { backgroundColor: '#1a252f' },
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
