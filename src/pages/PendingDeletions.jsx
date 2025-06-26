import { useEffect, useState } from "react";
import API from "../api/api";

function PendingDeletions() {
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [pendingDistributions, setPendingDistributions] = useState([]);
  const [pendingSchools, setPendingSchools] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingTransfers();
    fetchPendingDistributions();
    fetchPendingSchools();
  }, []);

  const fetchPendingTransfers = async () => {
    try {
      const res = await API.getTransfers();
      const pending = res.data.filter((item) => item.delete_status === "pending");
      setPendingTransfers(pending);
    } catch (err) {
      setError("Failed to load pending transfers.");
    }
  };

  const fetchPendingDistributions = async () => {
    try {
      const res = await API.getDistributions();
      const pending = res.data.filter((item) => item.delete_status === "pending");
      setPendingDistributions(pending);
    } catch (err) {
      setError("Failed to load pending distributions.");
    }
  };

  const fetchPendingSchools = async () => {
    try {
      const res = await API.getSchools();
      const pending = res.data.filter((item) => item.delete_status === "pending");
      setPendingSchools(pending);
    } catch (err) {
      setError("Failed to load pending schools.");
    }
  };

  // Transfer actions
  const handleConfirmTransferDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this transfer?")) return;

    try {
      await API.confirmTransferDelete(id);
      alert("Transfer deleted permanently.");
      fetchPendingTransfers();
    } catch (err) {
      alert("Failed to delete transfer.");
    }
  };

  const handleRecoverTransfer = async (id) => {
    try {
      await API.recoverTransfer(id);
      alert("Transfer recovered successfully.");
      fetchPendingTransfers();
    } catch (err) {
      alert("Failed to recover transfer.");
    }
  };

  // Distribution actions
  const handleConfirmDistributionDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this distribution?")) return;

    try {
      await API.confirmDistributionDelete(id);
      alert("Distribution deleted permanently.");
      fetchPendingDistributions();
    } catch (err) {
      alert("Failed to delete distribution.");
    }
  };

  const handleRecoverDistribution = async (id) => {
    try {
      await API.recoverDistribution(id);
      alert("Distribution recovered successfully.");
      fetchPendingDistributions();
    } catch (err) {
      alert("Failed to recover distribution.");
    }
  };

  // School actions
  const handleConfirmSchoolDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this school?")) return;

    try {
      await API.confirmSchoolDelete(id);
      alert("School deleted permanently.");
      fetchPendingSchools();
    } catch (err) {
      alert("Failed to delete school.");
    }
  };

  const handleRecoverSchool = async (id) => {
    try {
      await API.recoverSchool(id);
      alert("School recovered successfully.");
      fetchPendingSchools();
    } catch (err) {
      alert("Failed to recover school.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#27548A]">Pending Deletion Approvals</h1>
      {error && <p className="text-red-500 mb-6">{error}</p>}

      {/* Transfers Table */}
      <h2 className="text-xl font-semibold mb-3 mt-6 text-[#27548A]">Pending Transfers</h2>
      <table className="min-w-full bg-white border rounded-xl shadow-md overflow-hidden mb-10">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">No</th>
            <th className="p-3">School Code</th>
            <th className="p-3">School Name</th>
            <th className="p-3">Donor</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingTransfers.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center">No pending transfers.</td>
            </tr>
          ) : (
            pendingTransfers.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.SchoolCode}</td>
                <td className="p-3">
                  {item.school_name
                    ? item.school_name
                    : item.schools?.map((s, i) => <div key={i}>{s.name}</div>) || "N/A"}
                </td>
                <td className="p-3">{item.Donor}</td>
                <td className="p-3 text-right">{item.Amount?.toLocaleString()}</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleConfirmTransferDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => handleRecoverTransfer(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Distributions Table */}
      <h2 className="text-xl font-semibold mb-3 text-[#27548A]">Pending Distributions</h2>
      <table className="min-w-full bg-white border rounded-xl shadow-md overflow-hidden mb-10">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">No</th>
            <th className="p-3">School</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDistributions.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center">No pending distributions.</td>
            </tr>
          ) : (
            pendingDistributions.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.school_name}</td>
                <td className="p-3 text-right">{item.amount?.toLocaleString()}</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleConfirmDistributionDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => handleRecoverDistribution(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Schools Table */}
      <h2 className="text-xl font-semibold mb-3 text-[#27548A]">Pending Schools</h2>
      <table className="min-w-full bg-white border rounded-xl shadow-md overflow-hidden">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">No</th>
            <th className="p-3">Name</th>
            <th className="p-3">District</th>
            <th className="p-3">Sector</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingSchools.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-4 text-center">No pending schools.</td>
            </tr>
          ) : (
            pendingSchools.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.district}</td>
                <td className="p-3">{item.sector}</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleConfirmSchoolDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => handleRecoverSchool(item.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Recover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PendingDeletions;
