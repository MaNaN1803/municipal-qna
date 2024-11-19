// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if the token exists

  if (!isAuthenticated) {
    // If not authenticated, redirect to signup page
    return <Navigate to="/signup" />;
  }

  return children; // Render the children (protected components)
};

export default PrivateRoute;
