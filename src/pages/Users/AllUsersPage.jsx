import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar, IconButton, Paper, Tabs, Tab, Divider, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
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
import { getUserList } from "../../services/userService";

const AllUsersPage = () => {
  const theme = useTheme();
  const [usersData, setUsersData] = useState(owners);
  const [selectedTab, setSelectedTab] = useState(0);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const mapUserDto = (user, index) => {
    const status = user?.isBlocked ?
    "rejected" :
    user?.isActive ?
    "verified" :
    "pending";

    return {
      id: user?.id || user?.primaryKeyValue || index,
      name: user?.name || user?.email || "Unknown",
      email: user?.email || "",
      phone: user?.phoneNo || "",
      avatar: user?.avatarUrl || null,
      status,
      documentsSubmitted: false,
      documentUrl: null,
      propertiesCount: 0,
      totalRevenue: 0,
      joinedDate: (user?.transactedDate || user?.lastChanged || user?.lastLoginDate || "").
      toString().
      split("T")[0],
      address: ""
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const response = await getUserList({ language: "en" });
        const usersArray = Array.isArray(response) ? response : response ? [response] : [];
        if (isMounted && usersArray.length > 0) {
          setUsersData(usersArray.map(mapUserDto));
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter users based on tab
  const getFilteredUsers = () => {
    switch (selectedTab) {
      case 0:
        return usersData; // All
      case 1:
        return usersData.filter((o) => o.status === "verified");
      case 2:
        return usersData.filter((o) => o.status === "pending");
      case 3:
        return usersData.filter((o) => o.status === "rejected");
      default:
        return usersData;
    }
  };

  // Get user's properties (placeholder)
  const getUserProperties = (userId) => {
    return properties.filter((p) => p.ownerId === userId);
  };

  const columns = [
  {
    id: "name",
    label: "User",
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


  const getActions = () => {
    return ["view", "edit", "delete"];
  };

  const handleActionClick = (action, user) => {
    setSelectedUser(user);
    switch (action) {
      case "view":
        setOpenViewModal(true);
        break;
      case "edit":
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const newUser = {
      id: usersData.length + 1,
      ...formData,
      avatar: null,
      status: "pending",
      documentsSubmitted: false,
      documentUrl: null,
      propertiesCount: 0,
      totalRevenue: 0,
      joinedDate: new Date().toISOString().split("T")[0]
    };
    setUsersData([...usersData, newUser]);
    setOpenAddModal(false);
    resetForm();
  };

  const handleEditUser = () => {
    setUsersData(
      usersData.map((o) =>
      o.id === selectedUser.id ? { ...o, ...formData } : o
      )
    );
    setOpenEditModal(false);
    resetForm();
  };

  const handleDeleteUser = () => {
    setUsersData(usersData.filter((o) => o.id !== selectedUser.id));
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
    setSelectedUser(null);
  };

  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(amount);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const counts = {
    all: usersData.length,
    verified: usersData.filter((o) => o.status === "verified").length,
    pending: usersData.filter((o) => o.status === "pending").length,
    rejected: usersData.filter((o) => o.status === "rejected").length
  };

  return (
    <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage platform users and their accounts
                    </Typography>
                </Box>
            </Box>

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

            <CustomTable
        data={getFilteredUsers()}
        columns={columns}
        actions={getActions()}
        onActionClick={handleActionClick} />


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
                            Add New User
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
                name="phone"
                value={formData.phone}
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
            onClick={handleAddUser}
            disabled={!formData.name || !formData.email || !formData.phone}>

                        Add User
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
                            Edit User
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
                name="phone"
                value={formData.phone}
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
            onClick={handleEditUser}
            disabled={!formData.name || !formData.email || !formData.phone}>

                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedUser(null);
        }}
        maxWidth="md"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            User Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedUser &&
          <Grid container spacing={3}>
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

                                        {selectedUser.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {selectedUser.name}
                                    </Typography>
                                    <Chip
                  label={selectedUser.status}
                  color={
                  selectedUser.status === "verified" ?
                  "success" :
                  selectedUser.status === "pending" ?
                  "warning" :
                  "error"
                  }
                  size="small"
                  sx={{ mt: 1 }} />

                                </Paper>
                            </Grid>

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
                    secondary={selectedUser.email} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <PhoneIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Phone"
                    secondary={selectedUser.phone} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOnIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Address"
                    secondary={selectedUser.address} />

                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <CalendarTodayIcon color="action" />
                                        </ListItemIcon>
                                        <ListItemText
                    primary="Joined Date"
                    secondary={formatDate(selectedUser.joinedDate)} />

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
                                                {getUserProperties(selectedUser.id).length}
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
                                                {formatCurrency(selectedUser.totalRevenue)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Revenue
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                                    Documents
                                </Typography>
                                {selectedUser.documentsSubmitted ?
              <Button
                variant="outlined"
                startIcon={<DescriptionIcon />}
                fullWidth>

                                        View Submitted Documents
                                    </Button> :

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

            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger" />

        </Box>);

};

export default AllUsersPage;
