// src/components/User/Common/UserHeader.jsx
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  Divider,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useScrollTrigger,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LogoutIcon from "@mui/icons-material/Logout";
import HotelIcon from "@mui/icons-material/Hotel";
import CloseIcon from "@mui/icons-material/Close";

export default function UserHeader({ transparent = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if user is logged in (mock)
  const isLoggedIn = true; // Change based on auth state
  const user = { name: "Alex Thompson", email: "alex@email.com" };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

  useEffect(() => {
    setIsScrolled(trigger);
  }, [trigger]);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMobileToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { label: "Dashboard", path: "/account/dashboard", icon: DashboardIcon },
    { label: "My Bookings", path: "/account/bookings", icon: BookOnlineIcon },
    { label: "Wishlist", path: "/account/wishlist", icon: FavoriteIcon },
    { label: "My Reviews", path: "/account/reviews", icon: RateReviewIcon },
    { label: "Profile", path: "/account/profile", icon: PersonIcon },
  ];

  const shouldBeTransparent = transparent && !isScrolled;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={shouldBeTransparent ? 0 : 2}
        sx={{
          backgroundColor: shouldBeTransparent
            ? "transparent"
            : theme.palette.background.paper,
          color: shouldBeTransparent ? "#fff" : theme.palette.text.primary,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <HotelIcon
                sx={{
                  fontSize: 32,
                  mr: 1,
                  color: shouldBeTransparent
                    ? "#fff"
                    : theme.palette.primary.main,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: shouldBeTransparent
                    ? "#fff"
                    : theme.palette.primary.main,
                  display: { xs: "none", sm: "block" },
                }}
              >
                BhutanStay
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {isLoggedIn ? (
                <>
                  <IconButton
                    component={RouterLink}
                    to="/account/wishlist"
                    sx={{ color: "inherit" }}
                  >
                    <Badge badgeContent={3} color="error">
                      <FavoriteIcon />
                    </Badge>
                  </IconButton>

                  <Button
                    onClick={handleProfileClick}
                    sx={{
                      color: "inherit",
                      textTransform: "none",
                      ml: 1,
                    }}
                    startIcon={
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                        }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                    }
                  >
                    {user.name.split(" ")[0]}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: { mt: 1.5, minWidth: 220, borderRadius: 2 },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography fontWeight={600}>{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    {menuItems.map((item) => (
                      <MenuItem
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          handleMenuClose();
                        }}
                      >
                        <ListItemIcon>
                          <item.icon fontSize="small" />
                        </ListItemIcon>
                        {item.label}
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem sx={{ color: "error.main" }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ color: "inherit" }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: shouldBeTransparent
                        ? "#fff"
                        : theme.palette.primary.main,
                      color: shouldBeTransparent
                        ? theme.palette.primary.main
                        : "#fff",
                      "&:hover": {
                        bgcolor: shouldBeTransparent
                          ? alpha("#fff", 0.9)
                          : theme.palette.primary.dark,
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { md: "none" }, color: "inherit" }}
              onClick={handleMobileToggle}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileToggle}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Menu
          </Typography>
          <IconButton onClick={handleMobileToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {isLoggedIn && (
          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {user.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        <List>
          {isLoggedIn ? (
            <>
              {menuItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    handleMobileToggle();
                  }}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItemButton sx={{ color: "error.main" }}>
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          ) : (
            <>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemText primary="Login" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/register")}>
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
