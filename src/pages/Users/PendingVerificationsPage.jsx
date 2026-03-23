import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PageHeader from "../../components/PageHeader";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import OwnerDetailsModal from "../../components/modals/OwnerDetailsModal";
import { owners } from "../../data/mockData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getOwnerList, updateOwner } from "../../services/ownerService";

export default function PendingVerificationsPage() {
    const theme = useTheme();
    const [data, setData] = useState(owners.filter((o) => o.status === "pending"));
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const mapOwnerDto = (owner, index) => {
        const status =
            owner?.statusId === 1
                ? "verified"
                : owner?.statusId === 2
                    ? "rejected"
                    : "pending";

        return {
            id: owner?.id || owner?.primaryKeyValue || index,
            name: owner?.name || owner?.email || "Unknown",
            email: owner?.email || "",
            phone: owner?.phoneNo || "",
            avatar: owner?.avatarUrl || null,
            status,
            documentsSubmitted: Boolean(owner?.documentUrl),
            documentUrl: owner?.documentUrl || null,
            rejectionReason: owner?.rejectionReason || "",
            verificationDate: owner?.verificationDate || "",
            statusId: owner?.statusId ?? 0,
            propertiesCount: 0,
            totalRevenue: 0,
            joinedDate: (owner?.transactedDate || owner?.lastChanged || "")
                .toString()
                .split("T")[0],
            address: owner?.address || "",
        };
    };

    useEffect(() => {
        let isMounted = true;

        const fetchOwners = async () => {
            try {
                const response = await getOwnerList({ language: "en" });
                const ownersArray = Array.isArray(response) ? response : response ? [response] : [];
                if (isMounted && ownersArray.length > 0) {
                    const mapped = ownersArray.map(mapOwnerDto);
                    setData(
                        mapped.filter((o) => o.status === "pending")
                    );
                }
            } catch (err) {
                // Keep mock data on error.
            }
        };

        fetchOwners();

        return () => {
            isMounted = false;
        };
    }, []);

    const columns = [
        { id: "name", label: "Owner Name", type: "avatar", subField: "email", width: "250px" },
        { id: "phone", label: "Phone", type: "text", width: "150px" },
        { id: "address", label: "Address", type: "text", width: "200px" },
        {
            id: "documentsSubmitted",
            label: "Documents",
            type: "boolean",
            width: "120px",
        },
        { id: "joinedDate", label: "Applied Date", type: "date", width: "130px" },
    ];

    const handleActionClick = (action, row) => {
        setSelectedOwner(row);
        if (action === "view") {
            setViewModalOpen(true);
        } else if (action === "approve") {
            setApproveDialogOpen(true);
        } else if (action === "reject") {
            setRejectDialogOpen(true);
        }
    };

    const handleApprove = async () => {
        if (!selectedOwner?.id) return;
        setIsApproving(true);
        try {
            await updateOwner(
                {
                    isActive: true,
                    transactedBy: selectedOwner.email || "admin",
                    name: selectedOwner.name,
                    email: selectedOwner.email,
                    phoneNo: selectedOwner.phone,
                    address: selectedOwner.address,
                    avatarUrl: selectedOwner.avatar || null,
                    statusId: 1,
                    documentUrl: selectedOwner.documentUrl || null,
                    rejectionReason: "",
                    verificationDate: new Date().toISOString(),
                },
                { language: "en" }
            );

            setData((prev) => prev.filter((item) => item.id !== selectedOwner.id));
            setSnackbar({ open: true, message: "Owner approved successfully.", severity: "success" });
            setApproveDialogOpen(false);
            setSelectedOwner(null);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.message || "Failed to approve owner.",
                severity: "error",
            });
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        if (!selectedOwner?.id) return;
        setIsApproving(true);
        try {
            await updateOwner(
                {
                    isActive: true,
                    transactedBy: selectedOwner.email || "admin",
                    name: selectedOwner.name,
                    email: selectedOwner.email,
                    phoneNo: selectedOwner.phone,
                    address: selectedOwner.address,
                    avatarUrl: selectedOwner.avatar || null,
                    statusId: 2,
                    documentUrl: selectedOwner.documentUrl || null,
                    rejectionReason: "Rejected by admin",
                    verificationDate: new Date().toISOString(),
                },
                { language: "en" }
            );

            setData((prev) => prev.filter((item) => item.id !== selectedOwner.id));
            setSnackbar({ open: true, message: "Owner rejected.", severity: "success" });
            setRejectDialogOpen(false);
            setSelectedOwner(null);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err?.message || "Failed to reject owner.",
                severity: "error",
            });
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <Box>
            <PageHeader
                title="Owner Verifications"
                subtitle="Review and verify owner registrations"
                breadcrumbs={[
                    { label: "Dashboard", path: "/admin/dashboard" },
                    { label: "User Management", path: "/admin/users" },
                    { label: "Owner Verifications", path: "/admin/users/pending" },
                ]}
            />

            {data.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: "center", py: 6 }}>
                        <CheckCircleIcon sx={{ fontSize: 64, color: theme.palette.success.main, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            All Caught Up!
                        </Typography>
                        <Typography color="text.secondary">
                            There are no pending verification requests at the moment.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <CustomTable
                    data={data}
                    columns={columns}
                    actions={["view", "approve", "reject"]}
                    onActionClick={handleActionClick}
                />
            )}

            {/* View Modal */}
            <OwnerDetailsModal
                open={viewModalOpen}
                onClose={() => {
                    setViewModalOpen(false);
                    setSelectedOwner(null);
                }}
                owner={selectedOwner}
                showActions
                onApprove={() => {
                    setViewModalOpen(false);
                    setApproveDialogOpen(true);
                }}
                onReject={() => {
                    setViewModalOpen(false);
                    setRejectDialogOpen(true);
                }}
            />

            {/* Approve Dialog */}
            <ConfirmDialog
                open={approveDialogOpen}
                onClose={() => {
                    setApproveDialogOpen(false);
                    setSelectedOwner(null);
                }}
                onConfirm={handleApprove}
                title="Approve Owner"
                message={`Are you sure you want to approve "${selectedOwner?.name}" as a property owner? They will be able to register properties on the platform.`}
                confirmText="Approve"
                type="success"
                loading={isApproving}
            />

            {/* Reject Dialog */}
            <ConfirmDialog
                open={rejectDialogOpen}
                onClose={() => {
                    setRejectDialogOpen(false);
                    setSelectedOwner(null);
                }}
                onConfirm={handleReject}
                title="Reject Owner"
                message={`Are you sure you want to reject "${selectedOwner?.name}"? They will be notified of this decision.`}
                confirmText="Reject"
                type="error"
                loading={isApproving}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
