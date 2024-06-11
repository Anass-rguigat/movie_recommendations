// src/api/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const login = (credentials) => api.post('/login', credentials);

export const register = (userData) => api.post('/register', userData);

export const getUser = async () => {
    try {
      const response = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      });

      const userData = response.data;
      // console.log(userData.user.id);
      localStorage.setItem('userId', userData.user.id); // Store user ID in local storage
      return userData;

    } catch (error) {
      throw new Error('Failed to fetch user data: ' + error.message);
    }
  };

export const logout = async () => {
  try {
    await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, 
      },
    });
    localStorage.removeItem('token'); 
  } catch (error) {
    throw new Error('Failed to logout: ' + error.message);
  }
};

export default api;