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
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import BadgeIcon from "@mui/icons-material/Badge";
import PublicIcon from "@mui/icons-material/Public";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import NoteIcon from "@mui/icons-material/Note";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { guests, bookings } from "../../data/mockData";

const GuestsListPage = () => {
    const theme = useTheme();
    const [guestsData, setGuestsData] = useState(guests);
    const [searchQuery, setSearchQuery] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        idType: "Passport",
        idNumber: "",
        dateOfBirth: "",
        address: "",
        notes: "",
    });

    // ID Types
    const idTypes = ["Passport", "Driver License", "National ID", "Other"];

    // Get guest's bookings
    const getGuestBookings = (guestId) => {
        return bookings.filter((b) => b.guestId === guestId);
    };

    // Filter guests
    const getFilteredGuests = () => {
        if (!searchQuery) return guestsData;
        return guestsData.filter(
            (g) =>
                `${g.firstName} ${g.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.phone.includes(searchQuery)
        );
    };

    // Prepare data for table (combine first and last name)
    const tableData = getFilteredGuests().map((guest) => ({
        ...guest,
        name: `${guest.firstName} ${guest.lastName}`,
    }));

    // Table columns
    const columns = [
        {
            id: "name",
            label: "Guest",
            type: "avatar",
            subField: "email",
            width: "250px",
        },
        {
            id: "phone",
            label: "Phone",
            type: "text",
            width: "150px",
        },
        {
            id: "nationality",
            label: "Nationality",
            type: "text",
            width: "120px",
        },
        {
            id: "totalBookings",
            label: "Bookings",
            type: "text",
            width: "100px",
            filterable: false,
        },
        {
            id: "totalSpent",
            label: "Total Spent",
            type: "currency",
            width: "120px",
            filterable: false,
        },
        {
            id: "createdAt",
            label: "Registered",
            type: "date",
            width: "120px",
            filterable: false,
        },
    ];

    // Handle action clicks
    const handleActionClick = (action, guest) => {
        // Find original guest data
        const originalGuest = guestsData.find((g) => g.id === guest.id);
        setSelectedGuest(originalGuest);

        switch (action) {
            case "view":
                setOpenViewModal(true);
                break;
            case "edit":
                setFormData({
                    firstName: originalGuest.firstName,
                    lastName: originalGuest.lastName,
                    email: originalGuest.email,
                    phone: originalGuest.phone,
                    nationality: originalGuest.nationality,
                    idType: originalGuest.idType,
                    idNumber: originalGuest.idNumber,
                    dateOfBirth: originalGuest.dateOfBirth,
                    address: originalGuest.address,
                    notes: originalGuest.notes || "",
                });
                setOpenEditModal(true);
                break;
            case "delete":
                setOpenDeleteDialog(true);
                break;
            default:
                break;
        }
    };

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle add guest
    const handleAddGuest = () => {
        const newGuest = {
            id: guestsData.length + 1,
            ...formData,
            totalBookings: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setGuestsData([...guestsData, newGuest]);
        setOpenAddModal(false);
        resetForm();
    };

    // Handle edit guest
    const handleEditGuest = () => {
        setGuestsData(
            guestsData.map((g) =>
                g.id === selectedGuest.id ? { ...g, ...formData } : g
            )
        );
        setOpenEditModal(false);
        resetForm();
    };

    // Handle delete guest
    const handleDeleteGuest = () => {
        setGuestsData(guestsData.filter((g) => g.id !== selectedGuest.id));
        setOpenDeleteDialog(false);
        setSelectedGuest(null);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            nationality: "",
            idType: "Passport",
            idNumber: "",
            dateOfBirth: "",
            address: "",
            notes: "",
        });
        setSelectedGuest(null);
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
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Guest Form Component
    const GuestForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleFormChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>ID Type</InputLabel>
                    <Select
                        name="idType"
                        value={formData.idType}
                        onChange={handleFormChange}
                        label="ID Type"
                    >
                        {idTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="ID Number"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleFormChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    multiline
                    rows={2}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    multiline
                    rows={2}
                    placeholder="Special preferences, allergies, VIP status, etc."
                />
            </Grid>
        </Grid>
    );

    // Stats
    const totalGuests = guestsData.length;
    const totalSpent = guestsData.reduce((sum, g) => sum + g.totalSpent, 0);
    const avgSpent = totalGuests > 0 ? totalSpent / totalGuests : 0;
    const loyalGuests = guestsData.filter((g) => g.totalBookings >= 3).length;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Guests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage guest information and history
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddModal(true)}
                >
                    Add Guest
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
                            {totalGuests}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total Guests
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
                            {formatCurrency(totalSpent)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total Revenue
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
                            {formatCurrency(avgSpent)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Avg. Spend
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
                            {loyalGuests}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Loyal Guests (3+)
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Search */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search guests by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 400 }}
                />
            </Paper>

            {/* Table */}
            <CustomTable
                data={tableData}
                columns={columns}
                actions={["view", "edit", "delete"]}
                onActionClick={handleActionClick}
                emptyMessage="No guests found"
            />

            {/* Add Guest Modal */}
            <Dialog
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    resetForm();
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Add New Guest
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <GuestForm />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenAddModal(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddGuest}
                        disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                    >
                        Add Guest
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Guest Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    resetForm();
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Guest
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <GuestForm />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenEditModal(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditGuest}
                        disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Guest Modal */}
            <Dialog
                open={openViewModal}
                onClose={() => {
                    setOpenViewModal(false);
                    setSelectedGuest(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Guest Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedGuest && (
                        <Grid container spacing={3}>
                            {/* Guest Header */}
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 3,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            backgroundColor: theme.palette.primary.main,
                                            fontSize: 32,
                                        }}
                                    >
                                        {selectedGuest.firstName.charAt(0)}
                                        {selectedGuest.lastName.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                                            <Typography variant="h5" fontWeight={600}>
                                                {selectedGuest.firstName} {selectedGuest.lastName}
                                            </Typography>
                                            {selectedGuest.totalBookings >= 5 && (
                                                <Chip
                                                    icon={<StarIcon sx={{ fontSize: 16 }} />}
                                                    label="VIP"
                                                    color="warning"
                                                    size="small"
                                                />
                                            )}
                                            {selectedGuest.totalBookings >= 3 && selectedGuest.totalBookings < 5 && (
                                                <Chip
                                                    label="Loyal Guest"
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Guest since {formatDate(selectedGuest.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography variant="h4" fontWeight={700} color="primary.main">
                                            {selectedGuest.totalBookings}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Bookings
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography variant="h4" fontWeight={700} color="success.main">
                                            {formatCurrency(selectedGuest.totalSpent)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Spent
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Contact Information */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, height: "100%" }}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                        Contact Information
                                    </Typography>
                                    <List dense>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText primary="Email" secondary={selectedGuest.email} />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <PhoneIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText primary="Phone" secondary={selectedGuest.phone} />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <LocationOnIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Address"
                                                secondary={selectedGuest.address || "-"}
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Personal Information */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, height: "100%" }}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                        Personal Information
                                    </Typography>
                                    <List dense>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <PublicIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Nationality"
                                                secondary={selectedGuest.nationality || "-"}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CakeIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Date of Birth"
                                                secondary={formatDate(selectedGuest.dateOfBirth)}
                                            />
                                        </ListItem>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <BadgeIcon fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={selectedGuest.idType}
                                                secondary={selectedGuest.idNumber || "-"}
                                            />
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Grid>

                            {/* Notes */}
                            {selectedGuest.notes && (
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
                                        <Typography variant="body2">{selectedGuest.notes}</Typography>
                                    </Paper>
                                </Grid>
                            )}

                            {/* Booking History */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                        Booking History
                                    </Typography>
                                    {getGuestBookings(selectedGuest.id).length > 0 ? (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Booking Code</TableCell>
                                                        <TableCell>Property</TableCell>
                                                        <TableCell>Room</TableCell>
                                                        <TableCell>Check-in</TableCell>
                                                        <TableCell>Check-out</TableCell>
                                                        <TableCell>Amount</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {getGuestBookings(selectedGuest.id).map((booking) => (
                                                        <TableRow key={booking.id}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {booking.bookingCode}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>{booking.propertyName}</TableCell>
                                                            <TableCell>{booking.roomNumber}</TableCell>
                                                            <TableCell>{formatDate(booking.checkIn)}</TableCell>
                                                            <TableCell>{formatDate(booking.checkOut)}</TableCell>
                                                            <TableCell>
                                                                {formatCurrency(booking.grandTotal)}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={booking.bookingStatus}
                                                                    size="small"
                                                                    color={
                                                                        booking.bookingStatus === "checked-out"
                                                                            ? "default"
                                                                            : booking.bookingStatus === "checked-in"
                                                                                ? "success"
                                                                                : booking.bookingStatus === "confirmed"
                                                                                    ? "primary"
                                                                                    : "error"
                                                                    }
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 3 }}>
                                            <EventNoteIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                                            <Typography color="text.secondary">
                                                No booking history
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpenViewModal(false);
                            handleActionClick("edit", { id: selectedGuest.id });
                        }}
                    >
                        Edit Guest
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedGuest(null);
                }}
                onConfirm={handleDeleteGuest}
                title="Delete Guest"
                message={`Are you sure you want to delete "${selectedGuest?.firstName} ${selectedGuest?.lastName}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </Box>
    );
};

export default GuestsListPage;