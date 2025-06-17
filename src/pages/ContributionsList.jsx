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

  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState(""); // New state for temporary search term
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    donor: "",
  });

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = () => {
    API.getTransfers()
      .then((res) => {
        const transfersWithTimestamp = res.data.map(transfer => ({
          ...transfer,
          // Only set timestamp if it doesn't exist
          timestamp: transfer.timestamp || new Date().toISOString()
        }));
        setContributions(transfersWithTimestamp);
      })
      .catch(() => setError("Failed to fetch transfers. You might need to log in."));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    // Validate file type
    const fileType = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileType)) {
      setError("Please upload only Excel files (.xlsx or .xls)");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await API.uploadTransfers(formData);
      console.log('Upload response:', response); // Debug log
      setMessage("File uploaded successfully!");
      fetchContributions();
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload error:', err); // Debug log
      if (err.response) {
        // Server responded with error
        setError(`Upload failed: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection and try again.");
      } else {
        // Other errors
        setError("Failed to upload file. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);

    // Find the index of the first matching item
    const matchingIndex = contributions.findIndex((transfer) => {
      const searchLower = tempSearchTerm.toLowerCase();
      return (
        transfer.SchoolCode?.toLowerCase().includes(searchLower) ||
        transfer.Donor?.toLowerCase().includes(searchLower) ||
        (transfer.schools && transfer.schools.some((school) =>
          school.name.toLowerCase().includes(searchLower)
        ))
      );
    });

    // If found, calculate and set the correct page
    if (matchingIndex !== -1) {
      const targetPage = Math.floor(matchingIndex / itemsPerPage) + 1;
      setCurrentPage(targetPage);
    }
  };

  const filteredContributions = contributions.filter((transfer) => {
    const matchesSearch =
      transfer.SchoolCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.Donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.schools && transfer.schools.some((school) =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesDonor = filters.donor === "" || transfer.Donor === filters.donor;

    return matchesSearch && matchesDonor;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContributions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContributions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const donors = [...new Set(contributions.map((c) => c.Donor))];

  const formatNumber = (num) => {
    if (!num) return '0';
    // Remove any existing commas and decimal places
    const cleanNum = String(num).replace(/,/g, '').split('.')[0];
    // Add commas for thousands
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Add this new function before the return statement
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 rounded-lg ${currentPage === i
            ? 'bg-[#27548A] text-white'
            : 'border hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Transfers Management</h1>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search transfers..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-2 border rounded-lg focus:ring-[#27548A]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#27548A] text-white px-4 py-2 rounded-lg hover:bg-[#1e3f68]"
          >
            Search
          </button>
        </div>
        <select
          value={filters.donor}
          onChange={(e) => setFilters((prev) => ({ ...prev, donor: e.target.value }))}
          className="p-2 border rounded-lg focus:ring-[#27548A]"
        >
          <option value="">All Donors</option>
          {donors.map((donor) => (
            <option key={donor} value={donor}>
              {donor}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 flex justify-end gap-4">
        <button
          onClick={() => setIsContributionModalOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Transfer
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-[#27548A] to-[#1e3f68] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Excel File
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
        </button>
      </div>

      {/* Contribution Modal */}
      {isContributionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#003366] p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => setIsContributionModalOpen(false)} className="text-white">✕</button>
            </div>
            <ContributionForm />
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[800px]">
            <h2 className="text-2xl font-semibold mb-4 text-[#27548A]">Upload Transfers</h2>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#27548A] text-white px-6 py-2 rounded hover:bg-[#1e3f68]"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
          </div>
        </div>
      )}

      {/* Contributions Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md mt-6">
        <table className="min-w-full table-auto">
          <thead className="bg-[#27548A] text-white">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">School Code</th>
              <th className="p-3">School Name</th>
              <th className="p-3">Account Number</th>
              <th className="p-3">Donor</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Transactions</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{indexOfFirstItem + index + 1}</td>
                <td className="p-3">{item.SchoolCode}</td>
                <td className="p-3">{item.school_name || (item.schools?.[0]?.name ?? 'N/A')}</td>
                <td className="p-3">{item.AccountNumber || 'N/A'}</td>
                <td className="p-3">{item.Donor}</td>
                <td className="p-3 text-right">{formatNumber(item.Total_Amount)}</td>
                <td className="p-3 text-center">{item.NumberOfTransactions}</td>
                <td className="p-3">{formatDate(item.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <div className="flex mx-2">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Last
        </button>
      </div>

    </div>
  );
}

export default ContributionsList;

