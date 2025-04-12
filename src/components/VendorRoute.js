// src/components/VendorRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function VendorRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/vendor" replace />;
}
