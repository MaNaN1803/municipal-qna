import React, { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { Link } from "react-router-dom";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiRequest("/questions", "GET", null, token);
        const sortedQuestions = response.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setQuestions(sortedQuestions);
      } catch (err) {
        setError("Failed to load questions. Please try again later.");
      }
    };
  
    fetchQuestions();
  }, []);
  
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleString(); // Directly parse ISO date string
    } catch (e) {
      return "Invalid date";
    }
  };

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
          questions.map((question) => {
            const imageSrc = question.images?.[0]?.startsWith("http")
              ? question.images[0]
              : `http://localhost:5000/${question.images[0]}`;

            // Convert creation and update timestamps to readable format
            const createdAt = formatDate(question.createdAt);
            const updatedAt = formatDate(question.updatedAt);
            const gpsLocation = question.gpsLocation || "Not provided";

            return (
              <div
                key={question._id}
                className="p-6 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300"
              >
                {question.images?.length > 0 && (
                  <img
                    src={imageSrc || 'https://via.placeholder.com/400x200'} // Fallback image in case of missing image
                    alt={question.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h2 className="text-2xl font-semibold text-black mb-2">
                  {question.title}
                </h2>
                <p className="text-gray-600 mb-4">{question.description}</p>
                <p className="text-gray-500 text-xs">
                  <strong>Status:</strong> {question.status}
                </p>
                <p className="text-gray-500 text-xs">
                  <strong>Location:</strong> {gpsLocation}
                </p>
                <p className="text-gray-500 text-xs">
                  <strong>Created At:</strong> {createdAt}
                </p>
                <p className="text-gray-500 text-xs">
                  <strong>Last Updated:</strong> {updatedAt}
                </p>
                <p className="text-gray-500 text-xs">
                  <strong>Answers Count:</strong> {question.answersCount || "0"}
                </p>
                <div className="text-right">
                  <Link
                    to={`/questions/${question._id}`}
                    className="text-black font-semibold underline hover:text-gray-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
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
