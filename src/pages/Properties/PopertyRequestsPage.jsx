import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getOwnerList } from "../../services/ownerService";
import { getPropertyTypeList } from "../../services/propertyTypeService";
import {
  approveProperty,
  getPropertyList,
  getStoredPropertyRequests,
  rejectProperty,
} from "../../services/propertyService";

export default function PropertyRequestsPage() {
  const [data, setData] = useState([]);
  const [typesMap, setTypesMap] = useState({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      try {
        const [ownersRes, propertyTypesRes, propertiesRes] = await Promise.all([
          getOwnerList({ language: "en" }),
          getPropertyTypeList({ language: "en" }),
          getPropertyList({ language: "en" }),
        ]);

        const owners = Array.isArray(ownersRes) ? ownersRes : ownersRes ? [ownersRes] : [];
        const propertyTypes = Array.isArray(propertyTypesRes)
          ? propertyTypesRes
          : propertyTypesRes
            ? [propertyTypesRes]
            : [];
        const properties = Array.isArray(propertiesRes)
          ? propertiesRes
          : propertiesRes
            ? [propertiesRes]
            : [];

        const nextOwnersMap = owners.reduce((acc, owner) => {
          if (owner?.id) {
            acc[owner.id] = owner.name || owner.email || "Unknown";
          }
          return acc;
        }, {});

        const nextTypesMap = propertyTypes.reduce((acc, type) => {
          if (type?.id) {
            acc[type.id] = type;
          }
          return acc;
        }, {});

        const apiPendingProperties = properties
          .filter((property) => {
            const statusId = Number(property?.statusId ?? 0);
            return statusId === 1 || statusId === 0;
          })
          .map((property, index) => ({
            id: property?.id || property?.primaryKeyValue || index,
            ownerId: property?.ownerId || "",
            propertyTypeId: property?.propertyTypeId || "",
            name: property?.name || "Unnamed",
            description: property?.description || "",
            address: property?.address || "",
            city: property?.city || "",
            country: property?.country || "",
            totalRooms: property?.totalRooms ?? 0,
            ownerName: nextOwnersMap[property?.ownerId] || "Unknown",
            type:
              nextTypesMap[property?.propertyTypeId]?.name || "Unknown",
            contactEmail: property?.emailAddress || "",
            contactPhone: property?.phoneNo || "",
            commissionRate: property?.commissionRate ?? 0,
            accountName: property?.accountName || "",
            accountNo: property?.accountNo || "",
            amenities: property?.amenities || [],
            createdAt: (
              property?.transactedDate ||
              property?.lastChanged ||
              new Date().toISOString()
            )
              .toString()
              .split("T")[0],
          }));

        const storedPendingProperties = getStoredPropertyRequests().map(
          (property, index) => ({
            id: property?.id || property?.primaryKeyValue || `local-${index}`,
            ownerId: property?.ownerId || "",
            propertyTypeId: property?.propertyTypeId || "",
            name: property?.name || "Unnamed",
            description: property?.description || "",
            address: property?.address || "",
            city: property?.city || "",
            country: property?.country || "",
            totalRooms: property?.totalRooms ?? 0,
            ownerName: nextOwnersMap[property?.ownerId] || "Unknown",
            type: nextTypesMap[property?.propertyTypeId]?.name || "Unknown",
            contactEmail: property?.emailAddress || "",
            contactPhone: property?.phoneNo || "",
            commissionRate: property?.commissionRate ?? 0,
            accountName: property?.accountName || "",
            accountNo: property?.accountNo || "",
            amenities: property?.amenities || [],
            createdAt: (
              property?.transactedDate ||
              property?.lastChanged ||
              new Date().toISOString()
            )
              .toString()
              .split("T")[0],
          })
        );

        const mergedPendingProperties = [
          ...storedPendingProperties,
          ...apiPendingProperties.filter(
            (property) =>
              !storedPendingProperties.some(
                (storedProperty) => String(storedProperty.id) === String(property.id)
              )
          ),
        ];

        if (isMounted) {
          setTypesMap(nextTypesMap);
          setData(mergedPendingProperties);
        }
      } catch (error) {
        if (isMounted) {
          setData([]);
        }
      }
    };

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      { id: "name", label: "Property Name", type: "text", width: "200px" },
      { id: "ownerName", label: "Owner", type: "text", width: "150px" },
      {
        id: "type",
        label: "Type",
        type: "select",
        width: "120px",
        options: Object.values(typesMap)
          .map((type) => type?.name)
          .filter(Boolean),
      },
      { id: "city", label: "City", type: "text", width: "120px" },
      { id: "totalRooms", label: "Rooms", type: "number", width: "80px" },
      { id: "createdAt", label: "Submitted", type: "date", width: "120px" },
    ],
    [typesMap]
  );

  const handleActionClick = (action, row) => {
    setSelectedProperty(row);
    if (action === "view") {
      setViewModalOpen(true);
    } else if (action === "approve") {
      setApproveDialogOpen(true);
    } else if (action === "reject") {
      setRejectDialogOpen(true);
    }
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedProperty(null);
  };

  const handleApprove = async () => {
    if (!selectedProperty) return;

    try {
      await approveProperty(
        {
          id: selectedProperty.id,
          isActive: true,
          transactedBy: "admin",
        },
        { language: "en" }
      );

      setData((prev) => prev.filter((property) => property.id !== selectedProperty.id));
      setApproveDialogOpen(false);
      setSelectedProperty(null);
      setSnackbar({
        open: true,
        message: "Property approved successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to approve property.",
        severity: "error",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedProperty) return;

    try {
      await rejectProperty(
        {
          id: selectedProperty.id,
          isActive: true,
          transactedBy: "admin",
        },
        { language: "en" }
      );

      setData((prev) => prev.filter((property) => property.id !== selectedProperty.id));
      setRejectDialogOpen(false);
      setSelectedProperty(null);
      setSnackbar({
        open: true,
        message: "Property rejected successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to reject property.",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Property Registration Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and approve new property registrations
          </Typography>
        </Box>
        <Chip
          label={`${data.length} Pending`}
          color="warning"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {data.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No pending property requests
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All property registrations have been processed
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <CustomTable
              data={data}
              columns={columns}
              actions={["view", "approve", "reject"]}
              onActionClick={handleActionClick}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={viewModalOpen} onClose={closeViewModal} maxWidth="md" fullWidth>
        <DialogTitle>Property Registration Request</DialogTitle>
        <DialogContent dividers>
          {selectedProperty && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                This property is pending approval. Please review all details before making a decision.
              </Alert>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                  {selectedProperty.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {selectedProperty.address}
                  </Typography>
                </Box>
                <Chip label={selectedProperty.type} color="primary" size="small" sx={{ mt: 1 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid size={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedProperty.description}</Typography>
                </Grid>

                <Grid size={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Amenities
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selectedProperty.amenities.map((amenity) => (
                      <Chip key={amenity} label={amenity} size="small" variant="outlined" />
                    ))}
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
                    Contact Email
                  </Typography>
                  <Typography variant="body1">{selectedProperty.contactEmail || "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact Phone
                  </Typography>
                  <Typography variant="body1">{selectedProperty.contactPhone || "-"}</Typography>
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
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeViewModal} color="inherit">
            Close
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setViewModalOpen(false);
              setRejectDialogOpen(true);
            }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setViewModalOpen(false);
              setApproveDialogOpen(true);
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onConfirm={handleApprove}
        title="Approve Property"
        message={`Are you sure you want to approve "${selectedProperty?.name}"? It will be visible to guests for booking.`}
        confirmText="Approve"
        type="success"
      />

      <ConfirmDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleReject}
        title="Reject Property"
        message={`Are you sure you want to reject "${selectedProperty?.name}"? The owner will be notified.`}
        confirmText="Reject"
        type="error"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
