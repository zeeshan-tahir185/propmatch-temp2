'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Session timeout (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  let sessionTimer = null;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const sessionStart = localStorage.getItem('session_start');

        if (storedToken && storedUser && sessionStart) {
          const sessionAge = Date.now() - parseInt(sessionStart);
          
          if (sessionAge < SESSION_TIMEOUT) {
            // Valid session - restore user state
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            startSessionTimer();
          } else {
            // Session expired - clear everything
            logout();
          }
        } else {
          // No valid session data - ensure clean state
          logout();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Start session timer
  const startSessionTimer = () => {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      logout();
      alert('Your session has expired. Please log in again.');
    }, SESSION_TIMEOUT);
  };

  // Reset session timer on user activity
  const resetSessionTimer = () => {
    if (token) {
      localStorage.setItem('session_start', Date.now().toString());
      startSessionTimer();
    }
  };

  // Set up activity listeners to reset timer
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const resetTimer = () => resetSessionTimer();
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      clearTimeout(sessionTimer);
    };
  }, [token]);

  // Login function
  const login = (userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      
      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('session_start', Date.now().toString());
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      startSessionTimer();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('session_start');
      
      // Clear axios header
      delete axios.defaults.headers.common['Authorization'];
      
      clearTimeout(sessionTimer);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data?.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshProfile,
    resetSessionTimer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};