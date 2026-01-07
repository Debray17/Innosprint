import React, { useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Chip,
    Divider,
    Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { properties } from "../../data/mockData";

export default function PropertyRequestsPage() {
    const [data, setData] = useState(properties.filter((p) => p.status === "pending"));
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
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
        { id: "createdAt", label: "Submitted", type: "date", width: "120px" },
    ];

    const handleActionClick = (action, row) => {
        setSelectedProperty(row);
        if (action === "view") {
            setViewModalOpen(true);
        } else if (action === "approve") {
            setApproveDialogOpen(true);
        } else if (action === "reject") {
            setRejectDialogOpen(true);
        }
    };

    const handleApprove = () => {
        setData(data.filter((p) => p.id !== selectedProperty.id));
        setApproveDialogOpen(false);
        setSelectedProperty(null);
    };

    const handleReject = () => {
        setData(data.filter((p) => p.id !== selectedProperty.id));
        setRejectDialogOpen(false);
        setSelectedProperty(null);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Property Registration Requests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Review and approve new property registrations
                    </Typography>
                </Box>
                <Chip
                    label={`${data.length} Pending`}
                    color="warning"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                />
            </Box>

            {data.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                        <Typography variant="h6" color="text.secondary">
                            No pending property requests
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            All property registrations have been processed
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <CustomTable
                            data={data}
                            columns={columns}
                            actions={["view", "approve", "reject"]}
                            onActionClick={handleActionClick}
                        />
                    </CardContent>
                </Card>
            )}

            {/* View Modal */}
            <Dialog
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Property Registration Request</DialogTitle>
                <DialogContent dividers>
                    {selectedProperty && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                This property is pending approval. Please review all details before making a decision.
                            </Alert>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" fontWeight={600}>
                                    {selectedProperty.name}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                    <LocationOnIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                        {selectedProperty.address}
                                    </Typography>
                                </Box>
                                <Chip label={selectedProperty.type} color="primary" size="small" sx={{ mt: 1 }} />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedProperty.description}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
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
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setViewModalOpen(false)} color="inherit">
                        Close
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setViewModalOpen(false);
                            setRejectDialogOpen(true);
                        }}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            setViewModalOpen(false);
                            setApproveDialogOpen(true);
                        }}
                    >
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Approve Dialog */}
            <ConfirmDialog
                open={approveDialogOpen}
                onClose={() => setApproveDialogOpen(false)}
                onConfirm={handleApprove}
                title="Approve Property"
                message={`Are you sure you want to approve "${selectedProperty?.name}"? It will be visible to guests for booking.`}
                confirmText="Approve"
                type="success"
            />

            {/* Reject Dialog */}
            <ConfirmDialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                onConfirm={handleReject}
                title="Reject Property"
                message={`Are you sure you want to reject "${selectedProperty?.name}"? The owner will be notified.`}
                confirmText="Reject"
                type="error"
            />
        </Box>
    );
}