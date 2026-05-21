import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button } from '@mui/material';
import useUser from '../hooks/useUser';

const WelcomePage: React.FC = () => {
  const [name, setName] = useState('');
  const { saveUsername } = useUser();

  const start = () => {
    const n = name.trim();
    if (!n) return;
    saveUsername(n);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 48 }}>
      <Paper elevation={3} style={{ padding: 24 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Chattr
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter a username to start chatting.
        </Typography>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <TextField
            label="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={start}>
            Start
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default WelcomePage;
