import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import { LockOutlined, CheckCircleOutline, ArrowBack } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Simulating the reset password process
    setTimeout(() => {
      setIsSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      className="flex items-center justify-center min-h-screen w-full"
    >
      <Paper elevation={3} className="p-8 w-full">
        <Box className="flex flex-col items-center">
          <Avatar className="m-2 bg-blue-600">
            {isSuccess ? <CheckCircleOutline /> : <LockOutlined />}
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {isSuccess ? 'Email Sent' : 'Reset Password'}
          </Typography>
          
          {isSuccess ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Password reset link has been sent to your email.
              </Alert>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam folder.
              </Typography>
              <Button
                startIcon={<ArrowBack />}
                variant="outlined"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
                
                <Grid container>
                  <Grid item xs>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      <Link 
                        to="/login"
                        style={{ color: '#1C7293', textDecoration: 'underline' }}
                      >
                        Back to Login
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword; 