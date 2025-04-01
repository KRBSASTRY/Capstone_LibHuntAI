
import axios from "axios";

const API = "http://localhost:5002/api/auth";

export const register = async (userData) => {
  const res = await axios.post(`${API}/register`, userData);
  return res.data;
};

export const login = async (credentials) => {
    const res = await axios.post(`${API}/login`, credentials);
    const { token, user } = res.data;
  
    const formattedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? "admin" : "user"
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
