import React, { useState } from "react";
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
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GeneralIcon from "@mui/icons-material/Build";
import BillingIcon from "@mui/icons-material/CreditCard";
import FaqIcon from "@mui/icons-material/Help";
import ContactIcon from "@mui/icons-material/MailOutline";

const drawerWidth = 240;
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
    { name: "dashboard", icon: DashboardIcon, path: "/dashboard" },
    { name: "projects", icon: FolderIcon, path: "/projects" },
    { name: "tasks", icon: ChecklistIcon, path: "/tasks" },
    { name: "reports", icon: AssessmentIcon, path: "/reports" },
    { name: "users", icon: GroupIcon, path: "/users" },
    {
        name: "settings",
        icon: SettingsIcon,
        isDropdown: true,
        path: "/settings", 
        subItems: [
            { name: "general", path: "/settings/general", icon: GeneralIcon },
            { name: "billing", path: "/settings/billing", icon: BillingIcon },
        ],
    },
    {
        name: "support",
        icon: SupportAgentIcon,
        isDropdown: true,
        path: "/support",
        subItems: [
            { name: "faq", path: "/support/faq", icon: FaqIcon },
            { name: "contact us", path: "/support/contact", icon: ContactIcon },
        ],
    },
];

export default function Sidebar({ open }) {
    const theme = useTheme();
    const location = useLocation(); 
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleClick = (name) => {
        if (open) {
            setOpenDropdown(openDropdown === name ? null : name);
        }
    };

    const nestedItemStyle = {
        "& .MuiListItemButton-root": {
            pl: 6,
            "& .MuiListItemIcon-root": {
                marginLeft: theme.spacing(-1),
                minWidth: 0,
                marginRight: theme.spacing(2),
                color: "inherit",
            },
            "&.active": {
                backgroundColor: theme.palette.action.selected,
            },
        },
    };

    const isParentActive = (parentPath) => {
        return location.pathname.startsWith(parentPath);
    };

    return (
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "flex-start" : "center",
                    p: "0 8px",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        ml: 1,
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s ease-in-out",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}
                >
                    Gemini Admin
                </Typography>
            </Toolbar>

            <Divider sx={{ mx: 2 }} />

            <List sx={{ pt: 1, px: 1 }}>
                {menuItems.map((item) => {
                    const { name, icon: IconComponent, path, isDropdown, subItems } = item;
                    const parentActive = isDropdown && path && isParentActive(path); 
                    const isActiveDropdown = openDropdown === name || parentActive;

                    if (!isDropdown) {
                        return (
                            <ListItemButton
                                key={name}
                                component={NavLink}
                                to={path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    "&.active": {
                                        backgroundColor: theme.palette.primary.main,
                                        color: "#fff",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                        color: "inherit",
                                    }}
                                >
                                    <IconComponent />
                                </ListItemIcon>

                                <ListItemText
                                    primary={name.charAt(0).toUpperCase() + name.slice(1)}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        transition: "opacity 0.2s",
                                    }}
                                />
                            </ListItemButton>
                        );
                    }

                    // --- Dropdown/Root Navigation Item ---
                    return (
                        <React.Fragment key={name}>
                            <ListItemButton
                                onClick={() => handleClick(name)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    ...(parentActive && {
                                        backgroundColor: theme.palette.primary.main, 
                                        color: "#fff", 
                                        "&:hover": {
                                            backgroundColor: theme.palette.primary.dark, 
                                        },
                                    }),
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : "auto",
                                        justifyContent: "center",
                                        color: parentActive ? "inherit" : theme.palette.action.active,
                                    }}
                                >
                                    <IconComponent />
                                </ListItemIcon>
                                <ListItemText
                                    primary={name.charAt(0).toUpperCase() + name.slice(1)}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        transition: "opacity 0.2s",
                                        color: parentActive ? "inherit" : theme.palette.text.primary,
                                    }}
                                />
                                {open && isActiveDropdown ? (
                                    <ExpandLess sx={{ color: parentActive ? "#fff" : "inherit" }} />
                                ) : open ? (
                                    <ExpandMore sx={{ color: parentActive ? "#fff" : "inherit" }} />
                                ) : null}
                            </ListItemButton>

                            {/* --- Nested Sub-Items (Dropdown) --- */}
                            <Collapse in={open && isActiveDropdown} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={nestedItemStyle}>
                                    {subItems.map((subItem) => {
                                        const SubIconComponent = subItem.icon;

                                        return (
                                            <ListItemButton
                                                key={subItem.name}
                                                component={NavLink}
                                                to={subItem.path}
                                            >
                                                <ListItemIcon>
                                                    <SubIconComponent fontSize="small" />
                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={
                                                        subItem.name.charAt(0).toUpperCase() +
                                                        subItem.name.slice(1)
                                                    }
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
        </Drawer>
    );
}