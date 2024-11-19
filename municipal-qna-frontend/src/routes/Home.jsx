import React, { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiRequest('/questions');
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>Questions Feed</h1>
      {questions.length > 0 ? (
        <ul>
          {questions.map((question) => (
            <li key={question._id}>
              <h2>{question.title}</h2>
              <p>{question.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default Home;
