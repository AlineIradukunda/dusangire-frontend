import { useState, useEffect } from "react";
import Select from "react-select";
import API from "../api/api";

function ContributionForm() {
  const [formData, setFormData] = useState({
    SchoolCode: "",
    Amount: "",
    Donor: "Indiv through MoMo",
    AccountNumber: "",
    NumberOfTransactions: "0",
    schoolType: "general",
    contribution_type: "momo",
  });

  const [selectedSchools, setSelectedSchools] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);

  const [newSchool, setNewSchool] = useState({ name: "", district: "", sector: "" });
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);

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

  const createAndSelectSchool = async () => {
    if (!newSchool.name || !newSchool.district || !newSchool.sector) {
      setError("Please fill in all school fields");
      return;
    }

    try {
      const response = await API.createSchool(newSchool);
      const createdSchool = response.data;
      const newOption = { value: createdSchool.id, label: createdSchool.name };

      setSchoolOptions(prev => [...prev, newOption]);
      setSelectedSchools(prev => [...prev, newOption]);
      setNewSchool({ name: "", district: "", sector: "" });
      setIsCreatingSchool(false);
    } catch (error) {
      setError("Failed to create school. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const submissionData = {
      SchoolCode: formData.SchoolCode,
      Donor: formData.Donor,
      contribution_type: formData.contribution_type,
      Amount: parseFloat(formData.Amount) || 0,
      AccountNumber: formData.AccountNumber,
      NumberOfTransactions: parseInt(formData.NumberOfTransactions) || 0,
      school_ids: formData.schoolType === "specific"
        ? selectedSchools.map((s) => s.value)
        : [],
    };

    console.log("Submitting transfer:", submissionData);

    API.createTransfer(submissionData)
      .then((response) => {
        setMessage("Transfer recorded successfully!");
        setFormData({
          SchoolCode: "",
          Amount: "",
          Donor: "Indiv through MoMo",
          AccountNumber: "",
          NumberOfTransactions: "0",
          schoolType: "general",
          contribution_type: "momo",
        });
        setSelectedSchools([]);
      })
      .catch((error) => {
        console.error("Submission error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Error recording transfer. Please try again.";
        setError(errorMessage);
      });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">
        Record Transfer
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

        {/* School Code */}
        <div>
          <label htmlFor="SchoolCode" className="block text-sm font-medium text-gray-300 text-left">
            School Code
          </label>
          <input
            id="SchoolCode"
            type="text"
            placeholder="School Code"
            value={formData.SchoolCode}
            onChange={(e) => setFormData({ ...formData, SchoolCode: e.target.value })}
            required
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          />
        </div>

        {/* Donor */}
        <div>
          <label htmlFor="Donor" className="block text-sm font-medium text-gray-300 text-left">
            Donor
          </label>
          <select
            id="Donor"
            value={formData.Donor}
            onChange={(e) => setFormData({ ...formData, Donor: e.target.value })}
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          >
            <option value="Indiv through MoMo">Indiv through MoMo</option>
            <option value="METRO WORLD CHILD">METRO WORLD CHILD</option>
            <option value="IREMBO">IREMBO</option>
            <option value="MTN RWANDACELL LTD">MTN RWANDACELL LTD</option>
          </select>
        </div>

        {/* Contribution Type */}
        <div>
          <label htmlFor="contribution_type" className="block text-sm font-medium text-gray-300 text-left">
            Contribution Type
          </label>
          <select
            id="contribution_type"
            value={formData.contribution_type}
            onChange={(e) => setFormData({ ...formData, contribution_type: e.target.value })}
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          >
            <option value="local_transfer">Local Transfer</option>
            <option value="momo">MoMo</option>
            <option value="international_transfer">International Transfer</option>
            <option value="lemitance">Lemitance</option>
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label htmlFor="AccountNumber" className="block text-sm font-medium text-gray-300 text-left">
            Account Number
          </label>
          <input
            id="AccountNumber"
            type="text"
            value={formData.AccountNumber}
            onChange={(e) => setFormData({ ...formData, AccountNumber: e.target.value })}
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="Amount" className="block text-sm font-medium text-gray-300 text-left">
            Amount (RWF)
          </label>
          <input
            id="Amount"
            type="number"
            min="0"
            value={formData.Amount}
            onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
            required
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          />
        </div>

        {/* Number of Transactions */}
        <div>
          <label htmlFor="NumberOfTransactions" className="block text-sm font-medium text-gray-300 text-left">
            Number of Transactions
          </label>
          <input
            id="NumberOfTransactions"
            type="number"
            min="0"
            value={formData.NumberOfTransactions}
            onChange={(e) => setFormData({ ...formData, NumberOfTransactions: e.target.value })}
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          />
        </div>

        {/* School Type */}
        <div>
          <label htmlFor="schoolType" className="block text-sm font-medium text-gray-300 text-left">
            School Type
          </label>
          <select
            id="schoolType"
            value={formData.schoolType}
            onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
            className="mt-1 block w-full px-4 py-3 bg-white bg-opacity-25 rounded-lg shadow-sm text-gray-900"
          >
            <option value="general">General (All Schools)</option>
            <option value="specific">Specific School(s)</option>
          </select>
        </div>

        {/* School Selection */}
        {formData.schoolType === "specific" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 text-left">Select School(s)</label>
            <Select
              isMulti
              options={schoolOptions}
              value={selectedSchools}
              onChange={setSelectedSchools}
              placeholder="Select school(s)..."
              className="text-gray-900"
            />
            <button
              type="button"
              onClick={() => setIsCreatingSchool(true)}
              className="text-sm text-blue-300 hover:text-blue-200"
            >
              + Add New School
            </button>

            {/* New School Form */}
            {isCreatingSchool && (
              <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
                <h3 className="text-white font-medium">Add New School</h3>
                <input
                  type="text"
                  placeholder="School Name"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/20 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="District"
                  value={newSchool.district}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/20 rounded text-white"
                />
                <input
                  type="text"
                  placeholder="Sector"
                  value={newSchool.sector}
                  onChange={(e) => setNewSchool(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/20 rounded text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={createAndSelectSchool}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add School
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingSchool(false);
                      setNewSchool({ name: "", district: "", sector: "" });
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-[#183B4E] text-white rounded-lg hover:bg-[#155060]"
        >
          Record Transfer
        </button>
      </form>
    </div>
  );
}

export default ContributionForm;
