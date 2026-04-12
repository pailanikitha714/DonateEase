import { useState, useEffect } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/login");
  };

  const navClasses = `px-4 py-3 flex flex-wrap justify-between items-center transition-colors duration-300 ${
    darkMode ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
  }`;

  return (
    <nav className={navClasses}>
      <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center">
      <h1 className="text-xl font-bold">DonateEase</h1>
      <div className="flex flex-wrap gap-2 items-center justify-end">
        <button
          onClick={toggleTheme}
          className="p-2 rounded cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        {!token ? (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/register" className="hover:text-gray-200">Register</Link>
            <Link to="/register-orphanage">
              <button className="bg-green-500 px-4 py-2 rounded text-white">
                Register Orphanage
              </button>
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;