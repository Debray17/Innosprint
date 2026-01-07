import React, { useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Grid,
    Button,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";

export default function ImageUpload({
    images = [],
    onChange,
    maxImages = 5,
    title = "Property Images",
}) {
    const theme = useTheme();
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        // Check max images limit
        const remainingSlots = maxImages - images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        // Convert files to base64 or URLs for preview
        const newImages = [];

        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push({
                    id: Date.now() + Math.random(),
                    file: file,
                    preview: reader.result,
                    name: file.name,
                });

                if (newImages.length === filesToAdd.length) {
                    onChange([...images, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        event.target.value = "";
    };

    const handleRemoveImage = (imageId) => {
        onChange(images.filter((img) => img.id !== imageId));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload up to {maxImages} images (JPG, PNG, WebP)
            </Typography>

            <Grid container spacing={2}>
                {/* Uploaded Images */}
                {images.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                        <Paper
                            sx={{
                                position: "relative",
                                paddingTop: "75%", // 4:3 aspect ratio
                                borderRadius: 2,
                                overflow: "hidden",
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Box
                                component="img"
                                src={image.preview || image.url}
                                alt={image.name}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(image.id)}
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                    },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}

                {/* Upload Button */}
                {images.length < maxImages && (
                    <Grid item xs={6} sm={4} md={3}>
                        <Paper
                            onClick={handleUploadClick}
                            sx={{
                                paddingTop: "75%",
                                borderRadius: 2,
                                border: `2px dashed ${theme.palette.divider}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                cursor: "pointer",
                                position: "relative",
                                transition: "all 0.2s",
                                "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CloudUploadIcon
                                    sx={{
                                        fontSize: 32,
                                        color: theme.palette.text.secondary,
                                        mb: 0.5,
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Upload
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                style={{ display: "none" }}
            />

            {/* Image Count */}
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
            >
                {images.length} of {maxImages} images uploaded
            </Typography>
        </Box>
    );
}