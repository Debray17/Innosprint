import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function CancellationPolicyPage() {
  const policyTypes = [
    {
      name: "Flexible",
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />,
      refund: "Full refund if cancelled 24 hours before check-in",
      details: [
        "100% refund: Cancel 24+ hours before check-in",
        "50% refund: Cancel within 24 hours before check-in",
        "No refund: Cancel after check-in or no-show",
      ],
    },
    {
      name: "Moderate",
      icon: <InfoIcon sx={{ fontSize: 40, color: "info.main" }} />,
      refund: "Full refund if cancelled 5 days before check-in",
      details: [
        "100% refund: Cancel 5+ days before check-in",
        "50% refund: Cancel 2-5 days before check-in",
        "No refund: Cancel within 48 hours or no-show",
      ],
    },
    {
      name: "Strict",
      icon: <CancelIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      refund: "50% refund if cancelled 7 days before check-in",
      details: [
        "50% refund: Cancel 7+ days before check-in",
        "25% refund: Cancel 3-7 days before check-in",
        "No refund: Cancel within 72 hours or no-show",
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Cancellation Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }} icon={<InfoIcon />}>
        Cancellation policies vary by property. Please review the specific
        policy for your booking before confirming.
      </Alert>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          How Cancellations Work
        </Typography>
        <Typography variant="body1" paragraph>
          Each property on BhutanStay sets its own cancellation policy. When you
          make a booking, the applicable policy will be clearly displayed before
          you confirm your reservation.
        </Typography>
        <Typography variant="body1" paragraph>
          If you need to cancel, you can do so through your account dashboard.
          Refunds (if applicable) will be processed to your original payment
          method within 7-10 business days.
        </Typography>
      </Paper>

      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Common Cancellation Policies
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {policyTypes.map((policy, index) => (
          <Grid size={{xs:12}} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {policy.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                      {policy.name} Policy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {policy.refund}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                {policy.details.map((detail, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 1, pl: 2 }}>
                    • {detail}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Special Circumstances
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Force Majeure:</strong> In cases of natural disasters,
            pandemics, or government-imposed travel restrictions, we may offer
            more flexible cancellation options. Please contact our support team.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Property Cancellation:</strong> If a property cancels your
            confirmed booking, you will receive a full refund and we will help
            you find alternative accommodation.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Modification vs. Cancellation
          </Typography>
          <Typography variant="body1" paragraph>
            If you need to change your booking dates, contact the property owner
            through our messaging system. Some properties may allow free date
            changes, subject to availability.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            How to Cancel
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            1. Log in to your BhutanStay account
            <br />
            2. Go to "My Bookings"
            <br />
            3. Select the booking you want to cancel
            <br />
            4. Click "Cancel Booking"
            <br />
            5. Review the refund amount (if applicable)
            <br />
            6. Confirm cancellation
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Refund Processing
          </Typography>
          <Typography variant="body1" paragraph>
            • Refunds are processed within 48 hours of cancellation
            <br />
            • Money will be returned to your original payment method
            <br />
            • Bank processing may take 7-10 business days
            <br />• You'll receive an email confirmation once the refund is
            initiated
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Non-Refundable Bookings
          </Typography>
          <Typography variant="body1" paragraph>
            Some properties offer discounted rates for non-refundable bookings.
            These bookings cannot be cancelled or modified, and no refund will
            be provided under any circumstances.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body1">
            If you have questions about cancellation:
            <br />
            Email: support@bhutanstay.com
            <br />
            Phone: +975 XXXX XXXX
            <br />
            Live Chat: Available 24/7
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
