import axios from "axios";
import { getToken } from "./authService";

// Use only one correct API base
const API = `${import.meta.env.VITE_REACT_APP_API_URL}/api/libraries`; 

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Fetch single library by ID
export const fetchLibraryById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

// ADD this new function:

export const fetchAllLibraries = async () => {
  try {
    const response = await axios.get(`${API}/all`); // hitting /api/libraries/all
    return response.data.libraries || [];
  } catch (error) {
    console.error("Failed to fetch all libraries:", error);
    return [];
  }
};

// Fetch libraries with pagination
export const fetchLibraries = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API}?page=${page}&limit=${limit}`);
    return {
      libraries: response.data.libraries,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch libraries:", error);
    return { libraries: [], totalPages: 1 };
  }
};

// Create a new library
export const createLibrary = async (data) => {
  const res = await axios.post(API, data, authHeaders());
  return res.data;
};

// Update existing library
export const updateLibrary = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, authHeaders());
  return res.data;
};

// Delete library
export const deleteLibrary = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
};

// Bulk insert libraries
export const bulkInsertLibraries = async (libs) => {
  const res = await axios.post(`${API}/bulk`, libs, authHeaders());
  return res.data;
};
