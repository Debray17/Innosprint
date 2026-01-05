import React, { useState } from "react";
import { Box, CssBaseline, Toolbar, Container } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
    const [open, setOpen] = useState(true);

    const handleDrawerToggle = () => setOpen(!open);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />
            <Header open={open} onToggle={handleDrawerToggle} />
            <Sidebar open={open} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minWidth: 0,
                    transition: "width 0.3s ease-in-out",
                    width: open
                        ? `calc(100% - 240px)`  // expanded drawer
                        : `calc(100% - 72px)`,  // collapsed drawer
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
                    <Outlet />
                </Container>
            </Box>

        </Box>
    );
}
