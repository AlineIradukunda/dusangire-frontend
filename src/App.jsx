import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ContributionsList from "./pages/ContributionsList";
import SchoolsList from "./pages/SchoolsList";
import DistributionPage from "./pages/DistributionPage";
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import API from "./api/api"; // Import API to use for token check
import AdminLayout from "./components/AdminLayout"; // Import AdminLayout
import AdminUsersPage from "./pages/AdminUsersPage"; // Import AdminUsersPage


// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }
  // If token exists, set it in API headers for subsequent requests
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return <AdminLayout>{children}</AdminLayout>;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} /> {/* Add login route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/contributions" 
          element={
            <ProtectedRoute>
              <ContributionsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/schools" 
          element={
            <ProtectedRoute>
              <SchoolsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/distribute" 
          element={
            <ProtectedRoute>
              <DistributionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminUsersPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
