// src/pages/User/Support/HelpCenterPage.jsx
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ArticleIcon from "@mui/icons-material/Article";

const faqCategories = [
  {
    id: "booking",
    label: "Booking",
    icon: BookOnlineIcon,
    faqs: [
      {
        question: "How do I make a booking?",
        answer:
          "Simply search for your destination, select your dates, choose a property and room, fill in your details, and complete the payment. You'll receive a confirmation email immediately.",
      },
      {
        question: "Can I book for someone else?",
        answer:
          "Yes! During the booking process, you can check the 'Booking for someone else' option and enter the guest's details.",
      },
      {
        question: "How do I get my booking confirmation?",
        answer:
          "After completing your booking, you'll receive a confirmation email immediately. You can also view all your bookings in your account dashboard.",
      },
      {
        question: "Can I modify my booking?",
        answer:
          "Yes, you can modify your booking up to 24 hours before check-in, depending on the property's policy. Go to 'My Bookings' and click 'Modify' on the relevant booking.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: PaymentIcon,
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, and in some cases, bank transfers.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, all payments are processed through secure, encrypted channels. We are PCI DSS compliant and never store your full card details.",
      },
      {
        question: "When will I be charged?",
        answer:
          "For most bookings, you'll be charged immediately upon booking. Some properties offer 'Pay at Property' option where you pay during check-in.",
      },
      {
        question: "Can I get a receipt?",
        answer:
          "Yes, you can download your receipt from the booking details page in your account. We also email receipts after checkout.",
      },
    ],
  },
  {
    id: "cancellation",
    label: "Cancellation & Refunds",
    icon: CancelIcon,
    faqs: [
      {
        question: "What is the cancellation policy?",
        answer:
          "Cancellation policies vary by property. You can see the specific policy on the property page before booking. Most properties offer free cancellation up to 24-48 hours before check-in.",
      },
      {
        question: "How do I cancel my booking?",
        answer:
          "Go to 'My Bookings' in your account, select the booking you want to cancel, and click 'Cancel Booking'. Follow the prompts to complete the cancellation.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are typically processed within 5-10 business days after cancellation. The time it takes to appear in your account depends on your bank.",
      },
      {
        question: "What if I'm a no-show?",
        answer:
          "If you don't show up for your booking without cancelling, you may be charged the full amount depending on the property's no-show policy.",
      },
    ],
  },
  {
    id: "property",
    label: "Property & Stay",
    icon: HomeIcon,
    faqs: [
      {
        question: "What are check-in and check-out times?",
        answer:
          "Standard check-in is typically 3:00 PM and check-out is 11:00 AM. Exact times vary by property and are shown on your booking confirmation.",
      },
      {
        question: "Can I request early check-in or late check-out?",
        answer:
          "Yes, you can add this as a special request during booking. The property will try to accommodate based on availability. Additional charges may apply.",
      },
      {
        question: "What if there's an issue with my room?",
        answer:
          "Contact the property directly first. If the issue isn't resolved, reach out to our customer support team through the Help Center.",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Pet policies vary by property. Check the property's amenities and house rules for pet information before booking.",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: AccountCircleIcon,
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign Up' in the top right corner, fill in your details, and verify your email address. You can also sign up using Google or Facebook.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page, enter your email, and we'll send you a password reset link.",
      },
      {
        question: "How do I earn loyalty points?",
        answer:
          "You earn 1 point for every Nu 1 spent on bookings. Points can be redeemed for discounts on future stays.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "You can request account deletion from your Security settings or by contacting customer support. Note that this action is irreversible.",
      },
    ],
  },
];

const popularArticles = [
  { title: "How to modify or cancel your booking", views: 15420 },
  { title: "Understanding cancellation policies", views: 12350 },
  { title: "Payment methods and security", views: 9870 },
  { title: "Check-in and check-out procedures", views: 8540 },
  { title: "How to contact your property", views: 7230 },
];

export default function HelpCenterPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("booking");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const currentCategory = faqCategories.find((c) => c.id === activeTab);

  const filteredFaqs = currentCategory?.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            How can we help you?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Search our help center for answers
          </Typography>

          <TextField
            fullWidth
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              maxWidth: 600,
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Category Tabs */}
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
              >
                {faqCategories.map((category) => (
                  <Tab
                    key={category.id}
                    value={category.id}
                    label={category.label}
                    icon={<category.icon />}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            </Paper>

            {/* FAQ List */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {currentCategory?.label} Questions
              </Typography>

              {filteredFaqs && filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <Accordion
                    key={index}
                    expanded={expandedFaq === index}
                    onChange={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                    sx={{
                      boxShadow: "none",
                      "&:before": { display: "none" },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ px: 0 }}
                    >
                      <Typography fontWeight={500}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Typography color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    No results found for "{searchQuery}"
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Contact Options */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Need more help?
              </Typography>

              <List disablePadding>
                <ListItem
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemIcon>
                    <ChatIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Live Chat"
                    secondary="Chat with our support team"
                  />
                </ListItem>
                <ListItem
                  component={RouterLink}
                  to="/contact"
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Support"
                    secondary="support@bhutanstay.com"
                  />
                </ListItem>
                <ListItem
                  sx={{
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Support"
                    secondary="+1 (800) 123-4567"
                  />
                </ListItem>
              </List>
            </Paper>

            {/* Popular Articles */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Popular Articles
              </Typography>

              <List disablePadding>
                {popularArticles.map((article, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      borderBottom:
                        index < popularArticles.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : "none",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ArticleIcon color="action" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={article.title}
                      secondary={`${article.views.toLocaleString()} views`}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
