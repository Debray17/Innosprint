// src/pages/User/Support/ContactUsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const contactReasons = [
  "Booking Issue",
  "Payment Problem",
  "Cancellation Request",
  "Refund Inquiry",
  "Account Help",
  "Property Complaint",
  "General Inquiry",
  "Partnership Inquiry",
  "Other",
];

export default function ContactUsPage() {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    bookingCode: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.reason) newErrors.reason = "Please select a reason";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message =
        "Please provide more details (at least 20 characters)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 6, textAlign: "center" }}>
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
                mb: 3,
              }}
            >
              <CheckCircleIcon
                sx={{ fontSize: 48, color: theme.palette.success.main }}
              />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Message Sent!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Thank you for contacting us. We've received your message and will
              get back to you within 24 hours.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Reference Number:{" "}
              <strong>CS-{Date.now().toString().slice(-6)}</strong>
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  reason: "",
                  bookingCode: "",
                  message: "",
                });
              }}
            >
              Send Another Message
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: "#fff", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            We're here to help. Get in touch with our support team.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Send us a message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={formData.name}
                      onChange={handleChange("name")}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleChange("phone")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.reason}>
                      <InputLabel>Reason for Contact *</InputLabel>
                      <Select
                        value={formData.reason}
                        label="Reason for Contact *"
                        onChange={handleChange("reason")}
                      >
                        {contactReasons.map((reason) => (
                          <MenuItem key={reason} value={reason}>
                            {reason}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Booking Reference (if applicable)"
                      placeholder="e.g., BK-2024-001"
                      value={formData.bookingCode}
                      onChange={handleChange("bookingCode")}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Your Message"
                      placeholder="Please describe your issue or question in detail..."
                      value={formData.message}
                      onChange={handleChange("message")}
                      error={!!errors.message}
                      helperText={errors.message}
                      required
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  disabled={loading}
                  sx={{ mt: 3 }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Info Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Quick Contact */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Contact
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Support
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    +1 (800) 123-4567
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmailIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    support@bhutanstay.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChatIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Live Chat
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Available 24/7
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Business Hours */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Business Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday: 9:00 AM - 9:00 PM EST
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saturday: 10:00 AM - 6:00 PM EST
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sunday: 12:00 PM - 5:00 PM EST
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="primary" fontWeight={500}>
                Emergency support available 24/7
              </Typography>
            </Paper>

            {/* Office Location */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                <LocationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Office Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                BhutanStay Inc.
                <br />
                WangchukTaba
                <br />
                Babesa
                <br />
                Thimphu
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
