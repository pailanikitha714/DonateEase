import { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/login");
  };

  const navClasses = `px-6 py-4 flex justify-between items-center transition-colors duration-300 ${
    darkMode ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
  }`;

  return (
    <nav className={navClasses}>
      <h1 className="text-xl font-bold">DonateEase</h1>
      <div className="space-x-4 flex items-center">
        <button
          onClick={toggleTheme}
          className="hover:bg-white/10 p-2 rounded transition duration-200"
          title="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {!token ? (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/register" className="hover:text-gray-200">Register</Link>
          </>
        ) : (
          <>
            {JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
            <Link to="/admin" className="font-bold text-yellow-300 hover:text-yellow-100 border border-yellow-500/50 px-3 py-1 rounded">
              Admin Panel ⚙️
            </Link>
          ) : (
            <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
          )}
            <Link to="/my-donations" className="hover:text-gray-200">My Donations</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;