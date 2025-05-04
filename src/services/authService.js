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
    isVerified: user.isVerified,
    isGithubAuth: user.isGithubAuth,
    githubUsername: user.githubUsername,
    githubAvatar: user.githubAvatar,
  };

  console.log("[authService] Register token:", token);
  console.log("[authService] Register user:", formattedUser);

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
    isVerified: user.isVerified,
    isGithubAuth: user.isGithubAuth,
    githubUsername: user.githubUsername,
    githubAvatar: user.githubAvatar,
  };

  console.log("[authService] Login token:", token);
  console.log("[authService] Login user:", formattedUser);

  localStorage.setItem("libhunt-token", token);
  localStorage.setItem("libhunt-user", JSON.stringify(formattedUser));

  return formattedUser;
};

export const logout = () => {
  console.log("[authService] Logging out...");
  localStorage.removeItem("libhunt-token");
  localStorage.removeItem("libhunt-user");
};

export const getToken = () => {
  const token = localStorage.getItem("libhunt-token");
  console.log("[authService] Retrieved token:", token);
  return token;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("libhunt-user");
  console.log("[authService] Retrieved user from localStorage:", user);
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
    isVerified: user.isVerified,
    isGithubAuth: user.isGithubAuth,
    githubUsername: user.githubUsername,
    githubAvatar: user.githubAvatar,
  };

  console.log("[authService] Synced user from API:", formattedUser);
  localStorage.setItem("libhunt-user", JSON.stringify(formattedUser));
  return formattedUser;
};
