import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Box, Container } from '@mui/material';
import Header from './Header';

function Dashboard() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('name');
    if (!storedRole) {
      navigate('/login');
    } else {
      setRole(storedRole);
      if (storedRole === 'Employee') {
        setName(storedName);
      }
    }
  }, [navigate]);

  const sectionBoxStyle = {
    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
  };

  const buttonStyle = {
    height: '55px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #0073e6, #005bb5)',
    textTransform: 'none',
    borderRadius: '8px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
      background: 'linear-gradient(135deg, #005bb5, #004494)',
    },
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: '700', color: '#333', mb: 3 }}
        >
          {role === 'Manager'
            ? 'Manager Dashboard'
            : `Welcome ${name || ''}  `}
        </Typography>

        {role === 'Manager' && (
          <Box sx={sectionBoxStyle}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '500', color: '#0073e6' }}>
              Quick Access
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/employee')} sx={buttonStyle}>
                  Manage Employees
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/company')} sx={buttonStyle}>
                  Manage Companies
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/record')} sx={buttonStyle}>
                  View Records
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {role === 'Employee' && (
          <Box sx={sectionBoxStyle}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '500', color: '#0073e6' }}>
              Options
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/work-entry')} sx={buttonStyle}>
                  Work Entry
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/work-details')} sx={buttonStyle}>
                  Work Details
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button fullWidth onClick={() => navigate('/Com_register')} sx={buttonStyle}>
                  Register Company
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
