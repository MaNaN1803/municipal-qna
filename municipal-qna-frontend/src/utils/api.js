import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend API URL

// Utility function to make API requests
export const apiRequest = async (url, method = 'GET', data = null, token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios({
      url: `${API_URL}${url}`,
      method,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error with API request:', error);
    throw error;
  }
};
