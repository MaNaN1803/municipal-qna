import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const SubmitQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/questions", "POST", formData);
      navigate("/home");
    } catch (error) {
      setError("Failed to submit question. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit a Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          rows="4"
          required
        ></textarea>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          <option value="Waste Management">Waste Management</option>
          <option value="Road Maintenance">Road Maintenance</option>
          <option value="Public Safety">Public Safety</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitQuestion;
