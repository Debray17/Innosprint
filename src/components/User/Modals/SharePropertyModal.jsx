// src/components/User/Modals/SharePropertyModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function SharePropertyModal({ open, onClose, property }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/property/${property?.id}`;
  const shareText = `Check out ${property?.name} on BhutanStay!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "#4267B2",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      color: "#1DA1F2",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      color: "#25D366",
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      color: "#0A66C2",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Email",
      icon: EmailIcon,
      color: "#EA4335",
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const handleSocialShare = (url) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Share this property
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {/* Property Preview */}
          {property && (
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Box
                component="img"
                src={property.images?.[0]}
                alt={property.name}
                sx={{
                  width: 100,
                  height: 75,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {property.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.location?.city}, {property.location?.state}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Social Share Buttons */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Share on social media
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.name}
                onClick={() => handleSocialShare(social.url)}
                sx={{
                  bgcolor: alpha(social.color, 0.1),
                  color: social.color,
                  "&:hover": {
                    bgcolor: alpha(social.color, 0.2),
                  },
                }}
              >
                <social.icon />
              </IconButton>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Copy Link */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Or copy link
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={shareUrl}
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.100",
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              Copy
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setCopied(false)}>
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
