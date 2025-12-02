import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Attaching JWT token automatically for all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// SIGNUP
export const signupUser = async (userData) => {
  try {
    const res = await API.post("/auth/signup", userData);
    return res.data; // { message }
  } catch (err) {
    const msg =
      err.response?.data?.message || "Signup failed. Please try again.";
    throw new Error(msg);
  }
};

// LOGIN
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);

    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || "Login failed. Please try again.";
    throw new Error(msg);
  }
};

export default API;