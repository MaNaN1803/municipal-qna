import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiRequest("/questions");
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-6">Questions Feed</h1>
      {questions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <div
              key={question._id}
              className="p-6 bg-white shadow rounded transition hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
              <p className="text-gray-600 text-sm">{question.description}</p>
              <p className="text-gray-500 mt-2 text-xs">
                <strong>Category:</strong> {question.category}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No questions available.</p>
      )}
    </div>
  );
};

export default Home;
