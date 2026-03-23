import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Alert, Snackbar, Card, CardContent, Slider } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import ConfirmDialog from "../../components/ConfirmDialog";
import { seasons } from "../../data/mockData";
import {
  createSeasonalPricing,
  deleteSeasonalPricing,
  getSeasonalPricingList,
  updateSeasonalPricing } from
"../../services/seasonalPricingService";

const SeasonalPricingPage = () => {
  const theme = useTheme();
  const [seasonsData, setSeasonsData] = useState(seasons);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    priceMultiplier: 1.0
  });

  useEffect(() => {
    let isMounted = true;

    const fetchSeasons = async () => {
      try {
        const response = await getSeasonalPricingList({ language: "en" });
        const seasonsArray = Array.isArray(response) ? response : response ? [response] : [];
        if (isMounted && seasonsArray.length > 0) {
          setSeasonsData(
            seasonsArray.map((season, index) => ({
              id: season?.id || season?.primaryKeyValue || index,
              name: season?.name || "",
              startDate: season?.startDate || "",
              endDate: season?.endDate || "",
              priceMultiplier: season?.priceMultiplier ?? 1,
              documentNumber: season?.documentNumber ?? null,
              isSelected: season?.isSelected ?? false,
              version: season?.version ?? 0,
              remark: season?.remark ?? null
            }))
          );
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchSeasons();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiplier change
  const handleMultiplierChange = (event, value) => {
    setFormData((prev) => ({ ...prev, priceMultiplier: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      startDate: "",
      endDate: "",
      priceMultiplier: 1.0
    });
    setSelectedSeason(null);
  };

  // Handle add season
  const handleAddSeason = async () => {
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priceMultiplier: Number(formData.priceMultiplier) || 1
      };
      const response = await createSeasonalPricing(payload, { language: "en" });
      const newSeason = {
        id: response?.id || response?.primaryKeyValue || seasonsData.length + 1,
        name: response?.name || formData.name,
        startDate: response?.startDate || formData.startDate,
        endDate: response?.endDate || formData.endDate,
        priceMultiplier: response?.priceMultiplier ?? formData.priceMultiplier,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };
      setSeasonsData((prev) => [...prev, newSeason]);
      setSnackbar({ open: true, message: "Season added.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to add season.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit click
  const handleEditClick = (season) => {
    setSelectedSeason(season);
    setFormData({
      name: season.name,
      startDate: season.startDate,
      endDate: season.endDate,
      priceMultiplier: season.priceMultiplier
    });
    setOpenEditModal(true);
  };

  // Handle edit season
  const handleEditSeason = async () => {
    if (!selectedSeason) return;
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        priceMultiplier: Number(formData.priceMultiplier) || 1,
        documentNumber: selectedSeason.documentNumber ?? null,
        isSelected: selectedSeason.isSelected ?? false,
        version: selectedSeason.version ?? 0,
        remark: selectedSeason.remark ?? null,
        id: selectedSeason.id
      };
      const response = await updateSeasonalPricing(payload, { language: "en" });
      setSeasonsData((prev) =>
      prev.map((s) =>
      s.id === selectedSeason.id ?
      {
        ...s,
        name: response?.name || formData.name,
        startDate: response?.startDate || formData.startDate,
        endDate: response?.endDate || formData.endDate,
        priceMultiplier: response?.priceMultiplier ?? formData.priceMultiplier,
        documentNumber: response?.documentNumber ?? s.documentNumber,
        isSelected: response?.isSelected ?? s.isSelected,
        version: response?.version ?? s.version,
        remark: response?.remark ?? s.remark
      } :
      s
      )
      );
      setSnackbar({ open: true, message: "Season updated.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update season.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (season) => {
    setSelectedSeason(season);
    setOpenDeleteDialog(true);
  };

  // Handle delete season
  const handleDeleteSeason = async () => {
    if (!selectedSeason) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        name: selectedSeason.name,
        startDate: selectedSeason.startDate,
        endDate: selectedSeason.endDate,
        priceMultiplier: selectedSeason.priceMultiplier,
        documentNumber: selectedSeason.documentNumber ?? null,
        isSelected: selectedSeason.isSelected ?? false,
        version: selectedSeason.version ?? 0,
        remark: selectedSeason.remark ?? null,
        id: selectedSeason.id
      };
      await deleteSeasonalPricing(payload, { language: "en" });
      setSeasonsData((prev) => prev.filter((s) => s.id !== selectedSeason.id));
      setSnackbar({ open: true, message: "Season deleted.", severity: "success" });
      setOpenDeleteDialog(false);
      setSelectedSeason(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete season.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get multiplier color
  const getMultiplierColor = (multiplier) => {
    if (multiplier > 1) return theme.palette.success.main;
    if (multiplier < 1) return theme.palette.error.main;
    return theme.palette.info.main;
  };

  // Get multiplier chip color
  const getMultiplierChipColor = (multiplier) => {
    if (multiplier > 1) return "success";
    if (multiplier < 1) return "error";
    return "info";
  };

  // Calculate price change percentage
  const getPriceChange = (multiplier) => {
    const change = (multiplier - 1) * 100;
    return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  // Season Form Component
  const SeasonForm = () =>
  <Box>
            <TextField
      fullWidth
      label="Season Name"
      name="name"
      value={formData.name}
      onChange={handleFormChange}
      required
      placeholder="e.g., Peak Season, Holiday Season"
      sx={{ mb: 2 }} />


            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleFormChange}
          InputLabelProps={{ shrink: true }}
          required />

                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleFormChange}
          InputLabelProps={{ shrink: true }}
          required />

                </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Price Multiplier
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Adjust prices for this season (1.0 = regular price)
            </Typography>

            <Box sx={{ px: 2 }}>
                <Slider
        value={formData.priceMultiplier}
        onChange={handleMultiplierChange}
        min={0.5}
        max={2.5}
        step={0.1}
        marks={[
        { value: 0.5, label: "0.5x" },
        { value: 1, label: "1x" },
        { value: 1.5, label: "1.5x" },
        { value: 2, label: "2x" },
        { value: 2.5, label: "2.5x" }]
        }
        valueLabelDisplay="on"
        valueLabelFormat={(value) => `${value}x`}
        sx={{
          "& .MuiSlider-valueLabel": {
            backgroundColor: getMultiplierColor(formData.priceMultiplier)
          }
        }} />

            </Box>

            <Box
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 2,
        backgroundColor: alpha(getMultiplierColor(formData.priceMultiplier), 0.1),
        border: `1px solid ${alpha(getMultiplierColor(formData.priceMultiplier), 0.3)}`
      }}>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Price Adjustment
                        </Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: getMultiplierColor(formData.priceMultiplier) }}>
                            {getPriceChange(formData.priceMultiplier)}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body2" color="text.secondary">
                            Example: Nu 100 room becomes
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            Nu {(100 * formData.priceMultiplier).toFixed(0)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>;


  return (
    <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Seasonal Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configure price adjustments for different seasons
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}>

                    Add Season
                </Button>
            </Box>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                    Seasonal pricing allows you to automatically adjust room prices based on demand.
                    Set multipliers above 1.0 for high-demand periods and below 1.0 for off-peak seasons.
                    These settings apply to all properties and rooms.
                </Typography>
            </Alert>

            {/* Stats Summary */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item md={3} xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mx: "auto",
                  mb: 1
                }}>

                                <DateRangeIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                {seasonsData.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Seasons Configured
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mx: "auto",
                  mb: 1
                }}>

                                <TrendingUpIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="success.main">
                                {seasonsData.filter((s) => s.priceMultiplier > 1).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Peak Seasons
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  mx: "auto",
                  mb: 1
                }}>

                                <TrendingDownIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="error.main">
                                {seasonsData.filter((s) => s.priceMultiplier < 1).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Off Seasons
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={3} xs={12} sm={6}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                  mx: "auto",
                  mb: 1
                }}>

                                <CalendarTodayIcon />
                            </Avatar>
                            <Typography variant="h4" fontWeight={700} color="info.main">
                                {seasonsData.filter((s) => s.priceMultiplier === 1).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Regular Seasons
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Seasons Table */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Configured Seasons
                </Typography>

                {seasonsData.length > 0 ?
        <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Season Name</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell align="center">Multiplier</TableCell>
                                    <TableCell align="center">Price Change</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {seasonsData.map((season) =>
              <TableRow key={season.id}>
                                        <TableCell>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: alpha(
                          getMultiplierColor(season.priceMultiplier),
                          0.1
                        ),
                        color: getMultiplierColor(season.priceMultiplier)
                      }}>

                                                    {season.priceMultiplier > 1 ?
                      <TrendingUpIcon fontSize="small" /> :
                      season.priceMultiplier < 1 ?
                      <TrendingDownIcon fontSize="small" /> :

                      <DateRangeIcon fontSize="small" />
                      }
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {season.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{formatDate(season.startDate)}</TableCell>
                                        <TableCell>{formatDate(season.endDate)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                    label={`${season.priceMultiplier}x`}
                    color={getMultiplierChipColor(season.priceMultiplier)}
                    size="small"
                    sx={{ fontWeight: 600, minWidth: 60 }} />

                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: getMultiplierColor(season.priceMultiplier)
                    }}>

                                                {getPriceChange(season.priceMultiplier)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                    size="small"
                    onClick={() => handleEditClick(season)}
                    sx={{ color: theme.palette.primary.main }}>

                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(season)}
                    sx={{ color: theme.palette.error.main }}>

                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
              )}
                            </TableBody>
                        </Table>
                    </TableContainer> :

        <Box sx={{ textAlign: "center", py: 6 }}>
                        <DateRangeIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No Seasons Configured
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Add seasonal pricing to adjust room rates automatically.
                        </Typography>
                        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}>

                            Add First Season
                        </Button>
                    </Box>
        }
            </Paper>

            {/* Add Season Modal */}
            <Dialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Add Season
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {SeasonForm()}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
            variant="outlined"
            onClick={() => {
              setOpenAddModal(false);
              resetForm();
            }}>

                        Cancel
                    </Button>
                    <Button
            variant="contained"
            onClick={handleAddSeason}
            disabled={!formData.name || !formData.startDate || !formData.endDate || saving}>

                        {saving ? "Saving..." : "Add Season"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Season Modal */}
            <Dialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          resetForm();
        }}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Season
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {SeasonForm()}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
            variant="outlined"
            onClick={() => {
              setOpenEditModal(false);
              resetForm();
            }}>

                        Cancel
                    </Button>
                    <Button
            variant="contained"
            onClick={handleEditSeason}
            disabled={!formData.name || !formData.startDate || !formData.endDate || saving}>

                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedSeason(null);
        }}
        onConfirm={handleDeleteSeason}
        title="Delete Season"
        message={`Are you sure you want to delete "${selectedSeason?.name}"? This will remove the seasonal pricing configuration.`}
        confirmText="Delete"
        type="danger" />


            {/* Success Snackbar */}
            <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>

                <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled">

                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>);

};

export default SeasonalPricingPage;