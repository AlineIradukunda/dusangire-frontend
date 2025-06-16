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
    <div className="relative flex flex-col font-arial">
      {/* Upper bar with contact info */}
      <div className="bg-[#003366]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="contact flex space-x-6 text-white text-sm">
              <p className="flex items-center transition-transform hover:transform hover:translate-y-[-2px]">
                <img src={locationIcon} alt="Location" className="w-4 h-4 mr-2 opacity-80" />
                <span className="hidden md:inline">KG 205 St, Kigali Gasabo Kimironko</span>
              </p>
              <p className="flex items-center transition-transform hover:transform hover:translate-y-[-2px]">
                <img src={mailIcon} alt="Mail" className="w-4 h-4 mr-2 opacity-80" />
                <span className="hidden md:inline">umwalimu.sacco@umwalimusacco.rw</span>
              </p>
              <p className="flex items-center transition-transform hover:transform hover:translate-y-[-2px]">
                <img src={phoneIcon} alt="Phone" className="w-4 h-4 mr-2 opacity-80" />
                <span>+250 781 469 546</span>
              </p>
            </div>
            <div className="social-links flex space-x-4">
              {Object.entries(socialIcons).map(([platform, { icon, url }]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all hover:scale-110"
                >
                  <img src={icon} alt={platform} className="w-5 h-5 filter brightness-0 invert" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Content */}
      <header className="shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-6 py-4">
            <img src={logo} alt="Logo" className="w-[250px] transition-transform hover:scale-105" />

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-full border border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-colors">
                  <img src={frenchFlag} alt="FR" className="w-6 h-4" />
                  <span>FR</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 rounded-full border border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white transition-colors">
                  <img src={englishFlag} alt="EN" className="w-6 h-4" />
                  <span>EN</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
      </header>
      <nav className="sticky z-50 top-0 bg-[#003366] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center py-3">
              {adminName && (
                <span className="text-white font-medium">
                  Welcome, {adminName}
                </span>
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              {[
                { to: "/admin", icon: <DashboardIcon />, text: "Dashboard" },
                { to: "/admin/schools", icon: <SchoolsIcon />, text: "Schools" },
                { to: "/admin/contributions", icon: <ContributionsIcon />, text: "Contributions" },
                { to: "/admin/distribute", icon: <DistributeIcon />, text: "Distribution" },
                { to: "/admin/users", icon: <AdminUsersIcon />, text: "Users" },
                { to: "/admin/reports", icon: <ReportsIcon />, text: "Reports" }
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-700 ${isActive ? 'bg-blue-700 text-white' : 'text-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.text}</span>
                </NavLink>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white rounded-md transition-colors hover:bg-red-600"
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className=" bg-[#f4f6f8]">
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
