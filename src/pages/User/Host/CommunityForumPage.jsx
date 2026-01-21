import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Tab,
  Tabs,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ForumIcon from "@mui/icons-material/Forum";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function CommunityForumPage() {
  const [tabValue, setTabValue] = useState(0);

  const categories = [
    "All Discussions",
    "Getting Started",
    "Pricing & Revenue",
    "Guest Communication",
    "Property Management",
    "Success Stories",
  ];

  const discussions = [
    {
      id: 1,
      title: "Best practices for seasonal pricing in Thimphu?",
      author: "Tashi Dorji",
      avatar: "T",
      category: "Pricing & Revenue",
      replies: 12,
      likes: 24,
      time: "2 hours ago",
      preview:
        "I'm trying to optimize my pricing strategy for the upcoming festival season...",
    },
    {
      id: 2,
      title: "How to handle last-minute cancellations?",
      author: "Pema Choden",
      avatar: "P",
      category: "Guest Communication",
      replies: 8,
      likes: 15,
      time: "5 hours ago",
      preview:
        "Just experienced my third last-minute cancellation this month. Any tips?",
    },
    {
      id: 3,
      title: "My property reached Superhost status! 🎉",
      author: "Karma Wangchuk",
      avatar: "K",
      category: "Success Stories",
      replies: 45,
      likes: 156,
      time: "1 day ago",
      preview:
        "After 6 months on the platform, I finally achieved Superhost status! Here's what worked for me...",
    },
    {
      id: 4,
      title: "Photography tips that increased my bookings by 40%",
      author: "Sonam Lhamo",
      avatar: "S",
      category: "Property Management",
      replies: 23,
      likes: 67,
      time: "2 days ago",
      preview:
        "I hired a professional photographer and saw a huge increase in bookings...",
    },
    {
      id: 5,
      title: "Managing multiple properties - tools and tips?",
      author: "Ugyen Tshering",
      avatar: "U",
      category: "Property Management",
      replies: 19,
      likes: 31,
      time: "3 days ago",
      preview:
        "Recently expanded to 3 properties. Looking for advice on efficient management...",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <ForumIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
        <Typography variant="h2" fontWeight={700} gutterBottom>
          Host Community Forum
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          Connect with fellow hosts, share experiences, and learn from each
          other
        </Typography>
      </Box>

      {/* Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search discussions..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            justifyContent: "space-between",
          }}
        >
          <Button variant="contained">Start New Discussion</Button>
          <Button variant="outlined" startIcon={<TrendingUpIcon />}>
            Trending
          </Button>
        </Box>
      </Paper>

      {/* Categories Tabs */}
      <Paper elevation={0} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </Paper>

      {/* Discussions */}
      <Box>
        {discussions.map((discussion) => (
          <Card key={discussion.id} elevation={2} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 50, height: 50 }}>
                  {discussion.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {discussion.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {discussion.author} • {discussion.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={discussion.category}
                      size="small"
                      color="primary"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {discussion.preview}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <ThumbUpIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {discussion.likes}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CommentIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {discussion.replies} replies
                      </Typography>
                    </Box>
                    <Button size="small">View Discussion</Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Community Guidelines */}
      <Paper elevation={0} sx={{ p: 4, bgcolor: "grey.50", mt: 6 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Community Guidelines
        </Typography>
        <Typography variant="body1" component="div">
          • Be respectful and professional
          <br />
          • Share authentic experiences and advice
          <br />
          • No spam or self-promotion
          <br />
          • Protect guest privacy
          <br />• Report inappropriate content
        </Typography>
      </Paper>
    </Container>
  );
}
