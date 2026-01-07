import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Avatar,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import HotelIcon from "@mui/icons-material/Hotel";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import { bookings, properties } from "../../data/mockData";

const CalendarPage = () => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [openDayModal, setOpenDayModal] = useState(false);
    const [filterProperty, setFilterProperty] = useState("");

    // Get approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Filter bookings by property
    const filteredBookings = filterProperty
        ? bookings.filter((b) => b.propertyId === parseInt(filterProperty))
        : bookings;

    // Get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

    // Month navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Format month/year
    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };

    // Get bookings for a specific date
    const getBookingsForDate = (day) => {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const checkIns = filteredBookings.filter((b) => b.checkIn === dateString);
        const checkOuts = filteredBookings.filter((b) => b.checkOut === dateString);
        const staying = filteredBookings.filter(
            (b) => b.checkIn < dateString && b.checkOut > dateString && b.bookingStatus !== "cancelled"
        );

        return { checkIns, checkOuts, staying, dateString };
    };

    // Handle date click
    const handleDateClick = (day) => {
        const { checkIns, checkOuts, staying, dateString } = getBookingsForDate(day);
        if (checkIns.length > 0 || checkOuts.length > 0 || staying.length > 0) {
            setSelectedDate({
                day,
                date: dateString,
                checkIns,
                checkOuts,
                staying,
            });
            setOpenDayModal(true);
        }
    };

    // Check if date is today
    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    // Days of week header
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Generate calendar grid
    const calendarDays = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(
            <Grid item size={{xs:12/7}} key={`empty-${i}`}>
                <Paper
                    sx={{
                        p: 1,
                        minHeight: 100,
                        backgroundColor: alpha(theme.palette.action.disabled, 0.05),
                    }}
                />
            </Grid>
        );
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const { checkIns, checkOuts, staying } = getBookingsForDate(day);
        const hasEvents = checkIns.length > 0 || checkOuts.length > 0 || staying.length > 0;
        const today = isToday(day);

        calendarDays.push(
            <Grid item sx={{xs:12/7}} key={day}>
                <Paper
                    onClick={() => handleDateClick(day)}
                    sx={{
                        p: 1,
                        minHeight: 100,
                        cursor: hasEvents ? "pointer" : "default",
                        border: today ? `2px solid ${theme.palette.primary.main}` : "none",
                        backgroundColor: today
                            ? alpha(theme.palette.primary.main, 0.05)
                            : "background.paper",
                        transition: "all 0.2s",
                        "&:hover": hasEvents
                            ? {
                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                transform: "scale(1.02)",
                            }
                            : {},
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={today ? 700 : 500}
                        color={today ? "primary" : "text.primary"}
                        sx={{ mb: 1 }}
                    >
                        {day}
                    </Typography>

                    {/* Event Indicators */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {checkIns.length > 0 && (
                            <Chip
                                icon={<LoginIcon sx={{ fontSize: 12 }} />}
                                label={`${checkIns.length} Check-in`}
                                size="small"
                                color="success"
                                sx={{
                                    height: 20,
                                    fontSize: 10,
                                    "& .MuiChip-icon": { fontSize: 12 },
                                }}
                            />
                        )}
                        {checkOuts.length > 0 && (
                            <Chip
                                icon={<LogoutIcon sx={{ fontSize: 12 }} />}
                                label={`${checkOuts.length} Check-out`}
                                size="small"
                                color="warning"
                                sx={{
                                    height: 20,
                                    fontSize: 10,
                                    "& .MuiChip-icon": { fontSize: 12 },
                                }}
                            />
                        )}
                        {staying.length > 0 && (
                            <Chip
                                icon={<HotelIcon sx={{ fontSize: 12 }} />}
                                label={`${staying.length} Staying`}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{
                                    height: 20,
                                    fontSize: 10,
                                    "& .MuiChip-icon": { fontSize: 12 },
                                }}
                            />
                        )}
                    </Box>
                </Paper>
            </Grid>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Booking Calendar
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Visual overview of all bookings
                    </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Property</InputLabel>
                    <Select
                        value={filterProperty}
                        onChange={(e) => setFilterProperty(e.target.value)}
                        label="Filter by Property"
                    >
                        <MenuItem value="">All Properties</MenuItem>
                        {approvedProperties.map((property) => (
                            <MenuItem key={property.id} value={property.id}>
                                {property.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Legend */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
                    <Typography variant="body2" fontWeight={500}>
                        Legend:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            icon={<LoginIcon sx={{ fontSize: 14 }} />}
                            label="Check-in"
                            size="small"
                            color="success"
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            icon={<LogoutIcon sx={{ fontSize: 14 }} />}
                            label="Check-out"
                            size="small"
                            color="warning"
                        />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                            icon={<HotelIcon sx={{ fontSize: 14 }} />}
                            label="Staying"
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Calendar Navigation */}
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <IconButton onClick={prevMonth}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {formatMonthYear(currentDate)}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<TodayIcon />}
                            onClick={goToToday}
                        >
                            Today
                        </Button>
                    </Box>
                    <IconButton onClick={nextMonth}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Paper>

            {/* Calendar Grid */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                {/* Days of Week Header */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {daysOfWeek.map((day) => (
                        <Grid item size={{xs:12/7}} key={day}>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.secondary"
                                align="center"
                                sx={{ py: 1 }}
                            >
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar Days */}
                <Grid container spacing={1}>
                    {calendarDays}
                </Grid>
            </Paper>

            {/* Day Details Modal */}
            <Dialog
                open={openDayModal}
                onClose={() => {
                    setOpenDayModal(false);
                    setSelectedDate(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                                sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                }}
                            >
                                <EventIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {selectedDate && formatDate(selectedDate.date)}
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={() => setOpenDayModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedDate && (
                        <Box>
                            {/* Check-Ins */}
                            {selectedDate.checkIns.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <LoginIcon color="success" />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Check-Ins ({selectedDate.checkIns.length})
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {selectedDate.checkIns.map((booking) => (
                                            <ListItem key={booking.id} sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: alpha(
                                                                theme.palette.success.main,
                                                                0.1
                                                            ),
                                                            color: theme.palette.success.main,
                                                        }}
                                                    >
                                                        {booking.guestName.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={booking.guestName}
                                                    secondary={`${booking.propertyName} • Room ${booking.roomNumber} • ${booking.nights} nights`}
                                                />
                                                <Chip
                                                    label={formatCurrency(booking.grandTotal)}
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Check-Outs */}
                            {selectedDate.checkOuts.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <LogoutIcon color="warning" />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Check-Outs ({selectedDate.checkOuts.length})
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {selectedDate.checkOuts.map((booking) => (
                                            <ListItem key={booking.id} sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: alpha(
                                                                theme.palette.warning.main,
                                                                0.1
                                                            ),
                                                            color: theme.palette.warning.main,
                                                        }}
                                                    >
                                                        {booking.guestName.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={booking.guestName}
                                                    secondary={`${booking.propertyName} • Room ${booking.roomNumber}`}
                                                />
                                                <Chip
                                                    label={booking.bookingStatus}
                                                    size="small"
                                                    color={
                                                        booking.bookingStatus === "checked-in"
                                                            ? "success"
                                                            : "default"
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {/* Currently Staying */}
                            {selectedDate.staying.length > 0 && (
                                <Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <HotelIcon color="info" />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Currently Staying ({selectedDate.staying.length})
                                        </Typography>
                                    </Box>
                                    <List dense>
                                        {selectedDate.staying.map((booking) => (
                                            <ListItem key={booking.id} sx={{ px: 0 }}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: alpha(
                                                                theme.palette.info.main,
                                                                0.1
                                                            ),
                                                            color: theme.palette.info.main,
                                                        }}
                                                    >
                                                        {booking.guestName.charAt(0)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={booking.guestName}
                                                    secondary={`${booking.propertyName} • Room ${booking.roomNumber}`}
                                                />
                                                <Chip
                                                    label={booking.bookingStatus}
                                                    size="small"
                                                    color="info"
                                                    variant="outlined"
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenDayModal(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CalendarPage;