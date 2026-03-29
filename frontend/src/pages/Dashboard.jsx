import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const [orphanages, setOrphanages] = useState([]);
  const [filteredOrphanages, setFilteredOrphanages] = useState([]);
  const { darkMode } = useTheme(); 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrphanage, setSelectedOrphanage] = useState(null);
  const [selectedItemType, setselectedItemType] = useState("");
  const [donationForm, setDonationForm] = useState({
    address: "",
    date: "",
    timeSlot: "Morning (9 AM - 12 PM)"
  });

  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const res = await api.get("/orphanages");
        console.log("Frontend Received Data:", res.data);
        setOrphanages(res.data);
        setFilteredOrphanages(res.data);
      } catch (err) {
        console.error("Error fetching orphanages", err);
      }
    };
    fetchOrphanages();
  }, []);

  useEffect(() => {
    if (!searchCity || searchCity === "") {
      setFilteredOrphanages(orphanages || []); 
    } else {
      const term = searchCity.toLowerCase().trim();
      const filtered = (orphanages || []).filter((o) => {
        return (
          (o.name || "").toLowerCase().includes(term) ||
          (o.city || "").toLowerCase().includes(term) ||
          (o.address || "").toLowerCase().includes(term)
        );
      });
      setFilteredOrphanages(filtered);
    }
  }, [searchCity, orphanages]);

  const handleDonateMoney = (orphanageId, orphanageName) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    const amount = prompt(`Enter donation amount for ${orphanageName} (₹):`);
    if (!amount || amount <= 0) {
      alert("Invalid amount");
      return;
    }
    navigate("/payment", {
      state: { orphanageId, amount, orphanageName }
    });
  };

  const openDonateModal = (orphanageId, itemType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    setSelectedOrphanage(orphanageId);
    setselectedItemType(itemType);
    setIsModalOpen(true);
  };

  const closeDonateModal = () => {
    setIsModalOpen(false);
    setDonationForm({ address: "", date: "", timeSlot: "Morning (9 AM - 12 PM)" });
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!donationForm.address || !donationForm.date) {
      alert("Please fill all details");
      return;
    }
    try {
      await api.post(
        "/donate/item",
        {
          orphanageId: selectedOrphanage,
          itemType: selectedItemType,
          pickupAddress: donationForm.address,
          pickupDate: donationForm.date,
          timeSlot: donationForm.timeSlot
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`${selectedItemType} donation request placed! Driver will arrive on ${donationForm.date} 🚚`);
      closeDonateModal();
    } catch (error) {
      alert("Item donation failed.");
    }
  };

  const containerStyle = `min-h-screen p-8 transition-colors duration-300 ${
    darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  }`;

  const cardStyle = `rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 ${
    darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
  }`;

  const inputStyle = `w-full p-2 border rounded-lg outline-none transition ${
    darkMode 
      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
      : "bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
  }`;

  return (
    <div className={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Dashboard 👋</h2>
          <div className="w-full md:w-96 relative">
             <input 
               type="text"
               placeholder="Search Orphanages (Name, City)..."
               value={searchCity}
               onChange={(e) => setSearchCity(e.target.value)}
               className={inputStyle} // Reusing the style
             />
          </div>
          <button
            onClick={() => (window.location.href = "/my-donations")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition whitespace-nowrap"
          >
            View My Donations
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-6">
           Available Orphanages {searchCity && `(Search: ${searchCity})`}
        </h3>
        {filteredOrphanages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No orphanages found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrphanages.map((o) => (
              <div key={o._id} className={cardStyle}>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-500">{o.name}</h3>
                  <p className="text-sm mb-2 opacity-75">
                    📍 {o.address}, <span className="font-bold">{o.city}</span>
                  </p>
                  <div className="mb-4">
                    <span className="text-sm font-semibold">Needs: </span>
                    <span className="text-sm opacity-90">
                      {o.needs && o.needs.length > 0 ? o.needs.join(", ") : "General supplies"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition text-sm font-semibold"
                      onClick={() => handleDonateMoney(o._id, o.name)}
                    >
                      Donate Money
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-sm"
                      onClick={() => openDonateModal(o._id, "food")}
                    >
                      Donate Food
                    </button>
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded transition text-sm"
                      onClick={() => openDonateModal(o._id, "clothes")}
                    >
                      Donate Clothes
                    </button>
                    <button
                      className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition text-sm"
                      onClick={() => openDonateModal(o._id, "books")}
                    >
                      Donate Books
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}>
            <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className="text-2xl font-bold text-center">
                Schedule Pickup 🚚
              </h3>
            </div>
            <form onSubmit={handleItemSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Pickup Address</label>
                <input
                  type="text"
                  placeholder="House No, Street, Area..."
                  value={donationForm.address}
                  onChange={(e) => setDonationForm({...donationForm, address: e.target.value})}
                  className={inputStyle} // Applied fixed style
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Available Date</label>
                <input
                  type="date"
                  value={donationForm.date}
                  onChange={(e) => setDonationForm({...donationForm, date: e.target.value})}
                  className={inputStyle} // Applied fixed style
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Preferred Time Slot</label>
                <select
                  value={donationForm.timeSlot}
                  onChange={(e) => setDonationForm({...donationForm, timeSlot: e.target.value})}
                  className={inputStyle} // Applied fixed style
                >
                  <option className={darkMode ? "bg-gray-700" : "bg-white"}>Morning (9 AM - 12 PM)</option>
                  <option className={darkMode ? "bg-gray-700" : "bg-white"}>Afternoon (12 PM - 4 PM)</option>
                  <option className={darkMode ? "bg-gray-700" : "bg-white"}>Evening (4 PM - 7 PM)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDonateModal}
                  className={`flex-1 py-2 rounded-lg border font-semibold transition ${
                    darkMode 
                      ? "border-gray-500 hover:bg-gray-700 text-white" 
                      : "border-gray-400 hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Confirm Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;