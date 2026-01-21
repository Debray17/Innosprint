// src/components/User/Search/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Popover,
  InputAdornment,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import GuestSelector from "./GuestSelector";

export default function SearchBar({ variant = "default", initialValues = {} }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(
    initialValues.destination || "",
  );
  // Initialize with dayjs objects or null, but handle properly
  const [checkIn, setCheckIn] = useState(
    initialValues.checkIn ? dayjs(initialValues.checkIn) : null,
  );
  const [checkOut, setCheckOut] = useState(
    initialValues.checkOut ? dayjs(initialValues.checkOut) : null,
  );
  const [guests, setGuests] = useState(
    initialValues.guests || { adults: 2, children: 0, rooms: 1 },
  );
  const [guestAnchor, setGuestAnchor] = useState(null);

  const isCompact = variant === "compact";

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (checkIn) params.set("checkIn", checkIn.format("YYYY-MM-DD"));
    if (checkOut) params.set("checkOut", checkOut.format("YYYY-MM-DD"));
    params.set("adults", guests.adults);
    params.set("children", guests.children);
    params.set("rooms", guests.rooms);

    navigate(`/search?${params.toString()}`);
  };

  const getGuestText = () => {
    const parts = [];
    parts.push(`${guests.adults} Adult${guests.adults !== 1 ? "s" : ""}`);
    if (guests.children > 0) {
      parts.push(
        `${guests.children} Child${guests.children !== 1 ? "ren" : ""}`,
      );
    }
    parts.push(`${guests.rooms} Room${guests.rooms !== 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  return (
    <Paper
      elevation={isCompact ? 1 : 4}
      sx={{
        p: isCompact ? 1 : 2,
        borderRadius: isCompact ? 2 : 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: isCompact ? 1 : 2,
        alignItems: "stretch",
      }}
    >
      {/* Destination */}
      <Box sx={{ flex: 2, minWidth: { md: 200 } }}>
        <TextField
          fullWidth
          placeholder="Where are you going?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          size={isCompact ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            },
          }}
        />
      </Box>

      {/* Check-in Date */}
      <Box sx={{ flex: 1, minWidth: { md: 150 } }}>
        <DatePicker
          label="Check-in"
          value={checkIn}
          onChange={(newValue) => setCheckIn(newValue)}
          minDate={dayjs()}
          slotProps={{
            textField: {
              fullWidth: true,
              size: isCompact ? "small" : "medium",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon color="action" />
                  </InputAdornment>
                ),
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              },
            },
          }}
        />
      </Box>

      {/* Check-out Date */}
      <Box sx={{ flex: 1, minWidth: { md: 150 } }}>
        <DatePicker
          label="Check-out"
          value={checkOut}
          onChange={(newValue) => setCheckOut(newValue)}
          minDate={checkIn ? checkIn.add(1, "day") : dayjs().add(1, "day")}
          slotProps={{
            textField: {
              fullWidth: true,
              size: isCompact ? "small" : "medium",
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthIcon color="action" />
                  </InputAdornment>
                ),
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              },
            },
          }}
        />
      </Box>

      {/* Guests */}
      <Box sx={{ flex: 1.5, minWidth: { md: 180 } }}>
        <TextField
          fullWidth
          placeholder="Guests"
          value={getGuestText()}
          onClick={(e) => setGuestAnchor(e.currentTarget)}
          size={isCompact ? "small" : "medium"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            cursor: "pointer",
            "& .MuiOutlinedInput-root": {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            },
          }}
        />
        <Popover
          open={Boolean(guestAnchor)}
          anchorEl={guestAnchor}
          onClose={() => setGuestAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{ sx: { p: 2, mt: 1, minWidth: 280 } }}
        >
          <GuestSelector
            guests={guests}
            onChange={setGuests}
            onClose={() => setGuestAnchor(null)}
          />
        </Popover>
      </Box>

      {/* Search Button */}
      <Button
        variant="contained"
        size={isCompact ? "medium" : "large"}
        onClick={handleSearch}
        sx={{
          minWidth: { xs: "100%", md: isCompact ? 100 : 140 },
          py: isCompact ? 1 : 1.8,
          fontSize: isCompact ? 14 : 16,
        }}
        startIcon={<SearchIcon />}
      >
        Search
      </Button>
    </Paper>
  );
}
