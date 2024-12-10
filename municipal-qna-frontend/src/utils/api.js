// src/utils/api.js
import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Fallback to local if not set

export const apiRequest = async (url, method = 'GET', body = null, token = '') => {
  const headers = {
    'Content-Type': body instanceof FormData ? 'multipart/form-data' : 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };

  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      data: body,
      headers,
    });

    return response.data; // Return data from the response
  } catch (error) {
    console.error('API Request Error:', error.response ? error.response.data : error.message);

    // Enhance error handling
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      'An unexpected error occurred. Please try again later.';
      
    throw new Error(errorMessage); // Throw meaningful error message
  }
};

// Optional: Export a utility to set the base URL for testing purposes
export const setApiBaseUrl = (url) => {
  if (url) API_URL = url;
};
