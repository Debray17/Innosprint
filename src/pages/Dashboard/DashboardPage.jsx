import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell } from
"recharts";

// Icons
import ApartmentIcon from "@mui/icons-material/Apartment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import StatCard from "../../components/StatCard";
import { useBookingHistory } from "../../hooks/useBooking";
import { getPropertyList } from "../../services/propertyService";
import { getRoomList } from "../../services/roomService";
import { getOwnerList } from "../../services/ownerService";

export default function DashboardPage() {
  const theme = useTheme();
  const { data: bookingRecords = [] } = useBookingHistory();
  const [propertiesData, setPropertiesData] = useState([]);
  const [roomsData, setRoomsData] = useState([]);
  const [ownersMap, setOwnersMap] = useState({});

  const COLORS = [
  theme.palette.primary.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main];

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [propertiesResponse, roomsResponse, ownersResponse] = await Promise.all([
          getPropertyList({ language: "en" }),
          getRoomList({ language: "en" }),
          getOwnerList({ language: "en" }),
        ]);

        const properties = Array.isArray(propertiesResponse) ?
        propertiesResponse :
        propertiesResponse ?
        [propertiesResponse] :
        [];
        const rooms = Array.isArray(roomsResponse) ?
        roomsResponse :
        roomsResponse ?
        [roomsResponse] :
        [];
        const owners = Array.isArray(ownersResponse) ?
        ownersResponse :
        ownersResponse ?
        [ownersResponse] :
        [];

        if (!isMounted) return;

        setPropertiesData(properties.filter((property) => property?.isActive !== false));
        setRoomsData(rooms.filter((room) => room?.isActive !== false));
        setOwnersMap(
          owners.reduce((acc, owner) => {
            const ownerId = owner?.id || owner?.primaryKeyValue;
            if (ownerId) {
              acc[ownerId] = owner?.name || owner?.email || "Unknown";
            }
            return acc;
          }, {})
        );
      } catch (error) {
        if (!isMounted) return;
        setPropertiesData([]);
        setRoomsData([]);
        setOwnersMap({});
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(value);

  const toDateOnly = (value) => {
    if (!value) return "";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toISOString().split("T")[0];
  };

  const mapBookingStatus = (booking) => {
    const apiStatus = String(booking?.api?.statusLabel || "").toLowerCase();
    const normalizedStatus = String(booking?.status || "").toLowerCase();

    if (
      apiStatus.includes("checked out") ||
      apiStatus.includes("checked-out") ||
      apiStatus.includes("checkout") ||
      normalizedStatus === "completed"
    ) {
      return "checked-out";
    }
    if (
      apiStatus.includes("checked in") ||
      apiStatus.includes("checked-in") ||
      apiStatus.includes("checkin") ||
      normalizedStatus === "checked-in"
    ) {
      return "checked-in";
    }
    if (apiStatus.includes("cancel") || normalizedStatus === "cancelled") {
      return "cancelled";
    }
    return "confirmed";
  };

  const today = new Date().toISOString().split("T")[0];

  const normalizedBookings = useMemo(
    () =>
      bookingRecords.map((booking) => ({
        id: booking.id,
        bookingCode: booking.bookingCode || booking.api?.bookingCode || "-",
        guestName:
          booking.api?.userName ||
          `${booking.guestDetails?.firstName || ""} ${booking.guestDetails?.lastName || ""}`.trim() ||
          "Guest",
        propertyId: booking.property?.id || booking.api?.propertyId || "",
        propertyName: booking.property?.name || booking.api?.propertyName || "Unknown Property",
        roomId: booking.room?.id || booking.api?.roomId || "",
        roomNumber: booking.room?.roomNo || booking.room?.name || "-",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        grandTotal: Number(booking.pricing?.total) || 0,
        approvalStatus: booking.approvalStatus || "pending",
        bookingStatus: mapBookingStatus(booking),
        createdAt: booking.createdAt || booking.api?.transactedDate || booking.checkIn,
      })),
    [bookingRecords]
  );

  const monthlyRevenue = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const totals = new Array(12).fill(0);

    normalizedBookings.forEach((booking) => {
      if (booking.bookingStatus === "cancelled") return;
      const sourceDate = new Date(booking.createdAt || booking.checkIn);
      if (Number.isNaN(sourceDate.getTime()) || sourceDate.getFullYear() !== year) return;
      totals[sourceDate.getMonth()] += Number(booking.grandTotal) || 0;
    });

    return monthLabels.map((month, index) => ({
      month,
      revenue: totals[index],
    }));
  }, [normalizedBookings]);

  const bookingsByStatus = useMemo(() => {
    const counts = normalizedBookings.reduce((acc, booking) => {
      const status = booking.bookingStatus || "confirmed";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return [
      { status: "confirmed", count: counts.confirmed || 0 },
      { status: "checked-in", count: counts["checked-in"] || 0 },
      { status: "checked-out", count: counts["checked-out"] || 0 },
      { status: "cancelled", count: counts.cancelled || 0 },
    ];
  }, [normalizedBookings]);

  const occupancyByProperty = useMemo(() => {
    const roomCountByPropertyId = roomsData.reduce((acc, room) => {
      const propertyId = room?.propertyId;
      if (!propertyId) return acc;
      acc[propertyId] = (acc[propertyId] || 0) + 1;
      return acc;
    }, {});

    const checkedInCountByPropertyId = normalizedBookings.reduce((acc, booking) => {
      if (booking.bookingStatus !== "checked-in" || !booking.propertyId) return acc;
      acc[booking.propertyId] = (acc[booking.propertyId] || 0) + 1;
      return acc;
    }, {});

    return propertiesData.slice(0, 8).map((property) => {
      const propertyId = property?.id || property?.primaryKeyValue;
      const totalRooms = roomCountByPropertyId[propertyId] || 0;
      const checkedInRooms = checkedInCountByPropertyId[propertyId] || 0;
      const occupancy = totalRooms > 0 ?
      Math.min(100, Math.round(checkedInRooms / totalRooms * 100)) :
      0;

      return {
        name: property?.name || "Unknown",
        occupancy,
      };
    });
  }, [normalizedBookings, propertiesData, roomsData]);

  const pendingProperties = useMemo(
    () =>
      propertiesData.
      filter((property) => {
        const statusId = Number(property?.statusId ?? 0);
        return statusId === 0 || statusId === 1;
      }).
      slice(0, 5).
      map((property) => ({
        id: property?.id || property?.primaryKeyValue,
        name: property?.name || "Unnamed Property",
        ownerName: ownersMap[property?.ownerId] || "Unknown",
      })),
    [ownersMap, propertiesData]
  );

  const recentBookings = useMemo(
    () =>
      [...normalizedBookings].
      sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).
      slice(0, 5),
    [normalizedBookings]
  );

  const dashboardStats = useMemo(() => {
    const approvedBookings = normalizedBookings.filter(
      (booking) => booking.approvalStatus === "approved"
    );
    const totalRevenue = normalizedBookings.reduce(
      (sum, booking) => booking.bookingStatus !== "cancelled" ? sum + booking.grandTotal : sum,
      0
    );
    const checkedInCount = normalizedBookings.filter(
      (booking) => booking.bookingStatus === "checked-in"
    ).length;

    return {
      totalProperties: propertiesData.length,
      totalRooms: roomsData.length,
      totalBookings: normalizedBookings.length,
      totalRevenue,
      occupancyRate: roomsData.length ?
      Math.min(100, Math.round(checkedInCount / roomsData.length * 100)) :
      0,
      pendingApprovals: pendingProperties.length,
      todayCheckIns: approvedBookings.filter(
        (booking) =>
        booking.bookingStatus === "confirmed" && toDateOnly(booking.checkIn) === today
      ).length,
      todayCheckOuts: approvedBookings.filter(
        (booking) =>
        booking.bookingStatus === "checked-in" && toDateOnly(booking.checkOut) === today
      ).length,
      monthlyRevenue,
      bookingsByStatus,
      occupancyByProperty,
    };
  }, [bookingsByStatus, monthlyRevenue, normalizedBookings, occupancyByProperty, pendingProperties.length, propertiesData.length, roomsData.length, today]);

  return (
    <Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Total Properties"
            value={dashboardStats.totalProperties}
            icon={ApartmentIcon}
            color="primary"
            subtitle="Live" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Total Rooms"
            value={dashboardStats.totalRooms}
            icon={MeetingRoomIcon}
            color="info"
            subtitle="Live" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Total Bookings"
            value={dashboardStats.totalBookings}
            icon={EventNoteIcon}
            color="success"
            subtitle="Live" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            icon={MonetizationOnIcon}
            color="warning"
            subtitle="Live" />

                </Grid>
            </Grid>

            {/* Secondary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Occupancy Rate"
            value={`${dashboardStats.occupancyRate}%`}
            icon={TrendingUpIcon}
            color="success" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Pending Approvals"
            value={dashboardStats.pendingApprovals}
            icon={PendingActionsIcon}
            color="warning" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Today's Check-ins"
            value={dashboardStats.todayCheckIns}
            icon={LoginIcon}
            color="primary" />

                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
            title="Today's Check-outs"
            value={dashboardStats.todayCheckOuts}
            icon={LogoutIcon}
            color="info" />

                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Revenue Chart */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                Monthly Revenue
                            </Typography>
                            <Box sx={{ width: "100%", height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={dashboardStats.monthlyRevenue}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis dataKey="month" />
                                        <YAxis
                      tickFormatter={(value) => `$${value / 1000}k`} />

                                        <Tooltip
                      formatter={(value) => [formatCurrency(value), "Revenue"]} />

                                        <Bar
                      dataKey="revenue"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]} />

                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Booking Status Pie Chart */}
                <Grid size={{ md: 4 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                Bookings by Status
                            </Typography>
                            <Box sx={{ width: "100%", height: 250 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                      data={dashboardStats.bookingsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="status">

                                            {dashboardStats.bookingsByStatus.map((entry, index) =>
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]} />

                      )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            {/* Legend */}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                                {dashboardStats.bookingsByStatus.map((item, index) =>
                <Chip
                  key={item.status}
                  label={`${item.status}: ${item.count}`}
                  size="small"
                  sx={{
                    bgcolor: alpha(COLORS[index % COLORS.length], 0.1),
                    color: COLORS[index % COLORS.length],
                    fontWeight: 500
                  }} />

                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Occupancy by Property */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                Occupancy by Property
                            </Typography>
                            <Box sx={{ width: "100%", height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={dashboardStats.occupancyByProperty}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                        <Tooltip formatter={(value) => [`${value}%`, "Occupancy"]} />
                                        <Line
                      type="monotone"
                      dataKey="occupancy"
                      stroke={theme.palette.success.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.success.main, r: 6 }} />

                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Bookings & Pending Approvals */}
            <Grid container spacing={3}>
                {/* Recent Bookings */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Recent Bookings
                                </Typography>
                                <Button endIcon={<ArrowForwardIcon />} size="small">
                                    View All
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Booking Code</TableCell>
                                            <TableCell>Guest</TableCell>
                                            <TableCell>Property</TableCell>
                                            <TableCell>Check In</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentBookings.map((booking) =>
                    <TableRow key={booking.id} hover>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {booking.bookingCode}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                                                            {booking.guestName.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="body2">
                                                            {booking.guestName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{booking.propertyName}</TableCell>
                                                <TableCell>
                                                    {new Date(booking.checkIn).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(booking.grandTotal)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                          label={booking.bookingStatus}
                          size="small"
                          color={
                          booking.bookingStatus === "confirmed" ?
                          "primary" :
                          booking.bookingStatus === "checked-in" ?
                          "success" :
                          booking.bookingStatus === "checked-out" ?
                          "default" :
                          "warning"
                          }
                          variant={
                          booking.bookingStatus === "cancelled" ?
                          "outlined" :
                          "filled"
                          } />

                                                </TableCell>
                                            </TableRow>
                    )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Approvals */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Pending Approvals
                                </Typography>
                                <Chip
                  label={pendingProperties.length}
                  color="warning"
                  size="small" />

                            </Box>
                            <List disablePadding>
                                {pendingProperties.length > 0 ?
                pendingProperties.map((property, index) =>
                <React.Fragment key={property.id}>
                                            <ListItem
                    sx={{ px: 0 }}
                    secondaryAction={
                    <Button size="small" variant="outlined">
                                                        Review
                                                    </Button>
                    }>

                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.15) }}>
                                                        <HomeWorkIcon sx={{ color: theme.palette.warning.main }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                      primary={property.name}
                      secondary={`by ${property.ownerName}`}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }} />

                                            </ListItem>
                                            {index < pendingProperties.length - 1 && <Divider />}
                                        </React.Fragment>
                ) :

                <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography color="text.secondary">
                                            No pending approvals
                                        </Typography>
                                    </Box>
                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>);

}
