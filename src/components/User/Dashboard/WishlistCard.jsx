// src/components/User/Dashboard/WishlistCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Rating,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";

export default function WishlistCard({ item, onRemove }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { property, addedAt } = item;

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(item.id);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        display: "flex",
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 160, height: 140, objectFit: "cover" }}
        image={property.images?.[0]}
        alt={property.name}
      />
      <CardContent
        sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              <StarIcon
                sx={{ fontSize: 16, color: theme.palette.warning.main }}
              />
              <Typography variant="body2" fontWeight={600}>
                {property.rating}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({property.reviewsCount})
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {property.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {property.location.city}, {property.location.state}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleRemove} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mt: "auto", pt: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            Nu {property.pricePerNight}
            <Typography component="span" variant="body2" color="text.secondary">
              {" "}
              / night
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
