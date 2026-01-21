import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExploreIcon from "@mui/icons-material/Explore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function AboutUsPage() {
  const theme = useTheme();

  const values = [
    {
      icon: <ExploreIcon sx={{ fontSize: 40 }} />,
      title: "Discovery",
      description: "Helping travelers discover authentic Bhutanese experiences",
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: "Trust",
      description: "Building trust between guests and property owners",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Community",
      description: "Supporting local communities and sustainable tourism",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: "Excellence",
      description: "Delivering exceptional service and experiences",
    },
  ];

  const stats = [
    { number: "500+", label: "Properties Listed" },
    { number: "10,000+", label: "Happy Guests" },
    { number: "20", label: "Districts Covered" },
    { number: "4.8/5", label: "Average Rating" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          About BhutanStay
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Your trusted platform for discovering and booking unique
          accommodations across the Kingdom of Bhutan
        </Typography>
      </Box>

      {/* Story Section */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our Story
        </Typography>
        <Typography variant="body1" paragraph>
          Founded in 2024, BhutanStay was born from a simple vision: to make
          authentic Bhutanese hospitality accessible to travelers from around
          the world while empowering local property owners to share their unique
          spaces.
        </Typography>
        <Typography variant="body1" paragraph>
          Bhutan, the Land of the Thunder Dragon, is a destination like no
          other. From the majestic Himalayas to ancient monasteries, from
          vibrant festivals to warm-hearted people, Bhutan offers experiences
          that stay with you forever. We wanted to create a platform that
          connects travelers with the perfect place to stay during their journey
          through this magical kingdom.
        </Typography>
        <Typography variant="body1" paragraph>
          Today, BhutanStay is the leading accommodation booking platform in
          Bhutan, featuring everything from luxury resorts and boutique hotels
          to cozy homestays and traditional farmhouses. We're proud to support
          local entrepreneurs and contribute to Bhutan's sustainable tourism
          development.
        </Typography>
      </Paper>

      {/* Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Our Values
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Paper
        elevation={0}
        sx={{
          p: 6,
          bgcolor: theme.palette.primary.main,
          color: "white",
          mb: 6,
        }}
      >
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" fontWeight={700}>
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mission Section */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          To be the most trusted and user-friendly accommodation booking
          platform in Bhutan, connecting travelers with authentic experiences
          while supporting local communities and promoting sustainable tourism
          practices.
        </Typography>

        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
          What We Do
        </Typography>
        <Typography variant="body1" component="div">
          <strong>For Travelers:</strong>
          <br />
          • Curate a diverse selection of verified properties across Bhutan
          <br />
          • Provide detailed information, photos, and genuine reviews
          <br />
          • Offer secure and convenient booking experience
          <br />
          • Deliver 24/7 customer support
          <br />
          <br />
          <strong>For Property Owners:</strong>
          <br />
          • Free property listing and easy management tools
          <br />
          • Access to a growing customer base
          <br />
          • Marketing support and business insights
          <br />
          • Secure and timely payment processing
          <br />
          • Training and resources to improve hospitality
          <br />
        </Typography>
      </Paper>

      {/* Commitment Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Our Commitment to Bhutan
        </Typography>
        <Typography variant="body1" paragraph>
          As a Bhutanese company, we're deeply committed to our nation's
          philosophy of Gross National Happiness and sustainable development. We
          work closely with property owners to ensure tourism benefits local
          communities while preserving Bhutan's unique culture and pristine
          environment.
        </Typography>
        <Typography variant="body1" paragraph>
          We actively promote homestays and community-based tourism, giving
          travelers authentic cultural experiences while providing income
          opportunities for rural families. A portion of our revenue supports
          local initiatives in education, environmental conservation, and
          cultural preservation.
        </Typography>
      </Box>

      {/* Contact CTA */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "primary.light",
          color: "white",
        }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Join Us on This Journey
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Whether you're a traveler seeking your next adventure or a property
          owner wanting to share your space, we'd love to hear from you.
        </Typography>
        <Typography variant="body1">
          Email: hello@bhutanstay.com | Phone: +975 XXXX XXXX
        </Typography>
      </Paper>
    </Container>
  );
}
