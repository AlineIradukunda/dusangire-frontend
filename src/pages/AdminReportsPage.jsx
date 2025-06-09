import { useEffect, useState } from "react";
import API from "../api/api";

function AdminReportsPage() {
    const [reports, setReports] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportName, setReportName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [format, setFormat] = useState("excel");
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReports();
        fetchTransactionSummary();
    }, []);

    const fetchReports = () => {
        API.getReports()
            .then((res) => {
                setReports(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch reports:", error);
                setLoading(false);
            });
    };

    const fetchTransactionSummary = async () => {
        try {
            const response = await API.getTransactionSummary({
                start_date: startDate,
                end_date: endDate
            });
            setReportData(response.data);
        } catch (error) {
            console.error("Failed to fetch transaction summary:", error);
            setError("Failed to fetch transaction summary");
        }
    };

    const handleGenerateReport = async (e) => {
        e.preventDefault();
        setGenerating(true);
        setError("");

        try {
            await fetchTransactionSummary();

            const response = await API.generateReport({
                start_date: startDate,
                end_date: endDate,
                format: format
            });

            // Create a blob and download it
            const blob = new Blob([response.data], {
                type: format === 'csv'
                    ? 'text/csv'
                    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${startDate}_${endDate}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setReportName("");
            setStartDate("");
            setEndDate("");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to generate report.");
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = (fileUrl) => {
        window.open(fileUrl, "_blank");
    };

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
        <div className="bg-[#e0e6ea] min-h-screen py-16 px-4">
            <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Dusangire Lunch Report</h1>

            {/* Generate Report Form */}
            <div className="bg-white max-w-4xl mx-auto p-6 rounded-xl shadow mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate New Report</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="report-name" className="text-sm font-medium mb-1">Report Name</label>
                        <input
                            id="report-name"
                            type="text"
                            placeholder="Enter Report Name"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="start-date" className="text-sm font-medium mb-1">Start Date</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="end-date" className="text-sm font-medium mb-1">End Date</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="format" className="text-sm font-medium mb-1">Format</label>
                        <select
                            id="format"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="excel">Excel</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={generating}
                        className="col-span-1 md:col-span-3 bg-green-600 text-white p-2 rounded-md hover:bg-green-700"
                    >
                        {generating ? "Generating..." : "Download Report"}
                    </button>
                </form>
            </div>

            {/* Transaction Report Table */}
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto p-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaction Summary</h2>
                <button
                    onClick={downloadCSV}
                    className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Download CSV Summary
                </button>
                <div className="overflow-x-auto">
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
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{report.school_name}</td>
                                    <td className="px-4 py-2">{report.total_contributions}</td>
                                    <td className="px-4 py-2">{report.total_distributed}</td>
                                    <td className="px-4 py-2">{report.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Display Existing Reports */}
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl mx-auto p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">All Generated Reports</h2>

                {loading ? (
                    <p className="text-gray-600">Loading reports...</p>
                ) : reports.length === 0 ? (
                    <p className="text-gray-600">No reports found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-700">
                            <thead className="bg-gray-100 font-semibold text-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Report Name</th>
                                    <th className="px-6 py-4">Date Generated</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">{report.name}</td>
                                        <td className="px-6 py-4">
                                            {new Date(report.date_generated).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDownload(report.file_url)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminReportsPage;
