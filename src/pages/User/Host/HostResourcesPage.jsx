import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SchoolIcon from "@mui/icons-material/School";
import DownloadIcon from "@mui/icons-material/Download";

export default function HostResourcesPage() {
  const guides = [
    {
      title: "Getting Started Guide",
      description: "Everything you need to know to list your first property",
      topics: [
        "Creating your host account",
        "Adding property details",
        "Writing compelling descriptions",
        "Taking great photos",
        "Setting competitive prices",
      ],
    },
    {
      title: "Photography Best Practices",
      description: "Tips for showcasing your property with stunning photos",
      topics: [
        "Lighting and angles",
        "Room preparation",
        "Highlighting amenities",
        "Seasonal variations",
        "Photo editing basics",
      ],
    },
    {
      title: "Pricing Strategy",
      description: "Optimize your pricing for maximum bookings and revenue",
      topics: [
        "Market research",
        "Seasonal pricing",
        "Weekend vs weekday rates",
        "Last-minute discounts",
        "Special offers",
      ],
    },
    {
      title: "Guest Communication",
      description: "Build trust and provide excellent service",
      topics: [
        "Response time best practices",
        "Pre-arrival communication",
        "During-stay support",
        "Handling special requests",
        "Post-stay follow-up",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I update my property's availability?",
      answer:
        "Log in to your host dashboard, navigate to 'Calendar' and select the dates you want to block or open. You can also set up automatic rules for regular unavailable periods.",
    },
    {
      question: "When will I receive payment?",
      answer:
        "Payments are processed within 48 hours after guest check-in and transferred to your registered bank account. You can track all payments in your dashboard under 'Earnings'.",
    },
    {
      question: "What if a guest cancels their booking?",
      answer:
        "Cancellation handling depends on your cancellation policy. You'll be notified immediately, and your calendar will be automatically updated. Partial payments may be released based on the policy.",
    },
    {
      question: "How can I improve my property's ranking?",
      answer:
        "Maintain high ratings, respond quickly to inquiries, keep your calendar updated, offer competitive pricing, and ensure your listing has complete information and quality photos.",
    },
    {
      question: "Can I offer additional services (meals, tours, etc.)?",
      answer:
        "Yes! You can add services in the 'Amenities & Services' section of your property listing. These can be optional add-ons that guests can select during booking.",
    },
  ];

  const downloads = [
    "Host Handbook (PDF)",
    "Photography Checklist",
    "Cleaning Standards Guide",
    "Safety Requirements Checklist",
    "Guest Welcome Template",
    "House Rules Template",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Host Resources
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Everything you need to succeed as a BhutanStay host
        </Typography>
      </Box>

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        <Grid size={{xs:12, sm:4}}>
          <Card
            elevation={2}
            sx={{
              textAlign: "center",
              p: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <MenuBookIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Host Guides
            </Typography>
          </Card>
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <Card
            elevation={2}
            sx={{
              textAlign: "center",
              p: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <TipsAndUpdatesIcon
              sx={{ fontSize: 60, color: "success.main", mb: 2 }}
            />
            <Typography variant="h6" fontWeight={600}>
              Tips & Best Practices
            </Typography>
          </Card>
        </Grid>
        <Grid size={{xs:12, sm:4}}>
          <Card
            elevation={2}
            sx={{
              textAlign: "center",
              p: 3,
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-8px)" },
            }}
          >
            <SchoolIcon sx={{ fontSize: 60, color: "info.main", mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Video Tutorials
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Guides */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Comprehensive Guides
        </Typography>
        <Grid container spacing={3}>
          {guides.map((guide, index) => (
            <Grid size={{xs:12, sm:6}} key={index}>
              <Card elevation={2}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {guide.description}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Topics covered:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                    {guide.topics.map((topic, idx) => (
                      <Typography
                        component="li"
                        variant="body2"
                        key={idx}
                        sx={{ mb: 0.5 }}
                      >
                        {topic}
                      </Typography>
                    ))}
                  </Box>
                  <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQs */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index} elevation={1} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Downloads */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          Downloadable Resources
        </Typography>
        <Grid container spacing={2}>
          {downloads.map((download, index) => (
            <Grid size={{xs:12, sm:6}} key={index}>
              <Card elevation={1}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1">{download}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Contact */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Paper
          elevation={3}
          sx={{ p: 4, bgcolor: "primary.light", color: "white" }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Need More Help?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Our host support team is available 24/7 to assist you
          </Typography>
          <Typography variant="body1">
            Email: hosts@bhutanstay.com | Phone: +975 XXXX XXXX
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
