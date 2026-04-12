import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const RegisterOrphanage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    pincode: "",
    phone: "",
    needs: "",
    email: "",
    password: ""
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) {
      alert("Phone must be 10 digits");
      return;
    }
    try {
      await api.post("/orphanage", {
        ...form,
        needs: form.needs.split(",").map(item => item.trim()),
      });
      alert("Request submitted! Waiting for admin approval.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };
  const containerBg = darkMode ? "bg-gray-900" : "bg-gray-100";
  const cardBg = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const inputStyle = `w-full min-w-0 p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
    darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900"
  }`;
  return (
    <div className={`relative min-h-screen flex items-center justify-center px-4 overflow-hidden transition-colors duration-300 ${containerBg}`}>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 shadow text-xl z-50"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>
      <div className={`${cardBg} w-full max-w-md p-5 sm:p-8 rounded-2xl shadow-2xl transition-colors duration-300 overflow-hidden`}>
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 mb-2">
            DonateEase
          </h1>
          <p className="text-xs sm:text-sm opacity-75">
            Register your orphanage to receive donations.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Orphanage Name"
            value={form.name} onChange={handleChange}
            className={inputStyle} required />
          <input name="address" placeholder="Address"
            value={form.address} onChange={handleChange}
            className={inputStyle} required />
          <input name="pincode" placeholder="Pincode"
            value={form.pincode} onChange={handleChange}
            className={inputStyle} required />
          <input name="phone" placeholder="Phone Number"
            value={form.phone} onChange={handleChange}
            maxLength="10" pattern="[0-9]{10}"
            className={inputStyle} required />
          <input name="email" placeholder="Email"
            value={form.email} onChange={handleChange}
            className={inputStyle} required />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputStyle}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
            >
              {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.058 10.058 0 013.436-5.392m6.596-2.505a10.052 10.052 0 012.905 1.897M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.058 10.058 0 01-3.436 5.392M9.88 9.88l-3.29-3.29" />
                </svg>
              )}
            </button>
          </div>
          <input name="needs"
            placeholder="Needs (food, clothes, books...)"
            value={form.needs}
            onChange={handleChange}
            className={inputStyle}
          />
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-bold shadow-lg transition">
            Submit Request
          </button>
        </form>
        <p className="text-center mt-5 text-xs sm:text-sm">
          Want to register as a user?{" "}
          <Link to="/register" className="text-blue-500 font-bold hover:underline">
            Go Back
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterOrphanage;