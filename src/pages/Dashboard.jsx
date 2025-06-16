import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import backgroundImage from '../pages/images/abana.jpeg';

// Icons for cards (can be replaced with more sophisticated ones or SVGs)
const ContributionsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SchoolsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const DistributionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0015.357 2M9 15h9" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;

function Dashboard() {
  const [stats, setStats] = useState({
    totalTransfers: 0,
    numberOfSchools: 0,
    totalDistributed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const [transfersRes, schoolsRes, distributionsRes] = await Promise.all([
          API.getTransfers(),
          API.getSchools(),
          API.getDistributions(),
        ]);

        const totalTransfers = transfersRes.data.reduce(
          (sum, t) => sum + parseFloat(t.Total_Amount),
          0
        );
        const numberOfSchools = schoolsRes.data.length;
        const totalDistributed = distributionsRes.data.reduce(
          (sum, d) => sum + parseFloat(d.amount),
          0
        );

        setStats({
          totalTransfers,
          numberOfSchools,
          totalDistributed,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        const errorMessage = err.message || 'Failed to fetch dashboard data';
        setError(errorMessage);
        // Optionally show user-friendly error message
        if (err.originalError?.code === 'ERR_NETWORK') {
          // Handle network error specifically
          console.error('Network Error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, unit = "" }) => (
    <div className="bg-white/90 backdrop-blur-xl shadow-lg rounded-xl p-6 flex items-center space-x-4">
      <div className="p-3 rounded-full bg-gray-100">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">
          {value}
          {unit && <span className="text-lg font-medium"> {unit}</span>}
        </p>
      </div>
    </div>
  );

  const ActionCard = ({ to, title, description, icon }) => (
    <Link to={to} className="block bg-white/90 backdrop-blur-xl shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out group">
      <div className="flex items-center mb-3">
        <div className="p-2 mr-3 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-[#27548A] group-hover:text-[#183B4E] transition-colors">{title}</h2>
      </div>
      <p className="text-gray-700 text-sm">{description}</p>
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          width: '100%'
        }}
      >
        <div className="min-h-full bg-blue/100 backdrop-blur-sm px-8 py-10">
          <div className="space-y-10">
            <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">School Feeding Contributions For Intended Schools</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Transfers"
                value={stats.totalTransfers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                unit="RWF"
                icon={<ContributionsIcon />}
              />
              <StatCard
                title="Registered Schools"
                value={stats.numberOfSchools}
                icon={<SchoolsIcon />}
              />
              <StatCard
                title="Total Funds Distributed"
                value={stats.totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                unit="RWF"
                icon={<DistributionIcon />}
              />
            </div>

            {/* Quick Actions / Navigation */}
            <div>
              <h2 className="text-2xl font-semibold text-[#27548A] mb-4 mt-10">Manage System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <ActionCard
                  to="/admin/contributions"
                  title="Transfers"
                  description="View and manage all transfers."
                  icon={<ContributionsIcon />}
                />
                <ActionCard
                  to="/admin/schools"
                  title="Schools"
                  description="Manage school listings and details."
                  icon={<SchoolsIcon />}
                />
                <ActionCard
                  to="/admin/distribute"
                  title="Distribute Funds"
                  description="Allocate and distribute funds to schools."
                  icon={<DistributionIcon />}
                />
                <ActionCard
                  to="/admin/users"
                  title="Admin Users"
                  description="Manage administrator accounts."
                  icon={<UsersIcon />}
                />
                <ActionCard
                  to="/admin/reports" // Updated from "/report" to match AdminReportsPage route
                  title="Reports"
                  description="View and download transaction summaries."
                  icon={<span className="text-3xl">📄</span>}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;