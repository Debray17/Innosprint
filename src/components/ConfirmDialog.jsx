import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning", // warning, error, success, info
    loading = false,
}) {
    const theme = useTheme();

    const typeConfig = {
        warning: {
            icon: WarningAmberIcon,
            color: theme.palette.warning.main,
            bgcolor: theme.palette.warning.light,
        },
        error: {
            icon: ErrorOutlineIcon,
            color: theme.palette.error.main,
            bgcolor: theme.palette.error.light,
        },
        success: {
            icon: CheckCircleOutlineIcon,
            color: theme.palette.success.main,
            bgcolor: theme.palette.success.light,
        },
        info: {
            icon: InfoOutlinedIcon,
            color: theme.palette.info.main,
            bgcolor: theme.palette.info.light,
        },
    };

    const config = typeConfig[type] || typeConfig.warning;
    const IconComponent = config.icon;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: `${config.color}15`,
                        }}
                    >
                        <IconComponent sx={{ fontSize: 28, color: config.color }} />
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ ml: 8, color: theme.palette.text.secondary }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={type === "error" ? "error" : type === "success" ? "success" : "primary"}
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                >
                    {loading ? "Processing..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}