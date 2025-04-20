import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bem-vindo, {user?.name || 'Usuário'}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Consultorias Ativas</Typography>
            <Typography variant="h4">12</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Clientes</Typography>
            <Typography variant="h4">8</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Receita Mensal</Typography>
            <Typography variant="h4">R$ 15.000</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 