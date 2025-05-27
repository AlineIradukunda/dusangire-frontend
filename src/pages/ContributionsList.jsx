import { useEffect, useState } from "react";
import API from "../api/api";


function ContributionsList() {
  const [contributions, setContributions] = useState([]);
  const [formData, setFormData] = useState({
    contributor_name: "",
    amount: "",
    payment_method: "momo", // or "bank"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch contributions when component loads
  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = () => {
    API.getContributions()
      .then((res) => setContributions(res.data))
      .catch(() => setError("Failed to fetch contributions. You might need to log in."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    API.createContribution(formData)
      .then(() => {
        setMessage("Contribution added successfully!");
        setFormData({ contributor_name: "", amount: "", payment_method: "momo" });
        fetchContributions(); // Refresh list after submission
      })
      .catch(() => setError("Error sending contribution."));
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Contributions Management</h1>

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">Add a Contribution (Admin)</h2>
        {message && <p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">{message}</p>}
        {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin_contributor_name" className="block text-sm font-medium text-gray-700">Contributor Name</label>
            <input
              id="admin_contributor_name"
              type="text"
              placeholder="Contributor's Name"
              value={formData.contributor_name}
              onChange={(e) =>
                setFormData({ ...formData, contributor_name: e.target.value })
              }
              required
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="admin_amount" className="block text-sm font-medium text-gray-700">Amount (RWF)</label>
            <input
              id="admin_amount"
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="admin_payment_method" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              id="admin_payment_method"
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
            >
              <option value="momo">Mobile Money</option>
              <option value="bank">Bank Card</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#27548A] hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27548A] focus:ring-offset-gray-100"
          >
            Add Contribution
          </button>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">All Contributions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200/70">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contributor</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount (RWF)</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment Method</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.length > 0 ? contributions.map((contribution) => (
                <tr key={contribution.id} className="hover:bg-blue-50/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{contribution.contributor_name || "Anonymous"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parseFloat(contribution.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contribution.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(contribution.timestamp).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No contributions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ContributionsList;
