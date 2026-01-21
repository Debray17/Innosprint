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
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WarningIcon from "@mui/icons-material/Warning";

export default function SafetyInformationPage() {
  const safetyFeatures = [
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: "primary.main" }} />,
      title: "Verified Properties",
      description:
        "All properties undergo verification. We check property ownership, quality standards, and host identity.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: "success.main" }} />,
      title: "Secure Payments",
      description:
        "All transactions are encrypted and processed through secure payment gateways. We never share your financial information.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: "info.main" }} />,
      title: "24/7 Support",
      description:
        "Our customer support team is available round the clock to assist with emergencies or concerns during your stay.",
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 50, color: "error.main" }} />,
      title: "Safety Standards",
      description:
        "Properties must meet safety requirements including fire safety, emergency exits, and first aid availability.",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Safety Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Your safety is our top priority
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        BhutanStay is committed to ensuring safe and secure experiences for all
        our users, whether you're a guest or a property owner.
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {safetyFeatures.map((feature, index) => (
          <Grid size={{xs:12, sm:6}} key={index}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center" }}>
                {feature.icon}
                <Typography variant="h6" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            For Guests: Stay Safe During Your Trip
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Before Booking:</strong>
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Read property reviews and ratings carefully
            <br />
            • Check if the property has verified badges
            <br />
            • Review property safety features and amenities
            <br />
            • Communicate with the host through our platform
            <br />• Never send money outside the BhutanStay platform
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" paragraph>
            <strong>During Your Stay:</strong>
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Familiarize yourself with emergency exits
            <br />
            • Know the location of fire extinguishers and first aid kits
            <br />
            • Keep emergency contact numbers handy
            <br />
            • Lock doors and windows when leaving
            <br />
            • Report any safety concerns immediately
            <br />• Don't share your room access codes publicly
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            For Property Owners: Safety Requirements
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Mandatory Safety Features:</strong>
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Working smoke detectors in all sleeping areas
            <br />
            • Fire extinguishers accessible and maintained
            <br />
            • Clear emergency evacuation plan posted
            <br />
            • First aid kit readily available
            <br />
            • Secure locks on all entry points
            <br />
            • Emergency contact information displayed
            <br />• Compliance with local safety regulations
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Health & Hygiene
          </Typography>
          <Typography variant="body1" paragraph>
            All properties must follow enhanced cleaning protocols:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Thorough sanitization between guests
            <br />
            • High-touch surfaces disinfected regularly
            <br />
            • Clean linens and towels for each guest
            <br />
            • Proper ventilation in all rooms
            <br />• Adherence to local health guidelines
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Data Privacy & Security
          </Typography>
          <Typography variant="body1" paragraph>
            We protect your personal information:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • All data is encrypted and stored securely
            <br />
            • We never sell your personal information
            <br />
            • Payment details are processed through PCI-compliant systems
            <br />
            • You control what information you share
            <br />• See our Privacy Policy for full details
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Trust & Verification
          </Typography>
          <Typography variant="body1" paragraph>
            We verify property owners through:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Government-issued ID verification
            <br />
            • Property ownership documentation
            <br />
            • Business registration (for commercial properties)
            <br />
            • Physical property inspection (when possible)
            <br />• Background checks for hosts
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Emergency Contacts
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            <strong>In Bhutan:</strong>
            <br />
            • Police: 113
            <br />
            • Fire: 110
            <br />
            • Ambulance: 112
            <br />
            <br />
            <strong>BhutanStay Support:</strong>
            <br />
            • 24/7 Hotline: +975 XXXX XXXX
            <br />
            • Emergency Email: emergency@bhutanstay.com
            <br />• In-app emergency button
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 4 }}>
          <Typography variant="body2" fontWeight={600}>
            Report Suspicious Activity
          </Typography>
          <Typography variant="body2">
            If you encounter suspicious behavior, safety violations, or feel
            uncomfortable, contact us immediately. We take all reports seriously
            and investigate thoroughly.
          </Typography>
        </Alert>

        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Questions About Safety?
          </Typography>
          <Typography variant="body1">
            Email: safety@bhutanstay.com
            <br />
            Phone: +975 XXXX XXXX
            <br />
            Available 24/7
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
