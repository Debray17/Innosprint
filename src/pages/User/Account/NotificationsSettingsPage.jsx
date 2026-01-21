// src/pages/User/Account/NotificationsSettingsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Switch,
  Divider,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
// import { useTheme, alpha } from "@mui/material/styles";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

import AccountSidebar from "./AccountSidebar";

export default function NotificationsSettingsPage() {
  // const theme = useTheme();

  const [settings, setSettings] = useState({
    // Email Notifications
    emailBookingConfirmation: true,
    emailBookingReminder: true,
    emailBookingChanges: true,
    emailPromotions: true,
    emailNewsletter: false,
    emailPriceAlerts: true,
    emailReviewReminder: true,

    // Push Notifications
    pushBookingUpdates: true,
    pushPromotions: false,
    pushPriceDrops: true,
    pushMessages: true,

    // SMS Notifications
    smsBookingConfirmation: false,
    smsCheckInReminder: true,
    smsUrgentUpdates: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (key) => (event) => {
    setSettings((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const NotificationSection = ({ title, icon: Icon, children }) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Icon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>
      <Paper sx={{ overflow: "hidden" }}>
        <List disablePadding>{children}</List>
      </Paper>
    </Box>
  );

  const NotificationItem = ({ label, description, settingKey }) => (
    <>
      <ListItem sx={{ py: 2 }}>
        <ListItemText
          primary={label}
          secondary={description}
          primaryTypographyProps={{ fontWeight: 500 }}
        />
        <ListItemSecondaryAction>
          <Switch
            checked={settings[settingKey]}
            onChange={handleChange(settingKey)}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider component="li" />
    </>
  );

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
                Notification preferences saved successfully!
              </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose how you want to receive updates and notifications
              </Typography>
            </Paper>

            {/* Email Notifications */}
            <NotificationSection title="Email Notifications" icon={EmailIcon}>
              <NotificationItem
                label="Booking Confirmations"
                description="Receive confirmation emails when you make a booking"
                settingKey="emailBookingConfirmation"
              />
              <NotificationItem
                label="Booking Reminders"
                description="Get reminders before your check-in date"
                settingKey="emailBookingReminder"
              />
              <NotificationItem
                label="Booking Changes"
                description="Updates about modifications or cancellations"
                settingKey="emailBookingChanges"
              />
              <NotificationItem
                label="Promotions & Deals"
                description="Special offers and discount codes"
                settingKey="emailPromotions"
              />
              <NotificationItem
                label="Price Alerts"
                description="Get notified when prices drop for saved properties"
                settingKey="emailPriceAlerts"
              />
              <NotificationItem
                label="Review Reminders"
                description="Reminders to review properties after your stay"
                settingKey="emailReviewReminder"
              />
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary="Newsletter"
                  secondary="Travel tips, destination guides, and inspiration"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.emailNewsletter}
                    onChange={handleChange("emailNewsletter")}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </NotificationSection>

            {/* Push Notifications */}
            <NotificationSection
              title="Push Notifications"
              icon={PhoneIphoneIcon}
            >
              <NotificationItem
                label="Booking Updates"
                description="Real-time updates about your bookings"
                settingKey="pushBookingUpdates"
              />
              <NotificationItem
                label="Price Drops"
                description="Alerts when wishlist properties have price drops"
                settingKey="pushPriceDrops"
              />
              <NotificationItem
                label="Messages"
                description="Messages from properties and hosts"
                settingKey="pushMessages"
              />
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary="Promotions"
                  secondary="Special offers and flash deals"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pushPromotions}
                    onChange={handleChange("pushPromotions")}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </NotificationSection>

            {/* SMS Notifications */}
            <NotificationSection title="SMS Notifications" icon={SmsIcon}>
              <NotificationItem
                label="Booking Confirmations"
                description="Receive SMS confirmation for bookings"
                settingKey="smsBookingConfirmation"
              />
              <NotificationItem
                label="Check-in Reminders"
                description="SMS reminder on your check-in day"
                settingKey="smsCheckInReminder"
              />
              <ListItem sx={{ py: 2 }}>
                <ListItemText
                  primary="Urgent Updates"
                  secondary="Important changes that require immediate attention"
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.smsUrgentUpdates}
                    onChange={handleChange("smsUrgentUpdates")}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </NotificationSection>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
