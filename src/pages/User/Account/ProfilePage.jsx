// src/pages/User/Account/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Typography, TextField, Button, Avatar, IconButton, Alert, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";

// Icons
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import { currentUser } from "../../../data/userMockData";
import { getUserById, updateUser } from "../../../services/userService";

const DEFAULT_PROFILE_USER_ID = "84826bd3-2e1a-445f-891e-1bb8c9951cf4";

export default function ProfilePage() {
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    aspNetUserId: "",
    name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
    email: currentUser.email,
    phoneNo: currentUser.phone,
    avatarUrl: "",
    lastLoginDate: "",
    isBlocked: false,
    isActive: true
  });

  useEffect(() => {
    let isMounted = true;

    const hydrateFromApi = async () => {
      try {
        const user = await getUserById(DEFAULT_PROFILE_USER_ID, {
          language: "en"
        });
        if (!user || !isMounted) return;

        setFormData((prev) => ({
          ...prev,
          id: user?.id || user?.primaryKeyValue || prev.id,
          aspNetUserId: user?.aspNetUserId || prev.aspNetUserId,
          name: user?.name || prev.name,
          email: user?.email || prev.email,
          phoneNo: user?.phoneNo || prev.phoneNo,
          avatarUrl: user?.avatarUrl || prev.avatarUrl,
          lastLoginDate: user?.lastLoginDate || prev.lastLoginDate,
          isBlocked: Boolean(user?.isBlocked),
          isActive: user?.isActive !== false
        }));
      } catch (error) {

        // Keep mock data on error.
      }};

    hydrateFromApi();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phoneNo.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const payload = {
        isActive: formData.isActive,
        transactedBy: formData.email || "self",
        aspNetUserId: formData.aspNetUserId,
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        avatarUrl: formData.avatarUrl || null,
        lastLoginDate: formData.lastLoginDate || "0001-01-01T00:00:00",
        isBlocked: formData.isBlocked
      };
      if (formData.id) {
        payload.id = formData.id;
      }

      const response = await updateUser(payload, { language: "en" });
      if (response?.hasErrors) {
        const firstError =
        response?.errorList?.[0]?.message || "Update failed.";
        throw new Error(firstError);
      }
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrorMessage(error?.message || "Error saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
      email: currentUser.email,
      phoneNo: currentUser.phone
    }));
    setIsEditing(false);
    setErrors({});
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <AccountSidebar />
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            {success &&
            <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            }
            {errorMessage &&
            <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
            }

            {/* Profile Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 36
                    }}>

                    {formData.name?.charAt(0) || "U"}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "#fff",
                      border: `2px solid ${theme.palette.primary.main}`,
                      "&:hover": { bgcolor: "grey.100" }
                    }}>

                    <CameraAltIcon fontSize="small" color="primary" />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5
                    }}>

                    <Typography variant="h5" fontWeight={700}>
                      {formData.name}
                    </Typography>
                    {currentUser.isVerified &&
                    <CheckCircleIcon color="primary" fontSize="small" />
                    }
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formData.email}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Chip
                      label={currentUser.membershipTier}
                      size="small"
                      sx={{
                        bgcolor:
                        currentUser.membershipTier === "Gold" ?
                        "#FFD700" :
                        theme.palette.primary.main,
                        color:
                        currentUser.membershipTier === "Gold" ?
                        "#000" :
                        "#fff"
                      }} />

                    <Chip
                      label={`Member since ${new Date(currentUser.memberSince).getFullYear()}`}
                      size="small"
                      variant="outlined" />

                  </Box>
                </Box>
                {!isEditing ?
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}>

                    Edit Profile
                  </Button> :

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}>

                      Cancel
                    </Button>
                    <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={loading}>

                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                }
              </Box>
            </Paper>

            {/* Personal Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                User Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={!isEditing} />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNo}
                    onChange={handleChange("phoneNo")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disabled={!isEditing} />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ASP.NET User Id"
                    value={formData.aspNetUserId}
                    disabled />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Avatar URL"
                    value={formData.avatarUrl}
                    onChange={handleChange("avatarUrl")}
                    disabled={!isEditing} />

                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>);

}