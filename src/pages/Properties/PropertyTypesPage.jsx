import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Card, CardContent, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Divider, Snackbar, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelIcon from "@mui/icons-material/Hotel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import VillaIcon from "@mui/icons-material/Villa";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HouseIcon from "@mui/icons-material/House";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import ConfirmDialog from "../../components/ConfirmDialog";
import { propertyTypes, properties } from "../../data/mockData";
import {
  createPropertyType,
  deletePropertyType,
  getPropertyTypeList,
  updatePropertyType } from
"../../services/propertyTypeService";

const iconMap = {
  hotel: HotelIcon,
  beach: BeachAccessIcon,
  villa: VillaIcon,
  apartment: ApartmentIcon,
  house: HouseIcon,
  hostel: MeetingRoomIcon,
  default: ApartmentIcon
};

const availableIcons = [
{ name: "hotel", icon: HotelIcon, label: "Hotel" },
{ name: "beach", icon: BeachAccessIcon, label: "Resort" },
{ name: "villa", icon: VillaIcon, label: "Villa" },
{ name: "apartment", icon: ApartmentIcon, label: "Apartment" },
{ name: "house", icon: HouseIcon, label: "Guest House" },
{ name: "hostel", icon: MeetingRoomIcon, label: "Hostel" }];


const PropertyTypesPage = () => {
  const theme = useTheme();
  const [typesData, setTypesData] = useState(propertyTypes);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [savingType, setSavingType] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "hotel"
  });

  const getPropertiesCount = (typeName) =>
  properties.filter((p) => p.type === typeName).length;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (iconName) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTypes = async () => {
      try {
        const response = await getPropertyTypeList({ language: "en" });
        const typesArray = Array.isArray(response) ? response : response ? [response] : [];
        if (isMounted && typesArray.length > 0) {
          const mapped = typesArray.map((type, index) => ({
            id: type?.id || type?.primaryKeyValue || index,
            name: type?.name || "Unknown",
            description: type?.description || "",
            icon: type?.icon || "default",
            documentNumber: type?.documentNumber ?? null,
            isSelected: type?.isSelected ?? false,
            version: type?.version ?? 0,
            remark: type?.remark ?? null
          }));
          setTypesData(mapped);
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddType = async () => {
    setSavingType(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        description: formData.description,
        icon: formData.icon
      };

      const response = await createPropertyType(payload, { language: "en" });

      const newType = {
        id: response?.id || response?.primaryKeyValue || typesData.length + 1,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };

      setTypesData((prev) => [...prev, newType]);
      setSnackbar({ open: true, message: "Property type added.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to add property type.",
        severity: "error"
      });
    } finally {
      setSavingType(false);
    }
  };

  const handleEditClick = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      icon: type.icon || "hotel"
    });
    setOpenEditModal(true);
  };

  const handleEditType = async () => {
    if (!selectedType) return;
    setSavingType(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        documentNumber: selectedType.documentNumber ?? null,
        isSelected: selectedType.isSelected ?? false,
        version: selectedType.version ?? 0,
        remark: selectedType.remark ?? null,
        id: selectedType.id
      };
      const response = await updatePropertyType(payload, { language: "en" });

      setTypesData((prev) =>
      prev.map((t) =>
      t.id === selectedType.id ?
      {
        ...t,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? t.documentNumber,
        isSelected: response?.isSelected ?? t.isSelected,
        version: response?.version ?? t.version,
        remark: response?.remark ?? t.remark
      } :
      t
      )
      );
      setSnackbar({ open: true, message: "Property type updated.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update property type.",
        severity: "error"
      });
    } finally {
      setSavingType(false);
    }
  };

  const handleDeleteClick = (type) => {
    setSelectedType(type);
    setOpenDeleteDialog(true);
  };

  const handleDeleteType = async () => {
    if (!selectedType) return;
    setSavingType(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        name: selectedType.name,
        description: selectedType.description,
        icon: selectedType.icon,
        documentNumber: selectedType.documentNumber ?? null,
        isSelected: selectedType.isSelected ?? false,
        version: selectedType.version ?? 0,
        remark: selectedType.remark ?? null,
        id: selectedType.id
      };
      await deletePropertyType(payload, { language: "en" });
      setTypesData((prev) => prev.filter((t) => t.id !== selectedType.id));
      setSnackbar({ open: true, message: "Property type deleted.", severity: "success" });
      setOpenDeleteDialog(false);
      setSelectedType(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete property type.",
        severity: "error"
      });
    } finally {
      setSavingType(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "hotel"
    });
    setSelectedType(null);
  };

  const PropertyTypeCard = ({ type }) => {
    const IconComponent = iconMap[type.icon] || iconMap.default;
    const count = getPropertiesCount(type.name);

    return (
      <Card
        sx={{
          height: "100%",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
          }
        }}>

                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}>

                            <IconComponent sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                            <IconButton
                size="small"
                onClick={() => handleEditClick(type)}
                sx={{ color: theme.palette.primary.main }}>

                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                size="small"
                onClick={() => handleDeleteClick(type)}
                sx={{ color: theme.palette.error.main }}>

                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        {type.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {type.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                        {count} properties
                    </Typography>
                </CardContent>
            </Card>);

  };

  return (
    <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Property Types
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage available property categories
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}>

                    Add Type
                </Button>
            </Box>

            <Grid container spacing={3}>
                {typesData.map((type) =>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={type.id}>
                        <PropertyTypeCard type={type} />
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
                            Add Property Type
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={2} />

                        </Grid>
                        <Grid size={12}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Icon
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {availableIcons.map((item) => {
                  const IconComponent = item.icon;
                  const selected = formData.icon === item.name;
                  return (
                    <Button
                      key={item.name}
                      variant={selected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleIconSelect(item.name)}
                      startIcon={<IconComponent />}>

                                            {item.label}
                                        </Button>);

                })}
                            </Box>
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
            onClick={handleAddType}
            disabled={!formData.name || savingType}>

                        {savingType ? "Saving..." : "Add Type"}
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
                            Edit Property Type
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={2} />

                        </Grid>
                        <Grid size={12}>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                Icon
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {availableIcons.map((item) => {
                  const IconComponent = item.icon;
                  const selected = formData.icon === item.name;
                  return (
                    <Button
                      key={item.name}
                      variant={selected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleIconSelect(item.name)}
                      startIcon={<IconComponent />}>

                                            {item.label}
                                        </Button>);

                })}
                            </Box>
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
                        <Button variant="contained" onClick={handleEditType} disabled={!formData.name || savingType}>
                            {savingType ? "Saving..." : "Save Changes"}
                        </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedType(null);
        }}
        onConfirm={handleDeleteType}
        title="Delete Property Type"
        message={`Are you sure you want to delete "${selectedType?.name}"?`}
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

export default PropertyTypesPage;