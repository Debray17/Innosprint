import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import ConfirmDialog from "../../components/ConfirmDialog";
import { getRoomList } from "../../services/roomService";
import { getSeasonalPricingList } from "../../services/seasonalPricingService";
import {
  createRoomSeasonalPricing,
  deleteRoomSeasonalPricing,
  getRoomSeasonalPricingList,
  updateRoomSeasonalPricing } from
"../../services/roomSeasonalPricingService";

const RoomSeasonalPricingPage = () => {
  const theme = useTheme();
  const [entries, setEntries] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    roomId: "",
    seasonalPricingId: "",
    price: ""
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [entriesRes, roomsRes, seasonsRes] = await Promise.all([
        getRoomSeasonalPricingList({ language: "en" }),
        getRoomList({ language: "en" }),
        getSeasonalPricingList({ language: "en" })]
        );

        const entriesArray = Array.isArray(entriesRes) ?
        entriesRes :
        entriesRes ?
        [entriesRes] :
        [];
        const roomsArray = Array.isArray(roomsRes) ?
        roomsRes :
        roomsRes ?
        [roomsRes] :
        [];
        const seasonsArray = Array.isArray(seasonsRes) ?
        seasonsRes :
        seasonsRes ?
        [seasonsRes] :
        [];

        if (isMounted) {
          setRooms(roomsArray);
          setSeasons(seasonsArray);
          setEntries(
            entriesArray.map((item, index) => ({
              id: item?.id || item?.primaryKeyValue || index,
              roomId: item?.roomId || "",
              seasonalPricingId: item?.seasonalPricingId || "",
              price: item?.price ?? 0,
              documentNumber: item?.documentNumber ?? null,
              isSelected: item?.isSelected ?? false,
              version: item?.version ?? 0,
              remark: item?.remark ?? null
            }))
          );
        }
      } catch (err) {

        // Keep empty state on error.
      }};

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ roomId: "", seasonalPricingId: "", price: "" });
    setSelectedEntry(null);
  };

  const handleAddEntry = async () => {
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        roomId: formData.roomId,
        seasonalPricingId: formData.seasonalPricingId,
        price: Number(formData.price) || 0
      };
      const response = await createRoomSeasonalPricing(payload, { language: "en" });
      const newEntry = {
        id: response?.id || response?.primaryKeyValue || entries.length + 1,
        roomId: response?.roomId || formData.roomId,
        seasonalPricingId: response?.seasonalPricingId || formData.seasonalPricingId,
        price: response?.price ?? (Number(formData.price) || 0),
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };
      setEntries((prev) => [...prev, newEntry]);
      setSnackbar({ open: true, message: "Seasonal pricing added.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to add seasonal pricing.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setFormData({
      roomId: entry.roomId,
      seasonalPricingId: entry.seasonalPricingId,
      price: entry.price
    });
    setOpenEditModal(true);
  };

  const handleEditEntry = async () => {
    if (!selectedEntry) return;
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        roomId: formData.roomId,
        seasonalPricingId: formData.seasonalPricingId,
        price: Number(formData.price) || 0,
        documentNumber: selectedEntry.documentNumber ?? null,
        isSelected: selectedEntry.isSelected ?? false,
        version: selectedEntry.version ?? 0,
        remark: selectedEntry.remark ?? null,
        id: selectedEntry.id
      };
      const response = await updateRoomSeasonalPricing(payload, { language: "en" });
      setEntries((prev) =>
      prev.map((e) =>
      e.id === selectedEntry.id ?
      {
        ...e,
        roomId: response?.roomId || formData.roomId,
        seasonalPricingId:
        response?.seasonalPricingId || formData.seasonalPricingId,
        price: response?.price ?? (Number(formData.price) || 0),
        documentNumber: response?.documentNumber ?? e.documentNumber,
        isSelected: response?.isSelected ?? e.isSelected,
        version: response?.version ?? e.version,
        remark: response?.remark ?? e.remark
      } :
      e
      )
      );
      setSnackbar({ open: true, message: "Seasonal pricing updated.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update seasonal pricing.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (entry) => {
    setSelectedEntry(entry);
    setOpenDeleteDialog(true);
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        roomId: selectedEntry.roomId,
        seasonalPricingId: selectedEntry.seasonalPricingId,
        price: selectedEntry.price ?? 0,
        documentNumber: selectedEntry.documentNumber ?? null,
        isSelected: selectedEntry.isSelected ?? false,
        version: selectedEntry.version ?? 0,
        remark: selectedEntry.remark ?? null,
        id: selectedEntry.id
      };
      await deleteRoomSeasonalPricing(payload, { language: "en" });
      setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
      setSnackbar({ open: true, message: "Seasonal pricing deleted.", severity: "success" });
      setOpenDeleteDialog(false);
      setSelectedEntry(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete seasonal pricing.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoomLabel = (roomId) => rooms.find((r) => r.id === roomId)?.roomNo || "Unknown Room";
  const getSeasonLabel = (seasonalPricingId) =>
  seasons.find((s) => s.id === seasonalPricingId)?.name || "Unknown Season";

  return (
    <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Room Seasonal Pricing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Assign seasonal pricing to rooms
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>
                    Add Seasonal Pricing
                </Button>
            </Box>

            <Grid container spacing={3}>
                {entries.map((entry) =>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2
                }}>

                                    <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}>

                                        <MonetizationOnIcon />
                                    </Avatar>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleEditClick(entry)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteClick(entry)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {getSeasonLabel(entry.seasonalPricingId)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Room {getRoomLabel(entry.roomId)}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    ${Number(entry.price || 0).toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
        )}
            </Grid>

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
                            Add Seasonal Pricing
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <FormControl fullWidth>
                                <InputLabel>Room</InputLabel>
                                <Select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleFormChange}
                  label="Room">

                                    {rooms.map((room) =>
                  <MenuItem key={room.id} value={room.id}>
                                            {room.roomNo}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <FormControl fullWidth>
                                <InputLabel>Season</InputLabel>
                                <Select
                  name="seasonalPricingId"
                  value={formData.seasonalPricingId}
                  onChange={handleFormChange}
                  label="Season">

                                    {seasons.map((season) =>
                  <MenuItem key={season.id} value={season.id}>
                                            {season.name}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange} />

                        </Grid>
                    </Grid>
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
            onClick={handleAddEntry}
            disabled={!formData.roomId || !formData.seasonalPricingId || saving}>

                        {saving ? "Saving..." : "Add Pricing"}
                    </Button>
                </DialogActions>
            </Dialog>

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
                            Edit Seasonal Pricing
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <FormControl fullWidth>
                                <InputLabel>Room</InputLabel>
                                <Select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleFormChange}
                  label="Room">

                                    {rooms.map((room) =>
                  <MenuItem key={room.id} value={room.id}>
                                            {room.roomNo}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <FormControl fullWidth>
                                <InputLabel>Season</InputLabel>
                                <Select
                  name="seasonalPricingId"
                  value={formData.seasonalPricingId}
                  onChange={handleFormChange}
                  label="Season">

                                    {seasons.map((season) =>
                  <MenuItem key={season.id} value={season.id}>
                                            {season.name}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleFormChange} />

                        </Grid>
                    </Grid>
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
            onClick={handleEditEntry}
            disabled={!formData.roomId || !formData.seasonalPricingId || saving}>

                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedEntry(null);
        }}
        onConfirm={handleDeleteEntry}
        title="Delete Seasonal Pricing"
        message={`Are you sure you want to delete seasonal pricing for ${getSeasonLabel(
          selectedEntry?.seasonalPricingId
        )}?`}
        confirmText="Delete"
        type="danger" />


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

export default RoomSeasonalPricingPage;