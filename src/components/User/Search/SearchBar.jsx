// src/components/User/Search/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function SearchBar({ variant = "default", initialValues = {} }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const [city, setCity] = useState(
    initialValues.city || initialValues.destination || "",
  );
  const [country, setCountry] = useState(initialValues.country || "");
  // Initialize with dayjs objects or null, but handle properly
  const [checkIn, setCheckIn] = useState(
    initialValues.checkIn ? dayjs(initialValues.checkIn) : null,
  );
  const [checkOut, setCheckOut] = useState(
    initialValues.checkOut ? dayjs(initialValues.checkOut) : null,
  );
  const [roomCapacity, setRoomCapacity] = useState(
    String(initialValues.roomCapacity || ""),
  );
  const [errors, setErrors] = useState({ city: "", country: "" });

  const isCompact = variant === "compact";

  const handleSearch = () => {
    const trimmedCity = city.trim();
    const trimmedCountry = country.trim();
    const hasLocation = Boolean(trimmedCity || trimmedCountry);
    const nextErrors = hasLocation
      ? { city: "", country: "" }
      : {
          city: "Enter a city or country",
          country: "Enter a city or country",
        };

    setErrors(nextErrors);
    if (nextErrors.city || nextErrors.country) return;

    const params = new URLSearchParams();
    if (trimmedCity) params.set("city", trimmedCity);
    if (trimmedCountry) params.set("country", trimmedCountry);
    if (checkIn) params.set("checkIn", checkIn.format("YYYY-MM-DD"));
    if (checkOut) params.set("checkOut", checkOut.format("YYYY-MM-DD"));
    if (roomCapacity.trim()) params.set("roomCapacity", roomCapacity.trim());

    navigate(`/search?${params.toString()}`);
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
          label="City"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
          }}
          error={!!errors.city}
          helperText={errors.city}
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

      {/* Country */}
      <Box sx={{ flex: 2, minWidth: { md: 200 } }}>
        <TextField
          fullWidth
          label="Country"
          placeholder="Enter country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
          }}
          error={!!errors.country}
          helperText={errors.country}
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

      {/* Room capacity */}
      <Box sx={{ flex: 1.5, minWidth: { md: 180 } }}>
        <TextField
          fullWidth
          label="Room Capacity"
          placeholder="Enter capacity"
          type="number"
          value={roomCapacity}
          onChange={(e) => setRoomCapacity(e.target.value)}
          size={isCompact ? "small" : "medium"}
          inputProps={{ min: 1 }}
          InputProps={{
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
