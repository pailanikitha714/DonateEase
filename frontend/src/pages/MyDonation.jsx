import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const MyDonations = () => {
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [itemDonations, setItemDonations] = useState([]);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const moneyRes = await api.get("/donate/money/my");
        const itemRes = await api.get("/donate/item/my");
        setMoneyDonations(moneyRes.data);
        setItemDonations(itemRes.data);
      } catch (err) {
        console.error("Error fetching donations", err);
        alert("Failed to load donations. Please login again.");
      }
    };
    fetchDonations();
  }, []);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === "success" || s === "delivered") return "bg-green-100 text-green-800 border-green-200";
    if (s === "pending" || s === "picked_up") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const containerStyle = `min-h-screen p-8 transition-colors duration-300 ${
    darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  }`;

  const cardBaseStyle = `rounded-xl shadow-sm border p-6 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
  }`;

  return (
    <div className={containerStyle}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">My Donations ❤️</h2>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-green-500">💰</span> Money Donations
          </h3>
          {moneyDonations.length === 0 ? (
            <div className={`p-6 rounded-lg text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <p className="text-gray-500">No money donations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moneyDonations.map((d) => (
                <div key={d._id} className={cardBaseStyle}>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(d.createdAt).toLocaleDateString()} • {d.paymentMethod}
                    </p>
                    <h4 className="text-lg font-bold">
                      ₹{d.amount}
                    </h4>
                    <p className="text-sm">
                      To: <span className="font-medium">{d.orphanage?.name || "Orphanage"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(d.status)}`}>
                      {d.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-500">📦</span> Item Donations
          </h3>
          {itemDonations.length === 0 ? (
            <div className={`p-6 rounded-lg text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <p className="text-gray-500">No item donations yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itemDonations.map((d) => (
                <div key={d._id} className={cardBaseStyle}>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                    <h4 className="text-lg font-bold capitalize">
                      {d.itemType}
                    </h4>
                    <p className="text-sm">
                      To: <span className="font-medium">{d.orphanage?.name || "Orphanage"}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pickup: {d.pickupAddress}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(d.deliveryStatus)}`}>
                      {d.deliveryStatus.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;