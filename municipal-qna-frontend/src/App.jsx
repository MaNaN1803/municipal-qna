import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import SubmitQuestion from './routes/SubmitQuestion';
import QuestionList from './routes/QuestionList';
import Profile from './routes/Profile';
import Navbar from './components/Navbar';
import SearchResults from './routes/SearchResults';
import AnswerQuestion from './routes/AnswerQuestion';
const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar />}
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                  
                </PrivateRoute>
              }
            />
            <Route
              path="/submit-question"
              element={
                <PrivateRoute>
                  <SubmitQuestion />
                </PrivateRoute>
              }
            />
            <Route path="/questions" element={ <PrivateRoute><QuestionList /></PrivateRoute>} />
            <Route path="/search" element={
              <PrivateRoute><SearchResults /></PrivateRoute>   } />
            <Route
              path="/questions"
              element={
                <PrivateRoute>
                  <QuestionList />
                </PrivateRoute>
              }
            />
            <Route
  path="/profile"
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  }
/>
<Route
  path="/questions/:id"
  element={
    <PrivateRoute>
      <AnswerQuestion />
    </PrivateRoute>
  }
/>
<Route path="/answer/:id" element={<AnswerQuestion />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
