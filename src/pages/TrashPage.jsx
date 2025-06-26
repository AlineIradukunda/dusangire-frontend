import { useEffect, useState } from "react";
import API from "../api/api";

function TrashPage() {
  const [deletedTransfers, setDeletedTransfers] = useState([]);
  const [deletedDistributions, setDeletedDistributions] = useState([]);
  const [deletedSchools, setDeletedSchools] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeletedTransfers();
    fetchDeletedDistributions();
    fetchDeletedSchools();
  }, []);

  const fetchDeletedTransfers = async () => {
    try {
      const res = await API.getDeletedTransfers();
      const deleted = res.data.filter(item => item.delete_status === "deleted");
      setDeletedTransfers(deleted);
    } catch {
      setError("Failed to fetch deleted transfers.");
    }
  };

  const fetchDeletedDistributions = async () => {
    try {
      const res = await API.getDeletedDistributions();
      const deleted = res.data.filter(item => item.delete_status === "deleted");
      setDeletedDistributions(deleted);
    } catch {
      setError("Failed to fetch deleted distributions.");
    }
  };

  const fetchDeletedSchools = async () => {
    try {
      const res = await API.getDeletedSchools();
      const deleted = res.data.filter(item => item.delete_status === "deleted");
      setDeletedSchools(deleted);
    } catch {
      setError("Failed to fetch deleted schools.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#27548A]">Deleted Records (Trash)</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Deleted Transfers */}
      <h2 className="text-xl font-semibold mb-3 mt-6 text-[#27548A]">Deleted Transfers</h2>
      <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow mb-10">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">School Code</th>
            <th className="p-3">Donor</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Reason</th>
          </tr>
        </thead>
        <tbody>
          {deletedTransfers.length === 0 ? (
            <tr><td colSpan="4" className="p-4 text-center">No deleted transfers.</td></tr>
          ) : (
            deletedTransfers.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.SchoolCode}</td>
                <td className="p-3">{item.Donor}</td>
                <td className="p-3">{item.Amount?.toLocaleString()} RWF</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Deleted Distributions */}
      <h2 className="text-xl font-semibold mb-3 text-[#27548A]">Deleted Distributions</h2>
      <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow mb-10">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">School</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Reason</th>
          </tr>
        </thead>
        <tbody>
          {deletedDistributions.length === 0 ? (
            <tr><td colSpan="3" className="p-4 text-center">No deleted distributions.</td></tr>
          ) : (
            deletedDistributions.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.school_name}</td>
                <td className="p-3">{item.amount?.toLocaleString()} RWF</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Deleted Schools */}
      <h2 className="text-xl font-semibold mb-3 text-[#27548A]">Deleted Schools</h2>
      <table className="min-w-full bg-white border rounded-xl overflow-hidden shadow">
        <thead className="bg-[#27548A] text-white">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">District</th>
            <th className="p-3">Sector</th>
            <th className="p-3">Reason</th>
          </tr>
        </thead>
        <tbody>
          {deletedSchools.length === 0 ? (
            <tr><td colSpan="4" className="p-4 text-center">No deleted schools.</td></tr>
          ) : (
            deletedSchools.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.district}</td>
                <td className="p-3">{item.sector}</td>
                <td className="p-3 text-sm text-gray-700">{item.delete_reason || "N/A"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TrashPage;
