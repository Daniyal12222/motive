import { createContext, useState, useContext } from 'react';

// Create context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Provider component
export const AppProvider = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // Data states
  const [coaches, setCoaches] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Mock login function (in a real app, this would make an API call)
  const login = (email, password) => {
    // Simulate an API call
    if (email === 'admin@onemotive.com' && password === 'admin123') {
      setUser({ 
        id: 1, 
        name: 'Admin User', 
        email, 
        role: 'admin' 
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        coaches,
        setCoaches,
        athletes,
        setAthletes,
        groups,
        setGroups,
        events,
        setEvents,
        schools,
        setSchools
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 