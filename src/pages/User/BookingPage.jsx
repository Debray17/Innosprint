// src/pages/User/BookingPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography, TextField, Button, Stepper, Step, StepLabel, Divider, FormControlLabel, Checkbox, Alert, Avatar, Collapse } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";

import PriceBreakdown from "../../components/User/Booking/PriceBreakdown";
import { propertyDetails, currentUser } from "../../data/userMockData";
import { useCreateBookingMutation } from "../../hooks/useBooking";
import { buildBookingPayload } from "../../services/bookingService";
import { getPropertyById } from "../../services/propertyService";
import { getRoomList } from "../../services/roomService";

const steps = ["Guest Details", "Booking Details", "Confirmation"];

export default function BookingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { propertyId, roomId } = useParams();
  const [searchParams] = useSearchParams();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const createBookingMutation = useCreateBookingMutation();

  // Get booking details from URL
  const checkIn =
  searchParams.get("checkIn") || dayjs().add(7, "day").format("YYYY-MM-DD");
  const checkOut =
  searchParams.get("checkOut") || dayjs().add(10, "day").format("YYYY-MM-DD");
  const guestsParam = searchParams.get("guests");
  const guests = guestsParam ?
  JSON.parse(guestsParam) :
  { adults: 2, children: 0, rooms: 1 };

  // Calculate nights
  const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");

  const fallbackImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    [],
  );

  const [propertyVm, setPropertyVm] = useState(propertyDetails);
  const [roomVm, setRoomVm] = useState(
    propertyDetails.rooms?.[0] || propertyDetails.rooms?.[0] || {}
  );

  useEffect(() => {
    let isMounted = true;

    const fetchBookingContext = async () => {
      try {
        const [propertyResponse, roomsResponse] = await Promise.all([
          propertyId ? getPropertyById(propertyId, { language: "en" }) : null,
          getRoomList({ language: "en" }),
        ]);

        const roomsList = Array.isArray(roomsResponse)
          ? roomsResponse
          : roomsResponse
            ? [roomsResponse]
            : [];

        const propertyData = propertyResponse || null;
        if (propertyData && isMounted) {
          const propertyImage = fallbackImages[0];
          setPropertyVm({
            ...propertyDetails,
            name: propertyData?.name || propertyDetails.name,
            type: propertyData?.propertyTypeName || propertyDetails.type,
            rating: Number(propertyData?.rating) || 0,
            reviewsCount: Number(propertyData?.reviewCount) || 0,
            location: {
              address:
                propertyData?.address ||
                propertyDetails.location?.address ||
                "",
              city: propertyData?.city || "",
              state:
                propertyData?.state ||
                propertyDetails.location?.state ||
                "",
              country:
                propertyData?.country ||
                propertyDetails.location?.country ||
                "",
            },
            images: [{ url: propertyImage }],
          });
        }

        const selectedRoom =
          roomsList.find((room) => room?.id === roomId) ||
          roomsList.find((room) => room?.primaryKeyValue === roomId) ||
          roomsList.find((room) => room?.propertyId === propertyId) ||
          null;

        if (selectedRoom && isMounted) {
          setRoomVm({
            id: selectedRoom?.id || selectedRoom?.primaryKeyValue,
            name: selectedRoom?.roomNo || selectedRoom?.name || "Room",
            roomNo: selectedRoom?.roomNo || "",
            type: selectedRoom?.roomTypeName || selectedRoom?.typeName || "",
            pricePerNight: Number(selectedRoom?.basePrise) || 0,
            breakfastIncluded: false,
            breakfastPrice: 0,
            freeCancellation: false,
          });
        }
      } catch (error) {
        // keep fallback mock data
      }
    };

    fetchBookingContext();

    return () => {
      isMounted = false;
    };
  }, [fallbackImages, propertyId, roomId]);

  const property = propertyVm;
  const room = roomVm;

  const fallbackUserId = "84826bd3-2e1a-445f-891e-1bb8c9951cf4";
  const resolvedUserId =
    typeof currentUser?.id === "string" ? currentUser.id : fallbackUserId;

  // Form states
  const [guestDetails, setGuestDetails] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    country: "USA",
    specialRequests: "",
    arrivalTime: "",
    bookingForSomeoneElse: false,
    guestFirstName: "",
    guestLastName: ""
  });

  const [bookingDetails, setBookingDetails] = useState({
    journalNo: ""
  });

  const [addBreakfast, setAddBreakfast] = useState(false);

  const handleGuestChange = (field) => (e) => {
    setGuestDetails((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBookingDetailChange = (field) => (e) => {
    setBookingDetails((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateGuestDetails = () => {
    const newErrors = {};
    if (!guestDetails.firstName.trim())
    newErrors.firstName = "First name is required";
    if (!guestDetails.lastName.trim())
    newErrors.lastName = "Last name is required";
    if (!guestDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!guestDetails.phone.trim()) newErrors.phone = "Phone is required";

    if (guestDetails.bookingForSomeoneElse) {
      if (!guestDetails.guestFirstName.trim())
      newErrors.guestFirstName = "Guest first name is required";
      if (!guestDetails.guestLastName.trim())
      newErrors.guestLastName = "Guest last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBookingDetails = () => {
    const newErrors = {};
    if (!bookingDetails.journalNo.trim()) {
      newErrors.journalNo = "Journal number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!validateGuestDetails()) return;
    } else if (activeStep === 1) {
      if (!validateBookingDetails()) return;

      // Create booking
      setLoading(true);
      try {
        const bookingPayload = buildBookingPayload({
          userId: resolvedUserId,
          roomId: roomId || room?.id,
          checkIn: dayjs(checkIn).toISOString(),
          checkOut: dayjs(checkOut).toISOString(),
          totalAmount: total,
          amountPaid: 0,
          journalNo: bookingDetails.journalNo.trim(),
          propertyName: property?.name || "",
          roomNo: room?.roomNo || room?.name || "",
          userName: `${guestDetails.firstName} ${guestDetails.lastName}`.trim(),
          transactedBy: guestDetails.email || "self",
        });

        const { response, bookingRecord } =
          await createBookingMutation.mutateAsync({
            payload: bookingPayload,
            options: { language: "en" },
            context: {
              userId: resolvedUserId,
              property,
              room,
              guestDetails,
              guests,
              pricing: {
                roomRate,
                subtotal,
                taxes,
                total,
              },
              checkIn,
              checkOut,
              nights,
            },
          });
        const bookingId =
          bookingRecord?.id ||
          response?.id ||
          response?.primaryKeyValue ||
          response?.bookingCode ||
          `BK-${Date.now()}`;

        navigate(`/booking/confirmation/${bookingId}`, {
          state: {
            bookingResponse: response,
            booking: bookingRecord,
            guestDetails,
            guests,
            pricing: {
              roomRate,
              subtotal,
              taxes,
              total,
            },
            property,
            room,
            checkIn,
            checkOut,
            nights,
          },
        });
      } catch (error) {
        setErrors({ journalNo: "Booking failed. Please try again." });
      } finally {
        setLoading(false);
      }
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const formatDate = (date) => {
    return dayjs(date).format("ddd, MMM D, YYYY");
  };

  // Calculate pricing
  const roomRate = room.pricePerNight;
  const subtotal = roomRate * nights * guests.rooms;
  const breakfastTotal =
  addBreakfast && !room.breakfastIncluded ?
  room.breakfastPrice * nights * guests.rooms :
  0;
  const taxes = (subtotal + breakfastTotal) * 0.1;
  const total = subtotal + breakfastTotal + taxes;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) =>
            <Step key={label}>
                <StepLabel
                StepIconComponent={() =>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor:
                    activeStep > index ?
                    theme.palette.success.main :
                    activeStep === index ?
                    theme.palette.primary.main :
                    "grey.300",
                    fontSize: 14
                  }}>

                      {activeStep > index ?
                  <CheckCircleIcon fontSize="small" /> :

                  index + 1
                  }
                    </Avatar>
                }>

                  {label}
                </StepLabel>
              </Step>
            )}
          </Stepper>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Guest Details Step */}
            {activeStep === 0 &&
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3
                }}>

                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Guest Details
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    label="First Name"
                    value={guestDetails.firstName}
                    onChange={handleGuestChange("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required />

                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    label="Last Name"
                    value={guestDetails.lastName}
                    onChange={handleGuestChange("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required />

                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={guestDetails.email}
                    onChange={handleGuestChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    required />

                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    label="Phone Number"
                    value={guestDetails.phone}
                    onChange={handleGuestChange("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required />

                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    select
                    label="Country/Region"
                    value={guestDetails.country}
                    onChange={handleGuestChange("country")}
                    SelectProps={{ native: true }}>

                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    select
                    label="Estimated Arrival Time"
                    value={guestDetails.arrivalTime}
                    onChange={handleGuestChange("arrivalTime")}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: true }}>

                      <option value="">Select time</option>
                      <option value="14:00">2:00 PM - 3:00 PM</option>
                      <option value="15:00">3:00 PM - 4:00 PM</option>
                      <option value="16:00">4:00 PM - 5:00 PM</option>
                      <option value="17:00">5:00 PM - 6:00 PM</option>
                      <option value="18:00">6:00 PM - 7:00 PM</option>
                      <option value="19:00">7:00 PM - 8:00 PM</option>
                      <option value="20:00">After 8:00 PM</option>
                    </TextField>
                  </Grid>
                  <Grid size={12}>
                    <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Special Requests (Optional)"
                    placeholder="Any special requests for the property?"
                    value={guestDetails.specialRequests}
                    onChange={handleGuestChange("specialRequests")} />

                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Booking for someone else */}
                <FormControlLabel
                control={
                <Checkbox
                  checked={guestDetails.bookingForSomeoneElse}
                  onChange={(e) =>
                  setGuestDetails((prev) => ({
                    ...prev,
                    bookingForSomeoneElse: e.target.checked
                  }))
                  } />

                }
                label="I'm booking for someone else" />


                <Collapse in={guestDetails.bookingForSomeoneElse}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                      fullWidth
                      label="Guest First Name"
                      value={guestDetails.guestFirstName}
                      onChange={handleGuestChange("guestFirstName")}
                      error={!!errors.guestFirstName}
                      helperText={errors.guestFirstName} />

                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                      fullWidth
                      label="Guest Last Name"
                      value={guestDetails.guestLastName}
                      onChange={handleGuestChange("guestLastName")}
                      error={!!errors.guestLastName}
                      helperText={errors.guestLastName} />

                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>
            }

            {/* Booking Details Step */}
            {activeStep === 1 &&
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3
                }}>

                  <Typography variant="h6" fontWeight={600}>
                    Booking Details
                  </Typography>
                </Box>

                {errors.journalNo &&
              <Alert severity="error" sx={{ mb: 3 }}>
                    {errors.journalNo}
                  </Alert>
              }

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                    fullWidth
                    label="Journal Number"
                    placeholder="Enter your payment journal number"
                    value={bookingDetails.journalNo}
                    onChange={handleBookingDetailChange("journalNo")}
                    error={!!errors.journalNo}
                    helperText={errors.journalNo} />

                  </Grid>
                </Grid>

                <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 1
                }}>

                  <Typography variant="body2" color="text.secondary">
                    Your booking will be confirmed after the owner verifies the
                    journal number.
                  </Typography>
                </Box>
              </Paper>
            }

            {/* Add-ons */}
            {activeStep === 0 &&
            !room.breakfastIncluded &&
            room.breakfastPrice > 0 &&
            <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Add-ons
                  </Typography>

                  <FormControlLabel
                control={
                <Checkbox
                  checked={addBreakfast}
                  onChange={(e) => setAddBreakfast(e.target.checked)} />

                }
                label={
                <Box>
                        <Typography variant="body1">Add Breakfast</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nu {room.breakfastPrice}/person/night - Continental
                          breakfast buffet
                        </Typography>
                      </Box>
                } />

                </Paper>
            }

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between"
              }}>

              <Button
                variant="outlined"
                onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
                disabled={loading}>

                {activeStep === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                size="large"
                sx={{ minWidth: 200 }}>

                {loading ?
                "Processing..." :
                activeStep === 1 ?
                "Confirm Booking" :
                "Continue"}
              </Button>
            </Box>
          </Grid>

          {/* Right Column - Booking Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, position: "sticky", top: 100 }}>
              {/* Property Summary */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Box
                  component="img"
                  src={property.images?.[0]?.url || property.images?.[0]}
                  alt={property.name}
                  sx={{
                    width: 100,
                    height: 80,
                    borderRadius: 1,
                    objectFit: "cover"
                  }} />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {property.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <StarIcon
                      sx={{ fontSize: 14, color: theme.palette.warning.main }} />

                    <Typography variant="body2">
                      {property.rating} ({property.reviewsCount})
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {property.location.city}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Room Details */}
              <Typography variant="subtitle2" color="text.secondary">
                Room
              </Typography>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                {room.name}
              </Typography>

              {/* Booking Details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  my: 2
                }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Check-in
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(checkIn)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Check-out
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {formatDate(checkOut)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NightsStayIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {nights} Night{nights > 1 ? "s" : ""} • {guests.rooms} Room
                    {guests.rooms > 1 ? "s" : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {guests.adults} Adult{guests.adults > 1 ? "s" : ""}
                    {guests.children > 0 &&
                    `, ${guests.children} Child${guests.children > 1 ? "ren" : ""}`}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Button
                fullWidth
                variant="text"
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                endIcon={
                showPriceDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                sx={{ justifyContent: "space-between", mb: 1 }}>

                Price Details
              </Button>

              <Collapse in={showPriceDetails}>
                <PriceBreakdown
                  roomRate={roomRate}
                  nights={nights}
                  rooms={guests.rooms}
                  taxes={taxes}
                  breakfastIncluded={room.breakfastIncluded}
                  breakfastPrice={room.breakfastPrice}
                  addBreakfast={addBreakfast} />

              </Collapse>

              {!showPriceDetails &&
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2
                }}>

                  <Typography variant="h6" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    Nu {total.toFixed(2)}
                  </Typography>
                </Box>
              }

              {/* Free Cancellation Notice */}
              {room.freeCancellation &&
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: 1
                }}>

                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    Free cancellation before check-in
                  </Typography>
                </Box>
              }
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>);

}
