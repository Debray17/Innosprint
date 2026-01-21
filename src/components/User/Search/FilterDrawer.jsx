// src/components/User/Search/FilterDrawer.jsx
import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Rating,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { searchFilters } from "../../../data/userMockData";

export default function FilterDrawer({
  open,
  onClose,
  filters,
  onApplyFilters,
}) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState(
    filters || {
      priceRange: [0, 1000],
      propertyTypes: [],
      amenities: [],
      guestRating: null,
      freeCancellation: false,
      breakfastIncluded: false,
    },
  );

  const handlePriceChange = (event, newValue) => {
    setLocalFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  const handlePropertyTypeChange = (typeId) => {
    setLocalFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter((t) => t !== typeId)
        : [...prev.propertyTypes, typeId],
    }));
  };

  const handleAmenityChange = (amenityId) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      priceRange: [0, 1000],
      propertyTypes: [],
      amenities: [],
      guestRating: null,
      freeCancellation: false,
      breakfastIncluded: false,
    });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000)
      count++;
    count += localFilters.propertyTypes.length;
    count += localFilters.amenities.length;
    if (localFilters.guestRating) count++;
    if (localFilters.freeCancellation) count++;
    if (localFilters.breakfastIncluded) count++;
    return count;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: 380 } } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          {activeFiltersCount() > 0 && (
            <Chip label={activeFiltersCount()} size="small" color="primary" />
          )}
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Filter Content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Price Range */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Price per night</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Slider
                value={localFilters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                valueLabelFormat={(value) => `$${value}`}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  Nu {localFilters.priceRange[0]}
                </Typography>
                <Typography variant="body2">
                  Nu {localFilters.priceRange[1]}+
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Property Type */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Property Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {searchFilters.propertyTypes.map((type) => (
                <FormControlLabel
                  key={type.id}
                  control={
                    <Checkbox
                      checked={localFilters.propertyTypes.includes(type.id)}
                      onChange={() => handlePropertyTypeChange(type.id)}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{type.label}</span>
                    </Box>
                  }
                  sx={{ width: "100%" }}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Guest Rating */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Guest Rating</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {searchFilters.guestRatings.map((rating) => (
                <Button
                  key={rating.value}
                  variant={
                    localFilters.guestRating === rating.value
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      guestRating:
                        prev.guestRating === rating.value ? null : rating.value,
                    }))
                  }
                  sx={{ justifyContent: "flex-start" }}
                  startIcon={
                    <Rating
                      value={rating.value}
                      readOnly
                      size="small"
                      precision={0.5}
                    />
                  }
                >
                  {rating.label}
                </Button>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Amenities */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Amenities</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {searchFilters.amenities.map((amenity) => (
                <FormControlLabel
                  key={amenity.id}
                  control={
                    <Checkbox
                      checked={localFilters.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityChange(amenity.id)}
                    />
                  }
                  label={amenity.label}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Special Features */}
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Special Features</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.freeCancellation}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        freeCancellation: e.target.checked,
                      }))
                    }
                  />
                }
                label="Free Cancellation"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={localFilters.breakfastIncluded}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        breakfastIncluded: e.target.checked,
                      }))
                    }
                  />
                }
                label="Breakfast Included"
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer Actions */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          gap: 2,
        }}
      >
        <Button variant="outlined" fullWidth onClick={handleReset}>
          Reset All
        </Button>
        <Button variant="contained" fullWidth onClick={handleApply}>
          Show Results
        </Button>
      </Box>
    </Drawer>
  );
}
