// src/pages/User/SeasonalOffersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Pagination,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { getRoomSeasonalPricingList } from "../../services/roomSeasonalPricingService";
import { getRoomList } from "../../services/roomService";
import { getSeasonalPricingList } from "../../services/seasonalPricingService";
import { getPropertyList } from "../../services/propertyService";

const fallbackImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
];

const formatShortDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function SeasonalOffersPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    let isMounted = true;

    const fetchSeasonalOffers = async () => {
      try {
        const [roomSeasonal, rooms, seasons, properties] = await Promise.all([
          getRoomSeasonalPricingList({ language: "en" }),
          getRoomList({ language: "en" }),
          getSeasonalPricingList({ language: "en" }),
          getPropertyList({ language: "en" }),
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
        const propertiesList = Array.isArray(properties)
          ? properties
          : properties
            ? [properties]
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
        const propertiesById = new Map(
          propertiesList
            .filter((property) => property?.isActive !== false)
            .map((property) => [property.id || property.primaryKeyValue, property]),
        );

        const normalized = roomSeasonalList
          .filter((item) => item?.isActive !== false)
          .map((item, index) => {
            const room = roomsById.get(item?.roomId) || null;
            const season = seasonsById.get(item?.seasonalPricingId) || null;
            const property = propertiesById.get(room?.propertyId) || null;
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
                property?.name ? property.name : null,
                room?.roomNo ? `Room ${room.roomNo}` : null,
                room?.capacity ? `Capacity ${room.capacity}` : null,
                validity ? `Valid ${validity}` : null,
              ]
                .filter(Boolean)
                .join(" • "),
              code: room?.roomNo ? `ROOM-${room.roomNo}` : "SEASONAL",
              discount: saveAmount,
              price: seasonalPrice,
              image: fallbackImages[index % fallbackImages.length],
              propertyId: room?.propertyId || null,
            };
          })
          .filter((offer) => offer.price > 0);

        if (isMounted) {
          setOffers(normalized);
        }
      } catch (err) {
        if (isMounted) setOffers([]);
      }
    };

    fetchSeasonalOffers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [offers.length]);

  const totalPages = Math.max(1, Math.ceil(offers.length / pageSize));
  const pagedOffers = offers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Seasonal Offers
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Browse all seasonal pricing deals available right now.
        </Typography>

        {offers.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No seasonal offers available yet.
          </Typography>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {pagedOffers.map((offer) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={offer.id}>
              <Card
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height={200}
                  image={offer.image}
                  alt={offer.title}
                />
                <Chip
                  label={
                    typeof offer.price === "number" && offer.price > 0
                      ? `Nu ${offer.price}`
                      : `Save ${typeof offer.discount === "number" && offer.discount > 50 ? `Nu ${offer.discount}` : `${offer.discount}%`}`
                  }
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "error.main",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {offer.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {offer.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                    <Chip
                      label={offer.code}
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    {offer.propertyId ? (
                      <Button
                        size="small"
                        onClick={() => navigate(`/property/${offer.propertyId}`)}
                      >
                        View Property
                      </Button>
                    ) : null}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          </Grid>
        )}

        {offers.length > pageSize ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              color="primary"
              count={totalPages}
              page={page}
              onChange={(_, nextPage) => setPage(nextPage)}
            />
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
