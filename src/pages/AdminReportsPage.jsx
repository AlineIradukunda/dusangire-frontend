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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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

    const validateDates = () => {
        if (!startDate || !endDate) return true;
        return new Date(startDate) <= new Date(endDate);
    };

    const fetchTransactionSummary = async () => {
        try {
            if (!validateDates()) {
                setError("Start date must be before or equal to end date");
                return;
            }

            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await API.getTransfers();
            if (response?.data) {
                const reportsWithTimestamp = response.data.map(report => ({
                    ...report,
                    // Preserve existing timestamp or set current time
                    timestamp: report.timestamp || new Date().toISOString()
                }));
                setReportData(reportsWithTimestamp);
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

        if (!validateDates()) {
            setError("Start date must be before or equal to end date");
            return;
        }

        setGenerating(true);
        setError("");

        try {
            await fetchTransactionSummary();

            const response = await API.generateReport({
                name: reportName,
                start_date: startDate,
                end_date: endDate,
                format: format
            });

            // Check if response exists and has data
            if (!response || !response.data) {
                throw new Error('No data received from server');
            }

            // Handle different response types
            let blob;
            if (response.data instanceof Blob) {
                blob = response.data;
            } else {
                // If response is JSON or other format, convert it
                blob = new Blob([JSON.stringify(response.data)], {
                    type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${startDate || 'all'}_${endDate || 'dates'}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Clear form
            setReportName("");
            setStartDate("");
            setEndDate("");
            setError("");
        } catch (err) {
            console.error("Report generation error:", err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                err.message ||
                "Failed to generate report. Please try again."
            );
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Add totalPages calculation
    const totalPages = Math.ceil(reportData.length / itemsPerPage);

    // Add renderPageNumbers function
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
                    className={`px-3 py-1 rounded ${currentPage === i
                        ? 'bg-[#27548A] text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
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
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3">{indexOfFirstItem + index + 1}</td>
                                <td className="p-3">{item.SchoolCode || 'N/A'}</td>
                                <td className="p-3">{item.school_name || (item.schools?.[0]?.name ?? 'N/A')}</td>
                                <td className="p-3">{item.AccountNumber || 'N/A'}</td>
                                <td className="p-3">{item.Donor || 'N/A'}</td>
                                <td className="p-3 text-right">{formatNumber(item.Total_Amount || 0)}</td>
                                <td className="p-3 text-center">{item.NumberOfTransactions || 0}</td>
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

export default AdminReportsPage;



