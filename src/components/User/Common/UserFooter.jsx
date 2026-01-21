// src/components/User/Common/UserFooter.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import HotelIcon from "@mui/icons-material/Hotel";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";

export default function UserFooter() {
  const theme = useTheme();

  const footerLinks = {
    company: [
      { label: "About Us", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
      { label: "Blog", path: "/blog" },
    ],
    support: [
      { label: "Help Center", path: "/help" },
      { label: "Contact Us", path: "/contact" },
      { label: "Cancellation Policy", path: "/cancellation-policy" },
      { label: "Safety Information", path: "/safety" },
    ],
    hosting: [
      { label: "List Your Property", path: "/host" },
      { label: "Host Resources", path: "/host-resources" },
      { label: "Community Forum", path: "/community" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Cookie Policy", path: "/cookies" },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a2e",
        color: "#fff",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <HotelIcon
                sx={{ fontSize: 36, mr: 1, color: theme.palette.primary.light }}
              />
              <Typography variant="h5" fontWeight={700}>
                BhutanStay
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mb: 3, maxWidth: 300 }}
            >
              Discover unique stays and experiences around Bhutan. Book
              hotels, resorts, villas, and homestays with ease.
            </Typography>

            {/* Newsletter */}
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Subscribe to our newsletter
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter your email"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.5)",
                  },
                }}
              />
              <Button variant="contained" sx={{ minWidth: "auto", px: 2 }}>
                <SendIcon />
              </Button>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Company
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Support
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Hosting
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.hosting.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Legal
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} BhutanStay. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map(
              (Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Icon />
                </IconButton>
              ),
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
