import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Divider, Rating, Snackbar, Alert, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import AddPropertyModal from "../../components/modals/AddPropertyModal";
import { properties } from "../../data/mockData";
import { getOwnerList } from "../../services/ownerService";
import { getPropertyTypeList } from "../../services/propertyTypeService";
import {
  createProperty,
  deleteProperty,
  getPropertyList,
  updateProperty } from
"../../services/propertyService";
import {
  createPropertyAmenity,
  deletePropertyAmenity,
  getPropertyAmenityList,
  updatePropertyAmenity } from
"../../services/propertyAmenityService";

export default function AllPropertiesPage() {
  const [data, setData] = useState(properties.filter((p) => p.status === "approved"));
  const [owners, setOwners] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [amenityOptions, setAmenityOptions] = useState([]);
  const [amenityTemplates, setAmenityTemplates] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [amenityForm, setAmenityForm] = useState({
    name: "",
    description: "",
    icon: ""
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let isMounted = true;

    const mapProperty = (property, index, ownersMap, typeMap) => ({
      id: property?.id || property?.primaryKeyValue || index,
      ownerId: property?.ownerId || "",
      propertyTypeId: property?.propertyTypeId || "",
      ownerName: ownersMap[property?.ownerId] || "Unknown",
      type: typeMap[property?.propertyTypeId]?.name || "Unknown",
      icon: property?.icon || typeMap[property?.propertyTypeId]?.icon || "default",
      name: property?.name || "Unnamed",
      description: property?.description || "",
      address: property?.address || "",
      city: property?.city || "",
      country: property?.country || "",
      statusId: property?.statusId ?? 0,
      status:
      property?.statusId === 3 ?
      "approved" :
      property?.statusId === 2 ?
      "rejected" :
      "pending",
      rating: property?.rating ?? 0,
      reviewsCount: property?.reviewCount ?? 0,
      commissionRate: property?.commissionRate ?? 0,
      contactEmail: property?.emailAddress || "",
      contactPhone: property?.phoneNo || "",
      accountName: property?.accountName || "",
      accountNo: property?.accountNo || "",
      checkinDate: property?.checkinDate || "",
      checkoutDate: property?.checkoutDate || "",
      rejectionReason: property?.rejectionReason || "",
      approvalDate: property?.approvalDate || "",
      documentNumber: property?.documentNumber ?? null,
      isSelected: property?.isSelected ?? false,
      version: property?.version ?? 0,
      remark: property?.remark ?? null,
      totalRooms: property?.totalRooms ?? 0,
      availableRooms: property?.availableRooms ?? 0,
      amenities: property?.amenities || [],
      images: property?.images || [],
      createdAt: (property?.transactedDate || property?.lastChanged || "").toString().split("T")[0]
    });

    const fetchAll = async () => {
      try {
        const [ownersRes, typesRes, propsRes, amenitiesRes] = await Promise.all([
        getOwnerList({ language: "en" }),
        getPropertyTypeList({ language: "en" }),
        getPropertyList({ language: "en" }),
        getPropertyAmenityList({ language: "en" })]
        );

        const ownersArray = Array.isArray(ownersRes) ? ownersRes : ownersRes ? [ownersRes] : [];
        const typesArray = Array.isArray(typesRes) ? typesRes : typesRes ? [typesRes] : [];
        const propsArray = Array.isArray(propsRes) ? propsRes : propsRes ? [propsRes] : [];
        const amenitiesArray = Array.isArray(amenitiesRes) ?
        amenitiesRes :
        amenitiesRes ?
        [amenitiesRes] :
        [];

        const ownersMap = ownersArray.reduce((acc, owner) => {
          if (owner?.id) acc[owner.id] = owner.name || owner.email || "Unknown";
          return acc;
        }, {});
        const typeMap = typesArray.reduce((acc, type) => {
          if (type?.id) acc[type.id] = type;
          return acc;
        }, {});

        if (isMounted) {
          setOwners(ownersArray.filter((owner) => owner?.statusId === 1 || owner?.isActive));
          setPropertyTypes(typesArray.filter((type) => type?.isActive));
          const activeAmenities = amenitiesArray.filter((a) => a?.isActive !== false);
          setAmenityTemplates(activeAmenities);
          setAmenityOptions(
            activeAmenities.map((a) => a?.name).filter(Boolean)
          );
          if (propsArray.length > 0) {
            setData(
              propsArray
                .map((p, i) => mapProperty(p, i, ownersMap, typeMap))
                .filter((property) => Number(property.statusId) === 3)
            );
          }
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
  { id: "name", label: "Property Name", type: "text", width: "200px" },
  { id: "ownerName", label: "Owner", type: "text", width: "150px" },
  {
    id: "type",
    label: "Type",
    type: "select",
    width: "120px",
    options: propertyTypes.map((t) => t.name)
  },
  { id: "city", label: "City", type: "text", width: "120px" },
  { id: "totalRooms", label: "Rooms", type: "number", width: "80px" },
  { id: "availableRooms", label: "Available", type: "number", width: "90px" },
  { id: "rating", label: "Rating", type: "rating", width: "100px", filterable: false },
  {
    id: "commissionRate",
    label: "Commission",
    type: "number",
    width: "100px",
    filterable: false
  }];


  const handleActionClick = (action, row) => {
    setSelectedProperty(row);
    if (action === "view") {
      setViewModalOpen(true);
      fetchAmenities(row.id);
    } else if (action === "edit") {
      setAddModalOpen(true);
    } else if (action === "delete") {
      setDeleteDialogOpen(true);
    }
  };

  const fetchAmenities = async (propertyId) => {
    try {
      const response = await getPropertyAmenityList({ language: "en" });
      const list = Array.isArray(response) ? response : response ? [response] : [];
      const filtered = list.filter((a) => a?.propertyId === propertyId);
      setAmenities(
        filtered.map((item, index) => ({
          id: item?.id || item?.primaryKeyValue || index,
          propertyId: item?.propertyId || propertyId,
          name: item?.name || "",
          description: item?.description || "",
          icon: item?.icon || "",
          documentNumber: item?.documentNumber ?? null,
          isSelected: item?.isSelected ?? false,
          version: item?.version ?? 0,
          remark: item?.remark ?? null
        }))
      );
    } catch (err) {
      setAmenities([]);
    }
  };

  const openAmenityDialog = (amenity = null) => {
    setEditingAmenity(amenity);
    setAmenityForm({
      name: amenity?.name || "",
      description: amenity?.description || "",
      icon: amenity?.icon || ""
    });
    setAmenityDialogOpen(true);
  };

  const handleAmenitySave = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        propertyId: selectedProperty.id,
        name: amenityForm.name,
        description: amenityForm.description,
        icon: amenityForm.icon,
        documentNumber: editingAmenity?.documentNumber ?? null,
        isSelected: editingAmenity?.isSelected ?? false,
        version: editingAmenity?.version ?? 0,
        remark: editingAmenity?.remark ?? null,
        id: editingAmenity?.id
      };

      let response;
      if (editingAmenity) {
        response = await updatePropertyAmenity(payload, { language: "en" });
      } else {
        response = await createPropertyAmenity(payload, { language: "en" });
      }

      const nextAmenity = {
        id: response?.id || response?.primaryKeyValue || editingAmenity?.id || `${Date.now()}`,
        propertyId: response?.propertyId || selectedProperty.id,
        name: response?.name || amenityForm.name,
        description: response?.description || amenityForm.description,
        icon: response?.icon || amenityForm.icon,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null
      };

      setAmenities((prev) => {
        if (editingAmenity) {
          return prev.map((a) => a.id === editingAmenity.id ? nextAmenity : a);
        }
        return [...prev, nextAmenity];
      });
      setAmenityDialogOpen(false);
      setEditingAmenity(null);
      setAmenityForm({ name: "", description: "", icon: "" });
      setSnackbar({ open: true, message: "Amenity saved.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to save amenity.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAmenityDelete = async (amenity) => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        propertyId: selectedProperty.id,
        name: amenity.name,
        description: amenity.description,
        icon: amenity.icon,
        documentNumber: amenity.documentNumber ?? null,
        isSelected: amenity.isSelected ?? false,
        version: amenity.version ?? 0,
        remark: amenity.remark ?? null,
        id: amenity.id
      };
      await deletePropertyAmenity(payload, { language: "en" });
      setAmenities((prev) => prev.filter((a) => a.id !== amenity.id));
      setSnackbar({ open: true, message: "Amenity deleted.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete amenity.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProperty = async (updatedProperty) => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        ownerId: updatedProperty.ownerId,
        propertyTypeId: updatedProperty.propertyTypeId,
        name: updatedProperty.name,
        description: updatedProperty.description,
        address: updatedProperty.address,
        city: updatedProperty.city,
        country: updatedProperty.country,
        statusId: selectedProperty.statusId ?? 0,
        icon: updatedProperty.propertyTypeIcon || selectedProperty.icon || "default",
        rating: selectedProperty.rating ?? 0,
        reviewCount: selectedProperty.reviewsCount ?? 0,
        commissionRate: Number(updatedProperty.commissionRate) || 0,
        emailAddress: updatedProperty.contactEmail || "",
        phoneNo: updatedProperty.contactPhone || "",
        accountName: updatedProperty.accountName || "",
        accountNo: updatedProperty.accountNo || "",
        checkinDate: selectedProperty.checkinDate || new Date().toISOString(),
        checkoutDate: selectedProperty.checkoutDate || new Date().toISOString(),
        rejectionReason: selectedProperty.rejectionReason || "",
        approvalDate: selectedProperty.approvalDate || new Date().toISOString(),
        documentNumber: selectedProperty.documentNumber ?? null,
        isSelected: selectedProperty.isSelected ?? false,
        version: selectedProperty.version ?? 0,
        remark: selectedProperty.remark ?? null,
        id: selectedProperty.id
      };

      const response = await updateProperty(payload, { language: "en" });

      const ownersMap = owners.reduce((acc, owner) => {
        if (owner?.id) acc[owner.id] = owner.name || owner.email || "Unknown";
        return acc;
      }, {});
      const typeMap = propertyTypes.reduce((acc, type) => {
        if (type?.id) acc[type.id] = type;
        return acc;
      }, {});

      setData((prev) =>
      prev.map((p) =>
      p.id === selectedProperty.id ?
      {
        ...p,
        ownerId: response?.ownerId || updatedProperty.ownerId,
        propertyTypeId: response?.propertyTypeId || updatedProperty.propertyTypeId,
        ownerName: ownersMap[response?.ownerId || updatedProperty.ownerId] || "",
        type: typeMap[response?.propertyTypeId || updatedProperty.propertyTypeId]?.name || "",
        icon: response?.icon || updatedProperty.propertyTypeIcon || p.icon,
        name: response?.name || updatedProperty.name,
        description: response?.description || updatedProperty.description,
        address: response?.address || updatedProperty.address,
        city: response?.city || updatedProperty.city,
        country: response?.country || updatedProperty.country,
        commissionRate: response?.commissionRate ?? updatedProperty.commissionRate,
        contactEmail: response?.emailAddress || updatedProperty.contactEmail || "",
        contactPhone: response?.phoneNo || updatedProperty.contactPhone || "",
        accountName: response?.accountName || updatedProperty.accountName || "",
        accountNo: response?.accountNo || updatedProperty.accountNo || "",
        totalRooms: updatedProperty.totalRooms || p.totalRooms,
        availableRooms: updatedProperty.totalRooms || p.availableRooms,
        amenities: updatedProperty.amenities || p.amenities,
        images: updatedProperty.images || p.images
      } :
      p
      )
      );
      setSnackbar({ open: true, message: "Property updated successfully.", severity: "success" });
      setAddModalOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update property.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddProperty = async (newProperty) => {
    setSaving(true);
    try {
      const payload = {
        isActive: true,
        transactedBy: "admin",
        ownerId: newProperty.ownerId,
        propertyTypeId: newProperty.propertyTypeId,
        name: newProperty.name,
        description: newProperty.description,
        address: newProperty.address,
        city: newProperty.city,
        country: newProperty.country,
        statusId: 0,
        icon: newProperty.propertyTypeIcon || "default",
        rating: 0,
        reviewCount: 0,
        commissionRate: Number(newProperty.commissionRate) || 0,
        emailAddress: newProperty.contactEmail || "",
        phoneNo: newProperty.contactPhone || "",
        accountName: newProperty.accountName || "",
        accountNo: newProperty.accountNo || "",
        checkinDate: new Date().toISOString(),
        checkoutDate: new Date().toISOString(),
        rejectionReason: "",
        approvalDate: new Date().toISOString()
      };

      const response = await createProperty(payload, { language: "en" });

      if (newProperty.amenities?.length) {
        await Promise.all(
          newProperty.amenities.map((amenityName) => {
            const template = amenityTemplates.find((a) => a?.name === amenityName);
            return createPropertyAmenity(
              {
                isActive: true,
                transactedBy: "admin",
                propertyId: response?.id || response?.primaryKeyValue,
                name: amenityName,
                description: template?.description || "",
                icon: template?.icon || ""
              },
              { language: "en" }
            );
          })
        );
      }

      const ownersMap = owners.reduce((acc, owner) => {
        if (owner?.id) acc[owner.id] = owner.name || owner.email || "Unknown";
        return acc;
      }, {});
      const typeMap = propertyTypes.reduce((acc, type) => {
        if (type?.id) acc[type.id] = type;
        return acc;
      }, {});

      const mapped = {
        id: response?.id || response?.primaryKeyValue || data.length + 10,
        ownerId: response?.ownerId || newProperty.ownerId,
        propertyTypeId: response?.propertyTypeId || newProperty.propertyTypeId,
        ownerName: ownersMap[response?.ownerId || newProperty.ownerId] || "",
        type: typeMap[response?.propertyTypeId || newProperty.propertyTypeId]?.name || "",
        icon: response?.icon || newProperty.propertyTypeIcon || "default",
        name: response?.name || newProperty.name,
        description: response?.description || newProperty.description,
        address: response?.address || newProperty.address,
        city: response?.city || newProperty.city,
        country: response?.country || newProperty.country,
        statusId: response?.statusId ?? 0,
        status: "pending",
        rating: response?.rating ?? 0,
        reviewsCount: response?.reviewCount ?? 0,
        commissionRate: response?.commissionRate ?? newProperty.commissionRate,
        contactEmail: response?.emailAddress || newProperty.contactEmail || "",
        contactPhone: response?.phoneNo || newProperty.contactPhone || "",
        accountName: response?.accountName || newProperty.accountName || "",
        accountNo: response?.accountNo || newProperty.accountNo || "",
        checkinDate: response?.checkinDate || payload.checkinDate,
        checkoutDate: response?.checkoutDate || payload.checkoutDate,
        rejectionReason: response?.rejectionReason || "",
        approvalDate: response?.approvalDate || payload.approvalDate,
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null,
        totalRooms: newProperty.totalRooms || 0,
        availableRooms: newProperty.totalRooms || 0,
        amenities: newProperty.amenities || [],
        images: newProperty.images || [],
        createdAt: (response?.lastChanged || response?.transactedDate || new Date().toISOString()).
        toString().
        split("T")[0]
      };

      if (mapped.status === "approved") {
        setData((prev) => [...prev, mapped]);
      }
      setSnackbar({
        open: true,
        message:
          mapped.status === "approved"
            ? "Property created successfully."
            : "Property submitted and moved to Registration Requests.",
        severity: "success"
      });
      setAddModalOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to create property.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        ownerId: selectedProperty.ownerId,
        propertyTypeId: selectedProperty.propertyTypeId,
        name: selectedProperty.name,
        description: selectedProperty.description,
        address: selectedProperty.address,
        city: selectedProperty.city,
        country: selectedProperty.country,
        statusId: selectedProperty.statusId ?? 0,
        icon: selectedProperty.icon || "default",
        rating: selectedProperty.rating ?? 0,
        reviewCount: selectedProperty.reviewsCount ?? 0,
        commissionRate: selectedProperty.commissionRate ?? 0,
        emailAddress: selectedProperty.contactEmail || "",
        phoneNo: selectedProperty.contactPhone || "",
        accountName: selectedProperty.accountName || "",
        accountNo: selectedProperty.accountNo || "",
        checkinDate: selectedProperty.checkinDate || new Date().toISOString(),
        checkoutDate: selectedProperty.checkoutDate || new Date().toISOString(),
        rejectionReason: selectedProperty.rejectionReason || "",
        approvalDate: selectedProperty.approvalDate || new Date().toISOString(),
        documentNumber: selectedProperty.documentNumber ?? null,
        isSelected: selectedProperty.isSelected ?? false,
        version: selectedProperty.version ?? 0,
        remark: selectedProperty.remark ?? null,
        id: selectedProperty.id
      };

      await deleteProperty(payload, { language: "en" });
      setData((prev) => prev.filter((p) => p.id !== selectedProperty.id));
      setSnackbar({ open: true, message: "Property deleted successfully.", severity: "success" });
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete property.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Properties
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage all approved properties
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProperty(null);
            setAddModalOpen(true);
          }}>

                    Add Property
                </Button>
            </Box>

            {/* Table */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <CustomTable
            data={data}
            columns={columns}
            actions={["view", "edit", "delete"]}
            onActionClick={handleActionClick} />

                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <AddPropertyModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedProperty(null);
        }}
        onSubmit={selectedProperty ? handleUpdateProperty : handleAddProperty}
        property={selectedProperty}
        owners={owners}
        propertyTypes={propertyTypes}
        amenities={amenityOptions} />


            {/* View Modal */}
            <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth>

                <DialogTitle>Property Details</DialogTitle>
                <DialogContent dividers>
                    {selectedProperty &&
          <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={600}>
                                        {selectedProperty.name}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                            {selectedProperty.address}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: "right" }}>
                                    <Chip label={selectedProperty.type} color="primary" />
                                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                        <Rating value={selectedProperty.rating} precision={0.1} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({selectedProperty.reviewsCount} reviews)
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedProperty.description}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Amenities
                                    </Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selectedProperty.amenities.map((amenity) =>
                  <Chip key={amenity} label={amenity} size="small" variant="outlined" />
                  )}
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Owner
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.ownerName}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Rooms
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.totalRooms}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Available Rooms
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.availableRooms}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Commission Rate
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.commissionRate}%</Typography>
                                </Grid>

                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Contact Email
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.contactEmail}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Contact Phone
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.contactPhone}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Account Name
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.accountName || "-"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Account No
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.accountNo || "-"}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.city}</Typography>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">{selectedProperty.country}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Amenities
                                </Typography>
                                <Button size="small" variant="outlined" onClick={() => openAmenityDialog()}>
                                    Add Amenity
                                </Button>
                            </Box>
                            {amenities.length === 0 ?
            <Typography variant="body2" color="text.secondary">
                                    No amenities added.
                                </Typography> :

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                    {amenities.map((amenity) =>
              <Box
                key={amenity.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  px: 1,
                  py: 0.25
                }}>

                                            <Typography variant="body2">{amenity.name}</Typography>
                                            <IconButton size="small" onClick={() => openAmenityDialog(amenity)}>
                                                <EditIcon fontSize="inherit" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleAmenityDelete(amenity)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Box>
              )}
                                </Box>
            }
                        </Box>
          }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProperty}
        title="Delete Property"
        message={`Are you sure you want to delete ${selectedProperty?.name}? This will also remove all associated rooms and bookings.`}
        confirmText="Delete"
        type="error" />


            <Dialog
        open={amenityDialogOpen}
        onClose={() => setAmenityDialogOpen(false)}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    {editingAmenity ? "Edit Amenity" : "Add Amenity"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Name"
                value={amenityForm.name}
                onChange={(e) =>
                setAmenityForm((prev) => ({ ...prev, name: e.target.value }))
                } />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Description"
                value={amenityForm.description}
                onChange={(e) =>
                setAmenityForm((prev) => ({ ...prev, description: e.target.value }))
                } />

                        </Grid>
                        <Grid size={12}>
                            <TextField
                fullWidth
                label="Icon"
                value={amenityForm.icon}
                onChange={(e) =>
                setAmenityForm((prev) => ({ ...prev, icon: e.target.value }))
                } />

                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAmenityDialogOpen(false)}>Cancel</Button>
                    <Button
            variant="contained"
            onClick={handleAmenitySave}
            disabled={!amenityForm.name || saving}>

                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>

                <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled">

                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>);

}
