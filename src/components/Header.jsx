import React, { useState } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Box,
  Tooltip,
  ListItemIcon,
  Badge,
  InputBase,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Notifications from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
      "&:focus": {
        width: "40ch",
      },
    },
  },
}));

export default function Header({ open, onToggle, title = "Dashboard" }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const openMenu = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchor);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const notifications = [
    { id: 1, message: "New property registration request", time: "5 min ago", unread: true },
    { id: 2, message: "Booking #BK-2024-008 confirmed", time: "1 hour ago", unread: true },
    { id: 3, message: "Owner verification pending", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={onToggle}
            sx={{
              mr: 2,
              backgroundColor: "rgba(33, 150, 243, 0.08)",
              "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.15)" },
            }}
          >
            <MenuIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>

          <Typography variant="h6" fontWeight={600} noWrap component="div">
            {title}
          </Typography>

          {/* Search Bar */}
          <Search sx={{ display: { xs: "none", md: "flex" } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search bookings, guests, properties..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Help */}
          <Tooltip title="Help">
            <IconButton
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <HelpOutlineIcon sx={{ color: theme.palette.text.secondary }} />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                "&:hover": { backgroundColor: "rgba(255, 193, 7, 0.2)" },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications sx={{ color: theme.palette.secondary.dark }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notification Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={openNotifications}
            onClose={handleNotificationClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, width: 320, borderRadius: 2 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontWeight={600}>Notifications</Typography>
            </Box>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationClose}
                sx={{
                  py: 1.5,
                  backgroundColor: notification.unread
                    ? alpha(theme.palette.primary.main, 0.05)
                    : "transparent",
                }}
              >
                <Box>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={handleNotificationClose}
              sx={{ justifyContent: "center", color: theme.palette.primary.main }}
            >
              View All Notifications
            </MenuItem>
          </Menu>

          {/* Profile Avatar */}
          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileClick} size="small" sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: theme.palette.primary.main,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 1.5, minWidth: 220, borderRadius: 2 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: theme.palette.primary.main }}>
                A
              </Avatar>
              <Box>
                <Typography fontWeight={600}>Admin User</Typography>
                <Typography variant="body2" color="text.secondary">
                  Super Admin
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <MenuItem>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "error.main" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}