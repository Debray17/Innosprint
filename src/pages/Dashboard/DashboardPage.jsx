import React from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
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
    Cell,
} from "recharts";

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
import { dashboardStats, bookings, properties } from "../../data/mockData";

export default function DashboardPage() {
    const theme = useTheme();

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
    ];

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(value);

    const recentBookings = bookings.slice(0, 5);
    const pendingProperties = properties.filter((p) => p.status === "pending");

    return (
        <Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Properties"
                        value={dashboardStats.totalProperties}
                        icon={ApartmentIcon}
                        color="primary"
                        trend="up"
                        trendValue="+12%"
                        subtitle="vs last month"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Total Rooms"
                        value={dashboardStats.totalRooms}
                        icon={MeetingRoomIcon}
                        color="info"
                        trend="up"
                        trendValue="+8%"
                        subtitle="vs last month"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Total Bookings"
                        value={dashboardStats.totalBookings}
                        icon={EventNoteIcon}
                        color="success"
                        trend="up"
                        trendValue="+15%"
                        subtitle="vs last month"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(dashboardStats.totalRevenue)}
                        icon={MonetizationOnIcon}
                        color="warning"
                        trend="up"
                        trendValue="+18%"
                        subtitle="vs last month"
                    />
                </Grid>
            </Grid>

            {/* Secondary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Occupancy Rate"
                        value={`${dashboardStats.occupancyRate}%`}
                        icon={TrendingUpIcon}
                        color="success"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Pending Approvals"
                        value={dashboardStats.pendingApprovals}
                        icon={PendingActionsIcon}
                        color="warning"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Today's Check-ins"
                        value={dashboardStats.todayCheckIns}
                        icon={LoginIcon}
                        color="primary"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Today's Check-outs"
                        value={dashboardStats.todayCheckOuts}
                        icon={LogoutIcon}
                        color="info"
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Revenue Chart */}
                <Grid item size={{xs:12, md:8}}>
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
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), "Revenue"]}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill={theme.palette.primary.main}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Booking Status Pie Chart */}
                <Grid item  size={{sx:12, md:4}} >
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
                                            nameKey="status"
                                        >
                                            {dashboardStats.bookingsByStatus.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                            {/* Legend */}
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                                {dashboardStats.bookingsByStatus.map((item, index) => (
                                    <Chip
                                        key={item.status}
                                        label={`${item.status}: ${item.count}`}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(COLORS[index % COLORS.length], 0.1),
                                            color: COLORS[index % COLORS.length],
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Occupancy by Property */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item size={{xs:12}}>
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
                                            dot={{ fill: theme.palette.success.main, r: 6 }}
                                        />
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
                <Grid item size={{xs:12, md:8}}>
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
                                        {recentBookings.map((booking) => (
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
                                                            booking.bookingStatus === "confirmed"
                                                                ? "primary"
                                                                : booking.bookingStatus === "checked-in"
                                                                    ? "success"
                                                                    : booking.bookingStatus === "checked-out"
                                                                        ? "default"
                                                                        : "warning"
                                                        }
                                                        variant={
                                                            booking.bookingStatus === "cancelled"
                                                                ? "outlined"
                                                                : "filled"
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pending Approvals */}
                <Grid item size={{xs:12, md:4}}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Pending Approvals
                                </Typography>
                                <Chip
                                    label={pendingProperties.length}
                                    color="warning"
                                    size="small"
                                />
                            </Box>
                            <List disablePadding>
                                {pendingProperties.length > 0 ? (
                                    pendingProperties.map((property, index) => (
                                        <React.Fragment key={property.id}>
                                            <ListItem
                                                sx={{ px: 0 }}
                                                secondaryAction={
                                                    <Button size="small" variant="outlined">
                                                        Review
                                                    </Button>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.15) }}>
                                                        <HomeWorkIcon sx={{ color: theme.palette.warning.main }} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={property.name}
                                                    secondary={`by ${property.ownerName}`}
                                                    primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                                                />
                                            </ListItem>
                                            {index < pendingProperties.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <Box sx={{ textAlign: "center", py: 4 }}>
                                        <Typography color="text.secondary">
                                            No pending approvals
                                        </Typography>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}