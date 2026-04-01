// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import HotelIcon from "@mui/icons-material/Hotel";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useLogin } from "../../hooks/useAuth";

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const loginMutation = useLogin();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await loginMutation.mutateAsync({
        username: formData.username.trim(),
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      setError(err?.message || "Invalid username or password. Please try again.");
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
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
      }}
    >
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
                mb: 2,
              }}
            >
              <HotelIcon
                sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 1 }}
              />
              <Typography variant="h5" fontWeight={700} color="primary">
                BhutanStay
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to continue to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange("username")}
              error={!!errors.username}
              helperText={errors.username}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 3 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Typography variant="body2" textAlign="center">
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              fontWeight={600}
              underline="hover"
            >
              Sign up for free
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
