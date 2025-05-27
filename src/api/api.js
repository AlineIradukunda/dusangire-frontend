import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Update to your production URL when needed

// Axios instance with base config
const API = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }, 
});

// Add token to headers automatically if present
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && !config.headers.Authorization) { // Add token if not already set
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================
// 🔐 Auth APIs
// ==========================

// Login and receive tokens
const login = (credentials) => API.post("/token/", credentials);

// Refresh the access token
const refreshToken = (refreshToken) =>
    API.post("/token/refresh/", { refresh: refreshToken });

// Optional: logout is usually just frontend (remove tokens)
const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete API.defaults.headers.common['Authorization']; // Ensure token is removed from instance defaults
    delete API.defaults.headers.Authorization; // Ensure token is removed from instance defaults for subsequent requests if common is not used
};

// ==========================
// 💳 Contributions
// ==========================

// Public endpoint to submit a contribution
const createContribution = (data) => API.post("/contributions/", data);

// Admin: Get all contributions
const getContributions = () => API.get("/contributions/");

// Public endpoint to simulate a payment (creates a contribution)
const simulatePayment = (data) => API.post("/simulate-payment/", data);

// ==========================
// 🏫 Schools
// ==========================

// Get all schools (public GET)
const getSchools = () => API.get("/schools/");

// Admin: Create a new school
const createSchool = (data) => API.post("/schools/", data);

// ==========================
// 💸 Distributions
// ==========================

// Admin: Create a new distribution
const distributeFunds = (data) => API.post("/distribute/", data);

// Admin: Get all distributions
const getDistributions = () => API.get("/distributions/");

// ==========================
// 👨‍💼 Admin Users
// ==========================

// Admin: Get all admin users
const getAdminUsers = () => API.get("/admins/");


// ==========================
// Export All
// ==========================

export default {
    login,
    refreshToken,
    logout,
    createContribution,
    getContributions,
    simulatePayment, // Added
    getSchools,
    createSchool, // Added
    distributeFunds, // Modified (parameter behavior, actual signature change was implicit if data was needed)
    getDistributions, // Added
    getAdminUsers, // Added
    // Expose the defaults to allow direct manipulation if needed (e.g., setting Authorization header after login)
    defaults: API.defaults, 
};
