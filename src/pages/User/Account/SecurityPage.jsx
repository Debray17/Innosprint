// src/pages/User/Account/SecurityPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ComputerIcon from "@mui/icons-material/Computer";
import TabletIcon from "@mui/icons-material/Tablet";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";

const activeSessions = [
  {
    id: 1,
    device: "MacBook Pro",
    type: "computer",
    browser: "Chrome",
    location: "San Francisco, CA",
    lastActive: "Active now",
    current: true,
  },
  {
    id: 2,
    device: "iPhone 14",
    type: "phone",
    browser: "Safari",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "iPad Pro",
    type: "tablet",
    browser: "Safari",
    location: "Los Angeles, CA",
    lastActive: "3 days ago",
    current: false,
  },
];

export default function SecurityPage() {
  const theme = useTheme();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [sessions, setSessions] = useState(activeSessions);

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setTwoFactorEnabled(false);
      setSuccess("Two-factor authentication disabled");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setTwoFactorDialogOpen(true);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setTwoFactorDialogOpen(false);
    setSuccess("Two-factor authentication enabled");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRevokeSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setSuccess("Session revoked successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRevokeAllSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    setSuccess("All other sessions have been logged out");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case "phone":
        return <PhoneAndroidIcon />;
      case "tablet":
        return <TabletIcon />;
      default:
        return <ComputerIcon />;
    }
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
                {success}
              </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your account security and login sessions
              </Typography>
            </Paper>

            {/* Change Password */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <LockIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Change Password
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword("current")}
                            edge="end"
                          >
                            {showPasswords.current ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange("newPassword")}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword("new")}
                            edge="end"
                          >
                            {showPasswords.new ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleShowPassword("confirm")}
                            edge="end"
                          >
                            {showPasswords.confirm ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </Paper>

            {/* Two-Factor Authentication */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <SecurityIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Two-Factor Authentication
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  bgcolor: twoFactorEnabled
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.warning.main, 0.1),
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {twoFactorEnabled ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <WarningIcon color="warning" />
                  )}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {twoFactorEnabled
                        ? "2FA is enabled"
                        : "2FA is not enabled"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {twoFactorEnabled
                        ? "Your account is protected with two-factor authentication"
                        : "Add an extra layer of security to your account"}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={twoFactorEnabled}
                  onChange={handleToggle2FA}
                  color="primary"
                />
              </Box>
            </Paper>

            {/* Active Sessions */}
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ComputerIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Active Sessions
                  </Typography>
                </Box>
                {sessions.length > 1 && (
                  <Button
                    color="error"
                    size="small"
                    onClick={handleRevokeAllSessions}
                  >
                    Log out all other sessions
                  </Button>
                )}
              </Box>

              <List>
                {sessions.map((session, index) => (
                  <React.Fragment key={session.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemIcon>{getDeviceIcon(session.type)}</ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography fontWeight={500}>
                              {session.device}
                            </Typography>
                            {session.current && (
                              <Chip
                                label="Current"
                                size="small"
                                color="primary"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            {session.browser} • {session.location}
                            <br />
                            {session.lastActive}
                          </>
                        }
                      />
                      {!session.current && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleRevokeSession(session.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    {index < sessions.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 2FA Setup Dialog */}
      <Dialog
        open={twoFactorDialogOpen}
        onClose={() => setTwoFactorDialogOpen(false)}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Enable Two-Factor Authentication
            <IconButton onClick={() => setTwoFactorDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Scan the QR code below with your authenticator app, then enter the
            6-digit code.
          </Typography>

          {/* QR Code Placeholder */}
          <Box
            sx={{
              width: 200,
              height: 200,
              bgcolor: "grey.100",
              mx: "auto",
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <Typography color="text.secondary">[QR Code]</Typography>
          </Box>

          <TextField
            fullWidth
            label="Enter 6-digit code"
            placeholder="000000"
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setTwoFactorDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEnable2FA}>
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
