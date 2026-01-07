import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "primary",
    trend,
    trendValue,
    subtitle,
}) {
    const theme = useTheme();

    const colorMap = {
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        success: theme.palette.success.main,
        error: theme.palette.error.main,
        warning: theme.palette.warning.main,
        info: theme.palette.info.main,
    };

    const bgColor = colorMap[color] || colorMap.primary;

    return (
        <Card
            sx={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease-in-out",
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500, mb: 1 }}
                        >
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                            {value}
                        </Typography>
                        {(trend || subtitle) && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                {trend && (
                                    <>
                                        {trend === "up" ? (
                                            <TrendingUpIcon
                                                sx={{ fontSize: 18, color: theme.palette.success.main }}
                                            />
                                        ) : (
                                            <TrendingDownIcon
                                                sx={{ fontSize: 18, color: theme.palette.error.main }}
                                            />
                                        )}
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    trend === "up"
                                                        ? theme.palette.success.main
                                                        : theme.palette.error.main,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {trendValue}
                                        </Typography>
                                    </>
                                )}
                                {subtitle && (
                                    <Typography variant="body2" color="text.secondary">
                                        {subtitle}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: alpha(bgColor, 0.15),
                            color: bgColor,
                            width: 56,
                            height: 56,
                        }}
                    >
                        <Icon sx={{ fontSize: 28 }} />
                    </Avatar>
                </Box>
            </CardContent>

            {/* Decorative element */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: bgColor,
                }}
            />
        </Card>
    );
}