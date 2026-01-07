import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, Grid, Avatar, Chip, Divider } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import PageHeader from "../../components/PageHeader";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import OwnerDetailsModal from "../../components/modals/OwnerDetailsModal";
import { owners } from "../../data/mockData";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PendingVerificationsPage() {
    const theme = useTheme();
    const [data, setData] = useState(owners.filter((o) => o.status === "pending"));
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);

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

    const handleApprove = () => {
        setData(data.filter((item) => item.id !== selectedOwner.id));
        setApproveDialogOpen(false);
        setSelectedOwner(null);
        // In real app: API call to update status
    };

    const handleReject = () => {
        setData(data.filter((item) => item.id !== selectedOwner.id));
        setRejectDialogOpen(false);
        setSelectedOwner(null);
        // In real app: API call to update status
    };

    return (
        <Box>
            <PageHeader
                title="Pending Verifications"
                subtitle="Review and verify property owner registrations"
                breadcrumbs={[
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "User Management", path: "/users" },
                    { label: "Pending Verifications", path: "/users/pending" },
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
            />
        </Box>
    );
}




