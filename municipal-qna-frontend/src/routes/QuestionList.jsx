import React, { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiRequest("/questions", "GET", null, token);
        setQuestions(response);
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-black">
        All Questions
      </h1>
      {error && (
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      )}
      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question._id}
              className="p-6 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-black mb-2">
                {question.title}
              </h2>
              <p className="text-gray-600 mb-4">{question.description}</p>
              <div className="text-right">
                <button className="text-black font-semibold underline hover:text-gray-700">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg">
            No questions available. Be the first to ask one!
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
