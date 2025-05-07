import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const loginSuccess = login(email, password);

    if (loginSuccess) {
      navigate("/dashboard");
    } else {
      setError(
        "Invalid email or password. Hint: use admin@onemotive.com / admin123"
      );
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Motive
          </Typography>
          {error && (
            <Alert severity="error" className="w-full mt-4">
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="mt-2 w-full"
          >
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
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Typography variant="body2" sx={{ textAlign: "right", mt: 2 }}>
                  <Link
                    to="/forgot"
                    style={{ color: "#1C7293", textDecoration: "underline" }}
                  >
                    Forgot password?
                  </Link>
                </Typography>
              </Grid>
            </Grid>
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
