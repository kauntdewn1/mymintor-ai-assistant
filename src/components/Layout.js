import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Layout - Auth State:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);

  const handleLogout = () => {
    console.log('Layout - Logging out');
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IA Assistente FlowOFF
          </Typography>
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container 
        component="main" 
        sx={{ 
          flex: 1, 
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)' // Altura total menos a altura do AppBar
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout; 