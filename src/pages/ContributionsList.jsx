import { useEffect, useState } from "react";
import API from "../api/api";
import ContributionForm from "../components/ContributionForm";

function ContributionsList() {
  const [contributions, setContributions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // New state variables for search, pagination and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    paymentMethod: "",
    contributionType: "",
  });

  // Fetch contributions when component loads
  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = () => {
    API.getContributions()
      .then((res) => setContributions(res.data))
      .catch(() => setError("Failed to fetch contributions. You might need to log in."));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await API.uploadContributions(formData);
      setMessage("File uploaded successfully!");
      fetchContributions(); // Refresh the list
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Filter and search logic
  const filteredContributions = contributions.filter((contribution) => {
    const matchesSearch = 
      contribution.contributor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.contribution_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPaymentMethod = filters.paymentMethod === "" || 
      contribution.payment_method === filters.paymentMethod;

    const matchesContributionType = filters.contributionType === "" || 
      contribution.contribution_type === filters.contributionType;

    return matchesSearch && matchesPaymentMethod && matchesContributionType;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique values for filters
  const paymentMethods = [...new Set(contributions.map(c => c.payment_method))];
  const contributionTypes = [...new Set(contributions.map(c => c.contribution_type))];

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Contributions Management</h1>
      
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search contributions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27548A]"
          />
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27548A]"
          >
            <option value="">All Payment Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <select
            value={filters.contributionType}
            onChange={(e) => setFilters(prev => ({ ...prev, contributionType: e.target.value }))}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27548A]"
          >
            <option value="">All Contribution Types</option>
            {contributionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex justify-end gap-4">
        <button
          onClick={() => setIsContributionModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          New Contribution
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#27548A] text-white px-4 py-2 rounded-lg hover:bg-[#1e3f68] transition-colors duration-200"
        >
          Upload Excel File
        </button>
      </div>

      {/* Contribution Form Modal */}
      {isContributionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#27548A] p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">New Contribution</h2>
              <button
                onClick={() => setIsContributionModalOpen(false)}
                className="text-white hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <ContributionForm />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-4 text-[#27548A]">Upload Contributions</h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#27548A] text-white px-4 py-2 rounded hover:bg-[#1e3f68] disabled:bg-gray-400"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
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
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contribution Type</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">School(s)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? currentItems.map((contribution) => (
                <tr key={contribution.id} className="hover:bg-blue-50/70 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{contribution.contributor_name || "Anonymous"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parseFloat(contribution.amount).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contribution.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(contribution.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{contribution.contribution_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {contribution.contribution_type === 'specific' && contribution.schools ?
                      contribution.schools.map(school => school.name).join(', ')
                      : 'All Schools'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No matching contributions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === i + 1 ? 'bg-[#27548A] text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ContributionsList;
