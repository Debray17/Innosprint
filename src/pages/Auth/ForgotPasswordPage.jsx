// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import HotelIcon from "@mui/icons-material/Hotel";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function ForgotPasswordPage() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
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

            {success ? (
              <>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 48, color: theme.palette.success.main }}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Check Your Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We've sent a password reset link to
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                  {email}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Forgot Password?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No worries! Enter your email and we'll send you a reset link.
                </Typography>
              </>
            )}
          </Box>

          {!success ? (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Didn't receive the email?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setSuccess(false)}
                  underline="hover"
                  fontWeight={600}
                >
                  Click to resend
                </Link>
              </Typography>

              <Button
                variant="outlined"
                component={RouterLink}
                to="/login"
                sx={{ mb: 2 }}
              >
                Back to Login
              </Button>
            </Box>
          )}

          {!success && (
            <Box sx={{ textAlign: "center" }}>
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<ArrowBackIcon />}
                sx={{ color: "text.secondary" }}
              >
                Back to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
