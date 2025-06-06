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
// 💳 Transfers APIs
// ==========================
const createTransfer = (data) => API.post("/transfers/", {
  SchoolCode: data.SchoolCode,
  Donor: data.Donor,
  Total_Amount: data.Total_Amount,
  contribution_type: data.contribution_type,
  AccountNumber: data.AccountNumber,
  NumberOfTransactions: data.NumberOfTransactions,
  timestamp: data.timestamp,
  school_ids: data.school_ids || []
});
const getTransfers = () => API.get("/transfers/");
const simulatePayment = (data) => API.post("/simulate-payment/", data);
const uploadTransfers = (formData) => {
  return API.post("/transfers/upload/", formData, {
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
  createTransfer,
  getTransfers,
  simulatePayment,
  getSchools,
  createSchool,
  distributeFunds,
  getDistributions,
  getAdminUsers,
  uploadTransfers,
  defaults: API.defaults,
};
