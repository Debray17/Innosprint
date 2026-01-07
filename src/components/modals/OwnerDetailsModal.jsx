import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    Grid,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function OwnerDetailsModal({
    open,
    onClose,
    owner,
    showActions = false,
    onApprove,
    onReject,
}) {
    const theme = useTheme();

    if (!owner) return null;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(value);

    const getStatusColor = (status) => {
        switch (status) {
            case "verified":
                return "success";
            case "pending":
                return "warning";
            case "rejected":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" fontWeight={600}>
                        Owner Details
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        py: 3,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 72,
                            height: 72,
                            bgcolor: theme.palette.primary.main,
                            fontSize: 28,
                        }}
                    >
                        {owner.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {owner.name}
                        </Typography>
                        <Chip
                            label={owner.status}
                            color={getStatusColor(owner.status)}
                            size="small"
                            sx={{ mt: 0.5, textTransform: "capitalize" }}
                        />
                    </Box>
                </Box>

                {/* Contact Info */}
                <List sx={{ py: 2 }}>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <EmailIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Email"
                            secondary={owner.email}
                            primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                            secondaryTypographyProps={{ variant: "body1", color: "text.primary" }}
                        />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <PhoneIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Phone"
                            secondary={owner.phone}
                            primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                            secondaryTypographyProps={{ variant: "body1", color: "text.primary" }}
                        />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <LocationOnIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Address"
                            secondary={owner.address || "Not provided"}
                            primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                            secondaryTypographyProps={{ variant: "body1", color: "text.primary" }}
                        />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <CalendarTodayIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Joined Date"
                            secondary={new Date(owner.joinedDate).toLocaleDateString()}
                            primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                            secondaryTypographyProps={{ variant: "body1", color: "text.primary" }}
                        />
                    </ListItem>
                </List>

                <Divider />

                {/* Stats */}
                <Grid container spacing={2} sx={{ py: 2 }}>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                textAlign: "center",
                            }}
                        >
                            <ApartmentIcon sx={{ color: theme.palette.primary.main, mb: 0.5 }} />
                            <Typography variant="h5" fontWeight={700}>
                                {owner.propertiesCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Properties
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.08),
                                textAlign: "center",
                            }}
                        >
                            <MonetizationOnIcon sx={{ color: theme.palette.success.main, mb: 0.5 }} />
                            <Typography variant="h5" fontWeight={700}>
                                {formatCurrency(owner.totalRevenue)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Total Revenue
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Documents */}
                {owner.status === "pending" && (
                    <>
                        <Divider />
                        <Box sx={{ py: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Documents
                            </Typography>
                            {owner.documentsSubmitted ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<DescriptionIcon />}
                                    fullWidth
                                    sx={{ justifyContent: "flex-start" }}
                                >
                                    View Submitted Documents
                                </Button>
                            ) : (
                                <Typography color="error" variant="body2">
                                    No documents submitted
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </DialogContent>

            {showActions && owner.status === "pending" && (
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button
                        onClick={onReject}
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        fullWidth
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={onApprove}
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        fullWidth
                    >
                        Approve
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}