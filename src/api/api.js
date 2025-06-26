import axios from "axios";

// Default to localhost if no environment variable is set
const BASE_URL = "http://localhost:8000/api";

// Create axios instance with default config
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error detected:", error);
      return Promise.reject({
        message: "Server is unreachable. Please check your connection and try again.",
        originalError: error,
      });
    }
    return Promise.reject(error);
  }
);

// ==========================
// 🔐 Auth APIs
// ==========================
const login = (credentials) => API.post("/token/", credentials);
const refreshToken = (refreshToken) => API.post("/token/refresh/", { refresh: refreshToken });
const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete API.defaults.headers.common["Authorization"];
  delete API.defaults.headers.Authorization;
};

// ==========================
// 📊 Reports APIs
// ==========================
const getReports = () => API.get("/reports/");
const generateReport = (params) => API.get("/reports/generate/", {
  params,
  responseType: "blob",
  headers: {
    Accept: "application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv",
  },
});
const downloadReport = (id) => API.get(`/reports/${id}/download/`, { responseType: "blob" });

// ==========================
// 💳 Transfers APIs
// ==========================
const createTransfer = (data) => API.post("/transfers/", {
  SchoolCode: data.SchoolCode,
  Donor: data.Donor,
  Amount: data.Amount,
  contribution_type: data.contribution_type,
  AccountNumber: data.AccountNumber,
  NumberOfTransactions: data.NumberOfTransactions,
  timestamp: data.timestamp,
  school_ids: data.school_ids || []
});
const getTransfers = () => API.get("/transfers/");
const getDeletedTransfers = () => API.get("/transfers/deleted/"); // NEW - get deleted transfers
const simulatePayment = (data) => API.post("/simulate-payment/", data);
const uploadTransfers = (formData) => {
  return API.post("/transfers/upload/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const markTransferAsPendingDelete = (id, reason, token) =>
  API.put(`/transfers/${id}/delete/`, { delete_reason: reason }, {
    headers: { Authorization: `Bearer ${token}` }
  });
const recoverTransfer = (id) =>
  API.put(`/transfers/${id}/recover/`);
const confirmTransferDelete = (id) =>
  API.delete(`/transfers/${id}/confirm/`);

// ==========================
// 🏫 Schools APIs
// ==========================
const getSchools = () => API.get("/schools/");
const getDeletedSchools = () => API.get("/schools/deleted/"); // NEW - get deleted schools
const createSchool = (data) => API.post("/schools/", data);
const markSchoolAsPendingDelete = (id, reason, token) =>
  API.put(`/schools/${id}/delete/`, { delete_reason: reason }, {
    headers: { Authorization: `Bearer ${token}` }
  });
const recoverSchool = (id) =>
  API.put(`/schools/${id}/recover/`);
const confirmSchoolDelete = (id) =>
  API.delete(`/schools/${id}/confirm/`);

// ==========================
// 💸 Distributions APIs
// ==========================
const distributeFunds = (data) => API.post("/distribute/", data);
const getDistributions = () => API.get("/distributions/");
const getDeletedDistributions = () => API.get("/distributions/deleted/"); // NEW - get deleted distributions
const markDistributionAsPendingDelete = (id, reason, token) =>
  API.put(`/distributions/${id}/delete/`, { delete_reason: reason }, {
    headers: { Authorization: `Bearer ${token}` }
  });
const recoverDistribution = (id) => API.put(`/distributions/${id}/recover/`);
const confirmDistributionDelete = (id) => API.delete(`/distributions/${id}/confirm/`);

// ==========================
// 👨‍💼 Admin Users APIs
// ==========================
const getAdminUsers = () => API.get("/admins/");

// ==========================
// 📈 Transaction Summary API
// ==========================
const getTransactionSummary = (params) => API.get('/transaction-summary/', { params });

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
  getDeletedTransfers,       // NEW
  simulatePayment,
  uploadTransfers,
  markTransferAsPendingDelete,
  recoverTransfer,
  confirmTransferDelete,
  getSchools,
  getDeletedSchools,         // NEW
  createSchool,
  distributeFunds,
  getDistributions,
  getDeletedDistributions,   // NEW
  markDistributionAsPendingDelete,
  recoverDistribution,
  confirmDistributionDelete,
  getAdminUsers,
  getTransactionSummary,
  markSchoolAsPendingDelete,
  recoverSchool,
  confirmSchoolDelete,
  defaults: API.defaults,
};
