import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const drawerWidth = 260;
const closedDrawerWidth = 70;

// Helper to get page title from path
const getPageTitle = (pathname) => {
    const routes = {
        "/dashboard": "Dashboard",
        "/users/owners": "Property Owners",
        "/users/pending": "Pending Verifications",
        "/properties/requests": "Property Requests",
        "/properties/all": "All Properties",
        "/properties/types": "Property Types",
        "/rooms/all": "All Rooms",
        "/rooms/types": "Room Types",
        "/bookings/all": "All Bookings",
        "/bookings/check-in-out": "Check-in / Check-out",
        "/bookings/calendar": "Calendar View",
        "/guests": "Guests",
        "/services/categories": "Service Categories",
        "/services/bookings": "Service Bookings",
        "/reports/revenue": "Revenue Report",
        "/reports/occupancy": "Occupancy Report",
        "/settings/general": "General Settings",
        "/settings/commission": "Commission Settings",
        "/settings/seasonal-pricing": "Seasonal Pricing",
    };

    // Check for dynamic routes
    if (pathname.startsWith("/properties/") && pathname !== "/properties/all" && pathname !== "/properties/requests" && pathname !== "/properties/types") {
        return "Property Details";
    }

    return routes[pathname] || "StayManager";
};

export default function DashboardLayout() {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F4F6F8" }}>
            <Header open={open} onToggle={handleToggle} title={pageTitle} />
            <Sidebar open={open} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)`,
                    transition: (theme) =>
                        theme.transitions.create(["width", "margin"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}