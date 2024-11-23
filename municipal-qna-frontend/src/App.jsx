// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute'; // Import the PrivateRoute component
import Home from './routes/Home'; // Protected route component
import Login from './routes/Login'; // Login page component
import Signup from './routes/Signup'; // Sign-up page component
import SubmitQuestion from './routes/SubmitQuestion'; // Submit question page
import QuestionList from './routes/QuestionList';
import Profile from './routes/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login page accessible to everyone */}
        <Route path="/login" element={<Login />} />

        {/* Sign-up page accessible to everyone */}
        <Route path="/signup" element={<Signup />} />

        {/* Home page - protected route, only accessible with authentication */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Submit question page - protected route, only accessible with authentication */}
        <Route
          path="/submit-question"
          element={
            <PrivateRoute>
              <SubmitQuestion />
            </PrivateRoute>
          }
        />
        <Route path="/questions" element={<QuestionList />} /> 
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
};

export default App;
