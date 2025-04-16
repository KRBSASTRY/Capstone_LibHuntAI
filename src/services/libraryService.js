import axios from "axios";
import { getToken } from "./authService";

const API = "http://localhost:5002/api/libraries";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const fetchLibraryById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

export const fetchAllLibraries = async () => {
  try {
    const res = await axios.get(API); 
    return res.data;
  } catch (err) {
    console.error("Error fetching libraries:", err);
    return [];
  }
};

export const createLibrary = async (data) => {
  const res = await axios.post(API, data, authHeaders());
  return res.data;
};

export const updateLibrary = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data, authHeaders());
  return res.data;
};

export const deleteLibrary = async (id) => {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
};


export const bulkInsertLibraries = async (libs) => {
    const token = getToken(); // from authservice
    const res = await axios.post(`${API}/bulk`, libs, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
  