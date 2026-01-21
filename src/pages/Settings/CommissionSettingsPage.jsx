import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Slider,
    Divider,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Chip,
    Avatar,
    Card,
    CardContent,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PercentIcon from "@mui/icons-material/Percent";
import HotelIcon from "@mui/icons-material/Hotel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { commissionSettings, properties, bookings } from "../../data/mockData";

const CommissionSettingsPage = () => {
    const theme = useTheme();
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        defaultRate: commissionSettings.defaultRate,
        minimumRate: commissionSettings.minimumRate,
        maximumRate: commissionSettings.maximumRate,
        paymentTerms: commissionSettings.paymentTerms,
    });
    const [propertyRates, setPropertyRates] = useState(commissionSettings.propertyRates);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [editRate, setEditRate] = useState(0);

    // Get approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Calculate commission stats
    // const totalRevenue = bookings
    //     .filter((b) => b.bookingStatus !== "cancelled")
    //     .reduce((sum, b) => sum + b.grandTotal, 0);

    const totalCommission = approvedProperties.reduce((sum, property) => {
        const propertyBookings = bookings.filter(
            (b) => b.propertyId === property.id && b.bookingStatus !== "cancelled"
        );
        const propertyRevenue = propertyBookings.reduce((s, b) => s + b.grandTotal, 0);
        return sum + propertyRevenue * (property.commissionRate / 100);
    }, 0);

    const avgCommissionRate =
        approvedProperties.length > 0
            ? approvedProperties.reduce((sum, p) => sum + p.commissionRate, 0) /
            approvedProperties.length
            : settings.defaultRate;

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    // Handle settings change
    const handleSettingsChange = (name, value) => {
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    // Handle edit property rate
    const handleEditClick = (property) => {
        const rate = propertyRates.find((pr) => pr.propertyId === property.id);
        setSelectedProperty(property);
        setEditRate(rate?.rate || settings.defaultRate);
        setOpenEditModal(true);
    };

    // Save property rate
    const handleSavePropertyRate = () => {
        const existingIndex = propertyRates.findIndex(
            (pr) => pr.propertyId === selectedProperty.id
        );

        if (existingIndex >= 0) {
            setPropertyRates(
                propertyRates.map((pr, index) =>
                    index === existingIndex ? { ...pr, rate: editRate } : pr
                )
            );
        } else {
            setPropertyRates([
                ...propertyRates,
                {
                    propertyId: selectedProperty.id,
                    propertyName: selectedProperty.name,
                    rate: editRate,
                },
            ]);
        }

        setOpenEditModal(false);
        setSelectedProperty(null);
    };

    // Get property rate
    const getPropertyRate = (propertyId) => {
        const rate = propertyRates.find((pr) => pr.propertyId === propertyId);
        return rate?.rate || settings.defaultRate;
    };

    // Handle save all settings
    const handleSaveAll = () => {
        // In real app, save to backend
        setSaved(true);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Commission Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage platform commission rates for properties
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveAll}>
                    Save Changes
                </Button>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    mx: "auto",
                                    mb: 1,
                                }}
                            >
                                <PercentIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {settings.defaultRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Default Rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    color: theme.palette.info.main,
                                    mx: "auto",
                                    mb: 1,
                                }}
                            >
                                <TrendingUpIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="info.main">
                                {avgCommissionRate.toFixed(1)}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Average Rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    color: theme.palette.success.main,
                                    mx: "auto",
                                    mb: 1,
                                }}
                            >
                                <PercentIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                                {formatCurrency(totalCommission)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Commission
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item size={{ sx: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                    color: theme.palette.warning.main,
                                    mx: "auto",
                                    mb: 1,
                                }}
                            >
                                <HotelIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="warning.main">
                                {approvedProperties.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Properties
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Global Settings */}
                <Grid item size={{ sx: 12, lg: 5 }}>
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Global Commission Settings
                        </Typography>

                        {/* Default Rate */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Default Commission Rate
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Applied to new properties by default
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <Slider
                                    value={settings.defaultRate}
                                    onChange={(e, value) => handleSettingsChange("defaultRate", value)}
                                    min={settings.minimumRate}
                                    max={settings.maximumRate}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value}%`}
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    value={settings.defaultRate}
                                    onChange={(e) =>
                                        handleSettingsChange("defaultRate", Number(e.target.value))
                                    }
                                    type="number"
                                    size="small"
                                    sx={{ width: 100 }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{ min: settings.minimumRate, max: settings.maximumRate }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Rate Range */}
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                            Commission Rate Range
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item size={{xs:6}}>
                                <TextField
                                    fullWidth
                                    label="Minimum Rate"
                                    type="number"
                                    value={settings.minimumRate}
                                    onChange={(e) =>
                                        handleSettingsChange("minimumRate", Number(e.target.value))
                                    }
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Grid>
                            <Grid item size={{ sx: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Maximum Rate"
                                    type="number"
                                    value={settings.maximumRate}
                                    onChange={(e) =>
                                        handleSettingsChange("maximumRate", Number(e.target.value))
                                    }
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        {/* Payment Terms */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Payment Terms
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Days after checkout to remit commission
                            </Typography>
                            <TextField
                                fullWidth
                                type="number"
                                value={settings.paymentTerms}
                                onChange={(e) =>
                                    handleSettingsChange("paymentTerms", Number(e.target.value))
                                }
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                                }}
                                inputProps={{ min: 1, max: 90 }}
                            />
                        </Box>
                    </Paper>

                    {/* Info Card */}
                    <Alert
                        severity="info"
                        icon={<InfoOutlinedIcon />}
                        sx={{ borderRadius: 2 }}
                    >
                        <Typography variant="subtitle2" fontWeight={600}>
                            How Commission Works
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Commission is calculated as a percentage of the total booking amount
                            (excluding taxes). Each property can have a custom rate within the
                            defined range. The platform collects commission after guest checkout
                            based on the payment terms.
                        </Typography>
                    </Alert>
                </Grid>

                {/* Property Rates */}
                <Grid item size={{ xs:12, lg:7}}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Property Commission Rates
                        </Typography>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Property</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="center">Commission Rate</TableCell>
                                        <TableCell align="right">Est. Commission</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {approvedProperties.map((property) => {
                                        const rate = getPropertyRate(property.id);
                                        const propertyBookings = bookings.filter(
                                            (b) =>
                                                b.propertyId === property.id &&
                                                b.bookingStatus !== "cancelled"
                                        );
                                        const revenue = propertyBookings.reduce(
                                            (sum, b) => sum + b.grandTotal,
                                            0
                                        );
                                        const commission = revenue * (rate / 100);

                                        return (
                                            <TableRow key={property.id}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                backgroundColor: alpha(
                                                                    theme.palette.primary.main,
                                                                    0.1
                                                                ),
                                                                color: theme.palette.primary.main,
                                                            }}
                                                        >
                                                            <HotelIcon fontSize="small" />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {property.name}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {property.city}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={property.type}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={`${rate}%`}
                                                        size="small"
                                                        color={
                                                            rate === settings.defaultRate
                                                                ? "default"
                                                                : rate > settings.defaultRate
                                                                    ? "success"
                                                                    : "warning"
                                                        }
                                                        sx={{ fontWeight: 600, minWidth: 60 }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        color="success.main"
                                                    >
                                                        {formatCurrency(commission)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditClick(property)}
                                                        sx={{ color: theme.palette.primary.main }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {approvedProperties.length === 0 && (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <HotelIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                                <Typography color="text.secondary">
                                    No approved properties found
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Edit Property Rate Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Commission Rate
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedProperty && (
                        <Box sx={{ mt: 2 }}>
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
                                        backgroundColor: theme.palette.primary.main,
                                    }}
                                >
                                    <HotelIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {selectedProperty.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedProperty.type} • {selectedProperty.city}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                Commission Rate
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <Slider
                                    value={editRate}
                                    onChange={(e, value) => setEditRate(value)}
                                    min={settings.minimumRate}
                                    max={settings.maximumRate}
                                    valueLabelDisplay="auto"
                                    valueLabelFormat={(value) => `${value}%`}
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    value={editRate}
                                    onChange={(e) => setEditRate(Number(e.target.value))}
                                    type="number"
                                    size="small"
                                    sx={{ width: 100 }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{
                                        min: settings.minimumRate,
                                        max: settings.maximumRate,
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                                Range: {settings.minimumRate}% - {settings.maximumRate}%
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSavePropertyRate}>
                        Save Rate
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={saved}
                autoHideDuration={3000}
                onClose={() => setSaved(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSaved(false)} severity="success" variant="filled">
                    Commission settings saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CommissionSettingsPage;