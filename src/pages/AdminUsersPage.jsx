import { useEffect, useState } from "react";
import API from "../api/api";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      API.getAdminUsers()
        .then((res) => {
          setUsers(res.data);
          setError("");
        })
        .catch(() => {
          setError("Failed to fetch admin users. You might need to be logged in with sufficient permissions.");
          setUsers([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading admin users...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Admin Users Management</h1>
      
      {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md max-w-3xl mx-auto">{error}</p>}
      
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">All Admin Users</h2>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200/70">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Super Admin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/70 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.is_superuser ? 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span> :
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                      }
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && <p className="text-gray-500 text-center py-4">No admin users found.</p>
        )}
      </div>
    </>
  );
}

export default AdminUsersPage;
