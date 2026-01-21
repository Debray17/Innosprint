// src/pages/User/BookingConfirmationPage.jsx
import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PrintIcon from "@mui/icons-material/Print";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import DirectionsIcon from "@mui/icons-material/Directions";

import { propertyDetails } from "../../data/userMockData";

export default function BookingConfirmationPage() {
  const theme = useTheme();
  const { bookingId } = useParams();
  // const navigate = useNavigate();

  // Mock booking data
  const booking = {
    id: bookingId,
    bookingCode: bookingId || "BK-2024-001",
    status: "confirmed",
    property: propertyDetails,
    room: propertyDetails.rooms[0],
    checkIn: "2024-02-15",
    checkOut: "2024-02-18",
    nights: 3,
    guests: { adults: 2, children: 0 },
    guestDetails: {
      firstName: "Alex",
      lastName: "Thompson",
      email: "alex.thompson@email.com",
      phone: "+1 555 123 4567",
    },
    pricing: {
      roomRate: 199,
      subtotal: 597,
      taxes: 59.7,
      total: 656.7,
    },
    paymentMethod: "Credit Card •••• 4242",
    createdAt: new Date().toISOString(),
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Success Message */}
        <Paper sx={{ p: 4, textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: alpha(theme.palette.success.main, 0.1),
              mx: "auto",
              mb: 2,
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 48, color: theme.palette.success.main }}
            />
          </Avatar>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your reservation has been successfully confirmed.
          </Typography>

          <Chip
            label={`Booking #${booking.bookingCode}`}
            variant="outlined"
            sx={{ fontSize: 16, py: 2.5, px: 1 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            A confirmation email has been sent to{" "}
            <strong>{booking.guestDetails.email}</strong>
          </Typography>
        </Paper>

        {/* Booking Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Booking Details
          </Typography>

          <Grid container spacing={3}>
            {/* Property Info */}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={booking.property.images[0]?.url}
                  alt={booking.property.name}
                  sx={{
                    width: 120,
                    height: 90,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {booking.property.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <StarIcon
                      sx={{ fontSize: 16, color: theme.palette.warning.main }}
                    />
                    <Typography variant="body2">
                      {booking.property.rating} ({booking.property.reviewsCount}{" "}
                      reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {booking.property.location.address},{" "}
                      {booking.property.location.city}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<DirectionsIcon />}
                  size="small"
                  sx={{ alignSelf: "center" }}
                >
                  Get Directions
                </Button>
              </Box>
            </Grid>

            {/* Room Info */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Room Type
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {booking.room.name}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Guests
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {booking.guests.adults} Adult
                {booking.guests.adults > 1 ? "s" : ""}
                {booking.guests.children > 0 &&
                  `, ${booking.guests.children} Child${booking.guests.children > 1 ? "ren" : ""}`}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            {/* Check-in / Check-out */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Check-in
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatDate(booking.checkIn)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  From {booking.property.policies?.checkIn || "3:00 PM"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Check-out
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {formatDate(booking.checkOut)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Until {booking.property.policies?.checkOut || "11:00 AM"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>

            {/* Guest Details */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Guest Name
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {booking.guestDetails.firstName} {booking.guestDetails.lastName}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {booking.guestDetails.email}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Summary */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Payment Summary
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Nu {booking.pricing.roomRate} x {booking.nights} nights
            </Typography>
            <Typography variant="body2">
              Nu {booking.pricing.subtotal.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Taxes & fees
            </Typography>
            <Typography variant="body2">
              Nu {booking.pricing.taxes.toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Total Paid
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.paymentMethod}
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary">
              Nu {booking.pricing.total.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* Important Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Important Information
          </Typography>

          <Box component="ul" sx={{ pl: 2, mb: 0 }}>
            <Typography
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Please present your booking confirmation and a valid ID at
              check-in.
            </Typography>
            <Typography
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {booking.property.policies?.cancellation ||
                "Free cancellation up to 24 hours before check-in."}
            </Typography>
            <Typography
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Contact the property directly for any special arrangements or
              early check-in requests.
            </Typography>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print Confirmation
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListAltIcon />}
            component={RouterLink}
            to="/account/bookings"
          >
            View My Bookings
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            component={RouterLink}
            to="/"
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
