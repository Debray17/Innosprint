// src/pages/User/Account/WishlistPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { userWishlist } from "../../../data/userMockData";

export default function WishlistPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(userWishlist);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleRemove = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmRemove = () => {
    if (selectedItem) {
      setWishlist((prev) => prev.filter((item) => item.id !== selectedItem.id));
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <AccountSidebar />
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    My Wishlist
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {wishlist.length} saved properties
                  </Typography>
                </Box>
              </Box>

              {wishlist.length > 0 ? (
                <Grid container spacing={3}>
                  {wishlist.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height={180}
                            image={item.property.images[0]}
                            alt={item.property.name}
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate(`/property/${item.property.id}`)
                            }
                          />

                          {/* Discount Badge */}
                          {item.property.discount > 0 && (
                            <Chip
                              label={`${item.property.discount}% OFF`}
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

                          {/* Remove Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleRemove(item)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(255,255,255,0.9)",
                              "&:hover": { bgcolor: "#fff" },
                            }}
                          >
                            <FavoriteIcon
                              sx={{ color: theme.palette.error.main }}
                            />
                          </IconButton>

                          {/* Property Type */}
                          <Chip
                            label={item.property.type}
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

                        <CardContent
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {/* Rating */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 1,
                            }}
                          >
                            <StarIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.warning.main,
                              }}
                            />
                            <Typography variant="body2" fontWeight={600}>
                              {item.property.rating}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({item.property.reviewsCount})
                            </Typography>
                          </Box>

                          {/* Name */}
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{
                              cursor: "pointer",
                              "&:hover": { color: theme.palette.primary.main },
                            }}
                            onClick={() =>
                              navigate(`/property/${item.property.id}`)
                            }
                          >
                            {item.property.name}
                          </Typography>

                          {/* Location */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 1,
                            }}
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {item.property.location.city},{" "}
                              {item.property.location.state}
                            </Typography>
                          </Box>

                          {/* Tags */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              flexWrap: "wrap",
                              mb: 1,
                            }}
                          >
                            {item.property.freeCancellation && (
                              <Chip
                                label="Free cancellation"
                                size="small"
                                variant="outlined"
                                color="success"
                                sx={{ fontSize: 10 }}
                              />
                            )}
                          </Box>

                          {/* Price */}
                          <Box sx={{ mt: "auto" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "baseline",
                                gap: 0.5,
                              }}
                            >
                              {item.property.originalPrice && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "text.secondary",
                                  }}
                                >
                                  Nu {item.property.originalPrice}
                                </Typography>
                              )}
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary"
                              >
                                Nu {item.property.pricePerNight}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                /night
                              </Typography>
                            </Box>
                          </Box>

                          {/* Saved Date */}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Saved on {formatDate(item.addedAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <FavoriteIcon
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Your wishlist is empty
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Save properties you love to view them later
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => navigate("/search")}
                  >
                    Explore Properties
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmRemove}
        title="Remove from Wishlist?"
        message={`Are you sure you want to remove "${selectedItem?.property?.name}" from your wishlist?`}
        confirmText="Remove"
        type="warning"
      />
    </Box>
  );
}
