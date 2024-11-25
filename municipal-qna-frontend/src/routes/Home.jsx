import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center my-6">Questions Feed</h1>

      {questions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => {
            // Ensure the image URL is valid
            const imageSrc =
              question.images && question.images[0] && question.images[0].startsWith("http")
                ? question.images[0] // Direct URL to the image
                : `http://localhost:5000/${question.images[0]}`; // Assuming the images are stored locally in the backend

            // Formatting created and updated dates
            const createdAt = new Date(question.createdAt.$numberLong).toLocaleString();
            const updatedAt = new Date(question.updatedAt.$numberLong).toLocaleString();

            // Default values for missing fields
            const gpsLocation = question.gpsLocation || "Not provided";
            const attempts = question.attempts || "Not provided";

            return (
              <Link
                to={`/questions/${question._id}`} // Link to the detailed question page
                key={question._id}
                className="block bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl"
              >
                {/* Image Placeholder - can be an actual image if available */}
                <div className="relative w-full h-56 bg-gray-300">
                  <img
                    src={imageSrc || 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'} // Use fallback image
                    alt={question.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
                  <p className="text-gray-600 text-sm">{question.description}</p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Category:</strong> {question.category}
                  </p>

                  {/* New Fields Display */}
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Status:</strong> {question.status}
                  </p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Location:</strong> {gpsLocation}
                  </p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Created At:</strong> {createdAt}
                  </p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Last Updated:</strong> {updatedAt}
                  </p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Answers Count:</strong> {question.answersCount.$numberInt}
                  </p>
                  <p className="text-gray-500 mt-2 text-xs">
                    <strong>Previous Attempts:</strong> {attempts}
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
