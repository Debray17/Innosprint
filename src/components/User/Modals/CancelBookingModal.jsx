// src/components/User/Modals/CancelBookingModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const cancellationReasons = [
  "Change of travel plans",
  "Found a better deal elsewhere",
  "Personal emergency",
  "Weather concerns",
  "Health reasons",
  "Other",
];

export default function CancelBookingModal({
  open,
  onClose,
  onConfirm,
  booking,
}) {
  const theme = useTheme();
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!reason) {
      setError("Please select a reason for cancellation");
      return;
    }
    if (reason === "Other" && !otherReason.trim()) {
      setError("Please specify your reason");
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        bookingId: booking?.id,
        reason: reason === "Other" ? otherReason : reason,
      });
      handleClose();
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setOtherReason("");
    setError("");
    onClose();
  };

  // Calculate refund amount (mock logic)
  const calculateRefund = () => {
    if (!booking) return { amount: 0, percentage: 0 };
    const checkIn = new Date(booking.checkIn);
    const today = new Date();
    const daysUntilCheckIn = Math.ceil(
      (checkIn - today) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilCheckIn > 7)
      return { amount: booking.pricing?.total || 0, percentage: 100 };
    if (daysUntilCheckIn > 3)
      return { amount: (booking.pricing?.total || 0) * 0.5, percentage: 50 };
    if (daysUntilCheckIn > 1)
      return { amount: (booking.pricing?.total || 0) * 0.25, percentage: 25 };
    return { amount: 0, percentage: 0 };
  };

  const refund = calculateRefund();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ color: theme.palette.warning.main }} />
            <Typography variant="h6" fontWeight={600}>
              Cancel Booking
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Booking Summary */}
        {booking && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Booking Details
            </Typography>
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
              <Typography fontWeight={600}>{booking.property?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.room?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                Total: Nu {booking.pricing?.total?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Refund Information */}
        <Alert
          severity={
            refund.percentage === 100
              ? "success"
              : refund.percentage > 0
                ? "warning"
                : "error"
          }
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle2">
            {refund.percentage === 100
              ? "Full refund available"
              : refund.percentage > 0
                ? `Partial refund: ${refund.percentage}%`
                : "No refund available"}
          </Typography>
          <Typography variant="body2">
            Refund amount: <strong>Nu {refund.amount.toFixed(2)}</strong>
          </Typography>
        </Alert>

        <Divider sx={{ my: 2 }} />

        {/* Cancellation Reason */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Why are you cancelling?
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          {cancellationReasons.map((r) => (
            <FormControlLabel key={r} value={r} control={<Radio />} label={r} />
          ))}
        </RadioGroup>

        {reason === "Other" && (
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Please specify your reason..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Keep Booking
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Cancel Booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
