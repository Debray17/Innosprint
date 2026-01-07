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
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Divider,
    Avatar,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ApartmentIcon from "@mui/icons-material/Apartment";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { rooms, properties, roomTypes, seasons } from "../../data/mockData";

const AllRoomsPage = () => {
    const theme = useTheme();
    const [roomsData, setRoomsData] = useState(rooms);
    const [selectedTab, setSelectedTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterProperty, setFilterProperty] = useState("");
    const [filterRoomType, setFilterRoomType] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formData, setFormData] = useState({
        propertyId: "",
        roomNumber: "",
        roomType: "",
        floor: "",
        capacity: 2,
        basePrice: "",
        description: "",
        amenities: [],
        seasonalPricing: [],
    });

    // Available amenities for rooms
    const availableAmenities = [
        "WiFi",
        "TV",
        "Mini Bar",
        "Safe",
        "Air Conditioning",
        "Balcony",
        "Ocean View",
        "Mountain View",
        "Kitchen",
        "Living Area",
        "Jacuzzi",
        "Private Terrace",
        "Work Desk",
        "Fireplace",
    ];

    // Get approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Filter rooms
    const getFilteredRooms = () => {
        let filtered = roomsData;

        // Tab filter
        switch (selectedTab) {
            case 1:
                filtered = filtered.filter((r) => r.status === "available");
                break;
            case 2:
                filtered = filtered.filter((r) => r.status === "occupied");
                break;
            case 3:
                filtered = filtered.filter((r) => r.status === "maintenance");
                break;
            case 4:
                filtered = filtered.filter((r) => r.status === "reserved");
                break;
            default:
                break;
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (r) =>
                    r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.roomType.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Property filter
        if (filterProperty) {
            filtered = filtered.filter((r) => r.propertyId === parseInt(filterProperty));
        }

        // Room type filter
        if (filterRoomType) {
            filtered = filtered.filter((r) => r.roomType === filterRoomType);
        }

        return filtered;
    };

    // Table columns
    const columns = [
        {
            id: "roomNumber",
            label: "Room",
            type: "text",
            width: "100px",
        },
        {
            id: "propertyName",
            label: "Property",
            type: "text",
            width: "200px",
        },
        {
            id: "roomType",
            label: "Type",
            type: "select",
            options: roomTypes.map((t) => t.name),
            width: "150px",
        },
        {
            id: "floor",
            label: "Floor",
            type: "text",
            width: "80px",
            filterable: false,
        },
        {
            id: "capacity",
            label: "Capacity",
            type: "text",
            width: "100px",
            filterable: false,
        },
        {
            id: "basePrice",
            label: "Base Price",
            type: "currency",
            width: "120px",
            filterable: false,
        },
        {
            id: "status",
            label: "Status",
            type: "status",
            options: ["available", "occupied", "maintenance", "reserved"],
            width: "120px",
        },
    ];

    // Handle action clicks
    const handleActionClick = (action, room) => {
        setSelectedRoom(room);
        switch (action) {
            case "view":
                setOpenViewModal(true);
                break;
            case "edit":
                setFormData({
                    propertyId: room.propertyId,
                    roomNumber: room.roomNumber,
                    roomType: room.roomType,
                    floor: room.floor,
                    capacity: room.capacity,
                    basePrice: room.basePrice,
                    description: room.description || "",
                    amenities: room.amenities || [],
                    seasonalPricing: room.seasonalPricing || [],
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

    // Handle amenities change
    const handleAmenitiesChange = (event, newValue) => {
        setFormData((prev) => ({ ...prev, amenities: newValue }));
    };

    // Handle seasonal pricing change
    const handleSeasonalPricingChange = (seasonId, price) => {
        setFormData((prev) => {
            const existing = prev.seasonalPricing.find((sp) => sp.seasonId === seasonId);
            if (existing) {
                return {
                    ...prev,
                    seasonalPricing: prev.seasonalPricing.map((sp) =>
                        sp.seasonId === seasonId ? { ...sp, price: Number(price) } : sp
                    ),
                };
            } else {
                return {
                    ...prev,
                    seasonalPricing: [...prev.seasonalPricing, { seasonId, price: Number(price) }],
                };
            }
        });
    };

    // Handle add room
    const handleAddRoom = () => {
        const property = approvedProperties.find((p) => p.id === formData.propertyId);
        const newRoom = {
            id: roomsData.length + 1,
            ...formData,
            propertyName: property?.name || "",
            status: "available",
            images: [],
        };
        setRoomsData([...roomsData, newRoom]);
        setOpenAddModal(false);
        resetForm();
    };

    // Handle edit room
    const handleEditRoom = () => {
        const property = approvedProperties.find((p) => p.id === formData.propertyId);
        setRoomsData(
            roomsData.map((r) =>
                r.id === selectedRoom.id
                    ? { ...r, ...formData, propertyName: property?.name || r.propertyName }
                    : r
            )
        );
        setOpenEditModal(false);
        resetForm();
    };

    // Handle delete room
    const handleDeleteRoom = () => {
        setRoomsData(roomsData.filter((r) => r.id !== selectedRoom.id));
        setOpenDeleteDialog(false);
        setSelectedRoom(null);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            propertyId: "",
            roomNumber: "",
            roomType: "",
            floor: "",
            capacity: 2,
            basePrice: "",
            description: "",
            amenities: [],
            seasonalPricing: [],
        });
        setSelectedRoom(null);
    };

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    // Counts for tabs
    const counts = {
        all: roomsData.length,
        available: roomsData.filter((r) => r.status === "available").length,
        occupied: roomsData.filter((r) => r.status === "occupied").length,
        maintenance: roomsData.filter((r) => r.status === "maintenance").length,
        reserved: roomsData.filter((r) => r.status === "reserved").length,
    };

    // Room Form Component
    const RoomForm = () => (
        <Grid container spacing={2}>
            <Grid item size={{xs:12, sm:6}}>
                <FormControl fullWidth required>
                    <InputLabel>Property</InputLabel>
                    <Select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleFormChange}
                        label="Property"
                    >
                        {approvedProperties.map((property) => (
                            <MenuItem key={property.id} value={property.id}>
                                {property.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item size={{xs:12, sm:6}}>
                <TextField
                    fullWidth
                    label="Room Number"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item size={{xs:12, sm:6}}>
                <FormControl fullWidth required>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleFormChange}
                        label="Room Type"
                    >
                        {roomTypes.map((type) => (
                            <MenuItem key={type.id} value={type.name}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item size={{xs:12, sm:6}}>
                <TextField
                    fullWidth
                    label="Floor"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleFormChange}
                    required
                />
            </Grid>
            <Grid item size={{xs:12, sm:6}}>
                <TextField
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">guests</InputAdornment>,
                    }}
                    inputProps={{ min: 1, max: 20 }}
                    required
                />
            </Grid>
            <Grid item size={{xs:12, sm:6}}>
                <TextField
                    fullWidth
                    label="Base Price (per night)"
                    name="basePrice"
                    type="number"
                    value={formData.basePrice}
                    onChange={handleFormChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    required
                />
            </Grid>
            <Grid item size={{xs:12}}>
                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    multiline
                    rows={2}
                />
            </Grid>
            <Grid item size={{xs:12}}>
                <Autocomplete
                    multiple
                    options={availableAmenities}
                    value={formData.amenities}
                    onChange={handleAmenitiesChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Amenities" placeholder="Select amenities" />
                    )}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option}
                                size="small"
                                {...getTagProps({ index })}
                                key={option}
                            />
                        ))
                    }
                />
            </Grid>

            {/* Seasonal Pricing Section */}
            <Grid item size={{xs:12}}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                    Seasonal Pricing
                </Typography>
                <Grid container spacing={2}>
                    {seasons.map((season) => {
                        const existingPrice = formData.seasonalPricing.find(
                            (sp) => sp.seasonId === season.id
                        );
                        return (
                            <Grid item size={{xs:12, sm:6}} key={season.id}>
                                <TextField
                                    fullWidth
                                    label={`${season.name} (x${season.priceMultiplier})`}
                                    type="number"
                                    value={existingPrice?.price || ""}
                                    onChange={(e) =>
                                        handleSeasonalPricingChange(season.id, e.target.value)
                                    }
                                    placeholder={`Suggested: $${Math.round(
                                        (formData.basePrice || 0) * season.priceMultiplier
                                    )}`}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    helperText={`${season.startDate} - ${season.endDate}`}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Rooms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage rooms across all properties
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddModal(true)}
                >
                    Add Room
                </Button>
            </Box>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item size={{xs:6, sm:4, md:2.4}}>
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
                            Total Rooms
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
                            {counts.available}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Available
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
                            {counts.occupied}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Occupied
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
                            {counts.maintenance}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Maintenance
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
                            {counts.reserved}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Reserved
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
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Available <Chip label={counts.available} size="small" color="success" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Occupied <Chip label={counts.occupied} size="small" color="error" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Maintenance <Chip label={counts.maintenance} size="small" color="warning" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Reserved <Chip label={counts.reserved} size="small" color="info" /></Box>} />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item size={{xs:12, sm:4}}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search rooms..."
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
                            <InputLabel>Room Type</InputLabel>
                            <Select
                                value={filterRoomType}
                                onChange={(e) => setFilterRoomType(e.target.value)}
                                label="Room Type"
                            >
                                <MenuItem value="">All Types</MenuItem>
                                {roomTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.name}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <CustomTable
                data={getFilteredRooms()}
                columns={columns}
                actions={["view", "edit", "delete"]}
                onActionClick={handleActionClick}
                emptyMessage="No rooms found matching your criteria"
            />

            {/* Add Room Modal */}
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
                            Add New Room
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <RoomForm />
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
                        onClick={handleAddRoom}
                        disabled={
                            !formData.propertyId ||
                            !formData.roomNumber ||
                            !formData.roomType ||
                            !formData.floor ||
                            !formData.basePrice
                        }
                    >
                        Add Room
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Room Modal */}
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
                            Edit Room
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <RoomForm />
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
                        onClick={handleEditRoom}
                        disabled={
                            !formData.propertyId ||
                            !formData.roomNumber ||
                            !formData.roomType ||
                            !formData.floor ||
                            !formData.basePrice
                        }
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Room Modal */}
            <Dialog
                open={openViewModal}
                onClose={() => {
                    setOpenViewModal(false);
                    setSelectedRoom(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Room Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedRoom && (
                        <Box>
                            {/* Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 3,
                                    p: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    borderRadius: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        backgroundColor: theme.palette.primary.main,
                                    }}
                                >
                                    <MeetingRoomIcon />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Room {selectedRoom.roomNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedRoom.propertyName}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={selectedRoom.status}
                                    color={
                                        selectedRoom.status === "available"
                                            ? "success"
                                            : selectedRoom.status === "occupied"
                                                ? "error"
                                                : selectedRoom.status === "maintenance"
                                                    ? "warning"
                                                    : "info"
                                    }
                                />
                            </Box>

                            {/* Details Grid */}
                            <Grid container spacing={2}>
                                <Grid item size={{xs:6}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Room Type
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.roomType}
                                    </Typography>
                                </Grid>
                                <Grid item size={{xs:6}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Floor
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.floor}
                                    </Typography>
                                </Grid>
                                <Grid item size={{xs:6}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.capacity} guests
                                    </Typography>
                                </Grid>
                                <Grid item size={{xs:6}}>
                                    <Typography variant="caption" color="text.secondary">
                                        Base Price
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formatCurrency(selectedRoom.basePrice)} / night
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Description */}
                            {selectedRoom.description && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Description
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedRoom.description}
                                    </Typography>
                                </Box>
                            )}

                            {/* Amenities */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                    Amenities
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selectedRoom.amenities.map((amenity) => (
                                        <Chip
                                            key={amenity}
                                            label={amenity}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                            </Box>

                            {/* Seasonal Pricing */}
                            {selectedRoom.seasonalPricing && selectedRoom.seasonalPricing.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                        Seasonal Pricing
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {selectedRoom.seasonalPricing.map((sp) => {
                                            const season = seasons.find((s) => s.id === sp.seasonId);
                                            return (
                                                <Grid item size={{xs:6}} key={sp.seasonId}>
                                                    <Paper
                                                        sx={{
                                                            p: 1,
                                                            textAlign: "center",
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="text.secondary">
                                                            {season?.name}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {formatCurrency(sp.price)}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            )}
                        </Box>
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
                            handleActionClick("edit", selectedRoom);
                        }}
                    >
                        Edit Room
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedRoom(null);
                }}
                onConfirm={handleDeleteRoom}
                title="Delete Room"
                message={`Are you sure you want to delete Room ${selectedRoom?.roomNumber} from ${selectedRoom?.propertyName}? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </Box>
    );
};

export default AllRoomsPage;