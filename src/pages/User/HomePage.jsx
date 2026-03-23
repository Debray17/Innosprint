// src/pages/User/HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography, Card, CardContent, CardMedia, Button, Chip, Paper } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/User/Search/SearchBar";
import PropertyCard from "../../components/User/Property/PropertyCard";
import {
  popularDestinations,
  featuredProperties,
  propertyCategories,
  specialOffers } from
"../../data/userMockData";
import { getPropertyTypeList } from "../../services/propertyTypeService";
import { getPropertyList } from "../../services/propertyService";
import { getRoomList } from "../../services/roomService";
import { getSeasonalPricingList } from "../../services/seasonalPricingService";
import { getRoomSeasonalPricingList } from "../../services/roomSeasonalPricingService";

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
  Hostels: NightShelterIcon
};

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [propertyTypes, setPropertyTypes] = useState(propertyCategories);
  const [featuredPropertiesData, setFeaturedPropertiesData] =
  useState(featuredProperties);
  const [seasonalRoomOffers, setSeasonalRoomOffers] = useState([]);
  const [cityStats, setCityStats] = useState({});
  const [dbDestinations, setDbDestinations] = useState([]);

  const handleFavoriteToggle = (propertyId) => {
    console.log("Toggle favorite:", propertyId);
  };

  const formatShortDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const normalizeText = (value) =>
    (value || "").
      toString().
      trim().
      toLowerCase();

  const propertyTypeIconMap = useMemo(
    () => ({
      hotel: HotelIcon,
      resort: BeachAccessIcon,
      beach: BeachAccessIcon,
      villa: VillaIcon,
      apartment: ApartmentIcon,
      home: HomeIcon,
      homestay: HomeIcon,
      hostel: NightShelterIcon,
    }),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchPropertyTypes = async () => {
      try {
        const response = await getPropertyTypeList({ language: "en" });
        const list = Array.isArray(response) ? response : response ? [response] : [];
        const normalized = list
          .filter((item) => item?.isActive !== false)
          .map((item, index) => ({
            id: item?.id || item?.primaryKeyValue || index,
            name: item?.name || "Unknown",
            description: item?.description || "",
            icon: (item?.icon || "").toString(),
            count: null,
          }));

        if (isMounted) {
          setPropertyTypes(normalized);
        }
      } catch (err) {
        // Fall back to mock categories on error.
        if (isMounted) setPropertyTypes(propertyCategories);
      }
    };

    fetchPropertyTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  const propertyTypeNameById = useMemo(() => {
    const map = new Map();
    propertyTypes.forEach((type) => {
      if (type?.id != null) {
        map.set(type.id, type.name || "Property");
      }
    });
    return map;
  }, [propertyTypes]);

  useEffect(() => {
    let isMounted = true;

    const fetchCityStats = async () => {
      try {
        const [propertiesResponse, roomsResponse] = await Promise.all([
          getPropertyList({ language: "en" }),
          getRoomList({ language: "en" }),
        ]);

        const propertiesList = Array.isArray(propertiesResponse) ?
        propertiesResponse :
        propertiesResponse ?
        [propertiesResponse] :
        [];

        const roomsList = Array.isArray(roomsResponse) ?
        roomsResponse :
        roomsResponse ?
        [roomsResponse] :
        [];

        const minRoomPriceByPropertyId = {};
        roomsList.
        filter((room) => room?.isActive !== false).
        forEach((room) => {
          const propertyId = room?.propertyId;
          if (!propertyId) return;
          const price = Number(room?.basePrise);
          if (!Number.isFinite(price) || price <= 0) return;
          const prev = minRoomPriceByPropertyId[propertyId];
          if (prev == null || price < prev) {
            minRoomPriceByPropertyId[propertyId] = price;
          }
        });

        const nextStats = {};
        const cityDisplayByKey = {};
        propertiesList.
        filter((property) => property?.isActive !== false).
        forEach((property) => {
          const cityKey = normalizeText(property?.city);
          if (!cityKey) return;
          if (!cityDisplayByKey[cityKey] && property?.city) {
            cityDisplayByKey[cityKey] = property.city.toString().trim();
          }

          const prev = nextStats[cityKey] || { count: 0, minPrice: null };
          prev.count += 1;

          const roomMin = minRoomPriceByPropertyId[property?.id];
          if (Number.isFinite(roomMin)) {
            prev.minPrice =
              prev.minPrice == null ? roomMin : Math.min(prev.minPrice, roomMin);
          }

          nextStats[cityKey] = prev;
        });

        const destinationImages =
        popularDestinations.map((destination) => destination.image).
        filter(Boolean);

        const destinationsFromDb = Object.entries(nextStats).
        map(([cityKey, stats], index) => ({
          id: cityKey,
          name: cityDisplayByKey[cityKey] || cityKey,
          image: destinationImages.length > 0 ?
          destinationImages[index % destinationImages.length] :
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          propertiesCount: stats?.count ?? 0,
          startingPrice: stats?.minPrice ?? 0,
        })).
        sort((a, b) => (b.propertiesCount || 0) - (a.propertiesCount || 0)).
        slice(0, 6);

        if (isMounted) {
          setCityStats(nextStats);
          setDbDestinations(destinationsFromDb);
        }
      } catch (err) {
        if (isMounted) {
          setCityStats({});
          setDbDestinations([]);
        }
      }
    };

    fetchCityStats();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedProperties = async () => {
      try {
        const response = await getPropertyList({ language: "en" });
        const list = Array.isArray(response) ? response : response ? [response] : [];
        const normalized = list
          .filter((item) => item?.isActive !== false)
          .map((item, index) => {
            const typeName =
              propertyTypeNameById.get(item?.propertyTypeId) ||
              item?.icon ||
              "Property";

            return {
              id: item?.id || item?.primaryKeyValue || index,
              name: item?.name || "Untitled Property",
              type: typeName,
              location: {
                city: item?.city || "",
                state: item?.country || "",
              },
              images: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
              ],
              rating: Number(item?.rating) || 0,
              reviewsCount: Number(item?.reviewCount) || 0,
              pricePerNight: 0,
              originalPrice: null,
              discount: 0,
              amenities: [],
              isFavorite: false,
              freeCancellation: false,
              breakfastIncluded: false,
            };
          });

        if (isMounted && normalized.length > 0) {
          setFeaturedPropertiesData(normalized);
        }
      } catch (err) {
        if (isMounted) setFeaturedPropertiesData(featuredProperties);
      }
    };

    fetchFeaturedProperties();

    return () => {
      isMounted = false;
    };
  }, [propertyTypeNameById]);

  useEffect(() => {
    let isMounted = true;

    const fetchSeasonalRoomOffers = async () => {
      try {
        const [roomSeasonal, rooms, seasons] = await Promise.all([
          getRoomSeasonalPricingList({ language: "en" }),
          getRoomList({ language: "en" }),
          getSeasonalPricingList({ language: "en" }),
        ]);

        const roomSeasonalList = Array.isArray(roomSeasonal)
          ? roomSeasonal
          : roomSeasonal
            ? [roomSeasonal]
            : [];
        const roomsList = Array.isArray(rooms) ? rooms : rooms ? [rooms] : [];
        const seasonsList = Array.isArray(seasons)
          ? seasons
          : seasons
            ? [seasons]
            : [];

        const roomsById = new Map(
          roomsList
            .filter((room) => room?.isActive !== false)
            .map((room) => [room.id || room.primaryKeyValue, room]),
        );

        const seasonsById = new Map(
          seasonsList
            .filter((season) => season?.isActive !== false)
            .map((season) => [season.id || season.primaryKeyValue, season]),
        );

        const images = [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        ];

        const normalized = roomSeasonalList
          .filter((item) => item?.isActive !== false)
          .map((item, index) => {
            const room = roomsById.get(item?.roomId) || null;
            const season = seasonsById.get(item?.seasonalPricingId) || null;
            const basePrice = Number(room?.basePrise) || 0;
            const seasonalPrice = Number(item?.price) || 0;
            const saveAmount =
              basePrice > 0 && seasonalPrice > 0 && basePrice > seasonalPrice
                ? basePrice - seasonalPrice
                : 0;

            const seasonLabel = season?.name || "Seasonal Pricing";
            const validity =
              season?.startDate && season?.endDate
                ? `${formatShortDate(season.startDate)} - ${formatShortDate(season.endDate)}`
                : "";

            return {
              id: item?.id || item?.primaryKeyValue || index,
              title: seasonLabel,
              description: [
                room?.roomNo ? `Room ${room.roomNo}` : null,
                room?.capacity ? `Capacity ${room.capacity}` : null,
                validity ? `Valid ${validity}` : null,
              ]
                .filter(Boolean)
                .join(" • "),
              code: room?.roomNo ? `ROOM-${room.roomNo}` : "SEASONAL",
              discount: saveAmount,
              price: seasonalPrice,
              image: images[index % images.length],
              roomId: item?.roomId || null,
              seasonalPricingId: item?.seasonalPricingId || null,
            };
          })
          .filter((offer) => offer.price > 0);

        if (isMounted) {
          setSeasonalRoomOffers(normalized);
        }
      } catch (err) {
        if (isMounted) setSeasonalRoomOffers([]);
      }
    };

    fetchSeasonalRoomOffers();

    return () => {
      isMounted = false;
    };
  }, []);

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
          pt: 8
        }}>

        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", color: "#fff", mb: 4 }}>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" }
              }}>

              Find Your Perfect Stay
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" }
              }}>

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
              flexWrap: "wrap"
            }}>

            {[
              { value: "10,000+", label: "Properties" },
              { value: "50,000+", label: "Happy Guests" },
              { value: "100+", label: "Destinations" },
              { value: "4.8", label: "Avg Rating" },
            ].map((stat) =>
            <Box key={stat.label} sx={{ textAlign: "center", color: "#fff" }}>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Property Categories */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom>

          Browse by Property Type
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}>

          Find the perfect accommodation for your next trip
        </Typography>

        <Grid container spacing={2}>
          {propertyTypes.map((category) => {
            const IconComponent =
              propertyTypeIconMap[category.icon.toLowerCase()] ||
              categoryIcons[category.name] ||
              HotelIcon;
            return (
              <Grid item key={category.id} xs={6} sm={4} md={2}>
                <Card
                  onClick={() =>
                  navigate(
                    `/search?type=${category.name.toLowerCase()}`,
                  )
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
                        color: "#fff"
                      }
                    }
                  }}>

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
                      transition: "all 0.3s"
                    }}>

                    <IconComponent
                      sx={{ fontSize: 28, color: theme.palette.primary.main }} />

                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description ||
                    (category.count != null ? `${category.count} properties` : "\u00a0")}
                  </Typography>
                </Card>
              </Grid>);

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
              mb: 4
            }}>

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
              sx={{ display: { xs: "none", sm: "flex" } }}>

              View All
            </Button>
          </Box>

          {dbDestinations.length > 0 ?
          <Grid container spacing={3}>
              {dbDestinations.map((destination, index) => (
              <Grid item key={destination.id} xs={12} sm={6} md={4}>
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
                    transform: "scale(1.1)"
                  }
                }}>

                  <CardMedia
                  component="img"
                  image={destination.image}
                  alt={destination.name}
                  sx={{
                    height: "100%",
                    transition: "transform 0.5s"
                  }} />

                  <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                    "linear-gradient(transparent, rgba(0,0,0,0.8))",
                    p: 2,
                    color: "#fff"
                  }}>

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
            </Grid> :

          <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No destinations available yet.
              </Typography>
            </Paper>
          }
        </Container>
      </Box>

      {/* Featured Properties */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4
          }}>

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
            sx={{ display: { xs: "none", sm: "flex" } }}>

            View All
          </Button>
        </Box>

        <Grid container spacing={3}>
          {featuredPropertiesData.slice(0, 4).map((property) =>
          <Grid item key={property.id} xs={12} sm={6} md={3}>
              <PropertyCard
              property={property}
              onFavoriteToggle={handleFavoriteToggle} />

            </Grid>
          )}
        </Grid>
      </Container>

      {/* Special Offers */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom>

            Seasonal Offers
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}>

            Exclusive deals and discounts just for you
          </Typography>

          <Grid container spacing={3}>
            {(seasonalRoomOffers.length > 0 ? seasonalRoomOffers : specialOffers).map((offer) =>
            <Grid item key={offer.id} xs={12} md={4}>
                <Card
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                  }
                }}>

                  <CardMedia
                  component="img"
                  height={200}
                  image={offer.image}
                  alt={offer.title} />

                  <Chip
                  label={
                  typeof offer.price === "number" && offer.price > 0 ?
                  `Nu ${offer.price}` :
                  `Save ${typeof offer.discount === "number" && offer.discount > 50 ? `Nu ${offer.discount}` : `${offer.discount}%`}`
                  }
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: theme.palette.error.main,
                    color: "#fff",
                    fontWeight: 600
                  }} />

                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {offer.title}
                    </Typography>
                    <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom>

                      {offer.description}
                    </Typography>
                    <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2
                    }}>

                      <Chip
                      label={offer.code}
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600 }} />

                      <Button
                      size="small"
                      onClick={() => navigate("/search?special=seasonal")}>

                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom>

          Why Book With Us
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}>

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
          ].map((feature) =>
          <Grid item key={feature.title} xs={12} sm={6} md={3}>
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
                  mb: 2
                }}>

                  <feature.icon
                  sx={{ fontSize: 36, color: theme.palette.primary.main }} />

                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Newsletter Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 6
        }}>

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
              flexDirection: { xs: "column", sm: "row" }
            }}>

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
                outline: "none"
              }} />

            <Button
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: theme.palette.primary.main,
                px: 4,
                "&:hover": {
                  bgcolor: alpha("#fff", 0.9)
                }
              }}>

              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>);

}
