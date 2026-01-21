import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      type: "Essential Cookies",
      purpose: "Required for the website to function properly",
      examples: "Session management, authentication",
      duration: "Session / 1 year",
    },
    {
      type: "Performance Cookies",
      purpose: "Help us understand how visitors interact with our website",
      examples: "Google Analytics, page load times",
      duration: "2 years",
    },
    {
      type: "Functional Cookies",
      purpose: "Remember your preferences and choices",
      examples: "Language preferences, location",
      duration: "1 year",
    },
    {
      type: "Marketing Cookies",
      purpose: "Track your browsing to show relevant advertisements",
      examples: "Facebook Pixel, Google Ads",
      duration: "2 years",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Cookie Policy
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Last updated: {new Date().toLocaleDateString()}
      </Typography>

      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            What Are Cookies?
          </Typography>
          <Typography variant="body1" paragraph>
            Cookies are small text files that are placed on your device when you
            visit a website. They help the website recognize your device and
            remember information about your visit, such as your preferences and
            actions.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            How We Use Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            BhutanStay uses cookies to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • Keep you signed in to your account
            <br />
            • Remember your preferences and settings
            <br />
            • Understand how you use our website
            <br />
            • Improve our services and user experience
            <br />
            • Provide personalized content and advertisements
            <br />• Analyze website traffic and performance
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Types of Cookies We Use
          </Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Cookie Type
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Purpose
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Examples
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>
                    Duration
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cookieTypes.map((cookie, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:nth-of-type(odd)": { bgcolor: "grey.100" } }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      {cookie.type}
                    </TableCell>
                    <TableCell>{cookie.purpose}</TableCell>
                    <TableCell>{cookie.examples}</TableCell>
                    <TableCell>{cookie.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Third-Party Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            We also use third-party cookies from trusted partners, including:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • <strong>Google Analytics:</strong> To analyze website traffic and
            user behavior
            <br />• <strong>Facebook Pixel:</strong> For targeted advertising
            <br />• <strong>Payment Processors:</strong> To facilitate secure
            transactions
            <br />• <strong>Customer Support Tools:</strong> To provide live
            chat support
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Managing Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            You can control and manage cookies in several ways:
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3, mb: 2 }}>
            <strong>Browser Settings:</strong>
            <br />
            Most browsers allow you to refuse or accept cookies. You can usually
            find these settings in your browser's "Options" or "Preferences"
            menu.
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3, mb: 2 }}>
            <strong>Cookie Consent Tool:</strong>
            <br />
            You can manage your cookie preferences using our cookie consent
            banner when you first visit our website.
          </Typography>
          <Typography variant="body1" paragraph sx={{ pl: 3 }}>
            <strong>Note:</strong> Blocking or deleting cookies may affect your
            ability to use some features of our website.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Browser-Specific Cookie Management
          </Typography>
          <Typography variant="body1" component="div" sx={{ pl: 3 }}>
            • <strong>Chrome:</strong> Settings → Privacy and security → Cookies
            <br />• <strong>Firefox:</strong> Options → Privacy & Security →
            Cookies
            <br />• <strong>Safari:</strong> Preferences → Privacy → Cookies
            <br />• <strong>Edge:</strong> Settings → Privacy → Cookies
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Changes to This Cookie Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Cookie Policy from time to time to reflect
            changes in technology or legal requirements. We encourage you to
            review this page periodically.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have questions about our use of cookies:
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
