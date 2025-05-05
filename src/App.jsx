import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Coaches from './pages/Coaches';
import CoachDetail from './pages/CoachDetail';
import Athletes from './pages/Athletes';
import AthleteDetail from './pages/AthleteDetail';
import Groups from './pages/Groups';
import Schools from './pages/Schools';
import GroupDetail from './pages/teamsDetail';
import SchoolDetail from './pages/schoolDetail';
import Profile from './pages/profile';
import ForgotPassword from './pages/forgetPassword';
// Context
import { AppProvider, useAppContext } from './context/AppContext';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Tailwind blue-600
      light: '#3b82f6', // Tailwind blue-500
      dark: '#1d4ed8', // Tailwind blue-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f43f5e', // Tailwind rose-500
      light: '#fb7185', // Tailwind rose-400
      dark: '#e11d48', // Tailwind rose-600
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb', // Tailwind gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937', // Tailwind gray-800
      secondary: '#4b5563', // Tailwind gray-600
    },
    error: {
      main: '#ef4444', // Tailwind red-500
    },
    warning: {
      main: '#f59e0b', // Tailwind amber-500
    },
    info: {
      main: '#3b82f6', // Tailwind blue-500
    },
    success: {
      main: '#10b981', // Tailwind emerald-500
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppContent() {
  const { isAuthenticated } = useAppContext();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, ready to use the dashboard');
    }
  }, [isAuthenticated]);
  
  return (
    <div className="min-h-screen antialiased text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="coaches" element={<Coaches />} />
          <Route path="coach/:id" element={<CoachDetail />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="athlete/:id" element={<AthleteDetail />} />
          <Route path="groups" element={<Groups />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="schools" element={<Schools />} />
          <Route path="/school/:schoolId" element={<SchoolDetail/>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
