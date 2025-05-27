import { useState } from "react";
import API from "../api/api";


function ContributionForm() {
  const [formData, setFormData] = useState({
    contributor_name: "",
    amount: "",
    payment_method: "momo", // or "bank"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    API.createContribution(formData)
      .then(() => {
        setMessage("Thank you for your contribution!");
        setFormData({ contributor_name: "", amount: "", payment_method: "momo" });
      })
      .catch(() => setError("Error sending contribution. Please try again."));
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">Make a Contribution</h2>
      {message && <p className="mb-4 text-green-300 bg-green-700 bg-opacity-50 p-3 rounded-md">{message}</p>}
      {error && <p className="mb-4 text-red-300 bg-red-700 bg-opacity-50 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="contributor_name" className="block text-sm font-medium text-gray-300 text-left">Your Name/ Company Name</label>
          <input
            id="contributor_name"
            type="text"
            placeholder="Your Name"
            value={formData.contributor_name}
            onChange={(e) =>
              setFormData({ ...formData, contributor_name: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 text-left">Amount (RWF)</label>
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-300 text-left">Payment Method</label>
          <select
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) =>
              setFormData({ ...formData, payment_method: e.target.value })
            }
            className="mt-1 block w-full pl-3 pr-10 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          >
            <option value="momo" className="text-gray-800">Mobile Money</option>
            <option value="bank" className="text-gray-800">Bank Card</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#27548A] hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-slate-800"
        >
          Contribute
        </button>
      </form>
    </div>
  );
}

export default ContributionForm;
