// src/Layout/UserLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import UserHeader from "../components/User/Common/UserHeader";
import UserFooter from "../components/User/Common/UserFooter";
import { currentUser } from "../data/userMockData";
import {
  CHATBOT_EMBED_API_URL,
  CHATBOT_EMBED_SCRIPT_URL,
} from "../config/apiConfig";

export default function UserLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const resolvedUserId =
    typeof currentUser?.id === "string"
      ? currentUser.id
      : `user_${currentUser?.id ?? "guest"}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const scriptId = "user-chatbot-embed-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.setAttribute("src", CHATBOT_EMBED_SCRIPT_URL);
      existingScript.setAttribute("data-api", CHATBOT_EMBED_API_URL);
      existingScript.setAttribute("data-user-id", resolvedUserId);
      return undefined;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = CHATBOT_EMBED_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-api", CHATBOT_EMBED_API_URL);
    script.setAttribute("data-user-id", resolvedUserId);
    document.body.appendChild(script);

    return () => {
      const appendedScript = document.getElementById(scriptId);
      if (appendedScript) {
        appendedScript.remove();
      }
    };
  }, [resolvedUserId]);

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
