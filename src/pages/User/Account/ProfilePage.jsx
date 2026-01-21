// src/pages/User/Account/ProfilePage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Icons
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import { currentUser } from "../../../data/userMockData";

export default function ProfilePage() {
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone,
    dateOfBirth: currentUser.dateOfBirth
      ? dayjs(currentUser.dateOfBirth)
      : null,
    gender: currentUser.gender || "",
    nationality: currentUser.nationality || "",
    street: currentUser.address?.street || "",
    city: currentUser.address?.city || "",
    state: currentUser.address?.state || "",
    zipCode: currentUser.address?.zipCode || "",
    country: currentUser.address?.country || "USA",
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      phone: currentUser.phone,
      dateOfBirth: currentUser.dateOfBirth
        ? dayjs(currentUser.dateOfBirth)
        : null,
      gender: currentUser.gender || "",
      nationality: currentUser.nationality || "",
      street: currentUser.address?.street || "",
      city: currentUser.address?.city || "",
      state: currentUser.address?.state || "",
      zipCode: currentUser.address?.zipCode || "",
      country: currentUser.address?.country || "USA",
    });
    setIsEditing(false);
    setErrors({});
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <AccountSidebar />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}

            {/* Profile Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.primary.main,
                      fontSize: 36,
                    }}
                  >
                    {formData.firstName.charAt(0)}
                    {formData.lastName.charAt(0)}
                  </Avatar>
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "#fff",
                      border: `2px solid ${theme.palette.primary.main}`,
                      "&:hover": { bgcolor: "grey.100" },
                    }}
                  >
                    <CameraAltIcon fontSize="small" color="primary" />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5" fontWeight={700}>
                      {formData.firstName} {formData.lastName}
                    </Typography>
                    {currentUser.isVerified && (
                      <CheckCircleIcon color="primary" fontSize="small" />
                    )}
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
                          currentUser.membershipTier === "Gold"
                            ? "#FFD700"
                            : theme.palette.primary.main,
                        color:
                          currentUser.membershipTier === "Gold"
                            ? "#000"
                            : "#fff",
                      }}
                    />
                    <Chip
                      label={`Member since ${new Date(currentUser.memberSince).getFullYear()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Personal Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    disabled={!isEditing}
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={handleChange("gender")}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer_not_to_say">
                        Prefer not to say
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Nationality"
                    value={formData.nationality}
                    onChange={handleChange("nationality")}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Address */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Address
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={formData.street}
                    onChange={handleChange("street")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleChange("city")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={formData.state}
                    onChange={handleChange("state")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    value={formData.zipCode}
                    onChange={handleChange("zipCode")}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.country}
                      label="Country"
                      onChange={handleChange("country")}
                    >
                      <MenuItem value="USA">United States</MenuItem>
                      <MenuItem value="UK">United Kingdom</MenuItem>
                      <MenuItem value="Canada">Canada</MenuItem>
                      <MenuItem value="Australia">Australia</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
