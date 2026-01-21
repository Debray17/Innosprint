// src/pages/User/Account/UserDashboardPage.jsx
import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import {
  currentUser,
  userBookings,
  userWishlist,
  userNotifications,
} from "../../../data/userMockData";

export default function UserDashboardPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Get upcoming bookings
  const upcomingBookings = userBookings
    .filter((b) => b.status === "confirmed" && new Date(b.checkIn) > new Date())
    .slice(0, 2);

  // Get recent notifications
  const recentNotifications = userNotifications
    .filter((n) => !n.isRead)
    .slice(0, 3);

  // Calculate loyalty progress
  const pointsToNextTier = 5000;
  const loyaltyProgress = (currentUser.loyaltyPoints / pointsToNextTier) * 100;

  const statCards = [
    {
      label: "Total Bookings",
      value: currentUser.totalBookings,
      icon: BookOnlineIcon,
      color: theme.palette.primary.main,
      link: "/account/bookings",
    },
    {
      label: "Wishlist",
      value: userWishlist.length,
      icon: FavoriteIcon,
      color: theme.palette.error.main,
      link: "/account/wishlist",
    },
    {
      label: "Reviews",
      value: 5,
      icon: RateReviewIcon,
      color: theme.palette.warning.main,
      link: "/account/reviews",
    },
    {
      label: "Loyalty Points",
      value: currentUser.loyaltyPoints.toLocaleString(),
      icon: LoyaltyIcon,
      color: theme.palette.success.main,
      link: "/account/rewards",
    },
  ];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <AccountSidebar />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Welcome Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 24,
                    }}
                  >
                    {currentUser.firstName.charAt(0)}
                    {currentUser.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Welcome back, {currentUser.firstName}!
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        label={currentUser.membershipTier}
                        size="small"
                        sx={{
                          bgcolor:
                            currentUser.membershipTier === "Gold"
                              ? "#FFD700"
                              : currentUser.membershipTier === "Platinum"
                                ? "#E5E4E2"
                                : theme.palette.primary.main,
                          color:
                            currentUser.membershipTier === "Gold"
                              ? "#000"
                              : "#fff",
                          fontWeight: 600,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Member since{" "}
                        {new Date(currentUser.memberSince).getFullYear()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  to="/account/profile"
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Loyalty Progress */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Progress to Platinum
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {currentUser.loyaltyPoints.toLocaleString()} /{" "}
                    {pointsToNextTier.toLocaleString()} points
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={loyaltyProgress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Earn{" "}
                  {(
                    pointsToNextTier - currentUser.loyaltyPoints
                  ).toLocaleString()}{" "}
                  more points to reach Platinum status
                </Typography>
              </Box>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {statCards.map((stat) => (
                <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={() => navigate(stat.link)}
                  >
                    <CardContent sx={{ textAlign: "center", py: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: alpha(stat.color, 0.1),
                          mx: "auto",
                          mb: 1,
                        }}
                      >
                        <stat.icon sx={{ color: stat.color }} />
                      </Avatar>
                      <Typography variant="h5" fontWeight={700}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Upcoming Bookings */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Upcoming Stays
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      component={RouterLink}
                      to="/account/bookings"
                    >
                      View All
                    </Button>
                  </Box>

                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking, index) => (
                      <Box key={booking.id}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            py: 2,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "grey.50" },
                            borderRadius: 1,
                            px: 1,
                            mx: -1,
                          }}
                          onClick={() =>
                            navigate(`/account/bookings/${booking.id}`)
                          }
                        >
                          <Box
                            component="img"
                            src={booking.property.image}
                            alt={booking.property.name}
                            sx={{
                              width: 80,
                              height: 60,
                              borderRadius: 1,
                              objectFit: "cover",
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {booking.property.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <CalendarTodayIcon
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(booking.checkIn)} -{" "}
                                {formatDate(booking.checkOut)}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={booking.status}
                            size="small"
                            color="success"
                            sx={{ textTransform: "capitalize" }}
                          />
                        </Box>
                        {index < upcomingBookings.length - 1 && <Divider />}
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CalendarTodayIcon
                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                      />
                      <Typography color="text.secondary">
                        No upcoming stays
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        component={RouterLink}
                        to="/"
                      >
                        Book Now
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Notifications */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <NotificationsIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Notifications
                      </Typography>
                      {recentNotifications.length > 0 && (
                        <Chip
                          label={recentNotifications.length}
                          size="small"
                          color="error"
                        />
                      )}
                    </Box>
                  </Box>

                  <List sx={{ p: 0 }}>
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification) => (
                        <ListItem
                          key={notification.id}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 1,
                            mb: 1,
                            px: 1.5,
                          }}
                        >
                          <ListItemText
                            primary={notification.title}
                            secondary={notification.message}
                            primaryTypographyProps={{
                              variant: "subtitle2",
                              fontWeight: 600,
                            }}
                            secondaryTypographyProps={{
                              variant: "body2",
                              noWrap: true,
                            }}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="text.secondary">
                          No new notifications
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Paper>
              </Grid>

              {/* Recent Wishlist */}
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Saved Properties
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      component={RouterLink}
                      to="/account/wishlist"
                    >
                      View All
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    {userWishlist.slice(0, 3).map((item) => (
                      <Grid size={{ xs: 12, sm: 4 }} key={item.id}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            },
                          }}
                          onClick={() =>
                            navigate(`/property/${item.property.id}`)
                          }
                        >
                          <Box
                            sx={{
                              height: 120,
                              backgroundImage: `url(${item.property.images[0]})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <CardContent sx={{ p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              noWrap
                            >
                              {item.property.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationOnIcon
                                sx={{ fontSize: 14, color: "text.secondary" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.property.location.city}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <StarIcon
                                  sx={{
                                    fontSize: 14,
                                    color: theme.palette.warning.main,
                                  }}
                                />
                                <Typography variant="body2">
                                  {item.property.rating}
                                </Typography>
                              </Box>
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                fontWeight={600}
                              >
                                Nu {item.property.pricePerNight}/night
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
