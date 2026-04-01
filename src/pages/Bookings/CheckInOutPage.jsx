import React, { useMemo, useState } from "react";
import { Box, Typography, Paper, Card, CardContent, Avatar, Button, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tabs, Tab, Alert, FormControlLabel, Checkbox } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HotelIcon from "@mui/icons-material/Hotel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import {
  useBookingActionMutation,
  useBookingHistory,
} from "../../hooks/useBooking";

const CheckInOutPage = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkOutNotes, setCheckOutNotes] = useState("");
  const [roomInspected, setRoomInspected] = useState(false);
  const [minibarChecked, setMinibarChecked] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState("");
  const { data: bookingRecords = [] } = useBookingHistory();
  const bookingActionMutation = useBookingActionMutation();

  // Get today's date string
  const today = new Date().toISOString().split("T")[0];

  const mapPaymentStatus = (paymentStatus) => {
    const normalizedValue = String(paymentStatus || "").toLowerCase();
    if (normalizedValue.includes("full") || normalizedValue === "paid") return "paid";
    if (normalizedValue.includes("part")) return "partial";
    if (normalizedValue.includes("refund")) return "refunded";
    return "pending";
  };

  const mapBookingStatus = (booking) => {
    const apiStatus = String(booking?.api?.statusLabel || "").toLowerCase();
    const normalizedStatus = String(booking?.status || "").toLowerCase();

    if (
      apiStatus.includes("checked out") ||
      apiStatus.includes("checked-out") ||
      apiStatus.includes("checkout") ||
      normalizedStatus === "completed"
    ) {
      return "checked-out";
    }
    if (
      apiStatus.includes("checked in") ||
      apiStatus.includes("checked-in") ||
      apiStatus.includes("checkin") ||
      normalizedStatus === "checked-in"
    ) {
      return "checked-in";
    }
    if (apiStatus.includes("cancel") || normalizedStatus === "cancelled") {
      return "cancelled";
    }
    return "confirmed";
  };

  const toDateOnly = (value) => {
    if (!value) return "";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString().split("T")[0];
  };

  const bookingsData = useMemo(
    () =>
      bookingRecords.map((booking) => ({
        id: booking.id,
        api: booking.api,
        bookingCode: booking.bookingCode || "-",
        guestName:
          booking.api?.userName ||
          `${booking.guestDetails?.firstName || ""} ${booking.guestDetails?.lastName || ""}`.trim() ||
          "Guest",
        propertyName: booking.property?.name || booking.api?.propertyName || "Unknown Property",
        roomNumber: booking.room?.roomNo || booking.room?.name || "-",
        roomType: booking.room?.type || "-",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        grandTotal: booking.pricing?.total || 0,
        paymentStatus: mapPaymentStatus(
          booking.paymentStatus || booking.api?.paymentStatusLabel
        ),
        bookingStatus: mapBookingStatus(booking),
        approvalStatus: booking.approvalStatus || "pending",
        adults: booking.guests?.adults || 0,
        children: booking.guests?.children || 0,
        nights: booking.nights || 0,
      })),
    [bookingRecords]
  );

  // Filter for today's check-ins (approved + confirmed bookings with today's check-in date)
  const todayCheckIns = bookingsData.filter(
    (b) =>
      b.approvalStatus === "approved" &&
      b.bookingStatus === "confirmed" &&
      toDateOnly(b.checkIn) === today
  );

  // Filter for today's check-outs (approved + checked-in bookings with today's check-out date)
  const todayCheckOuts = bookingsData.filter(
    (b) =>
      b.approvalStatus === "approved" &&
      b.bookingStatus === "checked-in" &&
      toDateOnly(b.checkOut) === today
  );

  const allPendingCheckIns = bookingsData.filter(
    (b) => b.approvalStatus === "approved" && b.bookingStatus === "confirmed"
  );
  const allPendingCheckOuts = bookingsData.filter(
    (b) => b.approvalStatus === "approved" && b.bookingStatus === "checked-in"
  );

  // Get displayed bookings based on tab
  const getDisplayedBookings = () => {
    if (selectedTab === 0) {
      return allPendingCheckIns;
    }
    return allPendingCheckOuts;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  // Format currency
  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);

  // Handle check-in click
  const handleCheckInClick = (booking) => {
    setSelectedBooking(booking);
    setOpenCheckInModal(true);
  };

  // Handle check-out click
  const handleCheckOutClick = (booking) => {
    setSelectedBooking(booking);
    setOpenCheckOutModal(true);
    resetCheckOutForm();
  };

  // Reset check-out form
  const resetCheckOutForm = () => {
    setCheckOutNotes("");
    setRoomInspected(false);
    setMinibarChecked(false);
    setAdditionalCharges("");
  };

  // Confirm check-in
  const runBookingAction = async (action, booking, remark = "") => {
    await bookingActionMutation.mutateAsync({
      action,
      payload: {
        id: booking.id,
        isActive: true,
        transactedBy: "admin",
        remark: remark || undefined,
      },
      options: { language: "en" },
      context: {
        id: booking.id,
        roomId: booking.api?.roomId || "",
        property: {
          name: booking.propertyName,
        },
        room: {
          id: booking.api?.roomId || "",
          name: booking.roomNumber,
          roomNo: booking.roomNumber,
          type: booking.roomType,
        },
        guests: {
          adults: booking.adults,
          children: booking.children,
        },
        pricing: {
          total: booking.grandTotal,
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        paymentStatus: booking.paymentStatus,
        status: action === "checkin" ? "checked-in" : "completed",
        approvalStatus: "approved",
      },
    });
  };

  const handleConfirmCheckIn = async () => {
    await runBookingAction("checkin", selectedBooking);
    setOpenCheckInModal(false);
    setSelectedBooking(null);
  };

  // Confirm check-out
  const handleConfirmCheckOut = async () => {
    const checkoutRemark = [
      checkOutNotes,
      additionalCharges ? `Additional charges: Nu ${additionalCharges}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    await runBookingAction("checkout", selectedBooking, checkoutRemark);
    setOpenCheckOutModal(false);
    setSelectedBooking(null);
    resetCheckOutForm();
  };

  // Booking Card Component
  const BookingCard = ({ booking, type }) => {
    const isCheckIn = type === "checkin";
    const isToday = isCheckIn ?
    toDateOnly(booking.checkIn) === today :
    toDateOnly(booking.checkOut) === today;

    return (
      <Card
        sx={{
          height: "100%",
          transition: "transform 0.2s, box-shadow 0.2s",
          border: isToday ? `2px solid ${theme.palette.primary.main}` : "none",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
          }
        }}>

                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}>

                                {booking.guestName.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {booking.guestName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {booking.bookingCode}
                                </Typography>
                            </Box>
                        </Box>
                        {isToday &&
            <Chip label="Today" color="primary" size="small" />
            }
                    </Box>

                    {/* Property & Room */}
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <HotelIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2">{booking.propertyName}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <MeetingRoomIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2">
                                Room {booking.roomNumber} • {booking.roomType}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Dates */}
                    <Paper
            sx={{
              p: 1.5,
              backgroundColor: alpha(
                isCheckIn ? theme.palette.success.main : theme.palette.warning.main,
                0.08
              ),
              mb: 2
            }}>

                        <Grid container spacing={1}>
                            <Grid size={12}>
                                <Typography variant="caption" color="text.secondary">
                                    Check-in
                                </Typography>
                                <Typography variant="body2" fontWeight={isCheckIn ? 600 : 400}>
                                    {formatDate(booking.checkIn)}
                                </Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="caption" color="text.secondary">
                                    Check-out
                                </Typography>
                                <Typography variant="body2" fontWeight={!isCheckIn ? 600 : 400}>
                                    {formatDate(booking.checkOut)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Guest Info */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            {booking.adults} Adults, {booking.children} Children • {booking.nights} Nights
                        </Typography>
                    </Box>

                    {/* Payment Status */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PaymentIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2" fontWeight={500}>
                                {formatCurrency(booking.grandTotal)}
                            </Typography>
                        </Box>
                        <Chip
              label={booking.paymentStatus}
              size="small"
              color={
              booking.paymentStatus === "paid" ?
              "success" :
              booking.paymentStatus === "pending" ?
              "warning" :
              "info"
              } />

                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Action Button */}
                    <Button
            fullWidth
            variant="contained"
            color={isCheckIn ? "success" : "warning"}
            startIcon={isCheckIn ? <LoginIcon /> : <LogoutIcon />}
            onClick={() =>
            isCheckIn ?
            handleCheckInClick(booking) :
            handleCheckOutClick(booking)
            }>

                        {isCheckIn ? "Check In" : "Check Out"}
                    </Button>
                </CardContent>
            </Card>);

  };

  return (
    <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                    Check-in / Check-out
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage guest arrivals and departures
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
            }}>

                        <LoginIcon sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                        <Typography variant="h3" fontWeight={700} color="success.main">
                            {todayCheckIns.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Today's Check-ins
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}>

                        <LogoutIcon sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                        <Typography variant="h3" fontWeight={700} color="warning.main">
                            {todayCheckOuts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Today's Check-outs
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>

                        <CalendarTodayIcon sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                        <Typography variant="h3" fontWeight={700} color="info.main">
                            {allPendingCheckIns.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pending Arrivals
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>

                        <AccessTimeIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                        <Typography variant="h3" fontWeight={700} color="primary.main">
                            {allPendingCheckOuts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Currently Staying
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ px: 2 }}>

                    <Tab
            icon={<LoginIcon />}
            iconPosition="start"
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Arrivals
                                <Chip label={allPendingCheckIns.length} size="small" color="success" />
                            </Box>
            } />

                    <Tab
            icon={<LogoutIcon />}
            iconPosition="start"
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Departures
                                <Chip label={allPendingCheckOuts.length} size="small" color="warning" />
                            </Box>
            } />

                </Tabs>
            </Paper>

            {/* Booking Cards Grid */}
            {getDisplayedBookings().length > 0 ?
      <Grid container spacing={3}>
                    {getDisplayedBookings().map((booking) =>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={booking.id}>
                            <BookingCard
            booking={booking}
            type={selectedTab === 0 ? "checkin" : "checkout"} />

                        </Grid>
        )}
                </Grid> :

      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: alpha(theme.palette.info.main, 0.05)
        }}>

                    {selectedTab === 0 ?
        <>
                            <LoginIcon sx={{ fontSize: 64, color: theme.palette.info.main, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No Pending Arrivals
                            </Typography>
                            <Typography color="text.secondary">
                                There are no guests waiting to check in.
                            </Typography>
                        </> :

        <>
                            <LogoutIcon sx={{ fontSize: 64, color: theme.palette.info.main, mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                No Pending Departures
                            </Typography>
                            <Typography color="text.secondary">
                                There are no guests to check out.
                            </Typography>
                        </>
        }
                </Paper>
      }

            {/* Check-In Modal */}
            <Dialog
        open={openCheckInModal}
        onClose={() => {
          setOpenCheckInModal(false);
          setSelectedBooking(null);
        }}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main
                }}>

                                <LoginIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={600}>
                                Guest Check-In
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setOpenCheckInModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBooking &&
          <Box>
                            {/* Booking Info */}
                            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.05)
              }}>

                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: theme.palette.primary.main
                      }}>

                                                {selectedBooking.guestName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {selectedBooking.guestName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedBooking.bookingCode} • Room {selectedBooking.roomNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Check-in
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {formatDate(selectedBooking.checkIn)}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Check-out
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {formatDate(selectedBooking.checkOut)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Alert severity="info">
                              Confirm check-in for this booking.
                            </Alert>

                        </Box>
          }
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenCheckInModal(false)}>
                        Cancel
                    </Button>
                    <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleConfirmCheckIn}>

                        Complete Check-In
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Check-Out Modal */}
            <Dialog
        open={openCheckOutModal}
        onClose={() => {
          setOpenCheckOutModal(false);
          setSelectedBooking(null);
        }}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main
                }}>

                                <LogoutIcon />
                            </Avatar>
                            <Typography variant="h6" fontWeight={600}>
                                Guest Check-Out
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setOpenCheckOutModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBooking &&
          <Box>
                            {/* Booking Info */}
                            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: alpha(theme.palette.warning.main, 0.05)
              }}>

                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: theme.palette.warning.main
                      }}>

                                                {selectedBooking.guestName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {selectedBooking.guestName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedBooking.bookingCode} • Room {selectedBooking.roomNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Stayed
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {selectedBooking.nights} nights
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Paid
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {formatCurrency(selectedBooking.grandTotal)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Check-Out Checklist */}
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                Check-Out Checklist
                            </Typography>
                            <Box sx={{ mb: 3 }}>
                                <FormControlLabel
                control={
                <Checkbox
                  checked={roomInspected}
                  onChange={(e) => setRoomInspected(e.target.checked)}
                  color="warning" />

                }
                label="Room inspected" />

                                <FormControlLabel
                control={
                <Checkbox
                  checked={minibarChecked}
                  onChange={(e) => setMinibarChecked(e.target.checked)}
                  color="warning" />

                }
                label="Minibar checked" />

                            </Box>

                            {/* Additional Charges */}
                            <TextField
              fullWidth
              type="number"
              label="Additional Charges"
              placeholder="0.00"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(e.target.value)}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>Nu</Typography>
              }}
              helperText="Minibar, damages, extra services, etc."
              sx={{ mb: 2 }} />


                            {/* Notes */}
                            <TextField
              fullWidth
              multiline
              rows={3}
              label="Check-Out Notes"
              placeholder="Add any notes about the check-out..."
              value={checkOutNotes}
              onChange={(e) => setCheckOutNotes(e.target.value)} />

                        </Box>
          }
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenCheckOutModal(false)}>
                        Cancel
                    </Button>
                    <Button
            variant="contained"
            color="warning"
            startIcon={<AssignmentTurnedInIcon />}
            onClick={handleConfirmCheckOut}
            disabled={!roomInspected}>

                        Complete Check-Out
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>);

};

export default CheckInOutPage;
