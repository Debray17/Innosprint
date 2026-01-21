import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Chip,
    Divider,
    Rating,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddPropertyModal from "../../components/modals/AddPropertyModal";
import { properties, owners } from "../../data/mockData";

export default function AllPropertiesPage() {
    const [data, setData] = useState(properties.filter((p) => p.status === "approved"));
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    const columns = [
        { id: "name", label: "Property Name", type: "text", width: "200px" },
        { id: "ownerName", label: "Owner", type: "text", width: "150px" },
        {
            id: "type",
            label: "Type",
            type: "select",
            width: "120px",
            options: ["Hotel", "Resort", "Villa", "Apartment", "Guest House", "Hostel"],
        },
        { id: "city", label: "City", type: "text", width: "120px" },
        { id: "totalRooms", label: "Rooms", type: "number", width: "80px" },
        { id: "availableRooms", label: "Available", type: "number", width: "90px" },
        { id: "rating", label: "Rating", type: "rating", width: "100px", filterable: false },
        {
            id: "commissionRate",
            label: "Commission",
            type: "number",
            width: "100px",
            filterable: false,
        },
    ];

    const handleActionClick = (action, row) => {
        setSelectedProperty(row);
        if (action === "view") {
            setViewModalOpen(true);
        } else if (action === "edit") {
            setAddModalOpen(true);
        } else if (action === "delete") {
            setDeleteDialogOpen(true);
        }
    };

    const handleAddProperty = (newProperty) => {
        const property = {
            ...newProperty,
            id: data.length + 10,
            status: "approved",
            rating: 0,
            reviewsCount: 0,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setData([...data, property]);
        setAddModalOpen(false);
        setSelectedProperty(null);
    };

    const handleDeleteProperty = () => {
        setData(data.filter((p) => p.id !== selectedProperty.id));
        setDeleteDialogOpen(false);
        setSelectedProperty(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Properties
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage all approved properties
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedProperty(null);
                        setAddModalOpen(true);
                    }}
                >
                    Add Property
                </Button>
            </Box>

            {/* Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <CustomTable
                        data={data.map((p) => ({
                            ...p,
                            commissionRate: `${p.commissionRate}%`,
                        }))}
                        columns={columns}
                        actions={["view", "edit", "delete"]}
                        onActionClick={handleActionClick}
                    />
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <AddPropertyModal
                open={addModalOpen}
                onClose={() => {
                    setAddModalOpen(false);
                    setSelectedProperty(null);
                }}
                onSubmit={handleAddProperty}
                property={selectedProperty}
                owners={owners.filter((o) => o.status === "verified")}
            />

            {/* View Modal */}
            <Dialog
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Property Details</DialogTitle>
                <DialogContent dividers>
                    {selectedProperty && (
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={600}>
                                        {selectedProperty.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                            {selectedProperty.address}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: "right" }}>
                                    <Chip label={selectedProperty.type} color="primary" />
                                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                        <Rating value={selectedProperty.rating} precision={0.1} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({selectedProperty.reviewsCount} reviews)
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedProperty.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Amenities
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selectedProperty.amenities.map((amenity) => (
                                            <Chip key={amenity} label={amenity} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Owner
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.ownerName}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Rooms
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.totalRooms}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Available Rooms
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.availableRooms}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Commission Rate
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.commissionRate}%</Typography>
                                </Grid>

                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Contact Email
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.contactEmail}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Contact Phone
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.contactPhone}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.city}</Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.country}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDeleteProperty}
                title="Delete Property"
                message={`Are you sure you want to delete ${selectedProperty?.name}? This will also remove all associated rooms and bookings.`}
                confirmText="Delete"
                type="error"
            />
        </Box>
    );
}