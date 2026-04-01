import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import ConfirmDialog from "../../components/ConfirmDialog";
import { getPropertyList } from "../../services/propertyService";
import {
  createPropertyAmenity,
  deletePropertyAmenity,
  getPropertyAmenityList,
  updatePropertyAmenity } from
"../../services/propertyAmenityService";

const PropertyAmenitiesPage = () => {
  const theme = useTheme();
  const [amenities, setAmenities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    propertyId: "",
    name: "",
    description: "",
    icon: ""
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [amenitiesRes, propertiesRes] = await Promise.all([
        getPropertyAmenityList({ language: "en" }),
        getPropertyList({ language: "en" })]
        );

        const amenitiesArray = Array.isArray(amenitiesRes) ?
        amenitiesRes :
        amenitiesRes ?
        [amenitiesRes] :
        [];
        const propertiesArray = Array.isArray(propertiesRes) ?
        propertiesRes :
        propertiesRes ?
        [propertiesRes] :
        [];

        if (isMounted) {
          setProperties(propertiesArray);
          setAmenities(
            amenitiesArray.map((item, index) => ({
              id: item?.id || item?.primaryKeyValue || index,
              propertyId: item?.propertyId || "",
              name: item?.name || "",
              description: item?.description || "",
              icon: item?.icon || "",
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

  const handleAddAmenity = async () => {
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        propertyId: formData.propertyId,
        name: formData.name,
        description: formData.description,
        icon: formData.icon
      };
      const response = await createPropertyAmenity(payload, { language: "en" });
      const newAmenity = {
        id: response?.id || response?.primaryKeyValue || amenities.length + 1,
        propertyId: response?.propertyId || formData.propertyId,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };
      setAmenities((prev) => [...prev, newAmenity]);
      setSnackbar({ open: true, message: "Amenity added.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to add amenity.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (amenity) => {
    setSelectedAmenity(amenity);
    setFormData({
      propertyId: amenity.propertyId,
      name: amenity.name,
      description: amenity.description,
      icon: amenity.icon
    });
    setOpenEditModal(true);
  };

  const handleEditAmenity = async () => {
    if (!selectedAmenity) return;
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        propertyId: formData.propertyId,
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        documentNumber: selectedAmenity.documentNumber ?? null,
        isSelected: selectedAmenity.isSelected ?? false,
        version: selectedAmenity.version ?? 0,
        remark: selectedAmenity.remark ?? null,
        id: selectedAmenity.id
      };
      const response = await updatePropertyAmenity(payload, { language: "en" });
      setAmenities((prev) =>
      prev.map((a) =>
      a.id === selectedAmenity.id ?
      {
        ...a,
        propertyId: response?.propertyId || formData.propertyId,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? a.documentNumber,
        isSelected: response?.isSelected ?? a.isSelected,
        version: response?.version ?? a.version,
        remark: response?.remark ?? a.remark
      } :
      a
      )
      );
      setSnackbar({ open: true, message: "Amenity updated.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update amenity.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (amenity) => {
    setSelectedAmenity(amenity);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAmenity = async () => {
    if (!selectedAmenity) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        propertyId: selectedAmenity.propertyId,
        name: selectedAmenity.name,
        description: selectedAmenity.description,
        icon: selectedAmenity.icon,
        documentNumber: selectedAmenity.documentNumber ?? null,
        isSelected: selectedAmenity.isSelected ?? false,
        version: selectedAmenity.version ?? 0,
        remark: selectedAmenity.remark ?? null,
        id: selectedAmenity.id
      };
      await deletePropertyAmenity(payload, { language: "en" });
      setAmenities((prev) => prev.filter((a) => a.id !== selectedAmenity.id));
      setSnackbar({ open: true, message: "Amenity deleted.", severity: "success" });
      setOpenDeleteDialog(false);
      setSelectedAmenity(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete amenity.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ propertyId: "", name: "", description: "", icon: "" });
    setSelectedAmenity(null);
  };

  const getPropertyName = (propertyId) =>
  properties.find((p) => p.id === propertyId)?.name || "Unknown Property";

  return (
    <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Property Amenities
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage amenities by property
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}>

                    Add Amenity
                </Button>
            </Box>

            <Grid container spacing={3}>
                {amenities.map((amenity) =>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={amenity.id}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                                    <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main
                  }}>

                                        <CheckCircleIcon />
                                    </Avatar>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleEditClick(amenity)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteClick(amenity)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {amenity.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {amenity.description || "No description"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {getPropertyName(amenity.propertyId)}
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
                            Add Amenity
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
                                <InputLabel>Property</InputLabel>
                                <Select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleFormChange}
                  label="Property">

                                    {properties.map((property) =>
                  <MenuItem key={property.id} value={property.id}>
                                            {property.name}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange} />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange} />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Icon"
                name="icon"
                value={formData.icon}
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
            onClick={handleAddAmenity}
            disabled={!formData.propertyId || !formData.name || saving}>

                        {saving ? "Saving..." : "Add Amenity"}
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
                            Edit Amenity
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
                                <InputLabel>Property</InputLabel>
                                <Select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleFormChange}
                  label="Property">

                                    {properties.map((property) =>
                  <MenuItem key={property.id} value={property.id}>
                                            {property.name}
                                        </MenuItem>
                  )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange} />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange} />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Icon"
                name="icon"
                value={formData.icon}
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
            onClick={handleEditAmenity}
            disabled={!formData.propertyId || !formData.name || saving}>

                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedAmenity(null);
        }}
        onConfirm={handleDeleteAmenity}
        title="Delete Amenity"
        message={`Are you sure you want to delete "${selectedAmenity?.name}"?`}
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

export default PropertyAmenitiesPage;