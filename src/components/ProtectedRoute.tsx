import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { id } = useSelector((state: RootState) => state.userReducer);
  const isAuthorized = id !== "";

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
