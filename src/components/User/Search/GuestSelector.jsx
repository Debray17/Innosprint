// src/components/User/Search/GuestSelector.jsx
import React from "react";
import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function GuestSelector({ guests, onChange, onClose }) {
  const handleChange = (field, delta) => {
    const newValue = guests[field] + delta;

    // Validation
    if (field === "adults" && newValue < 1) return;
    if (field === "children" && newValue < 0) return;
    if (field === "rooms" && newValue < 1) return;
    if (field === "adults" && newValue > 10) return;
    if (field === "children" && newValue > 6) return;
    if (field === "rooms" && newValue > 5) return;

    onChange({ ...guests, [field]: newValue });
  };

  const CounterRow = ({ label, sublabel, field, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 1.5,
      }}
    >
      <Box>
        <Typography fontWeight={500}>{label}</Typography>
        {sublabel && (
          <Typography variant="caption" color="text.secondary">
            {sublabel}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => handleChange(field, -1)}
          disabled={
            field === "adults" || field === "rooms" ? value <= 1 : value <= 0
          }
          sx={{
            border: "1px solid",
            borderColor: "divider",
            "&:disabled": { opacity: 0.4 },
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ minWidth: 24, textAlign: "center", fontWeight: 500 }}>
          {value}
        </Typography>
        <IconButton
          size="small"
          onClick={() => handleChange(field, 1)}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box>
      <CounterRow
        label="Adults"
        sublabel="Age 13+"
        field="adults"
        value={guests.adults}
      />
      <Divider />
      <CounterRow
        label="Children"
        sublabel="Ages 0-12"
        field="children"
        value={guests.children}
      />
      <Divider />
      <CounterRow label="Rooms" field="rooms" value={guests.rooms} />

      <Button fullWidth variant="contained" onClick={onClose} sx={{ mt: 2 }}>
        Done
      </Button>
    </Box>
  );
}
