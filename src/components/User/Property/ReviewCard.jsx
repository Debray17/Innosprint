// src/components/User/Property/ReviewCard.jsx
import React from "react";
import { Box, Typography, Avatar, Rating, Chip, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";

export default function ReviewCard({ review }) {
  const theme = useTheme();

  const {
    guestName,
    guestCountry,
    rating,
    title,
    comment,
    date,
    roomType,
    tripType,
    helpful,
    response,
  } = review;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Box sx={{ py: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Avatar
          sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}
        >
          {guestName.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600}>{guestName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {guestCountry}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Rating value={rating} readOnly size="small" precision={0.5} />
            <Typography variant="body2" fontWeight={600}>
              {rating}/5
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(date)}
          </Typography>
        </Box>
      </Box>

      {/* Room & Trip Type */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Chip label={roomType} size="small" variant="outlined" />
        <Chip label={tripType} size="small" variant="outlined" />
      </Box>

      {/* Review Content */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {comment}
      </Typography>

      {/* Host Response */}
      {response && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            mt: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Response from property
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {response.text}
          </Typography>
        </Box>
      )}

      {/* Helpful */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
        <Button
          size="small"
          startIcon={<ThumbUpOutlinedIcon />}
          sx={{ color: "text.secondary" }}
        >
          Helpful ({helpful || 0})
        </Button>
      </Box>
    </Box>
  );
}
