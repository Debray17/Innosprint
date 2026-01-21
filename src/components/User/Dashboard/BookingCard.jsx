// src/components/User/Dashboard/BookingCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function BookingCard({ booking, variant = "default" }) {
  // const theme = useTheme();
  const navigate = useNavigate();

  const {
    id,
    bookingCode,
    property,
    room,
    checkIn,
    checkOut,
    nights,
    guests,
    pricing,
    status,
    // canCancel,
    // canModify,
    reviewSubmitted,
  } = booking;

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "completed":
        return "default";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isCompact = variant === "compact";

  return (
    <Card
      sx={{
        mb: 2,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
      onClick={() => navigate(`/account/bookings/${id}`)}
    >
      <CardContent sx={{ p: 0 }}>
        <Grid container>
          {/* Property Image */}
          <Grid item xs={12} sm={isCompact ? 3 : 4} md={isCompact ? 2 : 3}>
            <Box
              sx={{
                height: { xs: 160, sm: "100%" },
                minHeight: { sm: 160 },
                backgroundImage: `url(${property.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Chip
                label={status}
                size="small"
                color={getStatusColor(status)}
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  textTransform: "capitalize",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          {/* Booking Details */}
          <Grid
            size={{ xs: 12, sm: isCompact ? 9 : 8, md: isCompact ? 10 : 9 }}
          >
            <Box sx={{ p: 2.5 }}>
              {/* Header */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Booking #{bookingCode}
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                {property.name}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}
              >
                <LocationOnIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {property.address}
                </Typography>
              </Box>

              {/* Room Type */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {room.name} • {room.type}
              </Typography>

              {/* Dates & Guests */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Check-in
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(checkIn)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Check-out
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(checkOut)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <NightsStayIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {nights} Night{nights > 1 ? "s" : ""}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography variant="body2" fontWeight={500}>
                    {guests.adults} Adult{guests.adults > 1 ? "s" : ""}
                    {guests.children > 0 &&
                      `, ${guests.children} Child${guests.children > 1 ? "ren" : ""}`}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Footer */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight={700} color="primary">
                  Nu {pricing.total.toFixed(2)}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  {status === "completed" && !reviewSubmitted && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/account/bookings/${id}?review=true`);
                      }}
                    >
                      Write Review
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/account/bookings/${id}`);
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
