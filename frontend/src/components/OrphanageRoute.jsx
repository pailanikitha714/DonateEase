import { Navigate } from "react-router-dom";

const OrphanageRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "orphanage") {
    if (user.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
};

export default OrphanageRoute;