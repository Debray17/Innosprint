// src/pages/User/HomePage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/User/Search/SearchBar";
import PropertyCard from "../../components/User/Property/PropertyCard";
import {
  popularDestinations,
  featuredProperties,
  propertyCategories,
  specialOffers,
} from "../../data/userMockData";

// Icons
import HotelIcon from "@mui/icons-material/Hotel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import VillaIcon from "@mui/icons-material/Villa";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeIcon from "@mui/icons-material/Home";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";

const categoryIcons = {
  Hotels: HotelIcon,
  Resorts: BeachAccessIcon,
  Villas: VillaIcon,
  Apartments: ApartmentIcon,
  Homestays: HomeIcon,
  Hostels: NightShelterIcon,
};

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleFavoriteToggle = (propertyId) => {
    console.log("Toggle favorite:", propertyId);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "80vh", md: "90vh" },
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: -8,
          pt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", color: "#fff", mb: 4 }}>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              Find Your Perfect Stay
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Discover amazing hotels, resorts, villas, and homestays at the
              best prices
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 1000, mx: "auto" }}>
            <SearchBar />
          </Box>

          {/* Quick Stats */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 3, md: 6 },
              mt: 4,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "10,000+", label: "Properties" },
              { value: "50,000+", label: "Happy Guests" },
              { value: "100+", label: "Destinations" },
              { value: "4.8", label: "Avg Rating" },
            ].map((stat) => (
              <Box key={stat.label} sx={{ textAlign: "center", color: "#fff" }}>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Property Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Browse by Property Type
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Find the perfect accommodation for your next trip
        </Typography>

        <Grid container spacing={2}>
          {propertyCategories.map((category) => {
            const IconComponent = categoryIcons[category.name] || HotelIcon;
            return (
              <Grid size={{xs:6, sm:4, md:2 }} key={category.id}>
                <Card
                  onClick={() =>
                    navigate(`/search?type=${category.name.toLowerCase()}`)
                  }
                  sx={{
                    textAlign: "center",
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      "& .category-icon": {
                        bgcolor: theme.palette.primary.main,
                        color: "#fff",
                      },
                    },
                  }}
                >
                  <Box
                    className="category-icon"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      transition: "all 0.3s",
                    }}
                  >
                    <IconComponent
                      sx={{ fontSize: 28, color: theme.palette.primary.main }}
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.count} properties
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Popular Destinations */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Popular Destinations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore trending destinations loved by travelers
              </Typography>
            </Box>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/search")}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {popularDestinations.slice(0, 6).map((destination, index) => (
              <Grid size={{xs:12, sm:6, md:4 }} key={destination.id}>
                <Card
                  onClick={() =>
                    navigate(`/search?destination=${destination.name}`)
                  }
                  sx={{
                    position: "relative",
                    height: index === 0 || index === 3 ? 300 : 200,
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover img": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={destination.image}
                    alt={destination.name}
                    sx={{
                      height: "100%",
                      transition: "transform 0.5s",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      p: 2,
                      color: "#fff",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {destination.propertiesCount} properties • From Nu
                      {destination.startingPrice}/night
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Properties */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Featured Properties
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Handpicked accommodations for an unforgettable experience
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/search?featured=true")}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredProperties.slice(0, 4).map((property) => (
            <Grid size={{xs:12, sm:6, md:3 }} key={property.id}>
              <PropertyCard
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Special Offers */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Special Offers
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Exclusive deals and discounts just for you
          </Typography>

          <Grid container spacing={3}>
            {specialOffers.map((offer) => (
              <Grid size={{xs:12, md:4 }} key={offer.id}>
                <Card
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height={200}
                    image={offer.image}
                    alt={offer.title}
                  />
                  <Chip
                    label={`Save ${typeof offer.discount === "number" && offer.discount > 50 ? `Nu ${offer.discount}` : `${offer.discount}%`}`}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: theme.palette.error.main,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {offer.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {offer.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Chip
                        label={offer.code}
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                      <Button size="small">Apply Now</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Why Book With Us
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          We're committed to making your travel experience seamless
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: StarIcon,
              title: "Best Price Guarantee",
              description:
                "Find a lower price? We'll match it and give you an additional 10% off.",
            },
            {
              icon: VerifiedIcon,
              title: "Verified Properties",
              description:
                "All our properties are verified and reviewed to ensure quality standards.",
            },
            {
              icon: SupportAgentIcon,
              title: "24/7 Support",
              description:
                "Our customer support team is available around the clock to assist you.",
            },
            {
              icon: PaymentIcon,
              title: "Secure Payments",
              description:
                "Your payments are protected with bank-level security encryption.",
            },
          ].map((feature) => (
            <Grid size={{xs:12, sm:6, md:3 }} key={feature.title}>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <feature.icon
                    sx={{ fontSize: 36, color: theme.palette.primary.main }}
                  />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Get Exclusive Deals
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Subscribe to our newsletter and receive special offers directly in
            your inbox
          </Typography>
          <Box
            component="form"
            sx={{
              display: "flex",
              gap: 1,
              maxWidth: 500,
              mx: "auto",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              component="input"
              placeholder="Enter your email"
              sx={{
                flex: 1,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                border: "none",
                fontSize: 16,
                outline: "none",
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: theme.palette.primary.main,
                px: 4,
                "&:hover": {
                  bgcolor: alpha("#fff", 0.9),
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
