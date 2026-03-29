import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("money");
  const [stats, setStats] = useState(null);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [itemDonations, setItemDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        setStats(statsRes.data);
        const [moneyRes, itemRes] = await Promise.all([
          api.get("/donate/money/all"),
          api.get("/donate/item/all")
        ]);
        setMoneyDonations(moneyRes.data);
        setItemDonations(itemRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data", error);
        console.error("Failed to load admin data");
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleMoneyStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/donate/money/${id}/status`, { status: newStatus });
      const res = await api.get("/donate/money/all");
      setMoneyDonations(res.data);
    } catch (error) {
      alert("Failed to update");
    }
  };

  const handleItemStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/donate/item/${id}/status`, { status: newStatus });
      const res = await api.get("/donate/item/all");
      setItemDonations(res.data);
    } catch (error) {
      alert("Failed to update");
    }
  };

  const containerBg = darkMode ? "bg-gray-900" : "bg-gray-100";
  const sidebarBg = darkMode ? "bg-gray-800" : "bg-slate-800"; 
  const contentBg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const statsCard = `p-6 rounded-xl shadow-md border-l-4 transition ${
    darkMode 
      ? "bg-gray-800 border-gray-700 text-white" 
      : "bg-white border-gray-200 text-gray-800"
  }`;

  const tableCard = darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900";

  const getStatusBadge = (status) => {
    if (darkMode) {
       if (status === "SUCCESS" || status === "DELIVERED") return "bg-green-900 text-white border border-green-700";
       if (status === "PENDING" || status === "PICKED_UP") return "bg-yellow-900 text-white border border-yellow-700";
       if (status === "REJECTED") return "bg-red-900 text-white border border-red-700";
       return "bg-gray-700 text-white border border-gray-600";
    } else {
       if (status === "SUCCESS" || status === "DELIVERED") return "bg-green-100 text-green-800 border border-green-300";
       if (status === "PENDING" || status === "PICKED_UP") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
       if (status === "REJECTED") return "bg-red-100 text-red-800 border border-red-300";
       return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  if (loading) return <div className={`p-8 text-center ${containerBg}`}>Loading Control Center...</div>;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${containerBg}`}>
      
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col w-64 ${sidebarBg} text-white min-h-screen shadow-xl`}>
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🛡️</span> Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("money")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${activeTab === "money" ? "bg-blue-600" : "hover:bg-gray-700"}`}
          >
            💰 Money Donations
          </button>
          <button 
            onClick={() => setActiveTab("items")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${activeTab === "items" ? "bg-blue-600" : "hover:bg-gray-700"}`}
          >
            📦 Item Donations
          </button>
        </nav>
        <div className="p-4 text-xs text-gray-400">
          Logged in as Administrator
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${statsCard} border-l-4 border-green-500`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Total Revenue</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">₹{stats?.totalDonations || 0}</h3>
          </div>
          <div className={`${statsCard} border-l-4 border-blue-500`}>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">Items Processed</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats?.itemsDonated || 0}</h3>
          </div>
        </div>

        {/* MOBILE TABS */}
        <div className="md:hidden mb-6 flex gap-2">
          <button 
            onClick={() => setActiveTab("money")}
            className={`flex-1 py-2 rounded font-bold ${activeTab === "money" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Money
          </button>
          <button 
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-2 rounded font-bold ${activeTab === "items" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Items
          </button>
        </div>

        {/* CONTENT SWITCHER */}
        <div className={`${tableCard} rounded-xl shadow-sm overflow-hidden border`}>
          
          {/* --- MONEY SECTION --- */}
          {activeTab === "money" && (
            <div>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Money Donation Requests</h2>
                <p className="text-sm opacity-60">Review and approve transactions.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">User</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Amount</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Method</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Current Status</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-100">
                    {moneyDonations.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center opacity-50">No transactions found.</td></tr>
                    ) : (
                      moneyDonations.map((d) => (
                        <tr 
                          key={d._id}
                          className="transition hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          <td className="p-4 font-semibold text-gray-500 dark:text-gray-100">{d.user?.name}</td>
                          <td className="p-4 font-bold text-green-600 dark:text-green-500">{d.amount}</td>
                          <td className="p-4 dark:text-white">
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded dark:bg-gray-700">{d.paymentMethod}</span>
                          </td>
                          <td className="p-4">
                            <span className={getStatusBadge(d.status)}>
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={d.status}
                              onChange={(e) => handleMoneyStatusChange(d._id, e.target.value)}
                              className="text-sm border p-1 rounded bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-gray-900"
                            >
                              <option value="PENDING" className="bg-white text-black dark:bg-gray-700 dark:text-white">Pending</option>
                              <option value="SUCCESS" className="bg-white text-black dark:bg-gray-700 dark:text-white">Success</option>
                              <option value="REJECTED" className="bg-white text-black dark:bg-gray-700 dark:text-white">Reject</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- ITEMS SECTION --- */}
          {activeTab === "items" && (
            <div>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold">Item Donation Requests</h2>
                <p className="text-sm opacity-60">Manage pickup and delivery status.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">User</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Item</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Address</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Status</th>
                      <th className="p-4 text-xs uppercase font-bold text-gray-600 dark:text-gray-200">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-100">
                    {itemDonations.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center opacity-50">No item donations found.</td></tr>
                    ) : (
                      itemDonations.map((d) => (
                        <tr 
                        key={d._id}
                        className="transition hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                          <td className="p-4 font-semibold text-gray-500 dark:text-gray-100">{d.user?.name}</td>
                          <td className="p-4 capitalize font-bold text-blue-600 dark:text-blue-400">{d.itemType}</td>
                          <td className="p-4 text-sm max-w-xs truncate text-gray-500 dark:text-gray-200">{d.pickupAddress}</td>
                          <td className="p-4">
                             <span className={getStatusBadge(d.deliveryStatus)}>
                              {d.deliveryStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={d.deliveryStatus}
                              onChange={(e) => handleItemStatusChange(d._id, e.target.value)}
                              className="text-sm border p-1 rounded bg-white hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-gray-900"
                            >
                              <option value="PENDING" className="bg-white text-black dark:bg-gray-700 dark:text-white">Pending</option>
                              <option value="PICKED_UP" className="bg-white text-black dark:bg-gray-700 dark:text-white">Picked Up</option>
                              <option value="DELIVERED" className="bg-white text-black dark:bg-gray-700 dark:text-white">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;