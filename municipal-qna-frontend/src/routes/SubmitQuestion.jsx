import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

const SubmitQuestion = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    gpsLocation: '', // New field for GPS Location
    attempts: '', // New field for previous attempts
  });
  const [images, setImages] = useState([]); // For handling multiple images
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files)); // Store multiple images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      images.forEach((image) => form.append('images', image)); // Append all images

      await apiRequest('/questions', 'POST', form, token, true); // true for multipart data
      navigate('/home');
    } catch (error) {
      setError('Failed to submit question. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Submit a Question</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <option value="" disabled>Select Category</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Road Maintenance">Road Maintenance</option>
          <option value="Public Safety">Public Safety</option>
        </select>
        <input
          type="text"
          name="gpsLocation"
          placeholder="Enter GPS Location (e.g., 28.6139, 77.2090)"
          value={formData.gpsLocation}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />
        <textarea
          name="attempts"
          placeholder="Previous attempts to resolve the issue"
          value={formData.attempts}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
          rows="3"
        ></textarea>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full mb-4"
          accept="image/*"
          multiple
        />
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
