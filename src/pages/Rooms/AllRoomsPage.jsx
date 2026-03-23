import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, FormControl, InputLabel, Select, InputAdornment, Tabs, Tab, Autocomplete, Divider, Avatar, Snackbar, Alert } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { rooms, seasons as mockSeasons } from "../../data/mockData";
import { getPropertyList } from "../../services/propertyService";
import { getRoomTypeList } from "../../services/roomTypeService";
import { createRoom, deleteRoom, getRoomList, updateRoom } from "../../services/roomService";
import {
  createRoomAmenity,
  getRoomAmenityList } from
"../../services/roomAmenityService";
import { getSeasonalPricingList } from "../../services/seasonalPricingService";
import {
  createRoomSeasonalPricing,
  deleteRoomSeasonalPricing,
  getRoomSeasonalPricingList,
  updateRoomSeasonalPricing } from
"../../services/roomSeasonalPricingService";

const AllRoomsPage = () => {
  const theme = useTheme();
  const [roomsData, setRoomsData] = useState(rooms);
  const [propertiesList, setPropertiesList] = useState([]);
  const [roomTypesList, setRoomTypesList] = useState([]);
  const [amenityOptions, setAmenityOptions] = useState([]);
  const [amenityTemplates, setAmenityTemplates] = useState([]);
  const [seasonalPricingOptions, setSeasonalPricingOptions] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterRoomType, setFilterRoomType] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    propertyId: "",
    roomNumber: "",
    roomTypeId: "",
    floor: "",
    capacity: 2,
    basePrice: "",
    description: "",
    amenities: [],
    seasonalPricing: []
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const normalizeSeasonalPricing = (entries = []) =>
  entries.
  map((sp) => ({
    id: sp?.id || sp?.primaryKeyValue,
    seasonalPricingId: sp?.seasonalPricingId || sp?.seasonId,
    price: sp?.price ?? 0,
    documentNumber: sp?.documentNumber ?? null,
    isSelected: sp?.isSelected ?? false,
    version: sp?.version ?? 0,
    remark: sp?.remark ?? null
  })).
  filter((sp) => sp.seasonalPricingId);

  useEffect(() => {
    let isMounted = true;

    const mapRoom = (room, index, propertyMap, roomTypeMap) => {
      const status =
      room?.statusId === 2 ?
      "occupied" :
      room?.statusId === 3 ?
      "maintenance" :
      room?.statusId === 4 ?
      "reserved" :
      "available";

      return {
        id: room?.id || room?.primaryKeyValue || index,
        propertyId: room?.propertyId || "",
        propertyName: propertyMap[room?.propertyId] || "Unknown Property",
        roomNumber: room?.roomNo || room?.roomNumber || "",
        roomTypeId: room?.roomTypeId || "",
        roomType: roomTypeMap[room?.roomTypeId]?.name || "Unknown",
        icon: room?.icon || roomTypeMap[room?.roomTypeId]?.icon || "default",
        floor: room?.floor || "",
        capacity: room?.capacity ?? 0,
        basePrice: room?.basePrise ?? room?.basePrice ?? 0,
        description: room?.description || "",
        amenities: room?.amenities || [],
        seasonalPricing: normalizeSeasonalPricing(room?.seasonalPricing || []),
        status,
        statusId: room?.statusId ?? 0,
        documentNumber: room?.documentNumber ?? null,
        isSelected: room?.isSelected ?? false,
        version: room?.version ?? 0,
        remark: room?.remark ?? null,
        images: []
      };
    };

    const fetchRooms = async () => {
      try {
        const [
        propertiesRes,
        roomTypesRes,
        roomsRes,
        amenitiesRes,
        seasonalPricingRes,
        roomSeasonalPricingRes] =
        await Promise.all([
        getPropertyList({ language: "en" }),
        getRoomTypeList({ language: "en" }),
        getRoomList({ language: "en" }),
        getRoomAmenityList({ language: "en" }),
        getSeasonalPricingList({ language: "en" }),
        getRoomSeasonalPricingList({ language: "en" })]
        );

        const propertiesArray = Array.isArray(propertiesRes) ?
        propertiesRes :
        propertiesRes ?
        [propertiesRes] :
        [];
        const roomTypesArray = Array.isArray(roomTypesRes) ?
        roomTypesRes :
        roomTypesRes ?
        [roomTypesRes] :
        [];
        const roomsArray = Array.isArray(roomsRes) ?
        roomsRes :
        roomsRes ?
        [roomsRes] :
        [];
        const amenitiesArray = Array.isArray(amenitiesRes) ?
        amenitiesRes :
        amenitiesRes ?
        [amenitiesRes] :
        [];
        const seasonalPricingArray = Array.isArray(seasonalPricingRes) ?
        seasonalPricingRes :
        seasonalPricingRes ?
        [seasonalPricingRes] :
        [];
        const roomSeasonalPricingArray = Array.isArray(roomSeasonalPricingRes) ?
        roomSeasonalPricingRes :
        roomSeasonalPricingRes ?
        [roomSeasonalPricingRes] :
        [];

        const propertyMap = propertiesArray.reduce((acc, property) => {
          if (property?.id) acc[property.id] = property.name || "Unknown Property";
          return acc;
        }, {});
        const roomTypeMap = roomTypesArray.reduce((acc, type) => {
          if (type?.id) acc[type.id] = type;
          return acc;
        }, {});

        const roomSeasonalPricingMap = roomSeasonalPricingArray.reduce(
          (acc, item) => {
            const roomId = item?.roomId;
            if (!roomId) return acc;
            if (!acc[roomId]) acc[roomId] = [];
            acc[roomId].push(item);
            return acc;
          },
          {}
        );

        if (isMounted) {
          setPropertiesList(propertiesArray);
          setRoomTypesList(roomTypesArray);
          setSeasonalPricingOptions(seasonalPricingArray);
          const activeAmenities = amenitiesArray.filter((a) => a?.isActive !== false);
          setAmenityTemplates(activeAmenities);
          setAmenityOptions(
            activeAmenities.map((a) => a?.name).filter(Boolean)
          );
          if (roomsArray.length > 0) {
            setRoomsData(
              roomsArray.map((room, index) => {
                const seasonalPricing =
                roomSeasonalPricingMap[room?.id] ||
                roomSeasonalPricingMap[room?.primaryKeyValue] ||
                room?.seasonalPricing ||
                [];
                return mapRoom(
                  { ...room, seasonalPricing },
                  index,
                  propertyMap,
                  roomTypeMap
                );
              })
            );
          }
        }
      } catch (err) {

        // Keep mock data on error.
      }};

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  // Available amenities for rooms (from API)
  const availableAmenities = amenityOptions;
  const availableSeasons = seasonalPricingOptions.length ?
  seasonalPricingOptions :
  mockSeasons;

  // Get approved properties
  const approvedProperties = propertiesList.filter(
    (p) => p?.statusId === 1 || p?.isActive
  );

  // Filter rooms
  const getFilteredRooms = () => {
    let filtered = roomsData;

    // Tab filter
    switch (selectedTab) {
      case 1:
        filtered = filtered.filter((r) => r.status === "available");
        break;
      case 2:
        filtered = filtered.filter((r) => r.status === "occupied");
        break;
      case 3:
        filtered = filtered.filter((r) => r.status === "maintenance");
        break;
      case 4:
        filtered = filtered.filter((r) => r.status === "reserved");
        break;
      default:
        break;
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Property filter
    if (filterProperty) {
      filtered = filtered.filter((r) => r.propertyId === filterProperty);
    }

    // Room type filter
    if (filterRoomType) {
      filtered = filtered.filter((r) => r.roomTypeId === filterRoomType);
    }

    return filtered;
  };

  // Table columns
  const columns = [
  {
    id: "roomNumber",
    label: "Room",
    type: "text",
    width: "100px"
  },
  {
    id: "propertyName",
    label: "Property",
    type: "text",
    width: "200px"
  },
  {
    id: "roomType",
    label: "Type",
    type: "select",
    options: roomTypesList.map((t) => t.name),
    width: "150px"
  },
  {
    id: "floor",
    label: "Floor",
    type: "text",
    width: "80px",
    filterable: false
  },
  {
    id: "capacity",
    label: "Capacity",
    type: "text",
    width: "100px",
    filterable: false
  },
  {
    id: "basePrice",
    label: "Base Price",
    type: "currency",
    width: "120px",
    filterable: false
  },
  {
    id: "status",
    label: "Status",
    type: "status",
    options: ["available", "occupied", "maintenance", "reserved"],
    width: "120px"
  }];


  // Handle action clicks
  const handleActionClick = (action, room) => {
    setSelectedRoom(room);
    switch (action) {
      case "view":
        setOpenViewModal(true);
        break;
      case "edit":
        setFormData({
          propertyId: room.propertyId,
          roomNumber: room.roomNumber,
          roomTypeId: room.roomTypeId,
          floor: room.floor,
          capacity: room.capacity,
          basePrice: room.basePrice,
          description: room.description || "",
          amenities: room.amenities || [],
          seasonalPricing: normalizeSeasonalPricing(room.seasonalPricing || [])
        });
        setOpenEditModal(true);
        break;
      case "delete":
        setOpenDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle amenities change
  const handleAmenitiesChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, amenities: newValue }));
  };

  // Handle seasonal pricing change
  const handleSeasonalPricingChange = (seasonalPricingId, price) => {
    setFormData((prev) => {
      const existing = prev.seasonalPricing.find(
        (sp) => sp.seasonalPricingId === seasonalPricingId
      );
      if (existing) {
        return {
          ...prev,
          seasonalPricing: prev.seasonalPricing.map((sp) =>
          sp.seasonalPricingId === seasonalPricingId ?
          { ...sp, price: Number(price) } :
          sp
          )
        };
      } else {
        return {
          ...prev,
          seasonalPricing: [
          ...prev.seasonalPricing,
          { seasonalPricingId, price: Number(price) }]

        };
      }
    });
  };

  // Handle add room
  const handleAddRoom = async () => {
    setSaving(true);
    try {
      const property = approvedProperties.find((p) => p.id === formData.propertyId);
      const roomType = roomTypesList.find((t) => t.id === formData.roomTypeId);
      const payload = {
        isActive: true,
        transactedBy: "admin",
        propertyId: formData.propertyId,
        roomTypeId: formData.roomTypeId,
        roomNo: formData.roomNumber,
        floor: formData.floor,
        capacity: Number(formData.capacity) || 0,
        basePrise: Number(formData.basePrice) || 0,
        description: formData.description,
        icon: roomType?.icon || "default",
        statusId: 0
      };

      const response = await createRoom(payload, { language: "en" });
      if (formData.amenities?.length) {
        await Promise.all(
          formData.amenities.map((amenityName) => {
            const template = amenityTemplates.find((a) => a?.name === amenityName);
            return createRoomAmenity(
              {
                isActive: true,
                transactedBy: "admin",
                roomId: response?.id || response?.primaryKeyValue,
                name: amenityName,
                description: template?.description || "",
                icon: template?.icon || ""
              },
              { language: "en" }
            );
          })
        );
      }
      if (formData.seasonalPricing?.length) {
        await Promise.all(
          formData.seasonalPricing.map((entry) =>
          createRoomSeasonalPricing(
            {
              isActive: true,
              transactedBy: "admin",
              roomId: response?.id || response?.primaryKeyValue,
              seasonalPricingId: entry.seasonalPricingId,
              price: Number(entry.price) || 0
            },
            { language: "en" }
          )
          )
        );
      }
      const newRoom = {
        id: response?.id || response?.primaryKeyValue || roomsData.length + 1,
        propertyId: response?.propertyId || formData.propertyId,
        propertyName: property?.name || "",
        roomNumber: response?.roomNo || formData.roomNumber,
        roomTypeId: response?.roomTypeId || formData.roomTypeId,
        roomType: roomType?.name || "Unknown",
        floor: response?.floor || formData.floor,
        capacity: response?.capacity ?? formData.capacity,
        basePrice: response?.basePrise ?? formData.basePrice,
        description: response?.description || formData.description,
        amenities: formData.amenities || [],
        seasonalPricing: normalizeSeasonalPricing(formData.seasonalPricing || []),
        status: "available",
        statusId: response?.statusId ?? 0,
        icon: response?.icon || roomType?.icon || "default",
        documentNumber: response?.documentNumber ?? null,
        isSelected: response?.isSelected ?? false,
        version: response?.version ?? 0,
        remark: response?.remark ?? null,
        images: []
      };
      setRoomsData((prev) => [...prev, newRoom]);
      setSnackbar({ open: true, message: "Room added successfully.", severity: "success" });
      setOpenAddModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to add room.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle edit room
  const handleEditRoom = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    try {
      const property = approvedProperties.find((p) => p.id === formData.propertyId);
      const roomType = roomTypesList.find((t) => t.id === formData.roomTypeId);
      const payload = {
        isActive: true,
        transactedBy: "admin",
        propertyId: formData.propertyId,
        roomTypeId: formData.roomTypeId,
        roomNo: formData.roomNumber,
        floor: formData.floor,
        capacity: Number(formData.capacity) || 0,
        basePrise: Number(formData.basePrice) || 0,
        description: formData.description,
        icon: roomType?.icon || selectedRoom.icon || "default",
        statusId: selectedRoom.statusId ?? 0,
        documentNumber: selectedRoom.documentNumber ?? null,
        isSelected: selectedRoom.isSelected ?? false,
        version: selectedRoom.version ?? 0,
        remark: selectedRoom.remark ?? null,
        id: selectedRoom.id
      };

      const response = await updateRoom(payload, { language: "en" });

      let updatedSeasonalPricing = normalizeSeasonalPricing(
        formData.seasonalPricing || []
      );
      const existingSeasonalPricing = normalizeSeasonalPricing(
        selectedRoom.seasonalPricing || []
      );
      const existingBySeason = new Map(
        existingSeasonalPricing.map((entry) => [entry.seasonalPricingId, entry])
      );
      const nextBySeason = new Map(
        updatedSeasonalPricing.map((entry) => [entry.seasonalPricingId, entry])
      );

      const updatePromises = [];
      const createPromises = [];
      const deletePromises = [];

      updatedSeasonalPricing.forEach((entry) => {
        const existing = existingBySeason.get(entry.seasonalPricingId);
        if (existing?.id) {
          updatePromises.push(
            updateRoomSeasonalPricing(
              {
                isActive: true,
                transactedBy: "admin",
                roomId: selectedRoom.id,
                seasonalPricingId: entry.seasonalPricingId,
                price: Number(entry.price) || 0,
                documentNumber: existing.documentNumber ?? null,
                isSelected: existing.isSelected ?? false,
                version: existing.version ?? 0,
                remark: existing.remark ?? null,
                id: existing.id
              },
              { language: "en" }
            )
          );
        } else {
          createPromises.push(
            createRoomSeasonalPricing(
              {
                isActive: true,
                transactedBy: "admin",
                roomId: selectedRoom.id,
                seasonalPricingId: entry.seasonalPricingId,
                price: Number(entry.price) || 0
              },
              { language: "en" }
            )
          );
        }
      });

      existingSeasonalPricing.forEach((entry) => {
        if (!nextBySeason.has(entry.seasonalPricingId)) {
          deletePromises.push(
            deleteRoomSeasonalPricing(
              {
                isActive: false,
                transactedBy: "admin",
                roomId: selectedRoom.id,
                seasonalPricingId: entry.seasonalPricingId,
                price: Number(entry.price) || 0,
                documentNumber: entry.documentNumber ?? null,
                isSelected: entry.isSelected ?? false,
                version: entry.version ?? 0,
                remark: entry.remark ?? null,
                id: entry.id
              },
              { language: "en" }
            )
          );
        }
      });

      if (updatePromises.length || createPromises.length || deletePromises.length) {
        await Promise.all([...updatePromises, ...createPromises, ...deletePromises]);
        const refreshed = await getRoomSeasonalPricingList({ language: "en" });
        const refreshedArray = Array.isArray(refreshed) ?
        refreshed :
        refreshed ?
        [refreshed] :
        [];
        const refreshedMap = refreshedArray.reduce((acc, item) => {
          if (!item?.roomId) return acc;
          if (!acc[item.roomId]) acc[item.roomId] = [];
          acc[item.roomId].push(item);
          return acc;
        }, {});
        updatedSeasonalPricing = normalizeSeasonalPricing(
          refreshedMap[selectedRoom.id] || []
        );
      }
      setRoomsData((prev) =>
      prev.map((r) =>
      r.id === selectedRoom.id ?
      {
        ...r,
        propertyId: response?.propertyId || formData.propertyId,
        propertyName: property?.name || r.propertyName,
        roomNumber: response?.roomNo || formData.roomNumber,
        roomTypeId: response?.roomTypeId || formData.roomTypeId,
        roomType: roomType?.name || r.roomType,
        floor: response?.floor || formData.floor,
        capacity: response?.capacity ?? formData.capacity,
        basePrice: response?.basePrise ?? formData.basePrice,
        description: response?.description || formData.description,
        seasonalPricing: updatedSeasonalPricing,
        icon: response?.icon || roomType?.icon || r.icon,
        documentNumber: response?.documentNumber ?? r.documentNumber,
        isSelected: response?.isSelected ?? r.isSelected,
        version: response?.version ?? r.version,
        remark: response?.remark ?? r.remark
      } :
      r
      )
      );
      setSnackbar({ open: true, message: "Room updated successfully.", severity: "success" });
      setOpenEditModal(false);
      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update room.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete room
  const handleDeleteRoom = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    try {
      const payload = {
        isActive: false,
        transactedBy: "admin",
        propertyId: selectedRoom.propertyId,
        roomTypeId: selectedRoom.roomTypeId,
        roomNo: selectedRoom.roomNumber,
        floor: selectedRoom.floor,
        capacity: Number(selectedRoom.capacity) || 0,
        basePrise: Number(selectedRoom.basePrice) || 0,
        description: selectedRoom.description,
        icon: selectedRoom.icon || "default",
        statusId: selectedRoom.statusId ?? 0,
        documentNumber: selectedRoom.documentNumber ?? null,
        isSelected: selectedRoom.isSelected ?? false,
        version: selectedRoom.version ?? 0,
        remark: selectedRoom.remark ?? null,
        id: selectedRoom.id
      };
      await deleteRoom(payload, { language: "en" });
      setRoomsData((prev) => prev.filter((r) => r.id !== selectedRoom.id));
      setOpenDeleteDialog(false);
      setSelectedRoom(null);
      setSnackbar({ open: true, message: "Room deleted successfully.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete room.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      propertyId: "",
      roomNumber: "",
      roomTypeId: "",
      floor: "",
      capacity: 2,
      basePrice: "",
      description: "",
      amenities: [],
      seasonalPricing: []
    });
    setSelectedRoom(null);
  };

  // Format currency
  const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(amount);

  // Counts for tabs
  const counts = {
    all: roomsData.length,
    available: roomsData.filter((r) => r.status === "available").length,
    occupied: roomsData.filter((r) => r.status === "occupied").length,
    maintenance: roomsData.filter((r) => r.status === "maintenance").length,
    reserved: roomsData.filter((r) => r.status === "reserved").length
  };

  // Room Form Component
  const RoomForm = () =>
  <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel>Property</InputLabel>
                    <Select
          name="propertyId"
          value={formData.propertyId}
          onChange={handleFormChange}
          label="Property">

                        {approvedProperties.map((property) =>
          <MenuItem key={property.id} value={property.id}>
                                {property.name}
                            </MenuItem>
          )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
        fullWidth
        label="Room Number"
        name="roomNumber"
        value={formData.roomNumber}
        onChange={handleFormChange}
        required />

            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel>Room Type</InputLabel>
                    <Select
          name="roomTypeId"
          value={formData.roomTypeId}
          onChange={handleFormChange}
          label="Room Type">

                        {roomTypesList.map((type) =>
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
        label="Floor"
        name="floor"
        type="number"
        value={formData.floor}
        onChange={handleFormChange}
        required />

            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
        fullWidth
        label="Capacity"
        name="capacity"
        type="number"
        value={formData.capacity}
        onChange={handleFormChange}
        InputProps={{
          endAdornment: <InputAdornment position="end">guests</InputAdornment>
        }}
        inputProps={{ min: 1, max: 20 }}
        required />

            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
        fullWidth
        label="Base Price (per night)"
        name="basePrice"
        type="number"
        value={formData.basePrice}
        onChange={handleFormChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>
        }}
        required />

            </Grid>
            <Grid item xs={12}>
                <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleFormChange}
        multiline
        rows={2} />

            </Grid>
            <Grid item xs={12}>
                <Autocomplete
        multiple
        options={availableAmenities}
        value={formData.amenities}
        onChange={handleAmenitiesChange}
        renderInput={(params) =>
        <TextField {...params} label="Amenities" placeholder="Select amenities" />
        }
        renderTags={(value, getTagProps) =>
        value.map((option, index) =>
        <Chip
          label={option}
          size="small"
          {...getTagProps({ index })}
          key={option} />

        )
        } />

            </Grid>

            {/* Seasonal Pricing Section */}
            <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2, mb: 1 }}>
                    Seasonal Pricing
                </Typography>
                <Grid container spacing={2}>
                    {availableSeasons.map((season) => {
          const multiplier = season.priceMultiplier ?? 1;
          const existingPrice = formData.seasonalPricing.find(
            (sp) =>
            sp.seasonalPricingId === season.id ||
            sp.seasonId === season.id
          );
          return (
            <Grid item key={season.id} xs={12} sm={6}>
                                <TextField
                fullWidth
                label={`${season.name} (x${multiplier})`}
                type="number"
                value={existingPrice?.price || ""}
                onChange={(e) =>
                handleSeasonalPricingChange(season.id, e.target.value)
                }
                placeholder={`Suggested: $${Math.round(
                  (formData.basePrice || 0) * multiplier
                )}`}
                InputProps={{
                  startAdornment:
                  <InputAdornment position="start">$</InputAdornment>

                }}
                size="small"
                helperText={
                season.startDate && season.endDate ?
                `${season.startDate} - ${season.endDate}` :
                ""
                } />

                            </Grid>);

        })}
                </Grid>
            </Grid>
        </Grid>;


  return (
    <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        All Rooms
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage rooms across all properties
                    </Typography>
                </Box>
                <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}>

                    Add Room
                </Button>
            </Box>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={4} md={2.4}>
                    <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.primary.main, 0.05)
            }}>

                        <Typography variant="h4" fontWeight={700} color="primary.main">
                            {counts.all}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total Rooms
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                    <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.success.main, 0.05)
            }}>

                        <Typography variant="h4" fontWeight={700} color="success.main">
                            {counts.available}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Available
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                    <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.error.main, 0.05)
            }}>

                        <Typography variant="h4" fontWeight={700} color="error.main">
                            {counts.occupied}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Occupied
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                    <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.warning.main, 0.05)
            }}>

                        <Typography variant="h4" fontWeight={700} color="warning.main">
                            {counts.maintenance}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Maintenance
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                    <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: alpha(theme.palette.info.main, 0.05)
            }}>

                        <Typography variant="h4" fontWeight={700} color="info.main">
                            {counts.reserved}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Reserved
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ px: 2 }}
          variant="scrollable"
          scrollButtons="auto">

                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>All <Chip label={counts.all} size="small" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Available <Chip label={counts.available} size="small" color="success" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Occupied <Chip label={counts.occupied} size="small" color="error" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Maintenance <Chip label={counts.maintenance} size="small" color="warning" /></Box>} />
                    <Tab label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>Reserved <Chip label={counts.reserved} size="small" color="info" /></Box>} />
                </Tabs>
            </Paper>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
              fullWidth
              size="small"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment:
                <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>

              }} />

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Property</InputLabel>
                            <Select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                label="Property">

                                <MenuItem value="">All Properties</MenuItem>
                                {approvedProperties.map((property) =>
                <MenuItem key={property.id} value={property.id}>
                                        {property.name}
                                    </MenuItem>
                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Room Type</InputLabel>
                            <Select
                value={filterRoomType}
                onChange={(e) => setFilterRoomType(e.target.value)}
                label="Room Type">

                                <MenuItem value="">All Types</MenuItem>
                                {roomTypesList.map((type) =>
                <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                )}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Table */}
            <CustomTable
        data={getFilteredRooms()}
        columns={columns}
        actions={["view", "edit", "delete"]}
        onActionClick={handleActionClick}
        emptyMessage="No rooms found matching your criteria" />


            {/* Add Room Modal */}
            <Dialog
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Add New Room
                        </Typography>
                        <IconButton onClick={() => setOpenAddModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {RoomForm()}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
            variant="outlined"
            onClick={() => {
              setOpenAddModal(false);
              resetForm();
            }}>

                        Cancel
                    </Button>
                    <Button
            variant="contained"
            onClick={handleAddRoom}
            disabled={
            !formData.propertyId ||
            !formData.roomNumber ||
            !formData.roomTypeId ||
            !formData.floor ||
            !formData.basePrice ||
            saving
            }>

                        {saving ? "Saving..." : "Add Room"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Room Modal */}
            <Dialog
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          resetForm();
        }}
        maxWidth="md"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Edit Room
                        </Typography>
                        <IconButton onClick={() => setOpenEditModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {RoomForm()}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
            variant="outlined"
            onClick={() => {
              setOpenEditModal(false);
              resetForm();
            }}>

                        Cancel
                    </Button>
                    <Button
            variant="contained"
            onClick={handleEditRoom}
            disabled={
            !formData.propertyId ||
            !formData.roomNumber ||
            !formData.roomTypeId ||
            !formData.floor ||
            !formData.basePrice ||
            saving
            }>

                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Room Modal */}
            <Dialog
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedRoom(null);
        }}
        maxWidth="sm"
        fullWidth>

                <DialogTitle>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight={600}>
                            Room Details
                        </Typography>
                        <IconButton onClick={() => setOpenViewModal(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedRoom &&
          <Box>
                            {/* Header */}
                            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                p: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2
              }}>

                                <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  backgroundColor: theme.palette.primary.main
                }}>

                                    <MeetingRoomIcon />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight={600}>
                                        Room {selectedRoom.roomNumber}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedRoom.propertyName}
                                    </Typography>
                                </Box>
                                <Chip
                label={selectedRoom.status}
                color={
                selectedRoom.status === "available" ?
                "success" :
                selectedRoom.status === "occupied" ?
                "error" :
                selectedRoom.status === "maintenance" ?
                "warning" :
                "info"
                } />

                            </Box>

                            {/* Details Grid */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Room Type
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.roomType}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Floor
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.floor}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {selectedRoom.capacity} guests
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Base Price
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formatCurrency(selectedRoom.basePrice)} / night
                                    </Typography>
                                </Grid>
                            </Grid>

                            {/* Description */}
                            {selectedRoom.description &&
            <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Description
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedRoom.description}
                                    </Typography>
                                </Box>
            }

                            {/* Amenities */}
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                    Amenities
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                    {selectedRoom.amenities.map((amenity) =>
                <Chip
                  key={amenity}
                  label={amenity}
                  size="small"
                  variant="outlined" />

                )}
                                </Box>
                            </Box>

                            {/* Seasonal Pricing */}
                            {selectedRoom.seasonalPricing && selectedRoom.seasonalPricing.length > 0 &&
            <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                        Seasonal Pricing
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {selectedRoom.seasonalPricing.map((sp) => {
                  const seasonId =
                  sp.seasonalPricingId || sp.seasonId;
                  const season = availableSeasons.find(
                    (s) => s.id === seasonId
                  );
                  return (
                    <Grid item key={seasonId} xs={6}>
                                                    <Paper
                        sx={{
                          p: 1,
                          textAlign: "center",
                          backgroundColor: alpha(theme.palette.primary.main, 0.05)
                        }}>

                                                        <Typography variant="caption" color="text.secondary">
                                                            {season?.name}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {formatCurrency(sp.price)}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>);

                })}
                                    </Grid>
                                </Box>
            }
                        </Box>
          }
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
                        Close
                    </Button>
                    <Button
            variant="contained"
            onClick={() => {
              setOpenViewModal(false);
              handleActionClick("edit", selectedRoom);
            }}>

                        Edit Room
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setSelectedRoom(null);
        }}
        onConfirm={handleDeleteRoom}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${selectedRoom?.roomNumber} from ${selectedRoom?.propertyName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger" />


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

};

export default AllRoomsPage;