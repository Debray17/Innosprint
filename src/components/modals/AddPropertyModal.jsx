import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Box,
  OutlinedInput } from
"@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageUpload from "../ImageUpload";

const initialFormState = {
  name: "",
  ownerId: "",
  propertyTypeId: "",
  address: "",
  city: "",
  country: "",
  description: "",
  totalRooms: "",
  amenities: [],
  contactEmail: "",
  contactPhone: "",
  commissionRate: 12,
  images: []
};

export default function AddPropertyModal({
  open,
  onClose,
  onSubmit,
  owners = [],
  propertyTypes = [],
  amenities = [],
  property
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name || "",
        ownerId: property.ownerId || "",
        propertyTypeId: property.propertyTypeId || "",
        address: property.address || "",
        city: property.city || "",
        country: property.country || "",
        description: property.description || "",
        totalRooms: property.totalRooms || "",
        amenities: property.amenities || [],
        contactEmail: property.contactEmail || "",
        contactPhone: property.contactPhone || "",
        commissionRate: property.commissionRate || 0,
        images: property.images || []
      });
      setErrors({});
    } else {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [property, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAmenitiesChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      amenities: typeof value === "string" ? value.split(",") : value
    }));
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Property name is required";
    if (!formData.ownerId) newErrors.ownerId = "Owner is required";
    if (!formData.propertyTypeId) newErrors.propertyTypeId = "Property type is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.totalRooms || formData.totalRooms <= 0) newErrors.totalRooms = "Valid room count required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const owner = owners.find((o) => o.id === formData.ownerId);
      const propertyType = propertyTypes.find((t) => t.id === formData.propertyTypeId);
      onSubmit({
        ...formData,
        ownerName: owner?.name || "",
        propertyTypeName: propertyType?.name || "",
        propertyTypeIcon: propertyType?.icon || "",
        totalRooms: parseInt(formData.totalRooms)
      });
      setFormData(initialFormState);
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Add New Property
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Property Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name} />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.ownerId}>
                            <InputLabel>Owner</InputLabel>
                            <Select
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                label="Owner">

                                {owners.map((owner) =>
                <MenuItem key={owner.id} value={owner.id}>
                                        {owner.name}
                                    </MenuItem>
                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.propertyTypeId}>
                            <InputLabel>Property Type</InputLabel>
                            <Select
                name="propertyTypeId"
                value={formData.propertyTypeId}
                onChange={handleChange}
                label="Property Type">

                                {propertyTypes.map((type) =>
                <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Total Rooms"
              name="totalRooms"
              type="number"
              value={formData.totalRooms}
              onChange={handleChange}
              error={!!errors.totalRooms}
              helperText={errors.totalRooms} />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address} />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city} />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange} />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange} />

                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Amenities</InputLabel>
                            <Select
                multiple
                value={formData.amenities}
                onChange={handleAmenitiesChange}
                input={<OutlinedInput label="Amenities" />}
                renderValue={(selected) =>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) =>
                  <Chip key={value} label={value} size="small" />
                  )}
                                    </Box>
                }>

                                {amenities.map((amenity) =>
                <MenuItem key={amenity} value={amenity}>
                                        {amenity}
                                    </MenuItem>
                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange} />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Contact Phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange} />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
              fullWidth
              label="Commission Rate (%)"
              name="commissionRate"
              type="number"
              value={formData.commissionRate}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }} />

                    </Grid>
                    <Grid item xs={12}>
                        <ImageUpload
              images={formData.images}
              onChange={handleImagesChange}
              maxImages={5} />

                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Add Property
                </Button>
            </DialogActions>
        </Dialog>);

}