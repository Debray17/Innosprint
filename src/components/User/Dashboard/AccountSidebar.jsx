// src/components/User/Dashboard/AccountSidebar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PaymentIcon from "@mui/icons-material/Payment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
  { label: "Dashboard", path: "/account/dashboard", icon: DashboardIcon },
  { label: "My Bookings", path: "/account/bookings", icon: BookOnlineIcon },
  { label: "Profile", path: "/account/profile", icon: PersonIcon },
  { label: "Wishlist", path: "/account/wishlist", icon: FavoriteIcon },
  { label: "My Reviews", path: "/account/reviews", icon: RateReviewIcon },
];

const settingsItems = [
  { label: "Payment Methods", path: "/account/payments", icon: PaymentIcon },
  {
    label: "Notifications",
    path: "/account/notifications",
    icon: NotificationsIcon,
  },
  { label: "Security", path: "/account/security", icon: SecurityIcon },
];

export default function AccountSidebar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/account/bookings") {
      return location.pathname.startsWith("/account/bookings");
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <Paper sx={{ p: 1, position: "sticky", top: 100 }}>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          MY ACCOUNT
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                "& .MuiListItemIcon-root": { color: "#fff" },
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
          SETTINGS
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        {settingsItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                "& .MuiListItemIcon-root": { color: "#fff" },
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <List sx={{ py: 0 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            mx: 1,
            color: theme.palette.error.main,
            "&:hover": {
              bgcolor: `${theme.palette.error.main}10`,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      </List>
    </Paper>
  );
}
