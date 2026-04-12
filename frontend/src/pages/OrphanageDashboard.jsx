import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const OrphanageDashboard = () => {
  const [data, setData] = useState(null);
  const { darkMode } = useTheme();
  const [moneyDonations, setMoneyDonations] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/orphanage/dashboard");
      console.log("Dashboard Data:", res.data); 
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/donate/item/${id}/status`, {
        status: newStatus,
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!data) return <div className="p-8">Loading...</div>;

  const cardStyle = `p-6 rounded-xl border-l-4 ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow"
  }`;

  const titleStyle = darkMode ? "text-gray-300" : "text-gray-700";
  const headingStyle = darkMode ? "text-white" : "text-gray-900";
  const formatCurrency = (num) => {
    if (!num) return "0";
    return new Intl.NumberFormat("en-IN").format(num);
  };
  return (
    <div className={`p-8 min-h-screen ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
    }`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          🏢 {data.orphanage?.name ?? "Orphanage Dashboard"}
        </h1>
        <p className="text-sm opacity-70">
          {data.orphanage?.city ?? ""} {data.orphanage?.email ? `• ${data.orphanage.email}` : ""}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${cardStyle} border-green-500`}>
          <p className={titleStyle}>Total Donations</p>
          <h2 className="text-2xl font-bold text-green-400">
            ₹{formatCurrency(data.totalMoney)}
          </h2>
        </div>
        <div className={`${cardStyle} border-blue-500`}>
          <p className={titleStyle}>Items Received</p>
          <h2 className="text-2xl font-bold text-blue-400">
            {data.itemsReceived}
          </h2>
        </div>
        <div className={`${cardStyle} border-yellow-500`}>
          <p className={titleStyle}>Pending Pickups</p>
          <h2 className="text-2xl font-bold text-yellow-400">
            {data.pendingItems}
          </h2>
        </div>
      </div>

      {/* MONEY TABLE */}
      <div className={`${cardStyle} mb-6`}>
        <h2 className={`text-xl font-bold mb-4 ${headingStyle}`}>
          💰 Recent Money Donations
        </h2>
        {data.recentMoney.length === 0 ? (
          <p>No donations yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentMoney.map((d) => (
                  <tr key={d._id} className="border-b">
                    <td className="p-3">{d.user?.name || "Unknown"}</td>
                    <td className="p-3 text-green-500 font-bold">
                      ₹{d.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ITEM TABLE */}
      <div className={`p-6 rounded-xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${headingStyle}`}>
          📦 Item Donations (Manage Status)
        </h2>
        {data.recentItems.length === 0 ? (
          <p>No item donations</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className={darkMode ? "bg-gray-700" : "bg-gray-200"}>
                  <th className="p-3">Donor</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Pickup Address</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentItems.map((d) => (
                  <tr key={d._id} className="border-b">
                    <td className="p-3">{d.user?.name || "Unknown"}</td>
                    <td className="p-3 capitalize">{d.itemType}</td>
                    <td className="p-3 text-sm opacity-80">
                      {d.pickupAddress}
                    </td>
                    <td className="p-3 font-semibold">
                      {d.deliveryStatus}
                    </td>
                    <td className="p-3">
                      <select
                        value={d.deliveryStatus}
                        onChange={(e) =>
                          handleStatusChange(d._id, e.target.value)
                        }
                        className={`p-1 border rounded ${
                          darkMode
                            ? "bg-gray-700 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrphanageDashboard;