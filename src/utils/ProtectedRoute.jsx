import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import Loader from "./loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex w-full h-screen justify-center items-center bg-glass">
        <Loader />
      </div>
    );
  }

  if (!user) {
    // Pobierz pełny URL (ścieżka, query params i hash)
    const fullPath = location.pathname + location.search + location.hash;

    return <Navigate to="/SignIn" replace state={{ from: fullPath }} />;
  }

  return children;
};

export default ProtectedRoute;
