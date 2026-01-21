import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    Avatar,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StarIcon from "@mui/icons-material/Star";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ImageIcon from "@mui/icons-material/Image";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import SpaIcon from "@mui/icons-material/Spa";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";

import ConfirmDialog from "../../components/ConfirmDialog";
import { properties, rooms, bookings, owners } from "../../data/mockData";

// Amenity icons
const amenityIcons = {
    WiFi: WifiIcon,
    Pool: PoolIcon,
    Spa: SpaIcon,
    Gym: FitnessCenterIcon,
    Restaurant: RestaurantIcon,
    Parking: LocalParkingIcon,
};

const PropertyDetailsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    // Find property
    const property = properties.find((p) => p.id === parseInt(id));

    // Get property rooms
    const propertyRooms = rooms.filter((r) => r.propertyId === parseInt(id));

    // Get property bookings
    const propertyBookings = bookings.filter((b) => b.propertyId === parseInt(id));

    // Get owner details
    const owner = property ? owners.find((o) => o.id === property.ownerId) : null;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    // Get status color
    const getStatusColor = (status) => {
        const colors = {
            approved: "success",
            pending: "warning",
            rejected: "error",
            available: "success",
            occupied: "error",
            maintenance: "warning",
            reserved: "info",
        };
        return colors[status] || "default";
    };

    // Handle delete
    const handleDelete = () => {
        // In real app, delete property
        navigate("/properties/all");
    };

    if (!property) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Property not found
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/properties/all")}
                >
                    Back to Properties
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <IconButton onClick={() => navigate("/properties/all")}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h5" fontWeight={600}>
                            {property.name}
                        </Typography>
                        <Chip
                            label={property.status}
                            color={getStatusColor(property.status)}
                            size="small"
                        />
                        <Chip label={property.type} size="small" variant="outlined" />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                            {property.address}
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDeleteDialog(true)}
                >
                    Delete
                </Button>
            </Box>

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Left Column - Images & Details */}
                <Grid item xs={12} lg={8}>
                    {/* Images */}
                    <Paper
                        sx={{
                            height: 300,
                            mb: 3,
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box sx={{ textAlign: "center" }}>
                            <ImageIcon sx={{ fontSize: 80, color: theme.palette.primary.light }} />
                            <Typography color="text.secondary">Property Images</Typography>
                        </Box>
                    </Paper>

                    {/* Tabs */}
                    <Paper sx={{ borderRadius: 2, mb: 3 }}>
                        <Tabs
                            value={selectedTab}
                            onChange={(e, newValue) => setSelectedTab(newValue)}
                            sx={{ borderBottom: 1, borderColor: "divider" }}
                        >
                            <Tab label="Overview" />
                            <Tab label={`Rooms (${propertyRooms.length})`} />
                            <Tab label={`Bookings (${propertyBookings.length})`} />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Overview Tab */}
                            {selectedTab === 0 && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {property.description}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Amenities
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {property.amenities.map((amenity) => {
                                            const IconComponent = amenityIcons[amenity] || WifiIcon;
                                            return (
                                                <Chip
                                                    key={amenity}
                                                    icon={<IconComponent sx={{ fontSize: 16 }} />}
                                                    label={amenity}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            );
                                        })}
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                        Contact Information
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <EmailIcon color="action" fontSize="small" />
                                                <Typography variant="body2">
                                                    {property.contactEmail}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <PhoneIcon color="action" fontSize="small" />
                                                <Typography variant="body2">
                                                    {property.contactPhone}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Rooms Tab */}
                            {selectedTab === 1 && (
                                <Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Rooms
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                        >
                                            Add Room
                                        </Button>
                                    </Box>
                                    {propertyRooms.length > 0 ? (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Room</TableCell>
                                                        <TableCell>Type</TableCell>
                                                        <TableCell>Capacity</TableCell>
                                                        <TableCell>Price/Night</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {propertyRooms.map((room) => (
                                                        <TableRow key={room.id}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    Room {room.roomNumber}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Floor {room.floor}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>{room.roomType}</TableCell>
                                                            <TableCell>{room.capacity} guests</TableCell>
                                                            <TableCell>{formatCurrency(room.basePrice)}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={room.status}
                                                                    color={getStatusColor(room.status)}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 4 }}>
                                            <MeetingRoomIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                                            <Typography color="text.secondary">
                                                No rooms added yet
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Bookings Tab */}
                            {selectedTab === 2 && (
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                        Recent Bookings
                                    </Typography>
                                    {propertyBookings.length > 0 ? (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Booking Code</TableCell>
                                                        <TableCell>Guest</TableCell>
                                                        <TableCell>Room</TableCell>
                                                        <TableCell>Check-in</TableCell>
                                                        <TableCell>Check-out</TableCell>
                                                        <TableCell>Amount</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {propertyBookings.map((booking) => (
                                                        <TableRow key={booking.id}>
                                                            <TableCell>
                                                                <Typography variant="body2" fontWeight={500}>
                                                                    {booking.bookingCode}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>{booking.guestName}</TableCell>
                                                            <TableCell>{booking.roomNumber}</TableCell>
                                                            <TableCell>{formatDate(booking.checkIn)}</TableCell>
                                                            <TableCell>{formatDate(booking.checkOut)}</TableCell>
                                                            <TableCell>{formatCurrency(booking.grandTotal)}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={booking.bookingStatus}
                                                                    color={getStatusColor(booking.bookingStatus)}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 4 }}>
                                            <CalendarTodayIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                                            <Typography color="text.secondary">
                                                No bookings yet
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Column - Stats & Owner */}
                <Grid item xs={12} lg={4}>
                    {/* Stats */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Property Stats
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        p: 2,
                                        textAlign: "center",
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                        borderRadius: 1,
                                    }}
                                >
                                    <MeetingRoomIcon color="primary" sx={{ mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700}>
                                        {property.totalRooms}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Total Rooms
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        p: 2,
                                        textAlign: "center",
                                        backgroundColor: alpha(theme.palette.success.main, 0.05),
                                        borderRadius: 1,
                                    }}
                                >
                                    <CheckCircleIcon color="success" sx={{ mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700}>
                                        {property.availableRooms}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Available
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        p: 2,
                                        textAlign: "center",
                                        backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                        borderRadius: 1,
                                    }}
                                >
                                    <StarIcon color="warning" sx={{ mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700}>
                                        {property.rating || "N/A"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Rating ({property.reviewsCount} reviews)
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        p: 2,
                                        textAlign: "center",
                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                        borderRadius: 1,
                                    }}
                                >
                                    <PercentIcon color="info" sx={{ mb: 1 }} />
                                    <Typography variant="h5" fontWeight={700}>
                                        {property.commissionRate}%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Commission
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Owner Card */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Property Owner
                        </Typography>
                        {owner ? (
                            <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            backgroundColor: theme.palette.primary.main,
                                        }}
                                    >
                                        {owner.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {owner.name}
                                        </Typography>
                                        <Chip
                                            label={owner.status}
                                            color={owner.status === "verified" ? "success" : "warning"}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                                <List dense>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <EmailIcon fontSize="small" color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={owner.email}
                                            primaryTypographyProps={{ variant: "body2" }}
                                        />
                                    </ListItem>
                                    <ListItem sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <PhoneIcon fontSize="small" color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={owner.phone}
                                            primaryTypographyProps={{ variant: "body2" }}
                                        />
                                    </ListItem>
                                </List>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    onClick={() => navigate(`/users/owners`)}
                                >
                                    View Owner Profile
                                </Button>
                            </Box>
                        ) : (
                            <Typography color="text.secondary">
                                Owner information not available
                            </Typography>
                        )}
                    </Paper>

                    {/* Timeline */}
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Property Timeline
                        </Typography>
                        <List dense>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <CalendarTodayIcon fontSize="small" color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Created"
                                    secondary={formatDate(property.createdAt)}
                                />
                            </ListItem>
                            {property.status === "approved" && (
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <CheckCircleIcon fontSize="small" color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Approved"
                                        secondary={formatDate(property.createdAt)}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Delete Dialog */}
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Property"
                message={`Are you sure you want to delete "${property.name}"? This will also remove all rooms and bookings associated with this property. This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </Box>
    );
};

export default PropertyDetailsPage;