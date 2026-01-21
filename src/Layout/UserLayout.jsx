// src/Layout/UserLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import UserHeader from "../components/User/Common/UserHeader";
import UserFooter from "../components/User/Common/UserFooter";

export default function UserLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <UserHeader transparent={isHomePage} />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <UserFooter />
    </Box>
  );
}
