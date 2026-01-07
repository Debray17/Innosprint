import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Avatar,
    IconButton,
    Paper,
    Tabs,
    Tab,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { owners, properties } from "../../data/mockData";

const OwnersListPage = () => {
    const theme = useTheme();
    const [ownersData, setOwnersData] = useState(owners);
    const [selectedTab, setSelectedTab] = useState(0);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    // Filter owners based on tab
    const getFilteredOwners = () => {
        switch (selectedTab) {
            case 0:
                return ownersData; // All
            case 1:
                return ownersData.filter((o) => o.status === "verified");
            case 2:
                return ownersData.filter((o) => o.status === "pending");
            case 3:
                return ownersData.filter((o) => o.status === "rejected");
            default:
                return ownersData;
        }
    };

    // Get owner's properties
    const getOwnerProperties = (ownerId) => {
        return properties.filter((p) => p.ownerId === ownerId);
    };

    // Table columns
    const columns = [
        {
            id: "name",
            label: "Owner",
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
            id: "propertiesCount",
            label: "Properties",
            type: "text",
            width: "100px",
            filterable: false,
        },
        {
            id: "totalRevenue",
            label: "Total Revenue",
            type: "currency",
            width: "150px",
            filterable: false,
        },
        {
            id: "status",
            label: "Status",
            type: "status",
            options: ["verified", "pending", "rejected"],
            width: "120px",
        },
        {
            id: "joinedDate",
            label: "Joined",
            type: "date",
            width: "120px",
            filterable: false,
        },
    ];

    // Actions for table
    const getActions = () => {
        return ["view", "edit", "delete"];
    };

    // Handle action clicks
    const handleActionClick = (action, owner) => {
        setSelectedOwner(owner);
        switch (action) {
            case "view":
                setOpenViewModal(true);
                break;
            case "edit":
                setFormData({
                    name: owner.name,
                    email: owner.email,
                    phone: owner.phone,
                    address: owner.address,
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

    // Handle add owner
    const handleAddOwner = () => {
        const newOwner = {
            id: ownersData.length + 1,
            ...formData,
            avatar: null,
            status: "pending",
            documentsSubmitted: false,
            documentUrl: null,
            propertiesCount: 0,
            totalRevenue: 0,
            joinedDate: new Date().toISOString().split("T")[0],
        };
        setOwnersData([...ownersData, newOwner]);
        setOpenAddModal(false);
        resetForm();
    };

    // Handle edit owner
    const handleEditOwner = () => {
        setOwnersData(
            ownersData.map((o) =>
                o.id === selectedOwner.id ? { ...o, ...formData } : o
            )
        );
        setOpenEditModal(false);
        resetForm();
    };

    // Handle delete owner
    const handleDeleteOwner = () => {
        setOwnersData(ownersData.filter((o) => o.id !== selectedOwner.id));
        setOpenDeleteDialog(false);
        setSelectedOwner(null);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
        setSelectedOwner(null);
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
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Counts for tabs
    const counts = {
        all: ownersData.length,
        verified: ownersData.filter((o) => o.status === "verified").length,
        pending: ownersData.filter((o) => o.status === "pending").length,
        rejected: ownersData.filter((o) => o.status === "rejected").length,
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Property Owners
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage property owners and their accounts
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddModal(true)}
                >
                    Add Owner
                </Button>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(e, newValue) => setSelectedTab(newValue)}
                    sx={{ px: 2 }}
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
                                Verified
                                <Chip label={counts.verified} size="small" color="success" />
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
                                Rejected
                                <Chip label={counts.rejected} size="small" color="error" />
                            </Box>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Table */}
            <CustomTable
                data={getFilteredOwners()}
                columns={columns}
                actions={getActions()}
                onActionClick={handleActionClick}
            />

            {/* Add Owner Modal */}
            <Dialog
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Add New Owner
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
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
                    </Grid>
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
                        onClick={handleAddOwner}
                        disabled={!formData.name || !formData.email || !formData.phone}
                    >
                        Add Owner
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Owner Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Owner
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
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
                    </Grid>
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
                        onClick={handleEditOwner}
                        disabled={!formData.name || !formData.email || !formData.phone}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Owner Modal */}
            <Dialog
                open={openViewModal}
                onClose={() => {
                    setOpenViewModal(false);
                    setSelectedOwner(null);
                }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Owner Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedOwner && (
                        <Grid container spacing={3}>
                            {/* Owner Info */}
                            <Grid item xs={12} md={4}>
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            mx: "auto",
                                            mb: 2,
                                            backgroundColor: theme.palette.primary.main,
                                            fontSize: 32,
                                        }}
                                    >
                                        {selectedOwner.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedOwner.name}
                                    </Typography>
                                    <Chip
                                        label={selectedOwner.status}
                                        color={
                                            selectedOwner.status === "verified"
                                                ? "success"
                                                : selectedOwner.status === "pending"
                                                    ? "warning"
                                                    : "error"
                                        }
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Paper>
                            </Grid>

                            {/* Contact & Stats */}
                            <Grid item xs={12} md={8}>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Contact Information
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <EmailIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Email"
                                            secondary={selectedOwner.email}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PhoneIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Phone"
                                            secondary={selectedOwner.phone}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOnIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Address"
                                            secondary={selectedOwner.address}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CalendarTodayIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Joined Date"
                                            secondary={formatDate(selectedOwner.joinedDate)}
                                        />
                                    </ListItem>
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Statistics
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, textAlign: "center" }}>
                                            <ApartmentIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                                            <Typography variant="h5" fontWeight={600}>
                                                {selectedOwner.propertiesCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Properties
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper sx={{ p: 2, textAlign: "center" }}>
                                            <AttachMoneyIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                                            <Typography variant="h5" fontWeight={600}>
                                                {formatCurrency(selectedOwner.totalRevenue)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Revenue
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Owner's Properties */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                                    Properties ({getOwnerProperties(selectedOwner.id).length})
                                </Typography>
                                {getOwnerProperties(selectedOwner.id).length > 0 ? (
                                    <Grid container spacing={2}>
                                        {getOwnerProperties(selectedOwner.id).map((property) => (
                                            <Grid item xs={12} sm={6} key={property.id}>
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            backgroundColor: alpha(
                                                                theme.palette.primary.main,
                                                                0.1
                                                            ),
                                                            color: theme.palette.primary.main,
                                                        }}
                                                    >
                                                        <ApartmentIcon />
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {property.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {property.type} • {property.city}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={property.status}
                                                        color={
                                                            property.status === "approved"
                                                                ? "success"
                                                                : property.status === "pending"
                                                                    ? "warning"
                                                                    : "error"
                                                        }
                                                        size="small"
                                                    />
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: "center" }}>
                                        <Typography color="text.secondary">
                                            No properties registered
                                        </Typography>
                                    </Paper>
                                )}
                            </Grid>

                            {/* Documents */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                                    Documents
                                </Typography>
                                {selectedOwner.documentsSubmitted ? (
                                    <Paper
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                                color: theme.palette.success.main,
                                            }}
                                        >
                                            <DescriptionIcon />
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight={500}>
                                                Business License
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Submitted on {formatDate(selectedOwner.joinedDate)}
                                            </Typography>
                                        </Box>
                                        <Button variant="outlined" size="small">
                                            View Document
                                        </Button>
                                    </Paper>
                                ) : (
                                    <Paper
                                        sx={{
                                            p: 3,
                                            textAlign: "center",
                                            backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                        }}
                                    >
                                        <CloudUploadIcon
                                            sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 1 }}
                                        />
                                        <Typography color="text.secondary">
                                            No documents submitted yet
                                        </Typography>
                                    </Paper>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedOwner(null);
                }}
                onConfirm={handleDeleteOwner}
                title="Delete Owner"
                message={`Are you sure you want to delete "${selectedOwner?.name}"? This action cannot be undone and will also remove all associated data.`}
                confirmText="Delete"
                type="danger"
            />
        </Box>
    );
};

export default OwnersListPage;