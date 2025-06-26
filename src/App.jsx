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
import PendingDeletions from "./pages/PendingDeletions";
import TrashPage from "./pages/TrashPage";

// ✅ ProtectedRoute component with role-based access
const ProtectedRoute = ({ children, excludeRoles = [] }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (excludeRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Excluded for admin */}
        <Route
          path="/admin/pending-deletions"
          element={
            <ProtectedRoute excludeRoles={["admin"]}>
              <PendingDeletions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/trash"
          element={
            <ProtectedRoute excludeRoles={["admin"]}>
              <TrashPage />
            </ProtectedRoute>
          }
        />

        {/* Shared access (admin & superuser) */}
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
            <ProtectedRoute excludeRoles={["admin"]}>
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
      </Routes>
    </Router>
  );
}

export default App;
