import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Update if needed

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to headers if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// 🔐 Auth APIs
// ==========================
const login = (credentials) => API.post("/token/", credentials);
const refreshToken = (refreshToken) => API.post("/token/refresh/", { refresh: refreshToken });
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete API.defaults.headers.common['Authorization'];
  delete API.defaults.headers.Authorization;
};

// ==========================
// 📊 Reports APIs
// ==========================
const getReports = () => API.get("/reports/");
const generateReport = (reportData) => API.post("/reports/generate/", reportData);
const downloadReport = (id) => API.get(`/reports/${id}/download/`, { responseType: "blob" });

// ==========================
// 💳 Contributions APIs
// ==========================
const createContribution = (data) => API.post("/contributions/", data);
const getContributions = () => API.get("/contributions/");
const simulatePayment = (data) => API.post("/simulate-payment/", data);
const uploadContributions = (formData) => {
  return API.post("/contributions/upload/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ==========================
// 🏫 Schools APIs
// ==========================
const getSchools = () => API.get("/schools/");
const createSchool = (data) => API.post("/schools/", data);

// ==========================
// 💸 Distributions APIs
// ==========================
const distributeFunds = (data) => API.post("/distribute/", data);
const getDistributions = () => API.get("/distributions/");

// ==========================
// 👨‍💼 Admin Users APIs
// ==========================
const getAdminUsers = () => API.get("/admins/");

// ==========================
// Export all API functions
// ==========================
export default {
  login,
  refreshToken,
  logout,
  getReports,
  generateReport,
  downloadReport,
  createContribution,
  getContributions,
  simulatePayment,
  getSchools,
  createSchool,
  distributeFunds,
  getDistributions,
  getAdminUsers,
  uploadContributions,
  defaults: API.defaults,
};
