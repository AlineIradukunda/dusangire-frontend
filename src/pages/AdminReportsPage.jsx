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
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await API.getTransactionSummary(params);
            if (response.data) {
                setReportData(response.data);
                setError("");
            }
        } catch (error) {
            console.error("Failed to fetch transaction summary:", error);
            setError("Failed to fetch transaction summary. " + (error.response?.data?.error || ''));
            setReportData([]);
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
        const headers = ['No', 'School Code', 'School Name', 'Account Number', 'Donor', 'Amount', 'Transactions'];
        const rows = reportData.map((item, index) => [
            index + 1,
            item.SchoolCode,
            item.school_name || (item.schools?.[0]?.name ?? 'N/A'),
            item.AccountNumber || 'N/A',
            item.Donor,
            formatNumber(item.Total_Amount),
            item.NumberOfTransactions
        ]);

        const csvContent = [headers, ...rows]
            .map(e => e.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transaction_summary_${startDate || 'all'}_${endDate || 'dates'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        const cleanNum = String(num).replace(/,/g, '').split('.')[0];
        return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                            {reportData.map((item, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{item.SchoolCode}</td>
                                    <td className="p-3">{item.school_name || (item.schools?.[0]?.name ?? 'N/A')}</td>
                                    <td className="p-3">{item.AccountNumber || 'N/A'}</td>
                                    <td className="p-3">{item.Donor}</td>
                                    <td className="p-3 text-right">{formatNumber(item.Total_Amount)}</td>
                                    <td className="p-3 text-center">{item.NumberOfTransactions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}

export default AdminReportsPage;
