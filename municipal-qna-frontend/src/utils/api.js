// src/utils/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Use Vite's environment variable

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

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};
