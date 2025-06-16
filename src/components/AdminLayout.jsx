import { useNavigate, Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";
import logo from '../pages/images/logo.png';
import frenchFlag from '../pages/images/france.png';
import englishFlag from '../pages/images/england.png';
import facebookIcon from '../pages/icons/facebook.svg';
import instagramIcon from '../pages/icons/instagrame.svg';
import twitterIcon from '../pages/icons/twitter.svg';
import youtubeIcon from '../pages/icons/youtube.svg';
import locationIcon from '../pages/icons/location.svg';
import mailIcon from '../pages/icons/mail.svg';
import phoneIcon from '../pages/icons/phone.svg';

// SVG Icons for sidebar
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// Other icons...
const ContributionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const SchoolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const DistributeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M9 15h9" />
  </svg>
);

const AdminUsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h6m4 0H13a2 2 0 00-2 2v6m0 4h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);


function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAdminName(user.username || user.name || "Admin");
      } catch (error) {
        console.error("Failed to parse admin user:", error);
        setAdminName("Admin");
      }
    } else {
      setAdminName("Admin");
    }
  }, []);

  const handleLogout = () => {
    API.logout();
    localStorage.removeItem("adminUser");
    delete API.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const socialIcons = {
    facebook: { icon: facebookIcon, url: 'https://www.facebook.com/Umwalimu.SACCO/' },
    twitter: { icon: twitterIcon, url: 'https://twitter.com/mwalimusacco' },
    instagram: { icon: instagramIcon, url: 'https://www.instagram.com/umwalimusacco/' },
    youtube: { icon: youtubeIcon, url: 'https://www.youtube.com/@UmwalimuSACCO' }
  };

  return (
    <div className="flex flex-col h-screen font-arial">
      {/* Upper bar with contact info */}
      <div>
        <div className="h-5 w-full bg-[#002f6c]"></div>
        <div className="flex justify-between items-center px-85">
          <div className="contact flex text-[#003366] text-sm">
            <p className="mr-5 flex items-center">
              <img src={locationIcon} alt="Location" className="w-4 h-4 mx-1" />
              KG 205 St, Kigali Gasabo Kimironko
            </p>
            <p className="mr-5 flex items-center">
              <img src={mailIcon} alt="Mail" className="w-4 h-4 mx-1" />
              umwalimu.sacco@umwalimusacco.rw
            </p>
            <p className="mr-5 flex items-center">
              <img src={phoneIcon} alt="Phone" className="w-4 h-4 mx-1" />
              +250 781 469 546
            </p>
          </div>
          <div className="social-links flex flex-row py-1">
            {Object.entries(socialIcons).map(([platform, { icon, url }]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2 hover:opacity-80"
              >
                <img
                  src={icon}
                  alt={platform}
                  className="w-4 h-4 align-middle"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Header Content */}
      <header className="flex flex-col">
        <div className="before-nav flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <img src={logo} alt="Logo" className="w-[300px]" />

          {/* Language Section */}
          <div className="flex items-center">
            <div className="lang-social flex flex-row items-center mx-8 my-12">
              <a href="#" className="flex items-center text-[#003366] mr-4">
                <img src={frenchFlag} alt="FR" className="w-[30px] h-5 mx-[5px] align-middle" />
                <span>FR</span>
              </a>
              <a href="#" className="flex items-center text-[#003366]">
                <img src={englishFlag} alt="EN" className="w-[30px] h-5 mx-[5px] align-middle" />
                <span>EN</span>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-[#003366] text-white text-sm font-bold px-0.5 py-0.5 flex justify-end">
          <div className="flex-1 flex items-center">
            {/* Admin Panel Title */}
            <div className="flex items-center py-3 px-4">

              {adminName && (
                <span className="text-sm text-gray-300 ml-2">
                  Welcome, {adminName}
                </span>
              )}
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/admin"
                end
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <DashboardIcon />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/admin/schools"
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <SchoolsIcon />
                <span>Schools</span>
              </NavLink>
              <NavLink
                to="/admin/contributions"
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <ContributionsIcon />
                <span>Contributions</span>
              </NavLink>
              <NavLink
                to="/admin/distribute"
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <DistributeIcon />
                <span>Distribution</span>
              </NavLink>
              <NavLink
                to="/admin/users"
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <AdminUsersIcon />
                <span>Users</span>
              </NavLink>
              <NavLink
                to="/admin/reports"
                className="flex items-center py-3 px-4 hover:bg-blue-800 rounded-md"
              >
                <ReportsIcon />
                <span>Reports</span>
              </NavLink>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center py-3 px-4 hover:bg-red-600 rounded-md"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f4f6f8] p-6 sm:p-8">
        {children}
      </main>

      <footer className="bg-[#003366] text-white text-center py-0.5">
        <p>
          Copyright © {new Date().getFullYear()} - Umwalimu Sacco Ltd Rwanda. All rights reserved.
          <span className="ml-2">Designed By Bizoneer</span>
        </p>
      </footer>
    </div>
  );
}

export default AdminLayout;
