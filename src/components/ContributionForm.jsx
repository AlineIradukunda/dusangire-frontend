import { useState, useEffect } from "react";
import Select from "react-select";
import API from "../api/api";

function ContributionForm() {
  const [formData, setFormData] = useState({
    contributor_name: "",
    amount: "",
    payment_method: "momo",
  });
  const [contributionType, setContributionType] = useState("general");
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);

  useEffect(() => {
    API.getSchools()
      .then((response) => {
        const schools = response.data.map((school) => ({
          value: school.id,
          label: school.name,
        }));
        setSchoolOptions(schools);
      })
      .catch(() => setError("Error loading schools"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const submissionData = {
      ...formData,
      contribution_type: contributionType,
      school_ids:
        contributionType === "specific"
          ? selectedSchools.map((s) => s.value)
          : [],
    };

    console.log("Submitting contribution:", submissionData); // For debugging

    API.createContribution(submissionData)
      .then((response) => {
        console.log("Contribution response:", response); // For debugging
        setMessage("Thank you for your contribution!");
        setFormData({
          contributor_name: "",
          amount: "",
          payment_method: "momo",
        });
        setContributionType("general");
        setSelectedSchools([]);
      })
      .catch((error) => {
        console.error("Submission error:", error); // For debugging
        setError("Error sending contribution. Please try again.");
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">
        Make a Contribution
      </h2>
      {message && (
        <p className="mb-4 text-green-300 bg-green-700 bg-opacity-50 p-3 rounded-md">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-red-300 bg-red-700 bg-opacity-50 p-3 rounded-md">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contributor Name */}
        <div>
          <label
            htmlFor="contributor_name"
            className="block text-sm font-medium text-gray-300 text-left"
          >
            Your Name/Company Name
          </label>
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

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 text-left"
          >
            Amount (RWF)
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label
            htmlFor="payment_method"
            className="block text-sm font-medium text-gray-300 text-left"
          >
            Payment Method
          </label>
          <select
            id="payment_method"
            value={formData.payment_method}
            onChange={(e) =>
              setFormData({ ...formData, payment_method: e.target.value })
            }
            className="mt-1 block w-full pl-3 pr-10 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          >
            <option value="momo" className="text-gray-800">
              Mobile Money
            </option>
            <option value="bank" className="text-gray-800">
              Bank Transfer
            </option>
          </select>
        </div>

        {/* Contribution Type */}
        <div>
          <label
            htmlFor="contribution_type"
            className="block text-sm font-medium text-gray-300 text-left"
          >
            Contribution Type
          </label>
          <select
            id="contribution_type"
            value={contributionType}
            onChange={(e) => setContributionType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-3 bg-white bg-opacity-25 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm text-gray-900"
          >
            <option value="general" className="text-gray-800">
              General (All Schools)
            </option>
            <option value="specific" className="text-gray-800">
              Specific School(s)
            </option>
          </select>
        </div>

        {/* School Selection */}
        {contributionType === "specific" && (
          <div>
            <label
              htmlFor="schools"
              className="block text-sm font-medium text-gray-300 text-left mb-1"
            >
              Select School(s)
            </label>
            <Select
              isMulti
              options={schoolOptions}
              value={selectedSchools}
              onChange={setSelectedSchools}
              placeholder="Select school(s)..."
              className="text-gray-900"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#183B4E] hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 focus:ring-offset-slate-800"
        >
          Contribute
        </button>
      </form>
    </div>
  );
}

export default ContributionForm;
