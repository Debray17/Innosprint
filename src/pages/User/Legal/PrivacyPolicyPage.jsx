import React from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us when you:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Create an account or register as a property owner
            <br />
            • Make a booking or reservation
            <br />
            • Contact our customer support
            <br />
            • Subscribe to our newsletter
            <br />• Participate in surveys or promotions
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2. Personal Information
          </Typography>
          <Typography variant="body1" paragraph>
            The types of personal information we may collect include:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Name, email address, and phone number
            <br />
            • Billing and payment information
            <br />
            • Booking history and preferences
            <br />
            • Profile information and photos
            <br />
            • Government-issued ID for verification (property owners)
            <br />• Communication records with our support team
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Process bookings and transactions
            <br />
            • Send booking confirmations and updates
            <br />
            • Provide customer support
            <br />
            • Verify property owner identities
            <br />
            • Send promotional communications (with your consent)
            <br />
            • Improve our services and user experience
            <br />
            • Detect and prevent fraud
            <br />• Comply with legal obligations
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            4. Information Sharing
          </Typography>
          <Typography variant="body1" paragraph>
            We may share your information with:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • <strong>Property Owners:</strong> When you make a booking, we
            share necessary information with the property owner to fulfill your
            reservation
            <br />• <strong>Service Providers:</strong> Third-party companies
            that help us operate our platform (payment processors, email
            services, etc.)
            <br />• <strong>Legal Authorities:</strong> When required by law or
            to protect our rights
            <br />• <strong>Business Transfers:</strong> In connection with a
            merger, acquisition, or sale of assets
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no internet
            transmission is completely secure, and we cannot guarantee absolute
            security.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Access and receive a copy of your personal data
            <br />
            • Correct inaccurate or incomplete data
            <br />
            • Request deletion of your data
            <br />
            • Object to or restrict processing of your data
            <br />
            • Withdraw consent at any time
            <br />• Lodge a complaint with a supervisory authority
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to improve your
            browsing experience. See our Cookie Policy for more details.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not directed to individuals under 18. We do not
            knowingly collect personal information from children.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            9. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "Last updated" date.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            10. Contact Us
          </Typography>
          <Typography variant="body1">
            If you have questions about this Privacy Policy, please contact us
            at:
            <br />
            Email: privacy@bhutanstay.com
            <br />
            Phone: +975 XXXX XXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
