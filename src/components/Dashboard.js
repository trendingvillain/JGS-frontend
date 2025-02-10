// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Box } from '@mui/material';

function Dashboard() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      // If no role is found, redirect to login page
      navigate('/login');
    } else {
      setRole(storedRole);
    }
  }, [navigate]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>

      {role === 'Manager' && (
        <Box>
          <Typography variant="h5" align="center" gutterBottom>
            Manager Dashboard
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/employee">
                Employee
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/company">
                Company
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/record">
                Records
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {role === 'Employee' && (
        <Box>
          <Typography variant="h5" align="center" gutterBottom>
            Employee Dashboard
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/work-entry">
                Work Entry
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/work-details">
                Work Details
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button variant="contained" fullWidth href="/Com_register">
                Create Company
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
