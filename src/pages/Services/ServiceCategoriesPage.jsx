import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Card,
    CardContent,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExploreIcon from "@mui/icons-material/Explore";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PoolIcon from "@mui/icons-material/Pool";

import ConfirmDialog from "../../components/ConfirmDialog";
import { serviceCategories, services } from "../../data/mockData";

// Icon mapping
const iconMap = {
    spa: SpaIcon,
    restaurant: RestaurantIcon,
    laundry: LocalLaundryServiceIcon,
    car: DirectionsCarIcon,
    tour: ExploreIcon,
    room_service: RoomServiceIcon,
    gym: FitnessCenterIcon,
    pool: PoolIcon,
    default: RoomServiceIcon,
};

// Available icons for selection
const availableIcons = [
    { name: "spa", icon: SpaIcon, label: "Spa" },
    { name: "restaurant", icon: RestaurantIcon, label: "Restaurant" },
    { name: "laundry", icon: LocalLaundryServiceIcon, label: "Laundry" },
    { name: "car", icon: DirectionsCarIcon, label: "Transport" },
    { name: "tour", icon: ExploreIcon, label: "Tours" },
    { name: "room_service", icon: RoomServiceIcon, label: "Room Service" },
    { name: "gym", icon: FitnessCenterIcon, label: "Gym" },
    { name: "pool", icon: PoolIcon, label: "Pool" },
];

const ServiceCategoriesPage = () => {
    const theme = useTheme();
    const [categoriesData, setCategoriesData] = useState(serviceCategories);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "spa",
        isActive: true,
    });

    // Get services count for each category
    const getServicesCount = (categoryId) => {
        return services.filter((s) => s.categoryId === categoryId).length;
    };

    // Handle form change
    const handleFormChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle icon select
    const handleIconSelect = (iconName) => {
        setFormData((prev) => ({ ...prev, icon: iconName }));
    };

    // Handle add category
    const handleAddCategory = () => {
        const newCategory = {
            id: categoriesData.length + 1,
            ...formData,
        };
        setCategoriesData([...categoriesData, newCategory]);
        setOpenAddModal(false);
        resetForm();
    };

    // Handle edit click
    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            icon: category.icon,
            isActive: category.isActive,
        });
        setOpenEditModal(true);
    };

    // Handle edit category
    const handleEditCategory = () => {
        setCategoriesData(
            categoriesData.map((c) =>
                c.id === selectedCategory.id ? { ...c, ...formData } : c
            )
        );
        setOpenEditModal(false);
        resetForm();
    };

    // Handle delete click
    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setOpenDeleteDialog(true);
    };

    // Handle delete category
    const handleDeleteCategory = () => {
        setCategoriesData(categoriesData.filter((c) => c.id !== selectedCategory.id));
        setOpenDeleteDialog(false);
        setSelectedCategory(null);
    };

    // Toggle active status
    const toggleActiveStatus = (categoryId) => {
        setCategoriesData(
            categoriesData.map((c) =>
                c.id === categoryId ? { ...c, isActive: !c.isActive } : c
            )
        );
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            icon: "spa",
            isActive: true,
        });
        setSelectedCategory(null);
    };

    // Category Card Component
    const CategoryCard = ({ category }) => {
        const IconComponent = iconMap[category.icon] || iconMap.default;
        const servicesCount = getServicesCount(category.id);

        return (
            <Card
                sx={{
                    height: "100%",
                    opacity: category.isActive ? 1 : 0.6,
                    transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                }}
            >
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                            }}
                        >
                            <IconComponent sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton
                                size="small"
                                onClick={() => handleEditClick(category)}
                                sx={{ color: theme.palette.primary.main }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(category)}
                                sx={{ color: theme.palette.error.main }}
                                disabled={servicesCount > 0}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {category.name}
                        </Typography>
                        <Chip
                            label={category.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={category.isActive ? "success" : "default"}
                            variant={category.isActive ? "filled" : "outlined"}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {category.description}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Services:
                            </Typography>
                            <Chip
                                label={servicesCount}
                                size="small"
                                color={servicesCount > 0 ? "primary" : "default"}
                            />
                        </Box>
                        <Switch
                            size="small"
                            checked={category.isActive}
                            onChange={() => toggleActiveStatus(category.id)}
                        />
                    </Box>
                </CardContent>
            </Card>
        );
    };

    // Form Component
    const CategoryForm = () => (
        <Box>
            <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
                sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Select Icon
            </Typography>
            <Grid container spacing={1} sx={{ mb: 3 }}>
                {availableIcons.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.icon === item.name;
                    return (
                        <Grid item key={item.name}>
                            <Paper
                                onClick={() => handleIconSelect(item.name)}
                                sx={{
                                    p: 1.5,
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0.5,
                                    minWidth: 70,
                                    border: isSelected
                                        ? `2px solid ${theme.palette.primary.main}`
                                        : `1px solid ${theme.palette.divider}`,
                                    backgroundColor: isSelected
                                        ? alpha(theme.palette.primary.main, 0.05)
                                        : "transparent",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        fontSize: 24,
                                        color: isSelected
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isSelected
                                            ? theme.palette.primary.main
                                            : theme.palette.text.secondary,
                                        fontWeight: isSelected ? 600 : 400,
                                        fontSize: 10,
                                    }}
                                >
                                    {item.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            <FormControlLabel
                control={
                    <Switch
                        checked={formData.isActive}
                        onChange={handleFormChange}
                        name="isActive"
                    />
                }
                label="Active"
            />
        </Box>
    );

    // Stats
    const activeCategories = categoriesData.filter((c) => c.isActive).length;
    const totalServices = services.length;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Service Categories
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage service categories for properties
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddModal(true)}
                >
                    Add Category
                </Button>
            </Box>

            {/* Stats Summary */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="primary.main">
                                {categoriesData.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Categories
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="success.main">
                                {activeCategories}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Categories
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h3" fontWeight={700} color="info.main">
                                {totalServices}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Services
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Categories Grid */}
            <Grid container spacing={3}>
                {categoriesData.map((category) => (
                    <Grid item xs={12} sm={6} md={4} key={category.id}>
                        <CategoryCard category={category} />
                    </Grid>
                ))}
            </Grid>

            {/* Add Category Modal */}
            <Dialog
                open={openAddModal}
                onClose={() => {
                    setOpenAddModal(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Add Service Category
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <CategoryForm />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenAddModal(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddCategory}
                        disabled={!formData.name}
                    >
                        Add Category
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Category Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    resetForm();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Service Category
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <CategoryForm />
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setOpenEditModal(false);
                            resetForm();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleEditCategory}
                        disabled={!formData.name}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setSelectedCategory(null);
                }}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </Box>
    );
};

export default ServiceCategoriesPage;