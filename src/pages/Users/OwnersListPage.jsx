import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, IconButton, Paper, Tabs, Tab, Divider, List, ListItem, ListItemText, ListItemIcon, Snackbar, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
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
import { createOwner, deleteOwner, getOwnerList, updateOwner } from "../../services/ownerService";

const OwnersListPage = () => {
  const theme = useTheme();
  const [ownersData, setOwnersData] = useState(owners);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [savingOwner, setSavingOwner] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    avatarUrl: "",
    statusId: 0,
    documentUrl: "",
    rejectionReason: "",
    verificationDate: new Date().toISOString()
  });

  const mapOwnerDto = (owner, index) => {
    const status =
    owner?.statusId === 1 ?
    "verified" :
    owner?.statusId === 2 ?
    "rejected" :
    "pending";

    return {
      id: owner?.id || owner?.primaryKeyValue || index,
      name: owner?.name || owner?.email || "Unknown",
      email: owner?.email || "",
      phone: owner?.phoneNo || "",
      avatar: owner?.avatarUrl || null,
      status,
      documentsSubmitted: Boolean(owner?.documentUrl),
      documentUrl: owner?.documentUrl || null,
      rejectionReason: owner?.rejectionReason || "",
      verificationDate: owner?.verificationDate || "",
      statusId: owner?.statusId ?? 0,
      documentNumber: owner?.documentNumber ?? null,
      isSelected: owner?.isSelected ?? false,
      version: owner?.version ?? 0,
      remark: owner?.remark ?? null,
      propertiesCount: 0,
      totalRevenue: 0,
      joinedDate: (owner?.transactedDate || owner?.lastChanged || "").
      toString().
      split("T")[0],
      address: owner?.address || ""
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchOwners = async () => {
      try {
        const response = await getOwnerList({ language: "en" });
        const ownersArray = Array.isArray(response) ? response : response ? [response] : [];
        if (isMounted && ownersArray.length > 0) {
          setOwnersData(ownersArray.map(mapOwnerDto));
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchOwners();

    return () => {
      isMounted = false;
    };
  }, []);

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
    width: "250px"
  },
  {
    id: "phone",
    label: "Phone",
    type: "text",
    width: "150px"
  },
  {
    id: "propertiesCount",
    label: "Properties",
    type: "text",
    width: "100px",
    filterable: false
  },
  {
    id: "totalRevenue",
    label: "Total Revenue",
    type: "currency",
    width: "150px",
    filterable: false
  },
  {
    id: "status",
    label: "Status",
    type: "status",
    options: ["verified", "pending", "rejected"],
    width: "120px"
  },
  {
    id: "joinedDate",
    label: "Joined",
    type: "date",
    width: "120px",
    filterable: false
  }];


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
          phoneNo: owner.phone,
          address: owner.address,
          avatarUrl: owner.avatar || "",
          statusId:
          owner.status === "verified" ?
          1 :
          owner.status === "rejected" ?
          2 :
          0,
          documentUrl: owner.documentUrl || "",
          rejectionReason: "",
          verificationDate: new Date().toISOString()
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
  const handleAddOwner = async () => {
    setSavingOwner(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: formData.email || "admin",
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: formData.address,
        avatarUrl: null,
        statusId: 0,
        documentUrl: null,
        rejectionReason: null,
        verificationDate: new Date().toISOString()
      };

      const response = await createOwner(payload, { language: "en" });

      const newOwner = {
        id: response?.id || response?.primaryKeyValue || ownersData.length + 1,
        name: response?.name || formData.name,
        email: response?.email || formData.email,
        phone: response?.phoneNo || formData.phoneNo,
        address: response?.address || formData.address,
        avatar: response?.avatarUrl || null,
        status: "pending",
        documentsSubmitted: Boolean(response?.documentUrl),
        documentUrl: response?.documentUrl || null,
        rejectionReason: response?.rejectionReason || "",
        verificationDate: response?.verificationDate || payload.verificationDate,
        statusId: response?.statusId ?? payload.statusId ?? 0,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null,
        propertiesCount: 0,
        totalRevenue: 0,
        joinedDate: (response?.lastChanged || response?.transactedDate || new Date().toISOString()).
        toString().
        split("T")[0]
      };

      setOwnersData((prev) => [...prev, newOwner]);
      setSnackbar({ open: true, message: "Owner created successfully.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to create owner.",
        severity: "error"
      });
    } finally {
      setSavingOwner(false);
    }
  };

  // Handle edit owner
  const handleEditOwner = async () => {
    if (!selectedOwner) return;
    setSavingOwner(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: formData.email || "admin",
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        address: formData.address,
        avatarUrl: formData.avatarUrl || null,
        statusId: Number(formData.statusId) || 0,
        documentUrl: formData.documentUrl || null,
        rejectionReason: formData.rejectionReason || null,
        verificationDate: formData.verificationDate || new Date().toISOString()
      };

      const response = await updateOwner(payload, { language: "en" });

      setOwnersData((prev) =>
      prev.map((o) =>
      o.id === selectedOwner.id ?
      {
        ...o,
        name: response?.name || formData.name,
        email: response?.email || formData.email,
        phone: response?.phoneNo || formData.phoneNo,
        address: response?.address || formData.address,
        avatar: response?.avatarUrl || formData.avatarUrl || null,
        documentUrl: response?.documentUrl || formData.documentUrl || null
      } :
      o
      )
      );
      setSnackbar({ open: true, message: "Owner updated successfully.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update owner.",
        severity: "error"
      });
    } finally {
      setSavingOwner(false);
    }
  };

  // Handle delete owner
  const handleDeleteOwner = async () => {
    if (!selectedOwner) return;
    setSavingOwner(true);
    try {
      const payload = {
        id: selectedOwner.id,
        isActive: true,
        transactedBy: selectedOwner.email || "admin",
        name: selectedOwner.name,
        email: selectedOwner.email,
        phoneNo: selectedOwner.phone,
        address: selectedOwner.address,
        avatarUrl: selectedOwner.avatar || null,
        statusId:
        selectedOwner.status === "verified" ?
        1 :
        selectedOwner.status === "rejected" ?
        2 :
        0,
        documentUrl: selectedOwner.documentUrl || null,
        rejectionReason: selectedOwner.rejectionReason || null,
        verificationDate: selectedOwner.verificationDate || new Date().toISOString(),
        documentNumber: selectedOwner.documentNumber ?? null,
        isSelected: selectedOwner.isSelected ?? false,
        version: selectedOwner.version ?? 0,
        remark: selectedOwner.remark ?? null
      };

      await deleteOwner(payload, { language: "en" });
      setOwnersData((prev) => prev.filter((o) => o.id !== selectedOwner.id));
      setSnackbar({ open: true, message: "Owner deleted successfully.", severity: "success" });
      setOpenDeleteDialog(false);
      setSelectedOwner(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete owner.",
        severity: "error"
      });
    } finally {
      setSavingOwner(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneNo: "",
      address: "",
      avatarUrl: "",
      statusId: 0,
      documentUrl: "",
      rejectionReason: "",
      verificationDate: new Date().toISOString()
    });
    setSelectedOwner(null);
  };

  // Format currency
  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(amount);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Counts for tabs
  const counts = {
    all: ownersData.length,
    verified: ownersData.filter((o) => o.status === "verified").length,
    pending: ownersData.filter((o) => o.status === "pending").length,
    rejected: ownersData.filter((o) => o.status === "rejected").length
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
          onClick={() => setOpenAddModal(true)}>

                    Add Owner
                </Button>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ px: 2 }}>

                    <Tab
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                All
                                <Chip label={counts.all} size="small" />
                            </Box>
            } />

                    <Tab
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Verified
                                <Chip label={counts.verified} size="small" color="success" />
                            </Box>
            } />

                    <Tab
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Pending
                                <Chip label={counts.pending} size="small" color="warning" />
                            </Box>
            } />

                    <Tab
            label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                Rejected
                                <Chip label={counts.rejected} size="small" color="error" />
                            </Box>
            } />

                </Tabs>
            </Paper>

            {/* Table */}
            <CustomTable
        data={getFilteredOwners()}
        columns={columns}
        actions={getActions()}
        onActionClick={handleActionClick} />


            {/* Add Owner Modal */}
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
                            Add New Owner
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
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                fullWidth
                label="Phone"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                multiline
                rows={2} />

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
            onClick={handleAddOwner}
            disabled={!formData.name || !formData.email || !formData.phoneNo || savingOwner}>

                        {savingOwner ? "Saving..." : "Add Owner"}
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
        fullWidth>

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
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                fullWidth
                label="Phone"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleFormChange}
                required />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                multiline
                rows={2} />

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
            onClick={handleEditOwner}
            disabled={!formData.name || !formData.email || !formData.phoneNo || savingOwner}>

                        {savingOwner ? "Saving..." : "Save Changes"}
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
        fullWidth>

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
                    {selectedOwner &&
          <Grid container spacing={3}>
                            {/* Owner Info */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.primary.main, 0.02)
                }}>

                                    <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                    fontSize: 32
                  }}>

                                        {selectedOwner.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedOwner.name}
                                    </Typography>
                                    <Chip
                  label={selectedOwner.status}
                  color={
                  selectedOwner.status === "verified" ?
                  "success" :
                  selectedOwner.status === "pending" ?
                  "warning" :
                  "error"
                  }
                  size="small"
                  sx={{ mt: 1 }} />

                                </Paper>
                            </Grid>

                            {/* Contact & Stats */}
                            <Grid size={{ xs: 12, md: 8 }}>
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
                    secondary={selectedOwner.email} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PhoneIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Phone"
                    secondary={selectedOwner.phone} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOnIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Address"
                    secondary={selectedOwner.address} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CalendarTodayIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Joined Date"
                    secondary={formatDate(selectedOwner.joinedDate)} />

                                    </ListItem>
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Statistics
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
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
                                    <Grid size={6}>
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
                            <Grid size={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                                    Properties ({getOwnerProperties(selectedOwner.id).length})
                                </Typography>
                                {getOwnerProperties(selectedOwner.id).length > 0 ?
              <Grid container spacing={2}>
                                        {getOwnerProperties(selectedOwner.id).map((property) =>
                <Grid size={{ xs: 12, sm: 6 }} key={property.id}>
                                                <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2
                    }}>

                                                    <Avatar
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.1
                        ),
                        color: theme.palette.primary.main
                      }}>

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
                      property.status === "approved" ?
                      "success" :
                      property.status === "pending" ?
                      "warning" :
                      "error"
                      }
                      size="small" />

                                                </Paper>
                                            </Grid>
                )}
                                    </Grid> :

              <Paper sx={{ p: 3, textAlign: "center" }}>
                                        <Typography color="text.secondary">
                                            No properties registered
                                        </Typography>
                                    </Paper>
              }
                            </Grid>

                            {/* Documents */}
                            <Grid size={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, mt: 2 }}>
                                    Documents
                                </Typography>
                                {selectedOwner.documentsSubmitted ?
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2
                }}>

                                        <Avatar
                  sx={{
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main
                  }}>

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
                                    </Paper> :

              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: alpha(theme.palette.warning.main, 0.05)
                }}>

                                        <CloudUploadIcon
                  sx={{ fontSize: 48, color: theme.palette.warning.main, mb: 1 }} />

                                        <Typography color="text.secondary">
                                            No documents submitted yet
                                        </Typography>
                                    </Paper>
              }
                            </Grid>
                        </Grid>
          }
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

export default OwnersListPage;
