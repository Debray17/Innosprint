// src/pages/User/Account/MyReviewsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RateReviewIcon from "@mui/icons-material/RateReview";
import StarIcon from "@mui/icons-material/Star";

import AccountSidebar from "../../../components/User/Dashboard/AccountSidebar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { userReviews } from "../../../data/userMockData";

export default function MyReviewsPage() {
  const theme = useTheme();

  const [reviews, setReviews] = useState(userReviews);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event, review) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    console.log("Edit review:", selectedReview);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedReview) {
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
    }
    setDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Stats
  const totalReviews = reviews.length;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : 0;
  const totalHelpful = reviews.reduce((sum, r) => sum + (r.helpful || 0), 0);

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
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                My Reviews
              </Typography>

              {/* Stats */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {totalReviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reviews
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="warning.main"
                      >
                        {averageRating}
                      </Typography>
                      <StarIcon sx={{ color: theme.palette.warning.main }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Average Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color="success.main"
                    >
                      {totalHelpful}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Helpful Votes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {/* Property Image */}
                      <Box
                        component="img"
                        src={review.property.image}
                        alt={review.property.name}
                        sx={{
                          width: 120,
                          height: 90,
                          borderRadius: 1,
                          objectFit: "cover",
                        }}
                      />

                      {/* Review Content */}
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                              {review.property.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Stayed: {review.stayDate}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, review)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                        >
                          {review.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {review.comment}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <ThumbUpIcon
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {review.helpful} people found this helpful
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Posted on {formatDate(review.createdAt)}
                          </Typography>
                        </Box>

                        {/* Host Response */}
                        {review.response && (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              bgcolor: alpha(theme.palette.primary.main, 0.05),
                              borderRadius: 1,
                              borderLeft: `3px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              Response from property
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {review.response.text}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Paper sx={{ p: 6, textAlign: "center" }}>
                <RateReviewIcon
                  sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No reviews yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  After your stays, you can share your experiences here
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit Review
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Review
        </MenuItem>
      </Menu>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        type="error"
      />
    </Box>
  );
}
