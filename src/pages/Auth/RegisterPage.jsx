// src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Container, Paper, Typography, TextField, Button, Link, InputAdornment, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useCreateUser } from "../../hooks/useUser";

export default function RegisterPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    avatarUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const createUserMutation = useCreateUser();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNo.trim())
    newErrors.phoneNo = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createUserMutation.mutateAsync({
        payload: {
          // Sending only the fields you listed for User/Post.
          id: undefined,
          isActive: true,
          transactedBy: formData.email.trim() || formData.name.trim(),
          documentNumber: undefined,
          isSelected: false,
          message: undefined,
          isDeleted: false,
          aspNetUserId: undefined,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phoneNo: formData.phoneNo.trim(),
          avatarUrl: formData.avatarUrl.trim() || undefined,
          lastLoginDate: undefined,
          isBlocked: false
        },
        options: { language: "en" }
      });
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
      }}>

      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                mb: 2
              }}>

              <HotelIcon
                sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 1 }} />

              <Typography variant="h5" fontWeight={700} color="primary">
                BhutanStay
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join us and start booking amazing stays
            </Typography>
          </Box>

          {error &&
          <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          }

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange("name")}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment:
                    <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>

                  }} />

              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment:
                <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>

              }} />


            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNo}
              onChange={handleChange("phoneNo")}
              error={!!errors.phoneNo}
              helperText={errors.phoneNo}
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment:
                <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>

              }} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 3 }}>

              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Box>

          {/* Sign In Link */}
          <Typography variant="body2" textAlign="center">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              fontWeight={600}
              underline="hover">

              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>);

}
