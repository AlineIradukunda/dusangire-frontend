import { useEffect, useState } from "react";
import API from "../api/api";

function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    API.getAdminUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Failed to fetch admin users. Ensure you are logged in with sufficient permissions."));
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Admin Users</h1>
      {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md max-w-2xl mx-auto">{error}</p>}
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200/70">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/70 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.is_superuser ? "Super Admin" : "Admin"}
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

export default AdminUsersList;
