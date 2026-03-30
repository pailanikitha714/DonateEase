import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI"); 
  
  if (!state || !state.orphanageId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid Payment Request. Redirecting...</p>
        {setTimeout(() => navigate("/dashboard"), 2000)}
      </div>
    );
  }

  const { orphanageId, amount, orphanageName } = state;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await api.post(
        "/donate/money",
        {
          orphanageId,
          amount: Number(amount),
          paymentMethod: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(`Payment of ₹${amount} Successful via ${paymentMethod}! 🎉`);
      navigate("/dashboard");
    } catch (error) {
      alert("Payment Failed. Please try again.");
      setLoading(false);
    }
  };

  const containerBg = darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const cardBg = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const inputStyle = `w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
    darkMode 
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  }`;

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${containerBg}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        <div className={`flex-1 p-6 rounded-xl border shadow-sm ${cardBg}`}>
          <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
          <div className="flex justify-between items-center mb-4">
            <span>Donating to:</span>
            <span className="font-bold">{orphanageName}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-xl font-bold">
            <span>Total Amount:</span>
            <span className="text-blue-600">₹{amount}</span>
          </div>
          <p className="text-sm opacity-75">
            Your contribution helps provide food, clothes, and education to children in need.
          </p>
        </div>

        <div className={`flex-1 p-6 rounded-xl border shadow-sm ${cardBg}`}>
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`flex-1 p-3 rounded-lg border font-semibold transition ${
                  paymentMethod === "UPI"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Card")}
                className={`flex-1 p-3 rounded-lg border font-semibold transition ${
                  paymentMethod === "Card"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("NetBanking")}
                className={`flex-1 p-3 rounded-lg border font-semibold transition ${
                  paymentMethod === "NetBanking"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                Netbanking
              </button>
            </div>

            {paymentMethod === "UPI" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">UPI ID</label>
                  <input 
                    type="text" 
                    placeholder="example@upi" 
                    className={inputStyle} 
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === "Card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Card Number (12 digits) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000" 
                    required
                    maxLength="12"
                    className={inputStyle} 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">Expiry <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      required
                      maxLength="5"
                      className={inputStyle} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1">CVV <span className="text-red-500">*</span></label>
                    <input 
                      type="password" 
                      placeholder="123" 
                      required
                      maxLength="3"
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "NetBanking" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Select Your Bank <span className="text-red-500">*</span></label>
                  <select 
                    required
                    className={inputStyle} 
                  >
                    <option value="" disabled selected>-- Choose Bank --</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="SBI">State Bank of India</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="HDFC">HDFC Bank</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="ICICI">ICICI Bank</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="Axis">Axis Bank</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="PNB">Punjab National Bank</option>
                    <option className={darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} value="Kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
                <p className="text-xs opacity-75">
                  * You will be redirected to your bank's secure payment gateway.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay ₹${amount}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;