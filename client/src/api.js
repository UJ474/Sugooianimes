import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, // backend base URL
});


// Automatically attach JWT if logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Signup request
export const signupUser = async (userData, navigate) => {
  try {
    const res = await API.post('/auth/signup', userData);
    alert('Signup successful! Please login.');
    navigate('/login');
    return res.data;
  } catch (err) {
    if (err.response && err.response.data.message) {
      alert(`Signup failed: ${err.response.data.message}`);
    } else {
      alert('Signup failed: Server error.');
    }
    throw err;
  }
};


// Login request
export const loginUser = async (credentials, navigate) => {
  try {
    const res = await API.post('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    alert('Login successful!');
    navigate('/');
    return res.data;
  } catch (err) {
    if (err.response && err.response.data.message) {
      alert(`Login failed: ${err.response.data.message}`);
    } else {
      alert('Login failed: Server error.');
    }
    throw err;
  }
};

export default API;
