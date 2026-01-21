// src/pages/NotFoundPage.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HotelIcon from "@mui/icons-material/Hotel";

export default function NotFoundPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 6, textAlign: "center" }}>
          {/* 404 Illustration */}
          <Box
            sx={{
              position: "relative",
              mb: 4,
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 120, sm: 180 },
                fontWeight: 800,
                color: alpha(theme.palette.primary.main, 0.1),
                lineHeight: 1,
              }}
            >
              404
            </Typography>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <HotelIcon
                sx={{
                  fontSize: 80,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          </Box>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Oops! The page you're looking for seems to have checked out. It
            might have been moved or no longer exists.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              component={RouterLink}
              to="/"
              size="large"
            >
              Go to Homepage
            </Button>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              component={RouterLink}
              to="/search"
              size="large"
            >
              Search Properties
            </Button>
          </Box>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ mt: 3 }}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
