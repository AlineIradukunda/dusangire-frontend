import { useEffect, useState } from "react";
import API from "../api/api";


function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [newSchool, setNewSchool] = useState({
    name: "",
    district: "Unknown",  // Set default values
    sector: "Unknown"     // Set default values
  });

  const fetchSchools = () => {
    API.getSchools()
      .then((res) => setSchools(res.data))
      .catch(() => setError("Failed to fetch schools. You might need to log in."));
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Simplify handleInputChange to only handle name
  const handleInputChange = (e) => {
    setNewSchool(prev => ({ ...prev, name: e.target.value }));
  };

  const handleSubmitNewSchool = (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    API.createSchool(newSchool)
      .then(() => {
        setFormSuccess("School created successfully!");
        setNewSchool({ name: "", district: "Unknown", sector: "Unknown" }); // Reset form
        fetchSchools(); // Refresh the list
      })
      .catch((err) => {
        const errorData = err.response?.data;
        if (errorData && typeof errorData === 'object') {
          const messages = Object.values(errorData).flat().join(' ');
          setFormError(messages || "Failed to create school. Please check the details.");
        } else {
          setFormError("Failed to create school. An unknown error occurred.");
        }
      });
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-10 text-center text-[#27548A]">Schools Management</h1>

      {/* Form to add new school */}
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">Add New School</h2>
        {formSuccess && <p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">{formSuccess}</p>}
        {formError && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{formError}</p>}
        <form onSubmit={handleSubmitNewSchool} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">School Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={newSchool.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#27548A] hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27548A] focus:ring-offset-gray-100"
          >
            Add School
          </button>
        </form>
      </div>

      {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md max-w-2xl mx-auto">{error}</p>}
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#27548A]">Existing Schools</h2>
        {schools.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {schools.map((school) => (
              <li key={school.id} className="py-5 px-4 hover:bg-blue-100/70 rounded-xl transition-colors duration-200 ease-in-out">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-[#27548A]">{school.name}</p>
                    <p className="text-sm text-gray-600">{school.district} - {school.sector}</p>
                  </div>
                  <p className="text-md font-medium">
                    Total Received: <span className="text-green-600 font-semibold">{parseFloat(school.total_received).toFixed(2)} RWF</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No schools found or unable to load schools.</p>
        )}
      </div>
    </>
  );
}

export default SchoolsList;
