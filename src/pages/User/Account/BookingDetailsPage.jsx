// src/pages/User/Account/BookingDetailsPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import StarIcon from "@mui/icons-material/Star";
import PrintIcon from "@mui/icons-material/Print";
import HelpIcon from "@mui/icons-material/Help";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsIcon from "@mui/icons-material/Directions";
import RateReviewIcon from "@mui/icons-material/RateReview";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import CancelBookingModal from "../../../components/User/Modals/CancelBookingModal";
import WriteReviewModal from "../../../components/User/Modals/WriteReviewModal";
import { userBookings } from "../../../data/userMockData";

export default function BookingDetailsPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(
    searchParams.get("review") === "true",
  );

  // Find booking
  const booking = userBookings.find((b) => b.id === parseInt(id));

  if (!booking) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Booking Not Found
            </Typography>
            <Button onClick={() => navigate("/account/bookings")}>
              Back to Bookings
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "completed":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBookingSteps = () => {
    const steps = [
      { label: "Booking Confirmed", completed: true },
      {
        label: "Payment Received",
        completed: booking.paymentStatus === "paid",
      },
      { label: "Check-in", completed: booking.status === "completed" },
      { label: "Check-out", completed: booking.status === "completed" },
    ];

    if (booking.status === "cancelled") {
      return [
        { label: "Booking Confirmed", completed: true },
        { label: "Cancelled", completed: true, error: true },
      ];
    }

    return steps;
  };

  const handleCancelBooking = async (data) => {
    console.log("Cancelling booking:", data);
    setCancelModalOpen(false);
    // Refresh or navigate
  };

  const handleSubmitReview = async (data) => {
    console.log("Submitting review:", data);
    setReviewModalOpen(false);
  };

  const activeStep =
    booking.status === "completed" ? 4 : booking.status === "cancelled" ? 2 : 2;

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
            {/* Back Button & Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/account/bookings")}
              >
                Back to Bookings
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" startIcon={<PrintIcon />}>
                  Print
                </Button>
                <Button variant="outlined" startIcon={<HelpIcon />}>
                  Get Help
                </Button>
              </Box>
            </Box>

            {/* Status Alert */}
            {booking.status === "confirmed" && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Your booking is confirmed! We look forward to welcoming you.
              </Alert>
            )}

            {booking.status === "cancelled" && (
              <Alert severity="error" sx={{ mb: 3 }}>
                This booking has been cancelled.
                {booking.refundAmount &&
                  ` Refund of Nu ${booking.refundAmount} has been processed.`}
              </Alert>
            )}

            {/* Main Booking Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Booking Reference
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {booking.bookingCode}
                  </Typography>
                </Box>
                <Chip
                  label={booking.status}
                  color={getStatusColor(booking.status)}
                  sx={{ textTransform: "capitalize", fontWeight: 600 }}
                />
              </Box>

              {/* Progress Stepper */}
              <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 4 }}>
                {getBookingSteps().map((step, index) => (
                  <Step key={step.label} completed={step.completed}>
                    <StepLabel error={step.error}>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 3 }} />

              {/* Property Info */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    component="img"
                    src={booking.property.image}
                    alt={booking.property.name}
                    sx={{
                      width: "100%",
                      height: 180,
                      borderRadius: 2,
                      objectFit: "cover",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {booking.property.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 1,
                        }}
                      >
                        <StarIcon
                          sx={{
                            fontSize: 16,
                            color: theme.palette.warning.main,
                          }}
                        />
                        <Typography variant="body2">
                          {booking.property.rating} • {booking.property.type}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {booking.property.address}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<DirectionsIcon />}
                      size="small"
                    >
                      Directions
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Room & Stay Details */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Room Type
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.room.name}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Guests
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {booking.guests.adults} Adult
                        {booking.guests.adults > 1 ? "s" : ""}
                        {booking.guests.children > 0 &&
                          `, ${booking.guests.children} Child${booking.guests.children > 1 ? "ren" : ""}`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              {/* Stay Details */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Stay Details
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Check-in
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(booking.checkIn)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        From 3:00 PM
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Check-out
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(booking.checkOut)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Until 11:00 AM
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <NightsStayIcon color="action" />
                    <Typography variant="body2">
                      {booking.nights} Night{booking.nights > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Payment Summary */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Payment Summary
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nu {booking.pricing.roomRate} x {booking.nights} nights
                    </Typography>
                    <Typography variant="body2">
                      Nu {booking.pricing.subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Taxes & fees
                    </Typography>
                    <Typography variant="body2">
                      Nu {booking.pricing.taxes.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      Nu {booking.pricing.total.toFixed(2)}
                    </Typography>
                  </Box>

                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${booking.paymentStatus} via Credit Card`}
                    color="success"
                    variant="outlined"
                    sx={{ mt: 2, textTransform: "capitalize" }}
                  />
                </Paper>
              </Grid>
            </Grid>

            {/* Actions */}
            {booking.status === "confirmed" && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Manage Booking
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {booking.canModify && (
                    <Button variant="outlined" startIcon={<EditIcon />}>
                      Modify Booking
                    </Button>
                  )}
                  {booking.canCancel && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setCancelModalOpen(true)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Box>
              </Paper>
            )}

            {/* Write Review (for completed bookings) */}
            {booking.status === "completed" && !booking.reviewSubmitted && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      How was your stay?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share your experience to help other travelers
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<RateReviewIcon />}
                    onClick={() => setReviewModalOpen(true)}
                  >
                    Write Review
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Modals */}
      <CancelBookingModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        booking={booking}
      />

      <WriteReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        booking={booking}
      />
    </Box>
  );
}
