import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    API.getReports()
        .then((res) => {
        setReports(res.data);
        setLoading(false);
        })
        .catch((error) => {
        console.error("Failed to fetch reports:", error);
        setLoading(false);
        });
    
  }, []);

  const downloadCSV = () => {
    const headers = ['School', 'Total Contributions (RWF)', 'Total Distributed (RWF)', 'Balance (RWF)'];
    const rows = reportData.map(report => [
      report.school_name,
      report.total_contributions,
      report.total_distributed,
      report.balance
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transaction_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction Report</h2>
      {loading ? (
        <p>Loading report...</p>
      ) : (
        <>
          <button
            onClick={downloadCSV}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download Report
          </button>
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">School</th>
                <th className="px-4 py-2 text-left">Total Contributions (RWF)</th>
                <th className="px-4 py-2 text-left">Total Distributed (RWF)</th>
                <th className="px-4 py-2 text-left">Balance (RWF)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((report, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{report.school_name}</td>
                  <td className="px-4 py-2">{report.total_contributions}</td>
                  <td className="px-4 py-2">{report.total_distributed}</td>
                  <td className="px-4 py-2">{report.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Report;
