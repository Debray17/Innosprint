// src/pages/User/Account/MyBookingsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import BookingCard from "../../../components/User/Dashboard/BookingCard";
import { userBookings } from "../../../data/userMockData";

export default function MyBookingsPage() {
  // const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // Filter bookings based on tab
  const filterBookings = () => {
    let filtered = [...userBookings];

    // Filter by tab
    switch (activeTab) {
      case 1: // Upcoming
        filtered = filtered.filter(
          (b) => b.status === "confirmed" && new Date(b.checkIn) > new Date(),
        );
        break;
      case 2: // Completed
        filtered = filtered.filter((b) => b.status === "completed");
        break;
      case 3: // Cancelled
        filtered = filtered.filter((b) => b.status === "cancelled");
        break;
      default: // All
        break;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.property.name.toLowerCase().includes(query) ||
          b.bookingCode.toLowerCase().includes(query) ||
          b.property.address.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortBy) {
      case "date_asc":
        filtered.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
        break;
      case "date_desc":
        filtered.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
        break;
      case "price_asc":
        filtered.sort((a, b) => a.pricing.total - b.pricing.total);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.pricing.total - a.pricing.total);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredBookings = filterBookings();

  const tabCounts = {
    all: userBookings.length,
    upcoming: userBookings.filter(
      (b) => b.status === "confirmed" && new Date(b.checkIn) > new Date(),
    ).length,
    completed: userBookings.filter((b) => b.status === "completed").length,
    cancelled: userBookings.filter((b) => b.status === "cancelled").length,
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
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                My Bookings
              </Typography>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
              >
                <Tab label={`All (${tabCounts.all})`} />
                <Tab label={`Upcoming (${tabCounts.upcoming})`} />
                <Tab label={`Completed (${tabCounts.completed})`} />
                <Tab label={`Cancelled (${tabCounts.cancelled})`} />
              </Tabs>

              {/* Filters */}
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                  placeholder="Search bookings..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1, minWidth: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date_desc">Date (Newest)</MenuItem>
                    <MenuItem value="date_asc">Date (Oldest)</MenuItem>
                    <MenuItem value="price_desc">Price (Highest)</MenuItem>
                    <MenuItem value="price_asc">Price (Lowest)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Bookings List */}
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No bookings found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Start planning your next trip!"}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
