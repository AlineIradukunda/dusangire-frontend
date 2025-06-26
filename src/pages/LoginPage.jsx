import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    API.login(formData)
      .then((res) => {
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        localStorage.setItem("userRole", res.data.role); 
        localStorage.setItem("username", res.data.username);
        API.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`; // Update API instance header
        navigate("/admin");
      })
      .catch(() => setError("Invalid credentials. Please try again."));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dfe6e9] via-[#dfe6e9] to-[#dfe6e9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-filter backdrop-blur-xl shadow-2xl rounded-3xl p-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#27548A]">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">
              {error}
            </p>
          )}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white/70 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="password-login" className="sr-only">
                Password
              </label>
              <input
                id="password-login"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 bg-white/70 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#27548A] focus:border-[#27548A] sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#27548A] hover:bg-[#183B4E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27548A] focus:ring-offset-gray-100"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
