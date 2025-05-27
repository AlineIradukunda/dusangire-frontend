import { useState, useEffect } from "react";
import API from "../api/api";

function DistributionPage() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState("");
    const [amount, setAmount] = useState("");
    const [distributions, setDistributions] = useState([]);
    const [distributionsError, setDistributionsError] = useState("");

    useEffect(() => {
        API.getSchools()
            .then(res => setSchools(res.data))
            .catch(() => setFormError("Failed to load schools for selection."));
        fetchDistributions();
    }, []);

    const fetchDistributions = () => {
        API.getDistributions()
            .then(res => setDistributions(res.data))
            .catch(() => setDistributionsError("Failed to load past distributions."));
    };

    const handleDistribute = (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setFormError("");

        if (!selectedSchool || !amount) {
            setFormError("Please select a school and enter an amount.");
            return;
        }

        API.distributeFunds({ school: selectedSchool, amount: parseFloat(amount) })
            .then((res) => {
                setMessage(res.data.message || "Funds distributed successfully!");
                setSelectedSchool("");
                setAmount("");
                fetchDistributions(); // Refresh the list of distributions
            })
            .catch((err) => {
                if (err.response && err.response.status === 403) {
                    setError("You must be logged in as admin to perform this action.");
                } else if (err.response && err.response.data) {
                    const errorData = err.response.data;
                    if (errorData.detail) {
                         setError(errorData.detail);
                    } else if (typeof errorData === 'object') {
                        const messages = Object.entries(errorData).map(([key, value]) => `${key}: ${value.join ? value.join(', ') : value}`).join('; ');
                        setError(messages || "An error occurred during fund distribution.");
                    } else {
                        setError("An error occurred during fund distribution.");
                    }
                } else {
                    setError("An error occurred during fund distribution.");
                }
            });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Fund Distribution</h1>
            
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center mb-12">
                <h2 className="text-2xl font-bold mb-6 text-[#27548A]">Distribute Funds to a School</h2>
                {message && <p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">{message}</p>}
                {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                {formError && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>}
                
                <form onSubmit={handleDistribute} className="space-y-6">
                    <div>
                        <label htmlFor="school" className="block text-sm font-medium text-gray-700 text-left">Select School</label>
                        <select 
                            id="school" 
                            value={selectedSchool} 
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-3 text-base bg-white border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
                        >
                            <option value="">-- Select a School --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 text-left">Amount (RWF)</label>
                        <input 
                            type="number" 
                            id="amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            min="0.01"
                            step="0.01"
                            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full px-8 py-3 bg-[#27548A] text-white font-semibold rounded-lg shadow-md hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:ring-opacity-75 focus:ring-offset-2 focus:ring-offset-gray-100 transition duration-150 ease-in-out"
                    >
                        Distribute Funds
                    </button>
                </form>
            </div>

            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 max-w-3xl w-full">
                <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">Distribution History</h2>
                {distributionsError && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{distributionsError}</p>}
                {distributions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-200/70">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">School</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount (RWF)</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {distributions.map(dist => (
                                    <tr key={dist.id} className="hover:bg-blue-50/70 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{dist.school_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parseFloat(dist.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(dist.distributed_on).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    !distributionsError && <p className="text-gray-500 text-center py-4">No distributions found.</p>
                )}
            </div>
        </div>
    );
}

export default DistributionPage;
