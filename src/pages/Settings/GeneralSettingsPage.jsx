import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Avatar,
    IconButton,
    Alert,
    Snackbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Card,
    CardContent,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { notificationSettings } from "../../data/mockData";

const GeneralSettingsPage = () => {
    const theme = useTheme();
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        // Business Info
        businessName: "StayManager",
        businessEmail: "admin@staymanager.com",
        businessPhone: "+1 234 567 8900",
        businessWebsite: "www.staymanager.com",
        businessAddress: "123 Hotel Street, New York, NY 10001",
        // Preferences
        timezone: "America/New_York",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        language: "en",
        // Notifications
        ...notificationSettings,
        // Display
        darkMode: false,
        compactMode: false,
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle save
    const handleSave = () => {
        // In real app, save to backend
        setSaved(true);
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        General Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your platform settings and preferences
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                >
                    Save Changes
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Business Information */}
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Business Information
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: theme.palette.primary.main,
                                        fontSize: 32,
                                    }}
                                >
                                    SM
                                </Avatar>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: theme.palette.background.paper,
                                        boxShadow: 1,
                                        "&:hover": {
                                            backgroundColor: theme.palette.background.paper,
                                        },
                                    }}
                                >
                                    <PhotoCameraIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Platform Logo
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Upload a logo for your platform (PNG, JPG, max 2MB)
                                </Typography>
                                <Button size="small" sx={{ mt: 1 }}>
                                    Upload Logo
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Business Name"
                                    name="businessName"
                                    value={settings.businessName}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <BusinessIcon color="action" sx={{ mr: 1 }} />
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="businessEmail"
                                    type="email"
                                    value={settings.businessEmail}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="businessPhone"
                                    value={settings.businessPhone}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Website"
                                    name="businessWebsite"
                                    value={settings.businessWebsite}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <LanguageIcon color="action" sx={{ mr: 1 }} />
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    name="businessAddress"
                                    value={settings.businessAddress}
                                    onChange={handleChange}
                                    multiline
                                    rows={2}
                                    InputProps={{
                                        startAdornment: (
                                            <LocationOnIcon color="action" sx={{ mr: 1, alignSelf: "flex-start", mt: 1 }} />
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Regional Settings */}
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Regional Settings
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Timezone"
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="America/New_York">Eastern Time (ET)</option>
                                    <option value="America/Chicago">Central Time (CT)</option>
                                    <option value="America/Denver">Mountain Time (MT)</option>
                                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                    <option value="Europe/London">London (GMT)</option>
                                    <option value="Europe/Paris">Paris (CET)</option>
                                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Currency"
                                    name="currency"
                                    value={settings.currency}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="JPY">JPY - Japanese Yen</option>
                                    <option value="CAD">CAD - Canadian Dollar</option>
                                    <option value="AUD">AUD - Australian Dollar</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Date Format"
                                    name="dateFormat"
                                    value={settings.dateFormat}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Language"
                                    name="language"
                                    value={settings.language}
                                    onChange={handleChange}
                                    SelectProps={{ native: true }}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                    <option value="ja">Japanese</option>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Notification Settings */}
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Notification Settings
                        </Typography>
                        <List>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <EmailIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Email Notifications"
                                    secondary="Receive notifications via email"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="emailNotifications"
                                        checked={settings.emailNotifications}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <PhoneIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="SMS Notifications"
                                    secondary="Receive notifications via SMS"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="smsNotifications"
                                        checked={settings.smsNotifications}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="New Booking Alerts"
                                    secondary="Get notified when a new booking is made"
                                    sx={{ pl: 7 }}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="newBookingAlert"
                                        checked={settings.newBookingAlert}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Cancellation Alerts"
                                    secondary="Get notified when a booking is cancelled"
                                    sx={{ pl: 7 }}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="cancellationAlert"
                                        checked={settings.cancellationAlert}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Payment Alerts"
                                    secondary="Get notified about payment status changes"
                                    sx={{ pl: 7 }}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="paymentAlert"
                                        checked={settings.paymentAlert}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary="Check-in Reminders"
                                    secondary="Receive reminders for upcoming check-ins"
                                    sx={{ pl: 7 }}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="checkInReminder"
                                        checked={settings.checkInReminder}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* Right Column - Quick Settings */}
                <Grid item xs={12} lg={4}>
                    {/* Display Settings */}
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Display Settings
                        </Typography>
                        <List>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <DarkModeIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Dark Mode"
                                    secondary="Use dark theme"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="darkMode"
                                        checked={settings.darkMode}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <ColorLensIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Compact Mode"
                                    secondary="Reduce spacing"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        name="compactMode"
                                        checked={settings.compactMode}
                                        onChange={handleChange}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Paper>

                    {/* Security */}
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Security
                        </Typography>
                        <List>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <SecurityIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Two-Factor Authentication"
                                    secondary="Add extra security to your account"
                                />
                            </ListItem>
                        </List>
                        <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                            Enable 2FA
                        </Button>
                        <Divider sx={{ my: 2 }} />
                        <Button variant="outlined" color="warning" fullWidth>
                            Change Password
                        </Button>
                    </Paper>

                    {/* System Info */}
                    <Card sx={{ backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                        <CardContent>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                                System Information
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Version
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    v2.1.0
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    Jan 15, 2024
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" color="text.secondary">
                                    License
                                </Typography>
                                <Typography variant="body2" fontWeight={500} color="success.main">
                                    Active
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Success Snackbar */}
            <Snackbar
                open={saved}
                autoHideDuration={3000}
                onClose={() => setSaved(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSaved(false)}
                    severity="success"
                    variant="filled"
                >
                    Settings saved successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GeneralSettingsPage;