import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your validation and password reset logic here
    if (email === '') {
      setError('Please enter a valid email address');
      return;
    }

    // Simulating the reset password process
    setTimeout(() => {
      setIsSuccess(true);
      setError('');
    }, 1000);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
          Forgot Password
        </Typography>
        
        {isSuccess ? (
          <Typography variant="body1" color="green" align="center" sx={{ marginBottom: 2 }}>
            Password reset link has been sent to your email.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                  error={Boolean(error)}
                  helperText={error || 'Enter your email to receive the password reset link'}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ padding: '10px 0' }}
                >
                  Send Reset Link
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
        
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Remembered your password?{' '}
            <Button variant="text" onClick={() => navigate('/login')} sx={{ padding: 0 }}>
              Login
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
