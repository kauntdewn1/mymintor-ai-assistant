import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Consultorias() {
  const { user } = useAuth();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Consultorias
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Gerencie suas consultorias aqui
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lista de Consultorias
            </Typography>
            <Typography variant="body1">
              Em breve: Lista de consultorias ativas
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Consultorias; 