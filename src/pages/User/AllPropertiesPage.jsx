// src/pages/User/AllPropertiesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import PropertyCard from "../../components/User/Property/PropertyCard";
import { featuredProperties } from "../../data/userMockData";
import { getPropertyList } from "../../services/propertyService";
import { getPropertyTypeList } from "../../services/propertyTypeService";
import { getAvailableRoomList } from "../../services/roomService";

export default function AllPropertiesPage() {
  const [propertiesData, setPropertiesData] = useState(featuredProperties);
  const [loading, setLoading] = useState(false);

  const fallbackImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const [propertiesResponse, propertyTypesResponse, roomsResponse] = await Promise.all([
          getPropertyList({ language: "en" }),
          getPropertyTypeList({ language: "en" }),
          getAvailableRoomList({ language: "en" }),
        ]);

        const propertiesList = Array.isArray(propertiesResponse)
          ? propertiesResponse
          : propertiesResponse
            ? [propertiesResponse]
            : [];

        const propertyTypesList = Array.isArray(propertyTypesResponse)
          ? propertyTypesResponse
          : propertyTypesResponse
            ? [propertyTypesResponse]
            : [];
        const roomsList = Array.isArray(roomsResponse)
          ? roomsResponse
          : roomsResponse
            ? [roomsResponse]
            : [];

        const propertyTypeById = new Map(
          propertyTypesList
            .filter((type) => type?.isActive !== false)
            .map((type) => [type.id || type.primaryKeyValue, type]),
        );
        const minRoomByPropertyId = new Map();
        roomsList
          .filter((room) => room?.isActive !== false)
          .forEach((room) => {
            const propertyId = room?.propertyId;
            if (!propertyId) return;
            const current = minRoomByPropertyId.get(propertyId);
            const nextPrice = Number(room?.basePrise) || 0;
            const roomId = room?.id || room?.primaryKeyValue || null;
            if (!current || (nextPrice > 0 && nextPrice < current.pricePerNight)) {
              minRoomByPropertyId.set(propertyId, {
                roomId,
                pricePerNight: nextPrice,
              });
            }
          });

        const normalized = propertiesList
          .filter((property) => property?.isActive !== false)
          .filter((property) => minRoomByPropertyId.has(property?.id || property?.primaryKeyValue))
          .map((property, index) => {
            const typeDto = propertyTypeById.get(property?.propertyTypeId) || null;
            const typeName = typeDto?.name || "Property";
            const roomInfo = minRoomByPropertyId.get(
              property?.id || property?.primaryKeyValue,
            );

            return {
              id: property?.id || property?.primaryKeyValue || index,
              roomId: roomInfo?.roomId || null,
              name: property?.name || "Untitled Property",
              type: typeName,
              location: {
                city: property?.city || "",
                state: property?.country || "",
                address: property?.address || "",
              },
              images: [fallbackImages[index % fallbackImages.length]],
              rating: Number(property?.rating) || 0,
              reviewsCount: Number(property?.reviewCount) || 0,
              pricePerNight: roomInfo?.pricePerNight || 0,
              originalPrice: null,
              discount: 0,
              amenities: [],
              isFavorite: false,
              freeCancellation: false,
              breakfastIncluded: false,
            };
          });

        if (isMounted && normalized.length > 0) {
          setPropertiesData(normalized);
        }
      } catch (err) {
        // Keep mock data on error.
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [fallbackImages]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          All Properties
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Explore the complete list of verified properties.
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
          {propertiesData.map((property) => (
            <Grid
              item
              key={property.id}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: "flex" }}
            >
              <PropertyCard property={property} loading={loading} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
