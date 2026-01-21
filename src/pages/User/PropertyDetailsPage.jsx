// src/pages/User/PropertyDetailsPage.jsx
import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Rating,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import SpaIcon from "@mui/icons-material/Spa";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import PetsIcon from "@mui/icons-material/Pets";
import SmokeFreeIcon from "@mui/icons-material/SmokeFree";

import SearchBar from "../../components/User/Search/SearchBar";
import RoomCard from "../../components/User/Property/RoomCard";
import ReviewCard from "../../components/User/Property/ReviewCard";
import ImageGalleryModal from "../../components/User/Modals/ImageGalleryModal";
import { propertyDetails } from "../../data/userMockData";

const amenityIcons = {
  "Free WiFi": WifiIcon,
  "Swimming Pool": PoolIcon,
  "Spa & Wellness": SpaIcon,
  "Fitness Center": FitnessCenterIcon,
  Restaurant: RestaurantIcon,
  "Bar/Lounge": LocalBarIcon,
  "Room Service": RoomServiceIcon,
  "Free Parking": LocalParkingIcon,
  "Air Conditioning": AcUnitIcon,
};

export default function PropertyDetailsPage() {
  const theme = useTheme();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // In real app, fetch property by id
  const property = propertyDetails;

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const handleImageClick = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", pb: 4 }}>
      {/* Search Bar */}
      <Box
        sx={{ bgcolor: "#fff", py: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <Container maxWidth="lg">
          <SearchBar variant="compact" />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {/* Image Gallery */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
          <Grid container sx={{ height: { xs: 300, md: 450 } }}>
            {/* Main Image */}
            <Grid size={{xs:12, md:6 }}>
              <Box
                onClick={() => handleImageClick(0)}
                sx={{
                  height: "100%",
                  backgroundImage: `url(${property.images[0]?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  "&:hover": { opacity: 0.9 },
                }}
              />
            </Grid>

            {/* Side Images */}
            <Grid size={{xs:12, md:6 }}>
              <Grid container sx={{ height: "100%" }}>
                {property.images.slice(1, 5).map((image, index) => (
                  <Grid size={{xs:6 }} key={image.id} sx={{ height: "50%" }}>
                    <Box
                      onClick={() => handleImageClick(index + 1)}
                      sx={{
                        height: "100%",
                        backgroundImage: `url(${image.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                        borderLeft: "2px solid #fff",
                        borderTop: index >= 2 ? "2px solid #fff" : "none",
                        position: "relative",
                        transition: "opacity 0.2s",
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      {index === 3 && property.images.length > 5 && (
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h6" color="#fff">
                            +{property.images.length - 5} photos
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Property Details */}
          <Grid size={{xs:12, sm:8 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={property.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    {property.stars && (
                      <Box sx={{ display: "flex" }}>
                        {Array.from({ length: property.stars }).map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{
                              fontSize: 16,
                              color: theme.palette.warning.main,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {property.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      {property.location.address}, {property.location.city},{" "}
                      {property.location.state}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton onClick={() => setIsFavorite(!isFavorite)}>
                    {isFavorite ? (
                      <FavoriteIcon sx={{ color: theme.palette.error.main }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Rating */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 700,
                  }}
                >
                  {property.rating}
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Excellent
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {property.reviewsCount} reviews
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab label="Overview" />
                <Tab label="Rooms" />
                <Tab label="Amenities" />
                <Tab label="Reviews" />
                <Tab label="Policies" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Overview Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      About this property
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {property.description}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* Popular Amenities */}
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Popular Amenities
                    </Typography>
                    <Grid container spacing={2}>
                      {property.amenities.slice(0, 8).map((amenity) => {
                        const IconComponent =
                          amenityIcons[amenity.name] || CheckCircleIcon;
                        return (
                          <Grid size={{xs:6, sm:4 }} key={amenity.name}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <IconComponent color="primary" />
                              <Typography variant="body2">
                                {amenity.name}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Rooms Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Available Rooms
                    </Typography>
                    {property.rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        propertyId={property.id}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests ? JSON.parse(guests) : null}
                      />
                    ))}
                  </Box>
                )}

                {/* Amenities Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      All Amenities
                    </Typography>
                    <Grid container spacing={2}>
                      {property.amenities.map((amenity) => {
                        const IconComponent =
                          amenityIcons[amenity.name] || CheckCircleIcon;
                        return (
                          <Grid size={{xs:12, sm:6, md:4 }} key={amenity.name}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 1.5,
                                bgcolor: "grey.50",
                                borderRadius: 1,
                              }}
                            >
                              <IconComponent color="primary" />
                              <Typography variant="body2">
                                {amenity.name}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                )}

                {/* Reviews Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Guest Reviews
                      </Typography>
                      <Button variant="outlined">Write a Review</Button>
                    </Box>

                    {/* Rating Summary */}
                    <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
                      <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:4 }}>
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              variant="h2"
                              fontWeight={700}
                              color="primary"
                            >
                              {property.rating}
                            </Typography>
                            <Rating
                              value={property.rating}
                              readOnly
                              precision={0.1}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Based on {property.reviewsCount} reviews
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{xs:12, sm:8, md:2 }}>
                          {/* Rating breakdown would go here */}
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Reviews List */}
                    {property.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </Box>
                )}

                {/* Policies Tab */}
                {activeTab === 4 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      House Rules & Policies
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <AccessTimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Check-in / Check-out"
                          secondary={`Check-in: ${property.policies.checkIn} | Check-out: ${property.policies.checkOut}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Cancellation Policy"
                          secondary={property.policies.cancellation}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ChildCareIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Children"
                          secondary={property.policies.children}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PetsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Pets"
                          secondary={property.policies.pets}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SmokeFreeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Smoking"
                          secondary="Non-smoking property"
                        />
                      </ListItem>
                    </List>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Booking Widget */}
          <Grid size={{xs:12, md:4 }}>
            <Paper sx={{ p: 3, position: "sticky", top: 100 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Reserve Your Stay
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}
              >
                <Typography variant="h4" fontWeight={700} color="primary">
                  Nu {property.rooms[0]?.pricePerNight || 199}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / night
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3 }}
              >
                <StarIcon
                  sx={{ fontSize: 18, color: theme.palette.warning.main }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {property.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({property.reviewsCount} reviews)
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select dates and room type above to see the final price
              </Typography>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setActiveTab(1)}
              >
                View Available Rooms
              </Button>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="success.main"
                  >
                    Free cancellation available
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Cancel up to 24 hours before check-in for a full refund
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={property.images}
        initialIndex={galleryIndex}
      />
    </Box>
  );
}
