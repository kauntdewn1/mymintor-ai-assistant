import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function Configuracoes() {
  const { user } = useAuth();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Configure suas preferências
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações do Usuário
            </Typography>
            <TextField
              fullWidth
              label="Nome"
              variant="outlined"
              margin="normal"
              value={user?.name || ''}
              disabled
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={user?.email || ''}
              disabled
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled
            >
              Salvar Alterações
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Configuracoes; 