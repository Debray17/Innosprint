// src/pages/User/Account/PaymentMethodsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import AddIcon from "@mui/icons-material/Add";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PaymentIcon from "@mui/icons-material/Payment";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import ConfirmDialog from "../../../components/ConfirmDialog";

// Card brand icons (simplified)
const cardBrands = {
  visa: { name: "Visa", color: "#1A1F71" },
  mastercard: { name: "Mastercard", color: "#EB001B" },
  amex: { name: "American Express", color: "#006FCF" },
  discover: { name: "Discover", color: "#FF6600" },
};

const initialPaymentMethods = [
  {
    id: 1,
    type: "credit_card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: "Alex Thompson",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit_card",
    brand: "mastercard",
    last4: "5678",
    expiryMonth: 8,
    expiryYear: 2024,
    holderName: "Alex Thompson",
    isDefault: false,
  },
];

export default function PaymentMethodsPage() {
  const theme = useTheme();

  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    setDefault: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    if (field === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "Nu 1 ")
        .trim()
        .slice(0, 19);
    }
    if (field === "expiryDate") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const detectCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "visa";
  };

  const validate = () => {
    const newErrors = {};
    if (
      !formData.cardNumber.trim() ||
      formData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "Valid card number is required";
    }
    if (!formData.cardName.trim())
      newErrors.cardName = "Name on card is required";
    if (!formData.expiryDate.trim() || formData.expiryDate.length < 5) {
      newErrors.expiryDate = "Valid expiry date is required";
    }
    if (!formData.cvv.trim() || formData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const [month, year] = formData.expiryDate.split("/");
      const newCard = {
        id: Date.now(),
        type: "credit_card",
        brand: detectCardBrand(formData.cardNumber),
        last4: formData.cardNumber.replace(/\s/g, "").slice(-4),
        expiryMonth: parseInt(month),
        expiryYear: 2000 + parseInt(year),
        holderName: formData.cardName,
        isDefault: formData.setDefault || paymentMethods.length === 0,
      };

      if (newCard.isDefault) {
        setPaymentMethods((prev) =>
          prev.map((pm) => ({ ...pm, isDefault: false })),
        );
      }

      setPaymentMethods((prev) => [...prev, newCard]);
      setAddDialogOpen(false);
      setFormData({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        setDefault: false,
      });
      setSuccess("Card added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = (id) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isDefault: pm.id === id })),
    );
    setSuccess("Default payment method updated!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDelete = (method) => {
    setSelectedMethod(method);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMethod) {
      setPaymentMethods((prev) =>
        prev.filter((pm) => pm.id !== selectedMethod.id),
      );
      setSuccess("Card removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
    setDeleteDialogOpen(false);
    setSelectedMethod(null);
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid                 size={{xs:12, md:3 }}
>
            <AccountSidebar />
          </Grid>

          {/* Main Content */}
          <Grid                 size={{xs:12, md:9 }}
>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Payment Methods
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your saved payment methods
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  Add Card
                </Button>
              </Box>

              {/* Payment Methods List */}
              {paymentMethods.length > 0 ? (
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid                 size={{xs:12, sm:6 }}
 key={method.id}>
                      <Card
                        sx={{
                          position: "relative",
                          border: method.isDefault
                            ? `2px solid ${theme.palette.primary.main}`
                            : "1px solid",
                          borderColor: method.isDefault
                            ? theme.palette.primary.main
                            : "divider",
                        }}
                      >
                        <CardContent>
                          {method.isDefault && (
                            <Chip
                              label="Default"
                              size="small"
                              color="primary"
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                              }}
                            />
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 56,
                                height: 36,
                                bgcolor:
                                  cardBrands[method.brand]?.color || "#333",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <CreditCardIcon sx={{ color: "#fff" }} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                •••• •••• •••• {method.last4}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {cardBrands[method.brand]?.name}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {method.holderName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expires{" "}
                            {method.expiryMonth.toString().padStart(2, "0")}/
                            {method.expiryYear}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                            {!method.isDefault && (
                              <Button
                                size="small"
                                onClick={() => handleSetDefault(method.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDelete(method)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <PaymentIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No payment methods saved
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Add a card to make booking faster
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                  >
                    Add Card
                  </Button>
                </Box>
              )}

              {/* Security Notice */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <CheckCircleIcon
                  color="info"
                  fontSize="small"
                  sx={{ mt: 0.3 }}
                />
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Your payment info is secure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We use industry-standard encryption to protect your payment
                    details. Your full card number is never stored on our
                    servers.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Add Card Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Add Payment Method
            </Typography>
            <IconButton onClick={() => setAddDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid                 size={{xs:12 }}
>
              <TextField
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange("cardNumber")}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                InputProps={{
                  startAdornment: (
                    <CreditCardIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Grid>
            <Grid                 size={{xs:12 }}
>
              <TextField
                fullWidth
                label="Name on Card"
                value={formData.cardName}
                onChange={handleChange("cardName")}
                error={!!errors.cardName}
                helperText={errors.cardName}
              />
            </Grid>
            <Grid                 size={{xs:6 }}
>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleChange("expiryDate")}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
              />
            </Grid>
            <Grid                 size={{xs:6 }}
>
              <TextField
                fullWidth
                label="CVV"
                placeholder="123"
                type="password"
                value={formData.cvv}
                onChange={handleChange("cvv")}
                error={!!errors.cvv}
                helperText={errors.cvv}
              />
            </Grid>
            <Grid                 size={{xs:12 }}
>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.setDefault}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        setDefault: e.target.checked,
                      }))
                    }
                  />
                }
                label="Set as default payment method"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCard}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Card"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Payment Method?"
        message={`Are you sure you want to remove the card ending in ${selectedMethod?.last4}?`}
        confirmText="Remove"
        type="warning"
      />
    </Box>
  );
}
