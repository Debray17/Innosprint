import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    Avatar,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import HotelIcon from "@mui/icons-material/Hotel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import StatCard from "../../components/StatCard";
import { dashboardStats, properties, rooms, bookings } from "../../data/mockData";

const OccupancyReportPage = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState("month");
    const [selectedProperty, setSelectedProperty] = useState("");

    // Approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Calculate occupancy stats
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const availableRooms = rooms.filter((r) => r.status === "available").length;
    const maintenanceRooms = rooms.filter((r) => r.status === "maintenance").length;
    const reservedRooms = rooms.filter((r) => r.status === "reserved").length;

    const overallOccupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Monthly occupancy data (mock)
    const monthlyOccupancyData = [
        { month: "Jan", occupancy: 65, bookings: 42 },
        { month: "Feb", occupancy: 58, bookings: 38 },
        { month: "Mar", occupancy: 72, bookings: 51 },
        { month: "Apr", occupancy: 78, bookings: 55 },
        { month: "May", occupancy: 68, bookings: 48 },
        { month: "Jun", occupancy: 85, bookings: 62 },
        { month: "Jul", occupancy: 92, bookings: 71 },
        { month: "Aug", occupancy: 88, bookings: 68 },
        { month: "Sep", occupancy: 75, bookings: 54 },
        { month: "Oct", occupancy: 70, bookings: 49 },
        { month: "Nov", occupancy: 62, bookings: 43 },
        { month: "Dec", occupancy: 80, bookings: 58 },
    ];

    // Occupancy by day of week (mock)
    const weekdayOccupancy = [
        { day: "Mon", occupancy: 62 },
        { day: "Tue", occupancy: 58 },
        { day: "Wed", occupancy: 65 },
        { day: "Thu", occupancy: 70 },
        { day: "Fri", occupancy: 88 },
        { day: "Sat", occupancy: 95 },
        { day: "Sun", occupancy: 82 },
    ];

    // Occupancy by property
    const occupancyByProperty = approvedProperties.map((property) => {
        const propertyRooms = rooms.filter((r) => r.propertyId === property.id);
        const occupied = propertyRooms.filter((r) => r.status === "occupied").length;
        const total = propertyRooms.length;
        const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

        return {
            id: property.id,
            name: property.name,
            type: property.type,
            totalRooms: total,
            occupiedRooms: occupied,
            availableRooms: propertyRooms.filter((r) => r.status === "available").length,
            occupancyRate,
        };
    });

    // Room type occupancy
    const roomTypeOccupancy = {};
    rooms.forEach((room) => {
        if (!roomTypeOccupancy[room.roomType]) {
            roomTypeOccupancy[room.roomType] = { total: 0, occupied: 0 };
        }
        roomTypeOccupancy[room.roomType].total++;
        if (room.status === "occupied") {
            roomTypeOccupancy[room.roomType].occupied++;
        }
    });

    const roomTypeData = Object.entries(roomTypeOccupancy).map(([type, data]) => ({
        type,
        total: data.total,
        occupied: data.occupied,
        occupancy: data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0,
    }));

    // Get occupancy color
    const getOccupancyColor = (rate) => {
        if (rate >= 80) return theme.palette.success.main;
        if (rate >= 50) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    // Average length of stay
    const avgStayLength = bookings.length > 0
        ? Math.round(bookings.reduce((sum, b) => sum + b.nights, 0) / bookings.length)
        : 0;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Occupancy Report
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Room occupancy analytics and trends
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export Report
                </Button>
            </Box>

            {/* Filters */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item size={{xs:12, sm:4}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Date Range</InputLabel>
                            <Select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                label="Date Range"
                            >
                                <MenuItem value="week">Last 7 Days</MenuItem>
                                <MenuItem value="month">Last 30 Days</MenuItem>
                                <MenuItem value="quarter">Last Quarter</MenuItem>
                                <MenuItem value="year">This Year</MenuItem>
                                <MenuItem value="custom">Custom Range</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={{xs:12, sm:4}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Property</InputLabel>
                            <Select
                                value={selectedProperty}
                                onChange={(e) => setSelectedProperty(e.target.value)}
                                label="Property"
                            >
                                <MenuItem value="">All Properties</MenuItem>
                                {approvedProperties.map((property) => (
                                    <MenuItem key={property.id} value={property.id}>
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {dateRange === "custom" && (
                        <>
                            <Grid item size={{xs:12, sm:2}}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="From"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item size={{xs:12, sm:2}}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="To"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Overall Occupancy"
                        value={`${overallOccupancy}%`}
                        icon={TrendingUpIcon}
                        color="primary"
                        trend="up"
                        trendValue="+5%"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Total Rooms"
                        value={totalRooms}
                        icon={MeetingRoomIcon}
                        color="info"
                        subtitle={`${occupiedRooms} occupied`}
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Available Rooms"
                        value={availableRooms}
                        icon={HotelIcon}
                        color="success"
                        subtitle="Ready for booking"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:6, md:3}}>
                    <StatCard
                        title="Avg. Stay Length"
                        value={`${avgStayLength} nights`}
                        icon={CalendarTodayIcon}
                        color="warning"
                        trend="up"
                        trendValue="+0.5"
                    />
                </Grid>
            </Grid>

            {/* Room Status Overview */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Current Room Status
                </Typography>
                <Grid container spacing={3}>
                    <Grid item size={{xs:6, sm:3}}>
                        <Box
                            sx={{
                                p: 2,
                                textAlign: "center",
                                backgroundColor: alpha(theme.palette.error.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            }}
                        >
                            <Typography variant="h3" fontWeight={700} color="error.main">
                                {occupiedRooms}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Occupied
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item size={{xs:6, sm:3}}>
                        <Box
                            sx={{
                                p: 2,
                                textAlign: "center",
                                backgroundColor: alpha(theme.palette.success.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            }}
                        >
                            <Typography variant="h3" fontWeight={700} color="success.main">
                                {availableRooms}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Available
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item size={{xs:6, sm:3}}>
                        <Box
                            sx={{
                                p: 2,
                                textAlign: "center",
                                backgroundColor: alpha(theme.palette.info.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            }}
                        >
                            <Typography variant="h3" fontWeight={700} color="info.main">
                                {reservedRooms}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Reserved
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item size={{xs:6, sm:3}}>
                        <Box
                            sx={{
                                p: 2,
                                textAlign: "center",
                                backgroundColor: alpha(theme.palette.warning.main, 0.08),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                            }}
                        >
                            <Typography variant="h3" fontWeight={700} color="warning.main">
                                {maintenanceRooms}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Maintenance
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Monthly Occupancy Trend */}
                <Grid item size={{xs:12, lg:8}}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Occupancy Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyOccupancyData}>
                                <defs>
                                    <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={theme.palette.primary.main}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={theme.palette.primary.main}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                    tickFormatter={(value) => `${value}%`}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                    }}
                                    formatter={(value, name) => [
                                        name === "occupancy" ? `${value}%` : value,
                                        name === "occupancy" ? "Occupancy Rate" : "Bookings",
                                    ]}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="occupancy"
                                    name="Occupancy Rate"
                                    stroke={theme.palette.primary.main}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorOccupancy)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="bookings"
                                    name="Bookings"
                                    stroke={theme.palette.success.main}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Occupancy by Day of Week */}
                <Grid item size={{xs:12, lg:4}}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            By Day of Week
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weekdayOccupancy}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                    tickFormatter={(value) => `${value}%`}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                    }}
                                    formatter={(value) => [`${value}%`, "Occupancy"]}
                                />
                                <Bar
                                    dataKey="occupancy"
                                    fill={theme.palette.primary.main}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Occupancy by Property */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Occupancy by Property
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Property</TableCell>
                                <TableCell align="center">Type</TableCell>
                                <TableCell align="center">Total Rooms</TableCell>
                                <TableCell align="center">Occupied</TableCell>
                                <TableCell align="center">Available</TableCell>
                                <TableCell>Occupancy Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {occupancyByProperty.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                    color: theme.palette.primary.main,
                                                }}
                                            >
                                                <HotelIcon fontSize="small" />
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={500}>
                                                {property.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip label={property.type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell align="center">{property.totalRooms}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={property.occupiedRooms}
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={property.availableRooms}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box sx={{ flex: 1, maxWidth: 150 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={property.occupancyRate}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: alpha(
                                                            getOccupancyColor(property.occupancyRate),
                                                            0.2
                                                        ),
                                                        "& .MuiLinearProgress-bar": {
                                                            borderRadius: 4,
                                                            backgroundColor: getOccupancyColor(
                                                                property.occupancyRate
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                sx={{
                                                    color: getOccupancyColor(property.occupancyRate),
                                                    minWidth: 45,
                                                }}
                                            >
                                                {property.occupancyRate}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Occupancy by Room Type */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Occupancy by Room Type
                </Typography>
                <Grid container spacing={3}>
                    {roomTypeData.map((roomType) => (
                        <Grid item size={{xs:12, sm:6, md:4}} key={roomType.type}>
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {roomType.type}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                        sx={{ color: getOccupancyColor(roomType.occupancy) }}
                                    >
                                        {roomType.occupancy}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={roomType.occupancy}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        mb: 1,
                                        backgroundColor: alpha(
                                            getOccupancyColor(roomType.occupancy),
                                            0.2
                                        ),
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 5,
                                            backgroundColor: getOccupancyColor(roomType.occupancy),
                                        },
                                    }}
                                />
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {roomType.occupied} of {roomType.total} rooms occupied
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default OccupancyReportPage;