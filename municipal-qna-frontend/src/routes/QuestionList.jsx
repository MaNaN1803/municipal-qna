// src/routes/QuestionList.jsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api'; // Utility function to make API requests

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the list of questions when the component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await apiRequest('/questions', 'GET', null, token); // Fetch the questions
        setQuestions(response); // Set the fetched questions to the state
      } catch (err) {
        setError('Failed to load questions. Please try again later.');
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []); // The empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      <h2>Questions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if any */}
      <ul>
        {questions.length > 0 ? (
          questions.map((question) => (
            <li key={question._id}>
              <h3>{question.title}</h3>
              <p>{question.description}</p>
              <p><strong>Category:</strong> {question.category}</p>
              <p><strong>Status:</strong> {question.status}</p>
              <p><strong>GPS Location:</strong> {question.gpsLocation}</p>
              <p><strong>Attempts:</strong> {question.attempts}</p>
              <div>
                <strong>Images:</strong>
                {question.images && question.images.length > 0 ? (
                  <ul>
                    {question.images.map((image, index) => (
                      <li key={index}>
                        <img src={image} alt={`Question Image ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No images available.</p>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </ul>
    </div>
  );
};

export default QuestionList;
