import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    InputAdornment,
    Tabs,
    Tab,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NoteIcon from "@mui/icons-material/Note";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { serviceBookings, services, bookings, properties, serviceCategories } from "../../data/mockData";

const ServiceBookingsPage = () => {
    const theme = useTheme();
    const [serviceBookingsData, setServiceBookingsData] = useState(serviceBookings);
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterProperty, setFilterProperty] = useState("");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [selectedServiceBooking, setSelectedServiceBooking] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // Get approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Filter service bookings
    const getFilteredServiceBookings = () => {
        let filtered = serviceBookingsData;

        // Tab filter
        switch (selectedTab) {
            case 1:
                filtered = filtered.filter((sb) => sb.status === "pending");
                break;
            case 2:
                filtered = filtered.filter((sb) => sb.status === "confirmed");
                break;
            case 3:
                filtered = filtered.filter((sb) => sb.status === "completed");
                break;
            case 4:
                filtered = filtered.filter((sb) => sb.status === "cancelled");
                break;
            default:
                break;
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (sb) =>
                    sb.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sb.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sb.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Property filter
        if (filterProperty) {
            filtered = filtered.filter((sb) => sb.propertyId === parseInt(filterProperty));
        }

        return filtered;
    };

    // Table columns
    const columns = [
        {
            id: "serviceName",
            label: "Service",
            type: "text",
            width: "180px",
        },
        {
            id: "guestName",
            label: "Guest",
            type: "avatar",
            width: "180px",
        },
        {
            id: "propertyName",
            label: "Property",
            type: "text",
            width: "180px",
        },
        {
            id: "scheduledDate",
            label: "Date",
            type: "date",
            width: "120px",
            filterable: false,
        },
        {
            id: "scheduledTime",
            label: "Time",
            type: "text",
            width: "100px",
            filterable: false,
        },
        {
            id: "amount",
            label: "Amount",
            type: "currency",
            width: "100px",
            filterable: false,
        },
        {
            id: "status",
            label: "Status",
            type: "status",
            options: ["pending", "confirmed", "completed", "cancelled"],
            width: "120px",
        },
    ];

    // Handle action clicks
    const handleActionClick = (action, serviceBooking) => {
        setSelectedServiceBooking(serviceBooking);
        switch (action) {
            case "view":
                setOpenViewModal(true);
                break;
            case "edit":
                setNewStatus(serviceBooking.status);
                setOpenUpdateModal(true);
                break;
            case "delete":
                setOpenCancelDialog(true);
                break;
            default:
                break;
        }
    };

    // Handle update status
    const handleUpdateStatus = () => {
        setServiceBookingsData(
            serviceBookingsData.map((sb) =>
                sb.id === selectedServiceBooking.id ? { ...sb, status: newStatus } : sb
            )
        );
        setOpenUpdateModal(false);
        setSelectedServiceBooking(null);
        setNewStatus("");
    };

    // Handle cancel service booking
    const handleCancelServiceBooking = () => {
        setServiceBookingsData(
            serviceBookingsData.map((sb) =>
                sb.id === selectedServiceBooking.id ? { ...sb, status: "cancelled" } : sb
            )
        );
        setOpenCancelDialog(false);
        setSelectedServiceBooking(null);
    };

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
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

    // Get service details
    const getServiceDetails = (serviceId) => {
        return services.find((s) => s.id === serviceId);
    };

    // Get category name
    const getCategoryName = (categoryId) => {
        const category = serviceCategories.find((c) => c.id === categoryId);
        return category?.name || "-";
    };

    // Counts for tabs
    const counts = {
        all: serviceBookingsData.length,
        pending: serviceBookingsData.filter((sb) => sb.status === "pending").length,
        confirmed: serviceBookingsData.filter((sb) => sb.status === "confirmed").length,
        completed: serviceBookingsData.filter((sb) => sb.status === "completed").length,
        cancelled: serviceBookingsData.filter((sb) => sb.status === "cancelled").length,
    };

    // Stats
    const totalRevenue = serviceBookingsData
        .filter((sb) => sb.status === "completed")
        .reduce((sum, sb) => sum + sb.amount, 0);
    const pendingRevenue = serviceBookingsData
        .filter((sb) => sb.status === "pending" || sb.status === "confirmed")
        .reduce((sum, sb) => sum + sb.amount, 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Service Bookings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage guest service requests and bookings
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />}>
                    New Service Booking
                </Button>
            </Box>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
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
                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.warning.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {counts.pending + counts.confirmed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Upcoming
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.success.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {formatCurrency(totalRevenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Completed Revenue
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: alpha(theme.palette.info.main, 0.05),
                        }}
                    >
                        <Typography variant="h4" fontWeight={700} color="info.main">
                            {formatCurrency(pendingRevenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Pending Revenue
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
                    <Tab
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                All
                                <Chip label={counts.all} size="small" />
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Pending
                                <Chip label={counts.pending} size="small" color="warning" />
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Confirmed
                                <Chip label={counts.confirmed} size="small" color="info" />
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Completed
                                <Chip label={counts.completed} size="small" color="success" />
                            </Box>
                        }
                    />
                    <Tab
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Cancelled
                                <Chip label={counts.cancelled} size="small" color="error" />
                            </Box>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by service, guest, or property..."
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
                    <Grid item xs={12} sm={6}>
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
                </Grid>
            </Paper>

            {/* Table */}
            <CustomTable
                data={getFilteredServiceBookings()}
                columns={columns}
                actions={["view", "edit", "delete"]}
                onActionClick={handleActionClick}
                emptyMessage="No service bookings found"
            />

            {/* View Service Booking Modal */}
            <Dialog
                open={openViewModal}
                onClose={() => {
                    setOpenViewModal(false);
                    setSelectedServiceBooking(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Service Booking Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedServiceBooking && (
                        <Box>
                            {/* Header */}
                            <Paper
                                sx={{
                                    p: 2,
                                    mb: 3,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            backgroundColor: theme.palette.primary.main,
                                        }}
                                    >
                                        <RoomServiceIcon />
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {selectedServiceBooking.serviceName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {(() => {
                                                const service = getServiceDetails(selectedServiceBooking.serviceId);
                                                return service ? getCategoryName(service.categoryId) : "-";
                                            })()}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={selectedServiceBooking.status}
                                        color={
                                            selectedServiceBooking.status === "completed"
                                                ? "success"
                                                : selectedServiceBooking.status === "confirmed"
                                                    ? "info"
                                                    : selectedServiceBooking.status === "pending"
                                                        ? "warning"
                                                        : "error"
                                        }
                                    />
                                </Box>
                            </Paper>

                            {/* Details */}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                        Guest & Property
                                    </Typography>
                                    <List dense>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <PersonIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Guest"
                                                secondary={selectedServiceBooking.guestName}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <HotelIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Property"
                                                secondary={selectedServiceBooking.propertyName}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                        Schedule
                                    </Typography>
                                    <List dense>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CalendarTodayIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Date"
                                                secondary={formatDate(selectedServiceBooking.scheduledDate)}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <AccessTimeIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Time"
                                                secondary={selectedServiceBooking.scheduledTime}
                                            />
                                        </ListItem>
                                    </List>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                        Payment
                                    </Typography>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: alpha(theme.palette.success.main, 0.05),
                                        }}
                                    >
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <AttachMoneyIcon color="success" />
                                            <Typography variant="body2">Service Amount</Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight={700} color="success.main">
                                            {formatCurrency(selectedServiceBooking.amount)}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {selectedServiceBooking.notes && (
                                    <Grid item xs={12}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                backgroundColor: alpha(theme.palette.info.main, 0.05),
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <NoteIcon fontSize="small" color="info" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Notes
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                {selectedServiceBooking.notes}
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
                    {selectedServiceBooking?.status === "pending" && (
                        <Button
                            variant="contained"
                            color="info"
                            onClick={() => {
                                setOpenViewModal(false);
                                setNewStatus("confirmed");
                                setOpenUpdateModal(true);
                            }}
                        >
                            Confirm Booking
                        </Button>
                    )}
                    {selectedServiceBooking?.status === "confirmed" && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                                setOpenViewModal(false);
                                setNewStatus("completed");
                                setOpenUpdateModal(true);
                            }}
                        >
                            Mark Completed
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Update Status Modal */}
            <Dialog
                open={openUpdateModal}
                onClose={() => {
                    setOpenUpdateModal(false);
                    setSelectedServiceBooking(null);
                    setNewStatus("");
                }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Update Status
                        </Typography>
                        <IconButton onClick={() => setOpenUpdateModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1 }}>
                        Update the status for "{selectedServiceBooking?.serviceName}" booking.
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="pending">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <PendingIcon color="warning" fontSize="small" />
                                    Pending
                                </Box>
                            </MenuItem>
                            <MenuItem value="confirmed">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CheckCircleIcon color="info" fontSize="small" />
                                    Confirmed
                                </Box>
                            </MenuItem>
                            <MenuItem value="completed">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CheckCircleIcon color="success" fontSize="small" />
                                    Completed
                                </Box>
                            </MenuItem>
                            <MenuItem value="cancelled">
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <CancelIcon color="error" fontSize="small" />
                                    Cancelled
                                </Box>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenUpdateModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleUpdateStatus} disabled={!newStatus}>
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Cancel Service Booking Dialog */}
            <ConfirmDialog
                open={openCancelDialog}
                onClose={() => {
                    setOpenCancelDialog(false);
                    setSelectedServiceBooking(null);
                }}
                onConfirm={handleCancelServiceBooking}
                title="Cancel Service Booking"
                message={`Are you sure you want to cancel the "${selectedServiceBooking?.serviceName}" booking for ${selectedServiceBooking?.guestName}?`}
                confirmText="Cancel Booking"
                type="danger"
            />
        </Box>
    );
};

export default ServiceBookingsPage;