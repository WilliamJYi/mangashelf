import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { isLoggedIn, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) return <div>Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
