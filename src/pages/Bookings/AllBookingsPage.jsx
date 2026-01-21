import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    Tabs,
    Tab,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HotelIcon from "@mui/icons-material/Hotel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NoteIcon from "@mui/icons-material/Note";
import PrintIcon from "@mui/icons-material/Print";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { bookings, properties, rooms, guests } from "../../data/mockData";

const AllBookingsPage = () => {
    const theme = useTheme();
    const [bookingsData, setBookingsData] = useState(bookings);
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterProperty, setFilterProperty] = useState("");
    const [filterPayment, setFilterPayment] = useState("");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Get approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Filter bookings
    const getFilteredBookings = () => {
        let filtered = bookingsData;

        // Tab filter
        switch (selectedTab) {
            case 1:
                filtered = filtered.filter((b) => b.bookingStatus === "confirmed");
                break;
            case 2:
                filtered = filtered.filter((b) => b.bookingStatus === "checked-in");
                break;
            case 3:
                filtered = filtered.filter((b) => b.bookingStatus === "checked-out");
                break;
            case 4:
                filtered = filtered.filter((b) => b.bookingStatus === "cancelled");
                break;
            default:
                break;
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (b) =>
                    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Property filter
        if (filterProperty) {
            filtered = filtered.filter((b) => b.propertyId === parseInt(filterProperty));
        }

        // Payment filter
        if (filterPayment) {
            filtered = filtered.filter((b) => b.paymentStatus === filterPayment);
        }

        return filtered;
    };

    // Table columns
    const columns = [
        {
            id: "bookingCode",
            label: "Booking Code",
            type: "text",
            width: "140px",
        },
        {
            id: "guestName",
            label: "Guest",
            type: "avatar",
            subField: "guestEmail",
            width: "200px",
        },
        {
            id: "propertyName",
            label: "Property",
            type: "text",
            width: "180px",
        },
        {
            id: "roomNumber",
            label: "Room",
            type: "text",
            width: "80px",
            filterable: false,
        },
        {
            id: "checkIn",
            label: "Check-in",
            type: "date",
            width: "120px",
            filterable: false,
        },
        {
            id: "checkOut",
            label: "Check-out",
            type: "date",
            width: "120px",
            filterable: false,
        },
        {
            id: "grandTotal",
            label: "Total",
            type: "currency",
            width: "100px",
            filterable: false,
        },
        {
            id: "paymentStatus",
            label: "Payment",
            type: "status",
            options: ["paid", "pending", "partial", "refunded"],
            width: "100px",
        },
        {
            id: "bookingStatus",
            label: "Status",
            type: "status",
            options: ["confirmed", "checked-in", "checked-out", "cancelled"],
            width: "120px",
        },
    ];

    // Handle action clicks
    const handleActionClick = (action, booking) => {
        setSelectedBooking(booking);
        switch (action) {
            case "view":
                setOpenViewModal(true);
                break;
            case "delete":
                setOpenCancelDialog(true);
                break;
            default:
                break;
        }
    };

    // Handle cancel booking
    const handleCancelBooking = () => {
        setBookingsData(
            bookingsData.map((b) =>
                b.id === selectedBooking.id
                    ? { ...b, bookingStatus: "cancelled", paymentStatus: "refunded" }
                    : b
            )
        );
        setOpenCancelDialog(false);
        setSelectedBooking(null);
    };

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(amount);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get booking status step
    const getBookingStep = (status) => {
        switch (status) {
            case "confirmed":
                return 0;
            case "checked-in":
                return 1;
            case "checked-out":
                return 2;
            case "cancelled":
                return -1;
            default:
                return 0;
        }
    };

    // Counts for tabs
    const counts = {
        all: bookingsData.length,
        confirmed: bookingsData.filter((b) => b.bookingStatus === "confirmed").length,
        checkedIn: bookingsData.filter((b) => b.bookingStatus === "checked-in").length,
        checkedOut: bookingsData.filter((b) => b.bookingStatus === "checked-out").length,
        cancelled: bookingsData.filter((b) => b.bookingStatus === "cancelled").length,
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Bookings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage all property bookings
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />}>
                    New Booking
                </Button>
            </Box>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item size={{xs:6, sm:4, md:2.4}} >
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="primary.main">
                            {counts.all}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total Bookings
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item size={{xs:6, sm:4, md:2.4}}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.info.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="info.main">
                            {counts.confirmed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Confirmed
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item size={{xs:6, sm:4, md:2.4}}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.success.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {counts.checkedIn}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Checked In
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item size={{xs:6, sm:4, md:2.4}}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.warning.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {counts.checkedOut}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Checked Out
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item size={{xs:6, sm:4, md:2.4}}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.error.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="error.main">
                            {counts.cancelled}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Cancelled
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    sx={{ px: 2 }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>All <Chip label={counts.all} size="small" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Confirmed <Chip label={counts.confirmed} size="small" color="info" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Checked In <Chip label={counts.checkedIn} size="small" color="success" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Checked Out <Chip label={counts.checkedOut} size="small" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Cancelled <Chip label={counts.cancelled} size="small" color="error" /></Box>} />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item size={{xs:12, sm:4}}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item size={{xs:12, sm:4}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Property</InputLabel>
                            <Select
                                value={filterProperty}
                                onChange={(e) => setFilterProperty(e.target.value)}
                                label="Property"
                            >
                                <MenuItem value="">All Properties</MenuItem>
                                {approvedProperties.map((property) => (
                                    <MenuItem key={property.id} value={property.id}>
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={{xs:12, sm:4}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Payment Status</InputLabel>
                            <Select
                                value={filterPayment}
                                onChange={(e) => setFilterPayment(e.target.value)}
                                label="Payment Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="partial">Partial</MenuItem>
                                <MenuItem value="refunded">Refunded</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <CustomTable
                data={getFilteredBookings()}
                columns={columns}
                actions={["view", "delete"]}
                onActionClick={handleActionClick}
                emptyMessage="No bookings found matching your criteria"
            />

            {/* View Booking Modal */}
            <Dialog
                open={openViewModal}
                onClose={() => {
                    setOpenViewModal(false);
                    setSelectedBooking(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Booking Details
                            </Typography>
                            {selectedBooking && (
                                <Chip
                                    label={selectedBooking.bookingCode}
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Box>
                        <Box>
                            <IconButton size="small" sx={{ mr: 1 }}>
                                <PrintIcon />
                            </IconButton>
                            <IconButton onClick={() => setOpenViewModal(false)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBooking && (
                        <Box>
                            {/* Booking Status Stepper */}
                            {selectedBooking.bookingStatus !== "cancelled" && (
                                <Box sx={{ mb: 4 }}>
                                    <Stepper activeStep={getBookingStep(selectedBooking.bookingStatus)} alternativeLabel>
                                        <Step>
                                            <StepLabel>Confirmed</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>Checked In</StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel>Checked Out</StepLabel>
                                        </Step>
                                    </Stepper>
                                </Box>
                            )}

                            {selectedBooking.bookingStatus === "cancelled" && (
                                <Paper
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        backgroundColor: alpha(theme.palette.error.main, 0.05),
                                        borderLeft: `4px solid ${theme.palette.error.main}`,
                                    }}
                                >
                                    <Typography color="error" fontWeight={500}>
                                        This booking has been cancelled
                                    </Typography>
                                </Paper>
                            )}

                            <Grid container spacing={3}>
                                {/* Guest Information */}
                                <Grid item size={{xs:12, md:6}}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                            Guest Information
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                            <Avatar
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    backgroundColor: theme.palette.primary.main,
                                                }}
                                            >
                                                {selectedBooking.guestName.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {selectedBooking.guestName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedBooking.adults} Adults, {selectedBooking.children} Children
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <List dense>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <EmailIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText primary={selectedBooking.guestEmail} />
                                            </ListItem>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <PhoneIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText primary={selectedBooking.guestPhone} />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>

                                {/* Property & Room */}
                                <Grid item size={{xs:12, md:6}}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                            Property & Room
                                        </Typography>
                                        <List dense>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <HotelIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={selectedBooking.propertyName}
                                                    secondary="Property"
                                                />
                                            </ListItem>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <MeetingRoomIcon fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={`Room ${selectedBooking.roomNumber} - ${selectedBooking.roomType}`}
                                                    secondary="Room"
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Grid>

                                {/* Stay Details */}
                                <Grid item size={{xs:12, md:6}}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                            Stay Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Check-in
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatDate(selectedBooking.checkIn)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Check-out
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatDate(selectedBooking.checkOut)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Nights
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {selectedBooking.nights}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Guests
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {selectedBooking.guests}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Payment Details */}
                                <Grid item size={{xs:12, md:6}}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                            Payment Details
                                        </Typography>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Room Rate ({selectedBooking.nights} nights)
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatCurrency(selectedBooking.totalAmount)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Taxes & Fees
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatCurrency(selectedBooking.taxAmount)}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Grand Total
                                            </Typography>
                                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                                                {formatCurrency(selectedBooking.grandTotal)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={selectedBooking.paymentStatus}
                                                color={
                                                    selectedBooking.paymentStatus === "paid"
                                                        ? "success"
                                                        : selectedBooking.paymentStatus === "pending"
                                                            ? "warning"
                                                            : selectedBooking.paymentStatus === "partial"
                                                                ? "info"
                                                                : "error"
                                                }
                                                size="small"
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                via {selectedBooking.paymentMethod}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Special Requests */}
                                {selectedBooking.specialRequests && (
                                    <Grid item size={{xs:12}}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                backgroundColor: alpha(theme.palette.info.main, 0.05),
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <NoteIcon fontSize="small" color="info" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Special Requests
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                {selectedBooking.specialRequests}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
                        Close
                    </Button>
                    {selectedBooking?.bookingStatus === "confirmed" && (
                        <Button variant="contained" color="success">
                            Check In
                        </Button>
                    )}
                    {selectedBooking?.bookingStatus === "checked-in" && (
                        <Button variant="contained" color="warning">
                            Check Out
                        </Button>
                    )}
                    {(selectedBooking?.bookingStatus === "confirmed" ||
                        selectedBooking?.bookingStatus === "checked-in") && (
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    setOpenViewModal(false);
                                    setOpenCancelDialog(true);
                                }}
                            >
                                Cancel Booking
                            </Button>
                        )}
                </DialogActions>
            </Dialog>

            {/* Cancel Booking Dialog */}
            <ConfirmDialog
                open={openCancelDialog}
                onClose={() => {
                    setOpenCancelDialog(false);
                    setSelectedBooking(null);
                }}
                onConfirm={handleCancelBooking}
                title="Cancel Booking"
                message={`Are you sure you want to cancel booking ${selectedBooking?.bookingCode}? The guest will be notified and a refund will be processed.`}
                confirmText="Cancel Booking"
                type="danger"
            />
        </Box>
    );
};

export default AllBookingsPage;