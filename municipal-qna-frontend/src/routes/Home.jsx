import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiRequest("/questions");
        console.log("Questions:", data); // Debug the API response
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const getImageSrc = (images) => {
    if (images && images[0] && images[0].startsWith("http")) {
      return images[0];
    }
    if (images && images[0]) {
      return `http://localhost:5000/${images[0]}`;
    }
    return "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
  };

  const formatDate = (dateField) => {
    if (!dateField) return "Unknown";
    try {
      return new Date(dateField).toLocaleString(); // Parse ISO date string
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-center my-8 text-gray-800">
        Questions Feed
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Browse the latest questions posted by users. Click on a question to
        provide answers or view details.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading questions...</p>
      ) : questions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {questions.map((question) => {
            const imageSrc = getImageSrc(question.images);
            const createdAt = formatDate(question.createdAt);
            const gpsLocation = question.gpsLocation || "Not provided";
            const attempts = question.attempts || "Not provided";

            return (
              <Link
                to={`/questions/${question._id}`}
                key={question._id}
                className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 min-h-[300px]"
              >
                <div className="relative w-full h-48 bg-gray-200">
                  <img
                    src={imageSrc}
                    alt={question.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    {question.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {question.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-gray-500 text-xs">
                      <strong>Category:</strong> {question.category}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`${
                          question.status === "resolved"
                            ? "text-green-600"
                            : question.status === "under review"
                            ? "text-yellow-500"
                            : "text-red-600"
                        } font-semibold`}
                      >
                        {question.status}
                      </span>
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Location:</strong> {gpsLocation}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Created:</strong> {createdAt}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <p className="text-gray-500 text-xs">
                    <strong>Answers:</strong> {question.answersCount || "0"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    <strong>Attempts:</strong> {attempts}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No questions available.</p>
      )}
    </div>
  );
};

export default Home;
