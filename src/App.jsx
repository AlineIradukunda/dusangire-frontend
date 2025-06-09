import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ContributionsList from "./pages/ContributionsList";
import SchoolsList from "./pages/SchoolsList";
import DistributionPage from "./pages/DistributionPage";
import LoginPage from "./pages/LoginPage";
import API from "./api/api";
import AdminLayout from "./components/AdminLayout";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminReportsPage from "./pages/AdminReportsPage";


// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

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
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/report" element={<AdminReportsPage />} />

      </Routes>
    </Router>
  );
}

export default App;
