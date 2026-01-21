import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function TermsOfServicePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Terms of Service
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using BhutanStay ("the Platform"), you agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our services.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            BhutanStay is a platform that connects travelers with accommodation
            providers in Bhutan. We facilitate bookings but are not responsible
            for the actual provision of accommodation services.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3.1 Registration:</strong> You must create an account to
            make bookings. You agree to provide accurate and complete
            information.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3.2 Account Security:</strong> You are responsible for
            maintaining the confidentiality of your account credentials and for
            all activities under your account.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3.3 Account Termination:</strong> We reserve the right to
            suspend or terminate accounts that violate these terms.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            4. Bookings and Payments
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.1 Booking Process:</strong> When you make a booking, you
            enter into a contract with the property owner, not with BhutanStay.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.2 Payment:</strong> Payment is processed through our
            secure payment gateway. You agree to pay all charges incurred.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.3 Pricing:</strong> All prices are displayed in the local
            currency and include applicable taxes unless stated otherwise.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.4 Booking Confirmation:</strong> Bookings are confirmed
            only after successful payment and property owner acceptance.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Cancellations and Refunds
          </Typography>
          <Typography variant="body1" paragraph>
            Cancellation policies vary by property. Please review the specific
            cancellation policy before booking. See our Cancellation Policy page
            for more details.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Property Owners (Hosts)
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.1 Listing Requirements:</strong> Property owners must
            provide accurate descriptions, photos, and pricing for their
            properties.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.2 Verification:</strong> Property owners must complete
            identity verification and provide required documentation.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.3 Service Standards:</strong> Property owners must honor
            confirmed bookings and maintain the quality standards advertised.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.4 Commission:</strong> Property owners agree to pay the
            platform commission as outlined in the Host Agreement.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. User Conduct
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Violate any laws or regulations
            <br />
            • Infringe on intellectual property rights
            <br />
            • Post false, misleading, or fraudulent content
            <br />
            • Harass, abuse, or harm others
            <br />
            • Attempt to circumvent platform fees
            <br />
            • Use automated systems to access the platform
            <br />• Interfere with the platform's operation
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on the platform, including text, graphics, logos, and
            software, is the property of BhutanStay or its content suppliers and
            is protected by copyright and intellectual property laws.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            9. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            BhutanStay acts as an intermediary platform. We are not liable for:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • The quality, safety, or legality of properties listed
            <br />
            • The accuracy of property descriptions
            <br />
            • The ability of property owners to fulfill bookings
            <br />
            • Personal injury or property damage during stays
            <br />• Loss of data or business interruption
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            10. Dispute Resolution
          </Typography>
          <Typography variant="body1" paragraph>
            In case of disputes between users and property owners, we may assist
            in resolution but are not obligated to do so. Any disputes with
            BhutanStay shall be governed by the laws of Bhutan.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            11. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. Continued
            use of the platform after changes constitutes acceptance of the new
            terms.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            12. Contact Information
          </Typography>
          <Typography variant="body1">
            For questions about these Terms of Service:
            <br />
            Email: legal@bhutanstay.com
            <br />
            Phone: +975 XXXX XXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
