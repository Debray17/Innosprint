import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";

export default function CareersPage() {
  const benefits = [
    "Competitive salary and performance bonuses",
    "Health insurance coverage",
    "Professional development opportunities",
    "Flexible work arrangements",
    "Annual team retreats",
    "Collaborative work environment",
  ];

  const openPositions = [
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Thimphu",
      type: "Full-time",
      description:
        "We're looking for an experienced full stack developer to help build and scale our platform.",
      requirements: [
        "3+ years of experience with React and Node.js",
        "Strong understanding of database design",
        "Experience with cloud platforms (AWS/Azure)",
        "Excellent problem-solving skills",
      ],
    },
    {
      title: "Customer Support Specialist",
      department: "Customer Service",
      location: "Thimphu / Remote",
      type: "Full-time",
      description:
        "Join our support team to help guests and property owners have the best experience on our platform.",
      requirements: [
        "Excellent communication skills in English and Dzongkha",
        "Customer service experience preferred",
        "Problem-solving mindset",
        "Comfortable with technology and learning new tools",
      ],
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Thimphu",
      type: "Full-time",
      description:
        "Lead our marketing efforts to grow our brand and reach more travelers and property owners.",
      requirements: [
        "5+ years of marketing experience",
        "Digital marketing expertise (SEO, social media, email)",
        "Experience in travel/hospitality industry preferred",
        "Creative and data-driven approach",
      ],
    },
    {
      title: "Property Relations Specialist",
      department: "Business Development",
      location: "Thimphu",
      type: "Full-time",
      description:
        "Build and maintain relationships with property owners across Bhutan to expand our listings.",
      requirements: [
        "Strong interpersonal and negotiation skills",
        "Willingness to travel within Bhutan",
        "Understanding of hospitality industry",
        "Fluent in Dzongkha and English",
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Join Our Team
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Help us revolutionize travel and hospitality in Bhutan
        </Typography>
      </Box>

      {/* Why Work With Us */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Why Work at BhutanStay?
        </Typography>
        <Typography variant="body1" paragraph>
          At BhutanStay, we're building more than just a booking platform—we're
          creating meaningful connections between travelers and hosts, promoting
          sustainable tourism, and contributing to Bhutan's digital economy.
        </Typography>
        <Typography variant="body1" paragraph>
          We're a fast-growing startup with a mission to make a positive impact.
          If you're passionate about technology, hospitality, and Bhutan's
          development, we'd love to have you on our team.
        </Typography>
      </Paper>

      {/* Benefits */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          What We Offer
        </Typography>
        <Grid container spacing={2}>
          {benefits.map((benefit, index) => (
            <Grid size={{xs:12, sm:6, md:4}} key={index}>
              <Card elevation={1}>
                <CardContent>
                  <Typography variant="body1">✓ {benefit}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Open Positions */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Open Positions
        </Typography>
        {openPositions.map((position, index) => (
          <Card key={index} elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {position.title}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}
                  >
                    <Chip
                      icon={<WorkIcon />}
                      label={position.department}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<LocationOnIcon />}
                      label={position.location}
                      size="small"
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={position.type}
                      size="small"
                    />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  href={`mailto:careers@bhutanstay.com?subject=Application for ${position.title}`}
                >
                  Apply Now
                </Button>
              </Box>

              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {position.description}
              </Typography>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Requirements:
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                {position.requirements.map((req, idx) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={idx}
                    sx={{ mb: 0.5 }}
                  >
                    {req}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* General Application */}
      <Paper
        elevation={3}
        sx={{ p: 4, bgcolor: "primary.light", color: "white" }}
      >
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Don't See the Right Position?
        </Typography>
        <Typography variant="body1" paragraph>
          We're always looking for talented individuals who share our passion
          and values. Send us your resume and tell us how you'd like to
          contribute to BhutanStay.
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            "&:hover": { bgcolor: "grey.100" },
          }}
          href="mailto:careers@bhutanstay.com"
        >
          Send General Application
        </Button>
      </Paper>

      {/* Contact Info */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Questions about careers at BhutanStay?
          <br />
          Email: careers@bhutanstay.com | Phone: +975 XXXX XXXX
        </Typography>
      </Box>
    </Container>
  );
}
