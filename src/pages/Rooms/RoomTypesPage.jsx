import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Card, CardContent, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Divider, InputAdornment } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import KingBedIcon from "@mui/icons-material/KingBed";
import BedIcon from "@mui/icons-material/Bed";
import WeekendIcon from "@mui/icons-material/Weekend";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ApartmentIcon from "@mui/icons-material/Apartment";
import VillaIcon from "@mui/icons-material/Villa";
import PeopleIcon from "@mui/icons-material/People";

import ConfirmDialog from "../../components/ConfirmDialog";
import { roomTypes, rooms } from "../../data/mockData";
import {
  createRoomType,
  deleteRoomType,
  getRoomTypeList,
  updateRoomType } from
"../../services/roomTypeService";

// Icon mapping
const iconMap = {
  single: SingleBedIcon,
  double: KingBedIcon,
  twin: BedIcon,
  suite: WeekendIcon,
  family: FamilyRestroomIcon,
  dorm: MeetingRoomIcon,
  penthouse: VillaIcon,
  default: ApartmentIcon
};

// Available icons for selection
const availableIcons = [
{ name: "single", icon: SingleBedIcon, label: "Single" },
{ name: "double", icon: KingBedIcon, label: "Double" },
{ name: "twin", icon: BedIcon, label: "Twin" },
{ name: "suite", icon: WeekendIcon, label: "Suite" },
{ name: "family", icon: FamilyRestroomIcon, label: "Family" },
{ name: "dorm", icon: MeetingRoomIcon, label: "Dormitory" },
{ name: "penthouse", icon: VillaIcon, label: "Penthouse" }];


const RoomTypesPage = () => {
  const theme = useTheme();
  const [typesData, setTypesData] = useState(roomTypes);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [savingType, setSavingType] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    baseCapacity: 2,
    icon: "double"
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRoomTypes = async () => {
      try {
        const response = await getRoomTypeList({ language: "en" });
        const typesArray = Array.isArray(response) ? response : response ? [response] : [];
        if (isMounted && typesArray.length > 0) {
          setTypesData(
            typesArray.map((type, index) => ({
              id: type?.id || type?.primaryKeyValue || index,
              name: type?.name || "Unknown",
              description: type?.description || "",
              baseCapacity: type?.baseCapacity ?? 0,
              icon: type?.icon || "default",
              documentNumber: type?.documentNumber ?? null,
              isSelected: type?.isSelected ?? false,
              version: type?.version ?? 0,
              remark: type?.remark ?? null
            }))
          );
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchRoomTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get rooms count for each type
  const getRoomsCount = (typeName) => {
    return rooms.filter((r) => r.roomType === typeName).length;
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle icon select
  const handleIconSelect = (iconName) => {
    setFormData((prev) => ({ ...prev, icon: iconName }));
  };

  // Handle add type
  const handleAddType = async () => {
    setSavingType(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        description: formData.description,
        baseCapacity: Number(formData.baseCapacity) || 0,
        icon: formData.icon
      };

      const response = await createRoomType(payload, { language: "en" });

      const newType = {
        id: response?.id || response?.primaryKeyValue || typesData.length + 1,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        baseCapacity: response?.baseCapacity ?? formData.baseCapacity,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };

      setTypesData((prev) => [...prev, newType]);
      setOpenAddModal(false);
      resetForm();
    } catch (err) {

      // Keep modal open on error for now.
    } finally {setSavingType(false);
    }
  };

  // Handle edit click
  const handleEditClick = (type) => {
    setSelectedType(type);
    setFormData({
      name: type.name,
      description: type.description,
      baseCapacity: type.baseCapacity,
      icon: type.icon
    });
    setOpenEditModal(true);
  };

  // Handle edit type
  const handleEditType = async () => {
    if (!selectedType) return;
    setSavingType(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        name: formData.name,
        description: formData.description,
        baseCapacity: Number(formData.baseCapacity) || 0,
        icon: formData.icon,
        documentNumber: selectedType.documentNumber ?? null,
        isSelected: selectedType.isSelected ?? false,
        version: selectedType.version ?? 0,
        remark: selectedType.remark ?? null,
        id: selectedType.id
      };

      const response = await updateRoomType(payload, { language: "en" });

      setTypesData((prev) =>
      prev.map((t) =>
      t.id === selectedType.id ?
      {
        ...t,
        name: response?.name || formData.name,
        description: response?.description || formData.description,
        baseCapacity: response?.baseCapacity ?? formData.baseCapacity,
        icon: response?.icon || formData.icon,
        documentNumber: response?.documentNumber ?? t.documentNumber,
        isSelected: response?.isSelected ?? t.isSelected,
        version: response?.version ?? t.version,
        remark: response?.remark ?? t.remark
      } :
      t
      )
      );
      setOpenEditModal(false);
      resetForm();
    } catch (err) {

      // Keep modal open on error for now.
    } finally {setSavingType(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (type) => {
    setSelectedType(type);
    setOpenDeleteDialog(true);
  };

  // Handle delete type
  const handleDeleteType = async () => {
    if (!selectedType) return;
    setSavingType(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        name: selectedType.name,
        description: selectedType.description,
        baseCapacity: Number(selectedType.baseCapacity) || 0,
        icon: selectedType.icon,
        documentNumber: selectedType.documentNumber ?? null,
        isSelected: selectedType.isSelected ?? false,
        version: selectedType.version ?? 0,
        remark: selectedType.remark ?? null,
        id: selectedType.id
      };

      await deleteRoomType(payload, { language: "en" });
      setTypesData(typesData.filter((t) => t.id !== selectedType.id));
      setOpenDeleteDialog(false);
      setSelectedType(null);
    } catch (err) {

      // Keep dialog open on error for now.
    } finally {setSavingType(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      baseCapacity: 2,
      icon: "double"
    });
    setSelectedType(null);
  };

  // Room Type Card
  const RoomTypeCard = ({ type }) => {
    const IconComponent = iconMap[type.icon] || iconMap.default;
    const roomsCount = getRoomsCount(type.name);

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
                sx={{ color: theme.palette.error.main }}
                disabled={roomsCount > 0}>

                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        {type.name}
                    </Typography>

                    <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              minHeight: 40,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}>

                        {type.description}
                    </Typography>

                    {/* Base Capacity */}
                    <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              p: 1.5,
              backgroundColor: alpha(theme.palette.info.main, 0.08),
              borderRadius: 1
            }}>

                        <PeopleIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                            Base Capacity
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {type.baseCapacity} {type.baseCapacity === 1 ? "guest" : "guests"}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            Rooms using this type
                        </Typography>
                        <Chip
              label={roomsCount}
              size="small"
              color={roomsCount > 0 ? "primary" : "default"}
              variant={roomsCount > 0 ? "filled" : "outlined"} />

                    </Box>
                </CardContent>
            </Card>);

  };

  // Form Component
  const TypeForm = () =>
  <Box>
            <TextField
      fullWidth
      label="Room Type Name"
      name="name"
      value={formData.name}
      onChange={handleFormChange}
      required
      sx={{ mb: 2 }}
      placeholder="e.g., Deluxe Suite, Standard Room" />

            <TextField
      fullWidth
      label="Description"
      name="description"
      value={formData.description}
      onChange={handleFormChange}
      multiline
      rows={3}
      sx={{ mb: 2 }}
      placeholder="Describe this room type..." />

            <TextField
      fullWidth
      label="Base Capacity"
      name="baseCapacity"
      type="number"
      value={formData.baseCapacity}
      onChange={handleFormChange}
      required
      sx={{ mb: 3 }}
      InputProps={{
        endAdornment: <InputAdornment position="end">guests</InputAdornment>
      }}
      inputProps={{ min: 1, max: 20 }}
      helperText="Default number of guests this room type can accommodate" />


            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Select Icon
            </Typography>
            <Grid container spacing={1}>
                {availableIcons.map((item) => {
        const IconComponent = item.icon;
        const isSelected = formData.icon === item.name;
        return (
          <Grid key={item.name}>
                            <Paper
              onClick={() => handleIconSelect(item.name)}
              sx={{
                p: 1.5,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                minWidth: 80,
                border: isSelected ?
                `2px solid ${theme.palette.primary.main}` :
                `1px solid ${theme.palette.divider}`,
                backgroundColor: isSelected ?
                alpha(theme.palette.primary.main, 0.05) :
                "transparent",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}>

                                <IconComponent
                sx={{
                  fontSize: 28,
                  color: isSelected ?
                  theme.palette.primary.main :
                  theme.palette.text.secondary
                }} />

                                <Typography
                variant="caption"
                sx={{
                  color: isSelected ?
                  theme.palette.primary.main :
                  theme.palette.text.secondary,
                  fontWeight: isSelected ? 600 : 400
                }}>

                                    {item.label}
                                </Typography>
                            </Paper>
                        </Grid>);

      })}
            </Grid>
        </Box>;


  return (
    <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Room Types
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage room types available for properties
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}>

                    Add Room Type
                </Button>
            </Box>

            {/* Stats Summary */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="primary.main">
                                {typesData.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Room Types
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="success.main">
                                {rooms.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Rooms
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="info.main">
                                {typesData.filter((t) => getRoomsCount(t.name) > 0).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Types In Use
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Room Types Grid */}
            <Grid container spacing={3}>
                {typesData.map((type) =>
        <Grid item key={type.id} xs={12} sm={6} md={4} lg={3}>
                        <RoomTypeCard type={type} />
                    </Grid>
        )}
            </Grid>

            {/* Add Type Modal */}
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
                            Add Room Type
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {TypeForm()}
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
            disabled={!formData.name || !formData.baseCapacity || savingType}>

                        {savingType ? "Saving..." : "Add Room Type"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Type Modal */}
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
                            Edit Room Type
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {TypeForm()}
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
            onClick={handleEditType}
            disabled={!formData.name || !formData.baseCapacity || savingType}>

                        {savingType ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedType(null);
        }}
        onConfirm={handleDeleteType}
        title="Delete Room Type"
        message={`Are you sure you want to delete "${selectedType?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger" />

        </Box>);

};

export default RoomTypesPage;