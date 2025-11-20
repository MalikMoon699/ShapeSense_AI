import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userType } from "../services/Helpers";
import Loader from "../components/Loader";

export const ProtectedRoute = ({ allowedTypes, children }) => {
  const { currentUser, loading } = useAuth();

  if (loading)
    return (
      <Loader
        size="70"
        style={{ height: "85vh", backgroundColor: "var(--backGroundColor)" }}
      />
    );

  const type = userType(currentUser);

  if (!allowedTypes.includes(type)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
