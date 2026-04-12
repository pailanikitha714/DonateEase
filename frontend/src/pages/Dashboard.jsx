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
  const [selectedItemType, setSelectedItemType] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [moneyAmount, setMoneyAmount] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedMoneyOrphanage, setSelectedMoneyOrphanage] = useState(null);
  const [donationForm, setDonationForm] = useState({
    address: "",
    date: "",
    timeSlot: "Morning (9 AM - 12 PM)"
  });
  useEffect(() => {
    const fetchOrphanages = async () => {
      try {
        const res = await api.get("/orphanage");
        setOrphanages(res.data);
        setFilteredOrphanages(res.data);
      } catch (err) {
        console.error("Error fetching orphanages", err);
      }
    };
    fetchOrphanages();
  }, []);

  useEffect(() => {
    if (!searchCity.trim()) {
      setFilteredOrphanages(orphanages);
    } else {
      const term = searchCity.toLowerCase();
      const filtered = orphanages.filter((o) =>
        o.name?.toLowerCase().includes(term) ||
        o.city?.toLowerCase().includes(term) ||
        o.address?.toLowerCase().includes(term)
      );
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
    setSelectedItemType(itemType);
    setCustomItem("");
    setIsModalOpen(true);
  };
  const closeDonateModal = () => {
    setIsModalOpen(false);
    setDonationForm({
      address: "",
      date: "",
      timeSlot: "Morning (9 AM - 12 PM)"
    });
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (selectedItemType === "OTHER" && !customItem.trim()) {
      alert("Please enter item name");
      return;
    }
    if (!donationForm.address || !donationForm.date) {
      alert("Please fill all details");
      return;
    }
    const selectedDate = new Date(donationForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert("Pickup date cannot be in the past ❌");
      return;
    }
    if (selectedDate.getFullYear() > 2100) {
      alert("Please enter a valid date ❌");
      return;
    }
    try {
      await api.post(
        "/donate/item",
        {
          orphanageId: selectedOrphanage,
          itemType:
            selectedItemType === "OTHER"
              ? customItem.toLowerCase()
              : selectedItemType,
          pickupAddress: donationForm.address,
          pickupDate: donationForm.date,
          timeSlot: donationForm.timeSlot,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(
        `${selectedItemType === "OTHER" ? customItem : selectedItemType
        } donation scheduled on ${donationForm.date} 🚚`
      );
      closeDonateModal();
    } catch (error) {
      console.error(error);
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
      ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
      : "bg-white text-gray-900 border-gray-300"
  }`;
  return (
    <div className={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">
            Explore Orphanages 👋
          </h2>
          <div className="w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name, city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className={inputStyle}
            />
          </div>
          <button
            onClick={() => navigate("/my-donations")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition whitespace-nowrap"
          >
            My Donations
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-6">
          Available Orphanages {searchCity && `(Search: ${searchCity})`}
        </h3>
        {filteredOrphanages.length === 0 ? (
          <p className={`text-center mt-10 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>
            No orphanages found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrphanages.map((o) => (
              <div key={o._id} className={cardStyle}>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                    {o.name}
                  </h3>
                  <p className="text-sm mb-2 opacity-80">
                    📍 {o.address}, <span className="font-bold">{o.city}</span>
                  </p>
                  <p className="text-sm mb-2">📧 {o.user?.email || "No email available"}</p>
                  <p className="text-sm mb-2">📞 +91 {o.phone}</p>
                  <p className="text-sm mb-4">
                    <span className="font-semibold">Needs: </span>
                    {o.needs?.length ? o.needs.join(", ") : "General supplies"}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                      onClick={() => handleDonateMoney(o._id, o.name)}
                    >
                      Donate Money
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                      onClick={() => openDonateModal(o._id, "food")}
                    >
                      Food
                    </button>
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
                      onClick={() => openDonateModal(o._id, "clothes")}
                    >
                      Clothes
                    </button>
                    <button
                      className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
                      onClick={() => openDonateModal(o._id, "books")}
                    >
                      Books
                    </button>
                    <button
                      className="col-span-2 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition text-sm"
                      onClick={() => openDonateModal(o._id, "OTHER")}
                    >
                      Donate Other Items
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-xl ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}>
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-center">Schedule Pickup</h3>
            </div>
            <form onSubmit={handleItemSubmit} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Pickup Address"
                value={donationForm.address}
                onChange={(e) =>
                  setDonationForm({ ...donationForm, address: e.target.value })
                }
                className={inputStyle}
                required
              />
              {selectedItemType === "OTHER" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Enter Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. toys, medicines..."
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                    className={inputStyle}
                    required
                  />
                </div>
              )}
             <input
              type="date"
              value={donationForm.date}
              min={new Date().toISOString().split("T")[0]}   // ❗ prevents past dates
              max="2100-12-31"                               // ❗ prevents crazy future dates
              onChange={(e) =>
                setDonationForm({ ...donationForm, date: e.target.value })
              }
              className={inputStyle}
              required
            />
              <select
                value={donationForm.timeSlot}
                onChange={(e) =>
                  setDonationForm({ ...donationForm, timeSlot: e.target.value })
                }
                className={inputStyle}
              >
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 4 PM)</option>
                <option>Evening (4 PM - 7 PM)</option>
              </select>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDonateModal}
                  className="flex-1 border rounded py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded"
                >
                  Confirm
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