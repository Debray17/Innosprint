// src/components/User/Property/RecentlyViewedSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// Mock recently viewed data
const recentlyViewed = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    location: "New York, NY",
    rating: 4.8,
    price: 199,
    viewedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Sunset Beach Resort",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    location: "Miami Beach, FL",
    rating: 4.6,
    price: 349,
    viewedAt: "Yesterday",
  },
  {
    id: 3,
    name: "Mountain View Villa",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    location: "Aspen, CO",
    rating: 4.9,
    price: 599,
    viewedAt: "2 days ago",
  },
  {
    id: 4,
    name: "Urban Loft Apartments",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    location: "San Francisco, CA",
    rating: 4.5,
    price: 179,
    viewedAt: "3 days ago",
  },
];

export default function RecentlyViewedSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <Box sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Recently Viewed
        </Typography>
        <Box>
          <IconButton onClick={() => scroll("left")} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={() => scroll("right")} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          pb: 1,
        }}
      >
        {recentlyViewed.map((property) => (
          <Card
            key={property.id}
            onClick={() => navigate(`/property/${property.id}`)}
            sx={{
              minWidth: 260,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardMedia
              component="img"
              height={140}
              image={property.image}
              alt={property.name}
            />
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mb: 0.5,
                }}
              >
                <StarIcon
                  sx={{ fontSize: 14, color: theme.palette.warning.main }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {property.rating}
                </Typography>
              </Box>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {property.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon
                  sx={{ fontSize: 12, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {property.location}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={600}
                >
                  Nu {property.price}/night
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {property.viewedAt}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
