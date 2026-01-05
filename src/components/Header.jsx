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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Notifications from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function Header({ open, onToggle, title = "Dashboard" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "width 0.3s ease-in-out, margin 0.3s ease-in-out",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Sidebar Toggle & Title */}
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
            <MenuIcon sx={{ color: "#1976D2" }} />
          </IconButton>

          <Typography variant="h6" fontWeight={600} noWrap component="div">
            {title}
          </Typography>
        </Box>

        {/* Right: Notifications + Profile */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                backgroundColor: "rgba(255, 193, 7, 0.1)",
                "&:hover": { backgroundColor: "rgba(255, 193, 7, 0.2)" },
              }}
            >
              <Notifications sx={{ color: "#FFC107" }} />
            </IconButton>
          </Tooltip>

          {/* Profile Avatar */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileClick}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                RC
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
              sx: { mt: 1.5, minWidth: 200, borderRadius: 2 },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* User Info */}
            <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 40, height: 40 }}>RC</Avatar>
              <Box>
                <Typography fontWeight={600}>Reema Chettri</Typography>
                <Typography variant="body2" color="text.secondary">
                  Admin
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Menu Actions */}
            <MenuItem>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <MenuItem>
              <ListItemIcon>
                <Notifications fontSize="small" />
              </ListItemIcon>
              Notifications
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
