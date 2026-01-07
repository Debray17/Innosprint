import React from "react";
import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs = [],
    actionButton,
    actionIcon = <AddIcon />,
    onActionClick,
}) {
    return (
        <Box sx={{ mb: 3 }}>
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 1 }}
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return isLast ? (
                            <Typography key={crumb.label} color="text.primary" fontWeight={500}>
                                {crumb.label}
                            </Typography>
                        ) : (
                            <Link
                                key={crumb.label}
                                component={RouterLink}
                                to={crumb.path}
                                underline="hover"
                                color="inherit"
                            >
                                {crumb.label}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            )}

            {/* Title Row */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {actionButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={actionIcon}
                        onClick={onActionClick}
                        sx={{ px: 3 }}
                    >
                        {actionButton}
                    </Button>
                )}
            </Box>
        </Box>
    );
}