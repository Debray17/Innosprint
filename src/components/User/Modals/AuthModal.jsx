// src/components/User/Modals/AuthModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import HotelIcon from "@mui/icons-material/Hotel";

export default function AuthModal({ open, onClose, initialTab = 0 }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setLoginErrors({});
    setRegisterErrors({});
  };

  const validateLogin = () => {
    const errors = {};
    if (!loginData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email))
      errors.email = "Invalid email";
    if (!loginData.password) errors.password = "Password is required";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.firstName.trim())
      errors.firstName = "First name is required";
    if (!registerData.lastName.trim())
      errors.lastName = "Last name is required";
    if (!registerData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(registerData.email))
      errors.email = "Invalid email";
    if (!registerData.phone.trim()) errors.phone = "Phone is required";
    if (!registerData.password) errors.password = "Password is required";
    else if (registerData.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onClose();
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: "center", pt: 4, pb: 2 }}>
          <HotelIcon
            sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }}
          />
          <Typography variant="h5" fontWeight={700}>
            Welcome to BhutanStay
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          {activeTab === 0 && (
            <Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                error={!!loginErrors.email}
                helperText={loginErrors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                error={!!loginErrors.password}
                helperText={loginErrors.password}
                InputProps={{
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
                sx={{ mb: 1 }}
              />

              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Link href="/forgot-password" underline="hover" variant="body2">
                  Forgot Password?
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          )}

          {/* Register Form */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={registerData.firstName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      firstName: e.target.value,
                    })
                  }
                  error={!!registerErrors.firstName}
                  helperText={registerErrors.firstName}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={registerData.lastName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      lastName: e.target.value,
                    })
                  }
                  error={!!registerErrors.lastName}
                  helperText={registerErrors.lastName}
                />
              </Box>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                error={!!registerErrors.email}
                helperText={registerErrors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={registerData.phone}
                onChange={(e) =>
                  setRegisterData({ ...registerData, phone: e.target.value })
                }
                error={!!registerErrors.phone}
                helperText={registerErrors.phone}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                error={!!registerErrors.password}
                helperText={registerErrors.password}
                InputProps={{
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
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                error={!!registerErrors.confirmPassword}
                helperText={registerErrors.confirmPassword}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: "block", textAlign: "center" }}
              >
                By signing up, you agree to our{" "}
                <Link href="/terms" underline="hover">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" underline="hover">
                  Privacy Policy
                </Link>
              </Typography>
            </Box>
          )}

          {/* Social Login */}
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin("google")}
                sx={{ color: "#DB4437", borderColor: "#DB4437" }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin("facebook")}
                sx={{ color: "#4267B2", borderColor: "#4267B2" }}
              >
                Facebook
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
