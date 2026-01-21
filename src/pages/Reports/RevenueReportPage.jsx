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
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PercentIcon from "@mui/icons-material/Percent";

import StatCard from "../../components/StatCard";
import { dashboardStats, bookings, properties } from "../../data/mockData";

const RevenueReportPage = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState("year");
    const [selectedProperty, setSelectedProperty] = useState("");

    // Approved properties
    const approvedProperties = properties.filter((p) => p.status === "approved");

    // Format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);

    // Calculate totals from bookings
    const totalRevenue = bookings
        .filter((b) => b.bookingStatus !== "cancelled")
        .reduce((sum, b) => sum + b.grandTotal, 0);

    // const totalTax = bookings
    //     .filter((b) => b.bookingStatus !== "cancelled")
    //     .reduce((sum, b) => sum + b.taxAmount, 0);

    const completedBookings = bookings.filter(
        (b) => b.bookingStatus === "checked-out" && b.paymentStatus === "paid"
    );

    const pendingPayments = bookings
        .filter((b) => b.paymentStatus === "pending" || b.paymentStatus === "partial")
        .reduce((sum, b) => sum + b.grandTotal, 0);

    // Avg booking value
    const avgBookingValue = completedBookings.length > 0
        ? completedBookings.reduce((sum, b) => sum + b.grandTotal, 0) / completedBookings.length
        : 0;

    // Revenue by property
    const revenueByProperty = approvedProperties.map((property) => {
        const propertyBookings = bookings.filter(
            (b) => b.propertyId === property.id && b.bookingStatus !== "cancelled"
        );
        const revenue = propertyBookings.reduce((sum, b) => sum + b.grandTotal, 0);
        const commission = revenue * (property.commissionRate / 100);
        return {
            id: property.id,
            name: property.name,
            revenue,
            commission,
            bookings: propertyBookings.length,
            commissionRate: property.commissionRate,
        };
    });

    // Revenue by payment method
    const paymentMethods = {};
    bookings
        .filter((b) => b.bookingStatus !== "cancelled")
        .forEach((b) => {
            const method = b.paymentMethod || "Unknown";
            if (!paymentMethods[method]) {
                paymentMethods[method] = 0;
            }
            paymentMethods[method] += b.grandTotal;
        });

    const paymentMethodData = Object.entries(paymentMethods).map(([name, value]) => ({
        name,
        value,
    }));

    // Colors for pie chart
    const COLORS = [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main,
    ];

    // Total commission
    const totalCommission = revenueByProperty.reduce((sum, p) => sum + p.commission, 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600}>
                        Revenue Report
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Detailed revenue analytics and financial overview
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
                        title="Total Revenue"
                        value={formatCurrency(totalRevenue)}
                        icon={AttachMoneyIcon}
                        color="success"
                        trend="up"
                        trendValue="+18%"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                    <StatCard
                        title="Platform Commission"
                        value={formatCurrency(totalCommission)}
                        icon={PercentIcon}
                        color="primary"
                        trend="up"
                        trendValue="+12%"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                    <StatCard
                        title="Avg. Booking Value"
                        value={formatCurrency(avgBookingValue)}
                        icon={ReceiptIcon}
                        color="info"
                        trend="up"
                        trendValue="+5%"
                    />
                </Grid>
                <Grid item size={{xs:12, sm:4}}>
                    <StatCard
                        title="Pending Payments"
                        value={formatCurrency(pendingPayments)}
                        icon={AccountBalanceIcon}
                        color="warning"
                        subtitle="Awaiting collection"
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Revenue Trend */}
                <Grid item size={{xs:12, lg:8}}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            Revenue Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dashboardStats.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={theme.palette.success.main}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={theme.palette.success.main}
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
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                    }}
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={theme.palette.success.main}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Revenue by Payment Method */}
                <Grid item size={{xs:12, lg:4}}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                            By Payment Method
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        backgroundColor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ mt: 2 }}>
                            {paymentMethodData.map((item, index) => (
                                <Box
                                    key={item.name}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 0.5,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: "50%",
                                                backgroundColor: COLORS[index % COLORS.length],
                                            }}
                                        />
                                        <Typography variant="body2">{item.name}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {formatCurrency(item.value)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Revenue by Property */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Revenue by Property
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByProperty} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            width={150}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8,
                            }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar
                            dataKey="revenue"
                            name="Revenue"
                            fill={theme.palette.primary.main}
                            radius={[0, 4, 4, 0]}
                        />
                        <Bar
                            dataKey="commission"
                            name="Commission"
                            fill={theme.palette.success.main}
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* Detailed Revenue Table */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                    Property Revenue Details
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Property</TableCell>
                                <TableCell align="right">Bookings</TableCell>
                                <TableCell align="right">Revenue</TableCell>
                                <TableCell align="right">Commission Rate</TableCell>
                                <TableCell align="right">Commission</TableCell>
                                <TableCell align="right">Net to Owner</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {revenueByProperty.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {property.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">{property.bookings}</TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight={500}>
                                            {formatCurrency(property.revenue)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={`${property.commissionRate}%`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography color="success.main" fontWeight={500}>
                                            {formatCurrency(property.commission)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontWeight={600}>
                                            {formatCurrency(property.revenue - property.commission)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        Total
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={700}>
                                        {revenueByProperty.reduce((sum, p) => sum + p.bookings, 0)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={700}>
                                        {formatCurrency(
                                            revenueByProperty.reduce((sum, p) => sum + p.revenue, 0)
                                        )}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">-</TableCell>
                                <TableCell align="right">
                                    <Typography color="success.main" fontWeight={700}>
                                        {formatCurrency(totalCommission)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={700}>
                                        {formatCurrency(
                                            revenueByProperty.reduce(
                                                (sum, p) => sum + (p.revenue - p.commission),
                                                0
                                            )
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default RevenueReportPage;