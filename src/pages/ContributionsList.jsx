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
  const [tempSearchTerm, setTempSearchTerm] = useState("");
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
        const transfersWithTimestamp = res.data.map((transfer) => ({
          ...transfer,
          timestamp: transfer.timestamp || new Date().toISOString(),
        }));
        setContributions(transfersWithTimestamp);
      })
      .catch(() =>
        setError("Failed to fetch transfers. You might need to log in.")
      );
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    const fileType = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls"].includes(fileType)) {
      setError("Please upload only Excel files (.xlsx or .xls)");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await API.uploadTransfers(formData);
      setMessage("File uploaded successfully!");
      fetchContributions();
      setIsModalOpen(false);
      setSelectedFile(null);
    } catch (err) {
      if (err.response) {
        setError(`Upload failed: ${err.response.data.message || err.response.statusText}`);
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Failed to upload file. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    const matchingIndex = contributions.findIndex((transfer) => {
      const searchLower = tempSearchTerm.toLowerCase();
      return (
        transfer.SchoolCode?.toLowerCase().includes(searchLower) ||
        transfer.Donor?.toLowerCase().includes(searchLower) ||
        (transfer.schools &&
          transfer.schools.some((school) =>
            school.name.toLowerCase().includes(searchLower)
          ))
      );
    });
    if (matchingIndex !== -1) {
      const targetPage = Math.floor(matchingIndex / itemsPerPage) + 1;
      setCurrentPage(targetPage);
    }
  };

  const handleDelete = async (transferId) => {
    const reason = prompt("Please provide a reason for deletion:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      await API.markTransferAsPendingDelete(transferId, reason, token);
      alert("Marked as pending deletion.");
      fetchContributions();
    } catch (err) {
      alert("Failed to delete. You might not have permission.");
    }
  };

  const handleRecover = async (transferId) => {
    try {
      await API.recoverTransfer(transferId);
      alert("Transfer successfully recovered.");
      fetchContributions();
    } catch (err) {
      alert("Failed to recover transfer.");
    }
  };

  const filteredContributions = contributions.filter((transfer) => {
    const matchesSearch =
      transfer.SchoolCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.Donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transfer.schools &&
        transfer.schools.some((school) =>
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
    if (!num) return "0";
    const cleanNum = String(num).replace(/,/g, "").split(".")[0];
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 rounded-lg ${currentPage === i
            ? "bg-[#27548A] text-white"
            : "border hover:bg-gray-100"
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

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search transfers..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

      {/* Buttons */}
      <div className="mb-8 flex justify-end gap-4">
        <button
          onClick={() => setIsContributionModalOpen(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
        >
          + New Transfer
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#27548A] text-white px-6 py-3 rounded-lg shadow hover:bg-[#1e3f68]"
        >
          Upload Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#e0e6ea] rounded-xl shadow-md mt-6">
        <table className="min-w-full table-auto">
          <thead className="bg-[#27548A] text-white">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">School Code</th>
              <th className="p-3">School Name</th>
              <th className="p-3">Account Number</th>
              <th className="p-3">Donor</th>
              <th className="p-3">Contribution Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Transactions</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentItems.map((item, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-50 ${item.delete_status === "pending" ? "bg-yellow-100" : ""}`}
              >
                <td className="p-3">{indexOfFirstItem + index + 1}</td>
                <td className="p-3">{item.SchoolCode}</td>
                <td className="p-3">
                  {item.school_name
                    ? item.school_name
                    : item.schools?.map((s, i) => <div key={i}>{s.name}</div>) || "N/A"}
                </td>
                <td className="p-3">{item.AccountNumber || "N/A"}</td>
                <td className="p-3">{item.Donor}</td>
                <td className="p-3">{item.contribution_type}</td>
                <td className="p-3 text-right">{formatNumber(item.Amount)}</td>
                <td className="p-3 text-center">{item.NumberOfTransactions}</td>
                <td className="p-3">{formatDate(item.timestamp)}</td>

                {/* ✅ Status */}
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                      item.delete_status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : item.delete_status === "deleted"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {item.delete_status || "active"}
                  </span>
                </td>

                <td className="p-3">
                  {item.delete_status === "pending" ? (
                    <button
                      onClick={() => handleRecover(item.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Recover
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => paginate(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">First</button>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-lg disabled:opacity-50">Prev</button>
        <div className="flex mx-2">{renderPageNumbers()}</div>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Next</button>
        <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-lg disabled:opacity-50">Last</button>
      </div>
    </div>
  );
}

export default ContributionsList;
