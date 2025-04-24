import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Avatar, Typography, TextField, 
  Button, Grid, Paper, Alert
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const loginSuccess = login(email, password);
    
    if (loginSuccess) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Hint: use admin@onemotive.com / admin123');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="flex items-center justify-center min-h-screen w-full">
      <Paper elevation={3} className="p-8 w-full">
        <Box className="flex flex-col items-center">
          <Avatar className="m-2 bg-blue-600">
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            One Motive Admin
          </Typography>
          {error && (
            <Alert severity="error" className="w-full mt-4">
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate className="mt-2 w-full">
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="mt-6 mb-4"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Typography variant="body2" className="text-gray-500">
                  Demo: admin@onemotive.com / admin123
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login; 