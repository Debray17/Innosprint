// src/pages/User/SearchResultsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography, Button, Paper, Select, MenuItem, FormControl, InputLabel, Chip, IconButton, useMediaQuery, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TuneIcon from "@mui/icons-material/Tune";
import MapIcon from "@mui/icons-material/Map";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloseIcon from "@mui/icons-material/Close";

import SearchBar from "../../components/User/Search/SearchBar";
import PropertyCard from "../../components/User/Property/PropertyCard";
import FilterDrawer from "../../components/User/Search/FilterDrawer";
import { featuredProperties, searchFilters } from "../../data/userMockData";
import { getPropertyList } from "../../services/propertyService";
import { getPropertyTypeList } from "../../services/propertyTypeService";

export default function SearchResultsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams] = useSearchParams();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [propertiesData, setPropertiesData] = useState(featuredProperties);

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: [],
    guestRating: null,
    freeCancellation: false,
    breakfastIncluded: false
  });

  const normalizeType = (value) => {
    const raw = (value || "").toString().trim().toLowerCase();
    if (!raw) return "";
    // Handle common plural inputs coming from the home page.
    return raw.endsWith("s") ? raw.slice(0, -1) : raw;
  };

  const typeParam = normalizeType(searchParams.get("type"));

  useEffect(() => {
    if (!typeParam) return;
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeParam)
        ? prev.propertyTypes
        : [typeParam]
    }));
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeParam]);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      setLoading(true);
      try {
        const [propertiesResponse, propertyTypesResponse] = await Promise.all([
          getPropertyList({ language: "en" }),
          getPropertyTypeList({ language: "en" })
        ]);

        const propertiesList = Array.isArray(propertiesResponse) ?
        propertiesResponse :
        propertiesResponse ?
        [propertiesResponse] :
        [];

        const propertyTypesList = Array.isArray(propertyTypesResponse) ?
        propertyTypesResponse :
        propertyTypesResponse ?
        [propertyTypesResponse] :
        [];

        const propertyTypeById = new Map(
          propertyTypesList.
          filter((t) => t?.isActive !== false).
          map((t) => [t.id || t.primaryKeyValue, t])
        );

        const fallbackImages = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
        ];

        const normalized = propertiesList.
        filter((p) => p?.isActive !== false).
        map((p, index) => {
          const typeDto = propertyTypeById.get(p?.propertyTypeId) || null;
          const typeName = typeDto?.name || "Property";
          return {
            id: p?.id || p?.primaryKeyValue || index,
            name: p?.name || "Untitled Property",
            type: typeName,
            location: {
              city: p?.city || "",
              state: p?.country || ""
            },
            images: [fallbackImages[index % fallbackImages.length]],
            rating: Number(p?.rating) || 0,
            reviewsCount: Number(p?.reviewCount) || 0,
            pricePerNight: 0,
            originalPrice: null,
            discount: 0,
            amenities: [],
            isFavorite: false,
            freeCancellation: false,
            breakfastIncluded: false
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
  }, []);

  // Get search params
  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  // Filtered results
  const filteredResults = useMemo(() => {
    let results = [...propertiesData];

    const normalizedDestination = (destination || "").
    toString().
    trim().
    toLowerCase();

    if (normalizedDestination) {
      results = results.filter((p) => {
        const city = (p?.location?.city || "").
        toString().
        trim().
        toLowerCase();
        if (!city) return false;
        return city === normalizedDestination ||
          city.includes(normalizedDestination) ||
          normalizedDestination.includes(city);
      });
    }

    // Apply filters
    if (filters.propertyTypes.length > 0) {
      results = results.filter((p) =>
      filters.propertyTypes.includes(normalizeType(p.type))
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      results = results.filter(
        (p) =>
        p.pricePerNight >= filters.priceRange[0] &&
        p.pricePerNight <= filters.priceRange[1]
      );
    }

    if (filters.guestRating) {
      results = results.filter((p) => p.rating >= filters.guestRating);
    }

    if (filters.freeCancellation) {
      results = results.filter((p) => p.freeCancellation);
    }

    if (filters.breakfastIncluded) {
      results = results.filter((p) => p.breakfastIncluded);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_low":
        results.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "price_high":
        results.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return results;
  }, [filters, propertiesData, sortBy]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === "propertyTypes") {
      setFilters((prev) => ({
        ...prev,
        propertyTypes: prev.propertyTypes.filter((t) => t !== value)
      }));
    } else if (filterType === "amenities") {
      setFilters((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((a) => a !== value)
      }));
    } else if (filterType === "guestRating") {
      setFilters((prev) => ({ ...prev, guestRating: null }));
    } else if (
    filterType === "freeCancellation" ||
    filterType === "breakfastIncluded")
    {
      setFilters((prev) => ({ ...prev, [filterType]: false }));
    }
  };

  const handleFavoriteToggle = (propertyId) => {
    console.log("Toggle favorite:", propertyId);
  };

  const activeFilterChips = [];
  filters.propertyTypes.forEach((type) => {
    activeFilterChips.push({ type: "propertyTypes", value: type, label: type });
  });
  filters.amenities.forEach((amenity) => {
    const amenityLabel =
    searchFilters.amenities.find((a) => a.id === amenity)?.label || amenity;
    activeFilterChips.push({
      type: "amenities",
      value: amenity,
      label: amenityLabel
    });
  });
  if (filters.guestRating) {
    activeFilterChips.push({
      type: "guestRating",
      value: filters.guestRating,
      label: `${filters.guestRating}+ Rating`
    });
  }
  if (filters.freeCancellation) {
    activeFilterChips.push({
      type: "freeCancellation",
      value: true,
      label: "Free Cancellation"
    });
  }
  if (filters.breakfastIncluded) {
    activeFilterChips.push({
      type: "breakfastIncluded",
      value: true,
      label: "Breakfast Included"
    });
  }

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", pb: 4 }}>
      {/* Search Header */}
      <Box
        sx={{ bgcolor: "#fff", py: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>

        <Container maxWidth="lg">
          <SearchBar
            variant="compact"
            initialValues={{
              destination,
              checkIn,
              checkOut
            }} />

        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {/* Results Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2
          }}>

          <Box>
            <Typography variant="h5" fontWeight={700}>
              {destination ? `Stays in ${destination}` : "All Properties"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredResults.length} properties found
              {checkIn && checkOut && ` • ${checkIn} - ${checkOut}`}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}>

                {searchFilters.sortOptions.map((option) =>
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            {/* View Toggle (Desktop) */}
            {!isMobile &&
            <Box
              sx={{
                display: "flex",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1
              }}>

                <IconButton
                onClick={() => setViewMode("grid")}
                color={viewMode === "grid" ? "primary" : "default"}>

                  <ViewListIcon sx={{ transform: "rotate(90deg)" }} />
                </IconButton>
                <IconButton
                onClick={() => setViewMode("list")}
                color={viewMode === "list" ? "primary" : "default"}>

                  <ViewListIcon />
                </IconButton>
              </Box>
            }

            {/* Filter Button */}
            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={() => setFilterDrawerOpen(true)}>

              Filters
              {activeFilterChips.length > 0 &&
              <Chip
                label={activeFilterChips.length}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20, fontSize: 12 }} />

              }
            </Button>

            {/* Map View Button */}
            <Button variant="outlined" startIcon={<MapIcon />}>
              Map
            </Button>
          </Box>
        </Box>

        {/* Active Filters */}
        {activeFilterChips.length > 0 &&
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {activeFilterChips.map((chip, index) =>
          <Chip
            key={index}
            label={chip.label}
            onDelete={() => handleRemoveFilter(chip.type, chip.value)}
            deleteIcon={<CloseIcon />}
            sx={{ textTransform: "capitalize" }} />

          )}
            <Button
            size="small"
            onClick={() =>
            setFilters({
              priceRange: [0, 1000],
              propertyTypes: [],
              amenities: [],
              guestRating: null,
              freeCancellation: false,
              breakfastIncluded: false
            })
            }>

              Clear All
            </Button>
          </Box>
        }

        {/* Results Grid */}
        <Grid container spacing={3}>
          {loading ?
          Array.from({ length: 8 }).map((_, index) =>
          <Grid item

          key={index} xs={12} sm={6} md={viewMode === "list" ? 12 : 3}>

                  <PropertyCard loading />
                </Grid>
          ) :
          paginatedResults.map((property) =>
          <Grid item

          key={property.id} xs={12} sm={6} md={viewMode === "list" ? 12 : 3}>

                  <PropertyCard
              property={property}
              onFavoriteToggle={handleFavoriteToggle} />

                </Grid>
          )}
        </Grid>

        {/* No Results */}
        {!loading && filteredResults.length === 0 &&
        <Paper sx={{ p: 6, textAlign: "center", mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              No properties found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your filters or search criteria
            </Typography>
            <Button
            variant="contained"
            onClick={() =>
            setFilters({
              priceRange: [0, 1000],
              propertyTypes: [],
              amenities: [],
              guestRating: null,
              freeCancellation: false,
              breakfastIncluded: false
            })
            }>

              Clear Filters
            </Button>
          </Paper>
        }

        {/* Pagination */}
        {totalPages > 1 &&
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large" />

          </Box>
        }
      </Container>

      {/* Filter Drawer */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters} />

    </Box>);

}
