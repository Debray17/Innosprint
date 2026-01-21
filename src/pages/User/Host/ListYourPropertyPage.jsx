import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from "@mui/material";
import AddHomeIcon from "@mui/icons-material/AddHome";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function ListYourPropertyPage() {
  const navigate = useNavigate();

  const steps = [
    "Create Host Account",
    "Add Property Details",
    "Upload Photos",
    "Set Pricing & Availability",
    "Verify & Publish",
  ];

  const benefits = [
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 50, color: "success.main" }} />,
      title: "Earn Extra Income",
      description:
        "Turn your property into a revenue source with no upfront costs",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Trusted Platform",
      description: "Benefit from our verified guest system and secure payments",
    },
    {
      icon: <AddHomeIcon sx={{ fontSize: 50, color: "info.main" }} />,
      title: "Easy Management",
      description: "Simple tools to manage bookings, calendar, and pricing",
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 50, color: "warning.main" }} />,
      title: "Full Support",
      description: "24/7 host support and resources to help you succeed",
    },
  ];

  const requirements = [
    "Valid government-issued ID",
    "Proof of property ownership or authorization",
    "High-quality property photos (minimum 5)",
    "Detailed property description",
    "Emergency contact information",
    "Bank account for payouts",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" fontWeight={700} gutterBottom>
          List Your Property on BhutanStay
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", mb: 4 }}
        >
          Join hundreds of successful hosts and start earning from your property
          today
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/register")}
          sx={{ px: 4, py: 1.5 }}
        >
          Get Started - It's Free
        </Button>
      </Box>

      {/* Alert */}
      <Alert severity="info" sx={{ mb: 6 }}>
        To list a property, you need to register as a Hotel Owner. Click "Get
        Started" above to create your host account.
      </Alert>

      {/* Benefits */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
          Why List with BhutanStay?
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid size={{xs:12, sm:6, md:3}} key={index}>
              <Card elevation={2} sx={{ height: "100%", textAlign: "center" }}>
                <CardContent sx={{ p: 3 }}>
                  {benefit.icon}
                  <Typography variant="h6" fontWeight={600} sx={{ my: 2 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
          How It Works
        </Typography>
        <Stepper activeStep={-1} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label} expanded>
              <StepLabel>
                <Typography variant="h6">{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Requirements */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          What You'll Need
        </Typography>
        <Grid container spacing={2}>
          {requirements.map((req, index) => (
            <Grid size={{xs:12, sm:6}} key={index}>
              <Card elevation={1}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircleIcon sx={{ color: "success.main", mr: 2 }} />
                  <Typography variant="body1">{req}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pricing */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Transparent Pricing
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Commission:</strong> We charge a small commission on each
          booking (typically 10-15% depending on property type)
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>No Hidden Fees:</strong> No listing fees, no subscription
          fees, no setup costs
        </Typography>
        <Typography variant="body1">
          <strong>Payment:</strong> Receive payments directly to your bank
          account within 48 hours of guest check-in
        </Typography>
      </Paper>

      {/* Support */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Host Support & Resources
        </Typography>
        <Typography variant="body1" paragraph>
          As a BhutanStay host, you'll have access to:
        </Typography>
        <Typography variant="body1" component="div" sx={{ pl: 3 }}>
          • Dedicated host support team (24/7)
          <br />
          • Photography tips and guidelines
          <br />
          • Pricing optimization tools
          <br />
          • Marketing and promotion support
          <br />
          • Host community forum
          <br />
          • Best practices and training materials
          <br />• Regular performance insights and analytics
        </Typography>
      </Box>

      {/* CTA */}
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: "center",
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Ready to Become a Host?
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          List your property in minutes and start earning today
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "white",
            color: "primary.main",
            px: 4,
            py: 1.5,
            "&:hover": { bgcolor: "grey.100" },
          }}
          onClick={() => navigate("/register")}
        >
          Create Host Account
        </Button>
      </Paper>

      {/* Contact */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Have questions? Contact our host support team
          <br />
          Email: hosts@bhutanstay.com | Phone: +975 XXXX XXXX
        </Typography>
      </Box>
    </Container>
  );
}
