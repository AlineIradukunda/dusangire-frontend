import { useNavigate, Link, NavLink } from "react-router-dom";
import API from "../api/api";
import { useState, useEffect } from "react"; // Import useState and useEffect

// SVG Icons for sidebar
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ContributionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const SchoolsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const DistributeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M9 15h9" /></svg>;
const AdminUsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState(""); // State for admin's name

  useEffect(() => {
    // Attempt to get admin user info from localStorage
    const storedUser = localStorage.getItem("accessToken"); // Assuming user info is stored with key "adminUser"
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(user)
        // Assuming the user object has a 'username' or 'name' property
        setAdminName(user.username || user.name || "Admin"); 
      } catch (error) {
        console.error("Failed to parse admin user from localStorage:", error);
        setAdminName("Admin"); // Fallback name
      }
    } else {
      setAdminName("Admin"); // Fallback if no user info in localStorage
    }
  }, []);

  const handleLogout = () => {
    API.logout(); // Clear tokens from localStorage
    localStorage.removeItem("adminUser"); // Clear admin user info from localStorage
    delete API.defaults.headers.common['Authorization']; // Clear token from API instance
    navigate("/login"); // Redirect to login page
  };


  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out group ${
      isActive
        ? "bg-slate-900 text-white shadow-lg"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;
  
  const navLinkContent = (IconComponent, text) => (
    <>
      <IconComponent />
      {text}
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#e0e6ea] via-[#e0e6ea] to-[#e0e6ea]"> {/* Slightly lighter gradient for the whole screen */}
      {/* Sidebar */}
      <aside className="w-64 bg-[#0984e3] text-gray-100 flex flex-col shadow-2xl">
        <div className="h-20 flex flex-col items-center justify-center border-b border-slate-700 p-2 text-center"> {/* Adjusted height, added padding and flex-col for stacking */}
          <Link to="/admin" className="text-xl font-semibold text-white hover:text-gray-200 transition-colors">
            Admin Panel
          </Link>
          {adminName && (
            <span className="text-sm text-gray-300 mt-1">Welcome, {adminName}</span>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink to="/admin" end className={navLinkClasses}>
            {navLinkContent(DashboardIcon, "Dashboard")}
          </NavLink>
          <NavLink to="/admin/contributions" className={navLinkClasses}>
            {navLinkContent(ContributionsIcon, "Contributions")}
          </NavLink>
          <NavLink to="/admin/schools" className={navLinkClasses}>
            {navLinkContent(SchoolsIcon, "Schools")}
          </NavLink>
          <NavLink to="/admin/distribute" className={navLinkClasses}>
            {navLinkContent(DistributeIcon, "Distribute Funds")}
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClasses}>
            {navLinkContent(AdminUsersIcon, "Admin Users")}
          </NavLink>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-150 ease-in-out group"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* The main content area uses a consistent gradient background */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#dfe6e9] via-[#dfe6e9] to-[#dfe6e9]">
          <div className="container mx-auto p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


export default AdminLayout;
