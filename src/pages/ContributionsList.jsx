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
      .then((res) => setContributions(res.data))
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

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await API.uploadTransfers(formData);
      setMessage("File uploaded successfully!");
      fetchContributions();
      setIsModalOpen(false);
      setSelectedFile(null);
      setError("");
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
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

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Transfers Management</h1>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search transfers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:ring-[#27548A]"
        />
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
      <div className="mb-6 flex justify-end gap-4">
        <button
          onClick={() => setIsContributionModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          New Transfer
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#27548A] text-white px-4 py-2 rounded-lg hover:bg-[#1e3f68]"
        >
          Upload Excel File
        </button>
      </div>

      {/* Contribution Modal */}
      {isContributionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#27548A] p-8 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">New Contribution</h2>
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
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {console.log(item)}
                <td className="p-3">{indexOfFirstItem + index + 1}</td>
                <td className="p-3">{item.SchoolCode}</td>
                <td className="p-3">{item.school_name || (item.schools?.[0]?.name ?? 'N/A')}</td>
                <td className="p-3">{item.AccountNumber || 'N/A'}</td>
                <td className="p-3">{item.Donor}</td>
                <td className="p-3">{item.Total_Amount}</td>
                <td className="p-3">{item.NumberOfTransactions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default ContributionsList;
