// src/components/User/Modals/ImageGalleryModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function ImageGalleryModal({
  open,
  onClose,
  images,
  initialIndex = 0,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          bgcolor: "rgba(0,0,0,0.95)",
          m: isMobile ? 0 : 2,
        },
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "#fff",
          bgcolor: "rgba(255,255,255,0.1)",
          zIndex: 10,
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Counter */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "#fff",
          bgcolor: "rgba(0,0,0,0.5)",
          px: 2,
          py: 0.5,
          borderRadius: 1,
          zIndex: 10,
        }}
      >
        <Typography variant="body2">
          {currentIndex + 1} / {images.length}
        </Typography>
      </Box>

      {/* Main Image Container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 2,
        }}
      >
        {/* Left Arrow */}
        {images.length > 1 && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}

        {/* Image */}
        <Box
          component="img"
          src={
            typeof currentImage === "string" ? currentImage : currentImage.url
          }
          alt={
            typeof currentImage === "string"
              ? `Image ${currentIndex + 1}`
              : currentImage.caption
          }
          sx={{
            maxWidth: "100%",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: 1,
          }}
        />

        {/* Right Arrow */}
        {images.length > 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
      </Box>

      {/* Caption */}
      {typeof currentImage !== "string" && currentImage.caption && (
        <Box sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {currentImage.caption}
          </Typography>
        </Box>
      )}

      {/* Thumbnails */}
      {images.length > 1 && !isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            pb: 2,
            overflowX: "auto",
            px: 2,
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 60,
                height: 45,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                opacity: index === currentIndex ? 1 : 0.5,
                border:
                  index === currentIndex
                    ? "2px solid #fff"
                    : "2px solid transparent",
                transition: "all 0.2s",
                flexShrink: 0,
                "&:hover": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={typeof img === "string" ? img : img.url}
                alt={`Thumbnail ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Dialog>
  );
}
