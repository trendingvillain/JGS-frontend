import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #0073e6, #00c6ff)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: '1px',
            color: '#fff',
          }}
        >
          JGS AUTO MECH
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

