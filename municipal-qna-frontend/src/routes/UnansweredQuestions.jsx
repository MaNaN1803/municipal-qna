import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const UnansweredQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiRequest("/questions");
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(error.message || 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const unansweredQuestions = questions.filter((question) => question.answersCount === 0);

  const getImageSrc = (images) => {
    if (!images?.length) {
      return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
    }
    
    const imagePath = images[0];
    return imagePath.startsWith("http") 
      ? imagePath 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${imagePath}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {error ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-center text-gray-500">Loading unanswered questions...</p>
        </div>
      ) : (
        <>
          <header className="bg-blue-600 text-white py-8 px-4">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
              <h1 className="text-4xl font-bold text-center md:text-left mb-4 md:mb-0">
                Unanswered Questions
              </h1>
              <p className="text-center md:text-left text-lg">
                Explore questions waiting for your insights!
              </p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-6">
            {unansweredQuestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unansweredQuestions.map((question) => (
                  <div key={question._id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                    <Link to={`/questions/${question._id}`}>
                      <div className="p-4">
                        <h2 className="text-lg font-bold mb-2">{question.title}</h2>
                        <p className="text-sm text-gray-600">{question.description}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          <span>
                            <strong>Category:</strong> {question.category}
                          </span>{" "}
                          |{" "}
                          <span>
                            <strong>Created:</strong> {new Date(question.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-6">
                No unanswered questions available.
              </p>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default UnansweredQuestions;