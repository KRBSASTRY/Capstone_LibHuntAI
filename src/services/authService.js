import axios from "axios";

const API = `${import.meta.env.VITE_REACT_APP_API_URL}/api/auth`;

export const register = async (userData) => {
  const res = await axios.post(`${API}/register`, userData);
  const { token, user } = res.data;

  const formattedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.isAdmin ? "admin" : "user",
  };

  localStorage.setItem("libhunt-token", token);
  localStorage.setItem("libhunt-user", JSON.stringify(formattedUser));

  return formattedUser;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API}/login`, { email, password });
  const { token, user } = res.data;

  const formattedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.isAdmin ? "admin" : "user",
  };

  localStorage.setItem("libhunt-token", token);
  localStorage.setItem("libhunt-user", JSON.stringify(formattedUser));

  return formattedUser;
};

export const logout = () => {
  localStorage.removeItem("libhunt-token");
  localStorage.removeItem("libhunt-user");
};

export const getToken = () => localStorage.getItem("libhunt-token");

export const getCurrentUser = () => {
  const user = localStorage.getItem("libhunt-user");
  return user ? JSON.parse(user) : null;
};

export const getUserFromAPI = async (token) => {
  const res = await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = res.data;
  const formattedUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.isAdmin ? "admin" : "user",
  };

  localStorage.setItem("libhunt-user", JSON.stringify(formattedUser));
  return formattedUser;
};
