import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
    Drawer as MuiDrawer,
    Toolbar,
    Typography,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Box,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import BedroomParentIcon from "@mui/icons-material/BedroomParent";
import KingBedIcon from "@mui/icons-material/KingBed";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import LoginIcon from "@mui/icons-material/Login";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupsIcon from "@mui/icons-material/Groups";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import SpaIcon from "@mui/icons-material/Spa";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";
import PercentIcon from "@mui/icons-material/Percent";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HotelIcon from "@mui/icons-material/Hotel";

const drawerWidth = 260;
const closedDrawerWidth = 70;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: open ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open && {
            "& .MuiDrawer-paper": {
                width: drawerWidth,
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        }),
        ...(!open && {
            "& .MuiDrawer-paper": {
                width: closedDrawerWidth,
                overflowX: "hidden",
                transition: theme.transitions.create("width", {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
            },
        }),
    })
);

const menuItems = [
    {
        name: "Dashboard",
        icon: DashboardIcon,
        path: "/dashboard",
    },
    {
        name: "User Management",
        icon: PeopleIcon,
        isDropdown: true,
        path: "/users",
        subItems: [
            { name: "All Owners", path: "/users/owners", icon: PersonAddIcon },
            { name: "Pending Verifications", path: "/users/pending", icon: VerifiedUserIcon },
        ],
    },
    {
        name: "Properties",
        icon: ApartmentIcon,
        isDropdown: true,
        path: "/properties",
        subItems: [
            { name: "Registration Requests", path: "/properties/requests", icon: AddBusinessIcon },
            { name: "All Properties", path: "/properties/all", icon: BusinessIcon },
            { name: "Property Types", path: "/properties/types", icon: CategoryIcon },
        ],
    },
    {
        name: "Rooms",
        icon: MeetingRoomIcon,
        isDropdown: true,
        path: "/rooms",
        subItems: [
            { name: "All Rooms", path: "/rooms/all", icon: BedroomParentIcon },
            { name: "Room Types", path: "/rooms/types", icon: KingBedIcon },
        ],
    },
    {
        name: "Bookings",
        icon: EventNoteIcon,
        isDropdown: true,
        path: "/bookings",
        subItems: [
            { name: "All Bookings", path: "/bookings/all", icon: BookOnlineIcon },
            { name: "Check-in / Check-out", path: "/bookings/check-in-out", icon: LoginIcon },
            { name: "Calendar View", path: "/bookings/calendar", icon: CalendarMonthIcon },
        ],
    },
    {
        name: "Guests",
        icon: GroupsIcon,
        path: "/guests",
    },
    {
        name: "Services",
        icon: RoomServiceIcon,
        isDropdown: true,
        path: "/services",
        subItems: [
            { name: "Service Categories", path: "/services/categories", icon: SpaIcon },
            { name: "Service Bookings", path: "/services/bookings", icon: BookmarkAddedIcon },
        ],
    },
    {
        name: "Reports",
        icon: AssessmentIcon,
        isDropdown: true,
        path: "/reports",
        subItems: [
            { name: "Revenue Report", path: "/reports/revenue", icon: MonetizationOnIcon },
            { name: "Occupancy Report", path: "/reports/occupancy", icon: TrendingUpIcon },
        ],
    },
    {
        name: "Settings",
        icon: SettingsIcon,
        isDropdown: true,
        path: "/settings",
        subItems: [
            { name: "General", path: "/settings/general", icon: TuneIcon },
            { name: "Commission", path: "/settings/commission", icon: PercentIcon },
            { name: "Seasonal Pricing", path: "/settings/seasonal-pricing", icon: DateRangeIcon },
        ],
    },
];

export default function Sidebar({ open }) {
    const theme = useTheme();
    const location = useLocation();
    const [openDropdowns, setOpenDropdowns] = useState({});

    // Auto-expand dropdown based on current path
    useEffect(() => {
        const currentPath = location.pathname;
        menuItems.forEach((item) => {
            if (item.isDropdown && item.subItems) {
                const isActive = item.subItems.some((sub) => currentPath.startsWith(sub.path));
                if (isActive) {
                    setOpenDropdowns((prev) => ({ ...prev, [item.name]: true }));
                }
            }
        });
    }, [location.pathname]);

    const handleDropdownClick = (name) => {
        if (open) {
            setOpenDropdowns((prev) => ({
                ...prev,
                [name]: !prev[name],
            }));
        }
    };

    const isParentActive = (item) => {
        if (!item.isDropdown) return false;
        return item.subItems?.some((sub) => location.pathname.startsWith(sub.path));
    };

    const nestedItemStyle = {
        "& .MuiListItemButton-root": {
            pl: 4,
            py: 0.75,
            "& .MuiListItemIcon-root": {
                minWidth: 36,
                color: "inherit",
            },
            "&.active": {
                backgroundColor: theme.palette.primary.light,
                color: "#fff",
                "& .MuiListItemIcon-root": {
                    color: "#fff",
                },
            },
        },
    };

    return (
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "flex-start" : "center",
                    px: 2,
                    py: 2,
                }}
            >
                <HotelIcon
                    sx={{
                        color: theme.palette.primary.main,
                        fontSize: 32,
                        mr: open ? 1.5 : 0,
                    }}
                />
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s ease-in-out",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}
                >
                    StayManager
                </Typography>
            </Toolbar>

            <Divider sx={{ mx: 2 }} />

            <Box sx={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
                <List sx={{ pt: 1, px: 0.5 }}>
                    {menuItems.map((item) => {
                        const { name, icon: IconComponent, path, isDropdown, subItems } = item;
                        const parentActive = isParentActive(item);
                        const isOpen = openDropdowns[name] || parentActive;

                        // Regular menu item (no dropdown)
                        if (!isDropdown) {
                            return (
                                <ListItemButton
                                    key={name}
                                    component={NavLink}
                                    to={path}
                                    sx={{
                                        minHeight: 44,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2,
                                        mx: 1,
                                        borderRadius: "8px",
                                        mb: 0.5,
                                        "&.active": {
                                            backgroundColor: theme.palette.primary.main,
                                            color: "#fff",
                                            "& .MuiListItemIcon-root": {
                                                color: "#fff",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        <IconComponent />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={name}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            transition: "opacity 0.2s",
                                        }}
                                    />
                                </ListItemButton>
                            );
                        }

                        // Dropdown menu item
                        return (
                            <React.Fragment key={name}>
                                <ListItemButton
                                    onClick={() => handleDropdownClick(name)}
                                    sx={{
                                        minHeight: 44,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2,
                                        mx: 1,
                                        borderRadius: "8px",
                                        mb: 0.5,
                                        ...(parentActive && {
                                            backgroundColor: theme.palette.primary.main,
                                            color: "#fff",
                                            "& .MuiListItemIcon-root": {
                                                color: "#fff",
                                            },
                                            "&:hover": {
                                                backgroundColor: theme.palette.primary.dark,
                                            },
                                        }),
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: parentActive ? "inherit" : theme.palette.text.secondary,
                                        }}
                                    >
                                        <IconComponent />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={name}
                                        primaryTypographyProps={{
                                            fontSize: 14,
                                            fontWeight: 500,
                                        }}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            transition: "opacity 0.2s",
                                        }}
                                    />
                                    {open && (
                                        isOpen ? (
                                            <ExpandLess sx={{ fontSize: 20 }} />
                                        ) : (
                                            <ExpandMore sx={{ fontSize: 20 }} />
                                        )
                                    )}
                                </ListItemButton>

                                <Collapse in={open && isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding sx={nestedItemStyle}>
                                        {subItems.map((subItem) => {
                                            const SubIcon = subItem.icon;
                                            return (
                                                <ListItemButton
                                                    key={subItem.name}
                                                    component={NavLink}
                                                    to={subItem.path}
                                                    sx={{ mx: 1, borderRadius: "8px" }}
                                                >
                                                    <ListItemIcon>
                                                        <SubIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={subItem.name}
                                                        primaryTypographyProps={{
                                                            fontSize: 13,
                                                            fontWeight: 400,
                                                        }}
                                                    />
                                                </ListItemButton>
                                            );
                                        })}
                                    </List>
                                </Collapse>
                            </React.Fragment>
                        );
                    })}
                </List>
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                {open && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "center" }}
                    >
                        © 2024 StayManager
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
}