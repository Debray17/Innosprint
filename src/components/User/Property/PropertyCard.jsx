// src/components/User/Property/PropertyCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    // Rating,
    Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const amenityIcons = {
    WiFi: WifiIcon,
    Pool: PoolIcon,
    Restaurant: RestaurantIcon,
    Parking: LocalParkingIcon,
    Gym: FitnessCenterIcon,
};

export default function PropertyCard({ property, loading = false }) {
    const theme = useTheme();
    const navigate = useNavigate();

    if (loading) {
        return (
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" height={28} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="text" width="50%" height={32} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    const {
        id,
        name,
        type,
        location,
        images,
        rating,
        reviewsCount,
        pricePerNight,
        originalPrice,
        discount,
        amenities,
        freeCancellation,
        breakfastIncluded,
    } = property;

    const handleClick = () => {
        navigate(`/property/${id}`);
    };

    return (
        <Card
            onClick={handleClick}
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                },
            }}
        >
            {/* Image Section */}
            <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
                <CardMedia
                    component="img"
                    height={200}
                    image={images?.[0] || "/placeholder-hotel.jpg"}
                    alt={name}
                    sx={{ height: 200, width: "100%", objectFit: "cover" }}
                />

                {/* Discount Badge */}
                {discount > 0 && (
                    <Chip
                        label={`${discount}% OFF`}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            bgcolor: theme.palette.error.main,
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    />
                )}

                {/* Favorite Button */}
                <IconButton
                    onClick={(e) => e.stopPropagation()}
                    disabled
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255,255,255,0.9)",
                        "&:hover": { bgcolor: "#fff" },
                    }}
                >
                    {/* Wishlist logic is temporarily disabled. */}
                    <FavoriteBorderIcon />
                </IconButton>

                {/* Property Type Badge */}
                <Chip
                    label={type}
                    size="small"
                    sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "#fff",
                    }}
                />
            </Box>

            {/* Content Section */}
            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: 220,
                    overflow: "hidden",
                }}
            >
                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                    <StarIcon sx={{ fontSize: 18, color: theme.palette.warning.main }} />
                    <Typography variant="body2" fontWeight={600}>
                        {rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ({reviewsCount} reviews)
                    </Typography>
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 0.5,
                        minHeight: 48,
                    }}
                >
                    {name}
                </Typography>

                {/* Location */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {location.city}, {location.state}
                    </Typography>
                </Box>

                {/* Amenities */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mb: 1.5,
                        flexWrap: "wrap",
                        minHeight: 28,
                    }}
                >
                    {amenities?.slice(0, 4).map((amenity) => {
                        const IconComponent = amenityIcons[amenity];
                        return (
                            <Box
                                key={amenity}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.3,
                                    color: "text.secondary",
                                }}
                            >
                                {IconComponent && <IconComponent sx={{ fontSize: 14 }} />}
                                <Typography variant="caption">{amenity}</Typography>
                            </Box>
                        );
                    })}
                </Box>

                {/* Tags */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        mb: 1.5,
                        flexWrap: "wrap",
                        minHeight: 28,
                    }}
                >
                    {freeCancellation && (
                        <Chip
                            label="Free Cancellation"
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{ fontSize: 11 }}
                        />
                    )}
                    {breakfastIncluded && (
                        <Chip
                            label="Breakfast Included"
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: 11 }}
                        />
                    )}
                </Box>

                {/* Price */}
                <Box sx={{ mt: "auto", pt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
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
                        <Typography variant="h5" fontWeight={700} color="primary">
                            Nu {pricePerNight}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            / night
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
