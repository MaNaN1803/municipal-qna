import React, { useState } from 'react';
import { apiRequest } from '../utils/api.js';

const SubmitQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');
  const [attempts, setAttempts] = useState('');
  const [images, setImages] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      category,
      gpsLocation,
      attempts,
      images: images.split(','),
    };

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage
      const response = await apiRequest('/questions', 'POST', formData, token);
      console.log('Question posted successfully:', response);
      // Reset form after submission
      setTitle('');
      setDescription('');
      setCategory('');
      setGpsLocation('');
      setAttempts('');
      setImages('');
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  return (
    <div>
      <h2>Submit a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="GPS Location"
          value={gpsLocation}
          onChange={(e) => setGpsLocation(e.target.value)}
        />
        <textarea
          placeholder="Attempts"
          value={attempts}
          onChange={(e) => setAttempts(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URLs (comma-separated)"
          value={images}
          onChange={(e) => setImages(e.target.value)}
        />
        <button type="submit">Submit Question</button>
      </form>
    </div>
  );
};

export default SubmitQuestion;
