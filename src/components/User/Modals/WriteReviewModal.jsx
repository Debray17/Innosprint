// src/components/User/Modals/WriteReviewModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

const ratingCategories = [
  { id: "cleanliness", label: "Cleanliness" },
  { id: "comfort", label: "Comfort" },
  { id: "location", label: "Location" },
  { id: "facilities", label: "Facilities" },
  { id: "staff", label: "Staff" },
  { id: "value", label: "Value for Money" },
];

export default function WriteReviewModal({ open, onClose, onSubmit, booking }) {
  const theme = useTheme();
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({});
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCategoryRating = (categoryId, value) => {
    setCategoryRatings((prev) => ({ ...prev, [categoryId]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (overallRating === 0)
      newErrors.overall = "Please provide an overall rating";
    if (!title.trim()) newErrors.title = "Please add a title";
    if (!comment.trim()) newErrors.comment = "Please write your review";
    if (comment.length < 50)
      newErrors.comment = "Review should be at least 50 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        overallRating,
        categoryRatings,
        title,
        comment,
        bookingId: booking?.id,
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOverallRating(0);
    setCategoryRatings({});
    setTitle("");
    setComment("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Write a Review
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Property Info */}
        {booking && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
            }}
          >
            <Box
              component="img"
              src={booking.property?.image}
              alt={booking.property?.name}
              sx={{
                width: 80,
                height: 60,
                borderRadius: 1,
                objectFit: "cover",
              }}
            />
            <Box>
              <Typography fontWeight={600}>{booking.property?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {booking.room?.name} •{" "}
                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Overall Rating */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Overall Rating
          </Typography>
          <Rating
            value={overallRating}
            onChange={(e, value) => setOverallRating(value)}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarIcon fontSize="inherit" />}
            sx={{
              "& .MuiRating-iconFilled": { color: theme.palette.warning.main },
              fontSize: 40,
            }}
          />
          {errors.overall && (
            <Typography color="error" variant="caption" display="block">
              {errors.overall}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Category Ratings */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Rate by Category (Optional)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {ratingCategories.map((category) => (
            <Grid size={{ xs: 6 }} key={category.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">{category.label}</Typography>
                <Rating
                  size="small"
                  value={categoryRatings[category.id] || 0}
                  onChange={(e, value) =>
                    handleCategoryRating(category.id, value)
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Review Title */}
        <TextField
          fullWidth
          label="Review Title"
          placeholder="Sum up your experience in a few words"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ mb: 2 }}
        />

        {/* Review Comment */}
        <TextField
          fullWidth
          label="Your Review"
          placeholder="Share your experience with other travelers..."
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={!!errors.comment}
          helperText={
            errors.comment || `${comment.length}/50 characters minimum`
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
