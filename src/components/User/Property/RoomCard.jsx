// src/components/User/Property/RoomCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  Collapse,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import BedIcon from "@mui/icons-material/Bed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function RoomCard({
  room,
  propertyId,
  checkIn,
  checkOut,
  guests,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const {
    id,
    name,
    // description,
    size,
    maxGuests,
    bedType,
    images,
    amenities,
    pricePerNight,
    originalPrice,
    availableRooms,
    freeCancellation,
    breakfastIncluded,
    breakfastPrice,
  } = room;

  const handleReserve = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", JSON.stringify(guests));

    navigate(`/booking/${propertyId}/${id}?${params.toString()}`);
  };

  const discount = originalPrice
    ? Math.round((1 - pricePerNight / originalPrice) * 100)
    : 0;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Grid container>
          {/* Room Image */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                height: { xs: 200, md: "100%" },
                minHeight: { md: 200 },
                backgroundImage: `url(${images?.[0] || "/placeholder-room.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Grid>

          {/* Room Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {name}
              </Typography>

              {/* Room Info */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {maxGuests} Guest{maxGuests > 1 ? "s" : ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <BedIcon fontSize="small" color="action" />
                  <Typography variant="body2">{bedType}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SquareFootIcon fontSize="small" color="action" />
                  <Typography variant="body2">{size} m²</Typography>
                </Box>
              </Box>

              {/* Tags */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {freeCancellation && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Free Cancellation"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {breakfastIncluded && (
                  <Chip
                    label="Breakfast Included"
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Expandable Amenities */}
              <Box>
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ textTransform: "none", p: 0 }}
                >
                  Room Amenities
                </Button>
                <Collapse in={expanded}>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                  >
                    {amenities?.map((amenity) => (
                      <Chip
                        key={amenity}
                        label={amenity}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            </Box>
          </Grid>

          {/* Price & Action */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                p: 2.5,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderLeft: { md: `1px solid ${theme.palette.divider}` },
                borderTop: {
                  xs: `1px solid ${theme.palette.divider}`,
                  md: "none",
                },
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              {discount > 0 && (
                <Chip
                  label={`${discount}% OFF`}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.error.main,
                    color: "#fff",
                    fontWeight: 600,
                    alignSelf: "flex-start",
                    mb: 1,
                  }}
                />
              )}

              <Box sx={{ mb: 1 }}>
                {originalPrice && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    Nu {originalPrice}
                  </Typography>
                )}
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    Nu {pricePerNight}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / night
                  </Typography>
                </Box>
              </Box>

              {!breakfastIncluded && breakfastPrice > 0 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  + Nu {breakfastPrice} breakfast (optional)
                </Typography>
              )}

              <Typography
                variant="body2"
                color={availableRooms <= 3 ? "error.main" : "text.secondary"}
                sx={{ mb: 2 }}
              >
                {availableRooms <= 3
                  ? `Only ${availableRooms} left!`
                  : `${availableRooms} rooms available`}
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={handleReserve}
                size="large"
              >
                Reserve
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
