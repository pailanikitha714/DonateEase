import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("money");
  const [stats, setStats] = useState(null);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [itemDonations, setItemDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingOrphanages, setPendingOrphanages] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login"); 
    }
  }, []);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        setStats(statsRes.data || {});
        const pendingRes = await api.get("/admin/orphanages/pending");
        setPendingOrphanages(pendingRes.data);
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

  const approveOrphanage = async (id) => {
    try {
      await api.patch(`/admin/orphanage/approve/${id}`);
      alert("Orphanage Approved ✅");
      setPendingOrphanages(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectOrphanage = async (id) => {
    try {
      await api.patch(`/admin/orphanage/reject/${id}`);
      alert("Orphanage Rejected ❌");

      setPendingOrphanages(prev =>
        prev.filter(o => o._id !== id)
      );
    } catch (err) {
      alert("Rejection failed");
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
  const formatCurrency = (num) => {
    return Number(num || 0).toLocaleString("en-IN");
  };
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
          <button 
            onClick={() => setActiveTab("orphanages")}
            className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${activeTab === "orphanages" ? "bg-blue-600" : "hover:bg-gray-700"}`}
          >
            🏢 Orphanage Approvals
          </button>
        </nav>
        <div className="p-4 text-xs text-gray-400">
          Logged in as Administrator
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
          <div className={`${statsCard} border-l-4 border-green-500 overflow-hidden`}>
            <p className={`text-sm font-semibold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Total Revenue</p>
            <h3 className="text-2xl md:text-3xl font-bold text-green-600 mt-2 break-words">₹{formatCurrency(stats?.totalDonations || 0)}</h3>
          </div>
          <div className={`${statsCard} border-l-4 border-blue-500`}>
            <p className={`text-sm font-semibold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Items Processed</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">{stats?.itemsDonated || 0}</h3>
          </div>
        </div>

        {/* MOBILE TABS */}
        <div className="md:hidden mb-6 flex gap-2">
          <button 
            onClick={() => setActiveTab("money")}
            className={`flex-1 py-2 rounded font-bold ${activeTab === "money" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            💰 Money Donations
          </button>
          <button 
            onClick={() => setActiveTab("items")}
            className={`flex-1 py-2 rounded font-bold ${activeTab === "items" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            📦 Item Donations
          </button>
          <button 
            onClick={() => setActiveTab("orphanages")}
            className={`flex-1 py-2 rounded font-bold ${activeTab === "orphanages" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            🏢 Orphanage Approvals
          </button>
        </div>

        {/* CONTENT SWITCHER */}
        <div className={`${tableCard} rounded-xl shadow-sm overflow-hidden border`}>
          
          {/* --- MONEY SECTION --- */}
          {activeTab === "money" && (
            <div>
              <div className={`p-6 border-b ${ darkMode ? "border-gray-700" : "border-gray-200" }`}>
                <h2 className="text-xl font-bold">Money Donations</h2>
                <p className="text-sm opacity-60">View all user donation transactions.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead
                    className={`${
                      darkMode
                        ? "bg-gray-800 border-b border-gray-700"
                        : "bg-gray-100 border-b border-gray-300"
                    }`}
                  >
                    <tr>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>User</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Orphanage</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Amount</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Method</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-gray-700 text-gray-200" : "divide-gray-300 text-gray-800"
                    }`}
                  >
                    {moneyDonations.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-8 text-center opacity-50">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      moneyDonations.map((d) => (
                        <tr
                          key={d._id}
                          className={`transition ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                          }`}
                        >
                          <td className="p-4 font-semibold">{d.user?.name}</td>
                          <td className="p-4">{d.orphanage?.name || "N/A"}</td>
                          <td className="p-4 font-bold text-green-600 break-words whitespace-nowrap">₹{formatCurrency(d.amount)}</td>
                          <td className="p-4">{d.paymentMethod}</td>
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
              <div className={`p-6 border-b ${ darkMode ? "border-gray-700" : "border-gray-200" }`}>
                <h2 className="text-xl font-bold">Item Donations</h2>
                <p className="text-sm opacity-60">View and track item donation deliveries.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead
                    className={`${
                      darkMode
                        ? "bg-gray-800 border-b border-gray-700"
                        : "bg-gray-100 border-b border-gray-300"
                    }`}
                  >
                    <tr>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>User</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Orphanage</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Item</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Address</th>
                      <th className={`p-4 text-xs uppercase tracking-wider font-bold ${ darkMode ? "text-gray-300" : "text-gray-700" }`}>Status</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      darkMode
                        ? "divide-gray-700 text-gray-200"
                        : "divide-gray-300 text-gray-800"
                    }`}
                  >
                    {itemDonations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center opacity-50">No item donations found.</td>
                      </tr>
                    ) : (
                      itemDonations.map((d) => (
                        <tr
                          key={d._id}
                          className={`transition ${
                            darkMode
                              ? "hover:bg-gray-700 odd:bg-gray-800 even:bg-gray-900"
                              : "hover:bg-gray-200 odd:bg-white even:bg-gray-50"
                          }`}
                        >
                          <td className="p-4 font-semibold">{d.user?.name}</td>
                          <td className="p-4">{d.orphanage?.name || "N/A"}</td>
                          <td className="p-4 capitalize font-bold text-blue-600 dark:text-blue-400">{d.itemType}</td>
                          <td className="p-4 text-sm max-w-xs truncate opacity-80">{d.pickupAddress}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${getStatusBadge(d.deliveryStatus)}`}>{d.deliveryStatus}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "orphanages" && (
            <div>
              <div className={`p-6 border-b ${ darkMode ? "border-gray-700" : "border-gray-200" }`}>
                <h2 className="text-xl font-bold">Pending Orphanages</h2>
                <p className="text-sm opacity-60">Approve organizations before they go live.</p>
              </div>
              <div className="p-6 space-y-4">
                {pendingOrphanages.length === 0 ? (
                  <p className="text-center opacity-50">No pending approvals 🎉</p>
                ) : (
                  pendingOrphanages.map((o) => (
                    <div key={o._id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{o.name}</h3>
                        <p className="text-sm opacity-70">{o.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveOrphanage(o._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectOrphanage(o._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 
