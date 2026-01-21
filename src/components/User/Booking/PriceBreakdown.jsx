// src/components/User/Booking/PriceBreakdown.jsx
import React from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PriceBreakdown({
  roomRate,
  nights,
  rooms = 1,
  taxes,
  fees = 0,
  discount = 0,
  promoCode,
  onApplyPromo,
  breakfastIncluded = false,
  breakfastPrice = 0,
  addBreakfast = false,
}) {
  const theme = useTheme();
  const [promoInput, setPromoInput] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState(false);

  const subtotal = roomRate * nights * rooms;
  const breakfastTotal = addBreakfast ? breakfastPrice * nights * rooms : 0;
  const taxAmount = taxes || subtotal * 0.1;
  const total = subtotal + breakfastTotal + taxAmount + fees - discount;

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      onApplyPromo?.(promoInput);
      setPromoApplied(true);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Price Details
      </Typography>

      {/* Room Rate */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Nu {roomRate} x {nights} night{nights > 1 ? "s" : ""}
          {rooms > 1 && ` x ${rooms} rooms`}
        </Typography>
        <Typography variant="body2">Nu {subtotal.toFixed(2)}</Typography>
      </Box>

      {/* Breakfast (if applicable) */}
      {(breakfastIncluded || addBreakfast) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Breakfast
            {breakfastIncluded && (
              <Chip
                label="Included"
                size="small"
                color="success"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Typography variant="body2">
            {breakfastIncluded ? "Free" : `Nu ${breakfastTotal.toFixed(2)}`}
          </Typography>
        </Box>
      )}

      {/* Taxes */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Taxes & fees
        </Typography>
        <Typography variant="body2">Nu {taxAmount.toFixed(2)}</Typography>
      </Box>

      {/* Service Fee */}
      {fees > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Service fee
          </Typography>
          <Typography variant="body2">Nu {fees.toFixed(2)}</Typography>
        </Box>
      )}

      {/* Discount */}
      {discount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="success.main">
            Discount
          </Typography>
          <Typography variant="body2" color="success.main">
            -Nu {discount.toFixed(2)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Promo Code */}
      {!promoApplied ? (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button variant="outlined" onClick={handleApplyPromo}>
            Apply
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            p: 1.5,
            bgcolor: alpha(theme.palette.success.main, 0.1),
            borderRadius: 1,
          }}
        >
          <CheckCircleIcon color="success" fontSize="small" />
          <Typography variant="body2" color="success.main">
            Promo code applied
          </Typography>
        </Box>
      )}

      {/* Total */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Total
        </Typography>
        <Typography variant="h5" fontWeight={700} color="primary">
          Nu {total.toFixed(2)}
        </Typography>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Includes all taxes and fees. No hidden charges.
      </Typography>
    </Box>
  );
}
