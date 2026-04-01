import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, TextField, Typography, Button, Switch, FormControlLabel, Snackbar, Alert, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { getUserList, updateUser } from "../../services/userService";

const buildFormState = (user) => ({
  id: user?.id || user?.primaryKeyValue || "",
  aspNetUserId: user?.aspNetUserId || "",
  name: user?.name || "",
  email: user?.email || "",
  phoneNo: user?.phoneNo || "",
  avatarUrl: user?.avatarUrl || "",
  lastLoginDate: user?.lastLoginDate || "",
  isBlocked: Boolean(user?.isBlocked),
  isActive: user?.isActive !== false
});

export default function UserProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user || null);
  const [formData, setFormData] = useState(buildFormState(location.state?.user));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const breadcrumbs = useMemo(
    () => [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "User Management", path: "/admin/users" },
    { label: "User Profile", path: `/admin/users/profile/${id}` }],

    [id]
  );

  useEffect(() => {
    let isMounted = true;

    const hydrate = (target) => {
      if (!isMounted || !target) return;
      setUser(target);
      setFormData(buildFormState(target));
    };

    if (location.state?.user) {
      hydrate(location.state.user);
      return () => {
        isMounted = false;
      };
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getUserList({ language: "en" });
        const usersArray = Array.isArray(response) ? response : response ? [response] : [];
        const found = usersArray.find(
          (item) => item?.id === id || item?.primaryKeyValue === id
        );
        if (found) {
          hydrate(found);
        } else if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id, location.state]);

  const handleChange = (field) => (event) => {
    const value =
    field === "isBlocked" || field === "isActive" ?
    event.target.checked :
    event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        isActive: formData.isActive,
        transactedBy: "admin",
        aspNetUserId: formData.aspNetUserId || user?.aspNetUserId,
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        avatarUrl: formData.avatarUrl,
        lastLoginDate: formData.lastLoginDate || user?.lastLoginDate,
        isBlocked: formData.isBlocked
      };

      const updated = await updateUser(payload, { language: "en" });
      if (updated) {
        setUser(updated);
        setFormData(buildFormState(updated));
      }

      setSnackbar({ open: true, message: "User updated successfully.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to update user.",
        severity: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
            <PageHeader
        title="User Profile"
        subtitle="View and update user information"
        breadcrumbs={breadcrumbs} />


            {loading &&
      <Card>
                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <CircularProgress size={20} />
                        <Typography color="text.secondary">Loading user...</Typography>
                    </CardContent>
                </Card>
      }

            {!loading && !user &&
      <Card>
                    <CardContent>
                        <Typography variant="h6">User not found</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            We could not locate this user record.
                        </Typography>
                        <Button variant="outlined" onClick={() => navigate("/admin/users/owners")}>
                            Back to Owners
                        </Button>
                    </CardContent>
                </Card>
      }

            {!loading && user &&
      <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="User Id"
                value={formData.id}
                disabled />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="ASP.NET User Id"
                value={formData.aspNetUserId}
                onChange={handleChange("aspNetUserId")} />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")} />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange("email")} />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="Phone"
                value={formData.phoneNo}
                onChange={handleChange("phoneNo")} />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="Avatar URL"
                value={formData.avatarUrl}
                onChange={handleChange("avatarUrl")} />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                fullWidth
                label="Last Login Date"
                value={formData.lastLoginDate}
                disabled />

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ display: "flex", gap: 3, alignItems: "center", height: "100%" }}>
                                    <FormControlLabel
                  control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange("isActive")} />

                  }
                  label="Active" />

                                    <FormControlLabel
                  control={
                  <Switch
                    checked={formData.isBlocked}
                    onChange={handleChange("isBlocked")} />

                  }
                  label="Blocked" />

                                </Box>
                            </Grid>
                            <Grid size={12}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                                    <Button variant="outlined" onClick={() => navigate(-1)}>
                                        Back
                                    </Button>
                                    <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}>

                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
      }

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