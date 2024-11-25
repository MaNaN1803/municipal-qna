import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const AnswerQuestion = () => {
  const { id } = useParams(); // Question ID
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const questionData = await apiRequest(`/questions/${id}`, 'GET');
        const answerData = await apiRequest(`/answers/${id}`, 'GET');
        setQuestion(questionData);
        setAnswers(answerData);
      } catch (err) {
        setError('Error fetching data');
      }
    };
    fetchQuestionAndAnswers();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newAnswer = await apiRequest(
        '/answers',
        'POST',
        { content, questionId: id },
        token
      );
      setAnswers([newAnswer, ...answers]);
      setContent('');
    } catch (err) {
      setError('Error submitting answer');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 bg-white shadow rounded">
      {error && <p className="text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">{question.title}</h1>
      <p className="text-gray-700">{question.description}</p>

      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
          placeholder="Write your answer here..."
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Answer
        </button>
      </form>

      <h2 className="mt-6 text-xl font-semibold">Answers</h2>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <div key={answer._id} className="p-4 border-b mt-4">
            <p>{answer.content}</p>
            <p className="text-sm text-gray-500">By: {answer.user?.name}</p>
          </div>
        ))
      ) : (
        <p>No answers yet. Be the first to answer!</p>
      )}
    </div>
  );
};

export default AnswerQuestion;
