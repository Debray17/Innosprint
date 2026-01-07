import React, { useState, useMemo } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    MenuItem,
    Chip,
    IconButton,
    Typography,
    TablePagination,
    Tooltip,
    Avatar,
    TableSortLabel,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CheckCircle as ApproveIcon,
    Cancel as RejectIcon,
    Login as CheckInIcon,
    Logout as CheckOutIcon,
} from "@mui/icons-material";

const actionIconMap = {
    view: { icon: ViewIcon, color: "grey.600", tooltip: "View" },
    edit: { icon: EditIcon, color: "primary.main", tooltip: "Edit" },
    delete: { icon: DeleteIcon, color: "error.main", tooltip: "Delete" },
    approve: { icon: ApproveIcon, color: "success.main", tooltip: "Approve" },
    reject: { icon: RejectIcon, color: "error.main", tooltip: "Reject" },
    checkin: { icon: CheckInIcon, color: "success.main", tooltip: "Check In" },
    checkout: { icon: CheckOutIcon, color: "warning.main", tooltip: "Check Out" },
};

const ROW_HEIGHT = 56;

const CustomTable = ({
    data,
    columns,
    actions = [],
    onActionClick,
    showFilters = true,
    defaultRowsPerPage = 10,
}) => {
    const theme = useTheme();
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [orderBy, setOrderBy] = useState("");
    const [order, setOrder] = useState("asc");

    const minTableBodyHeight = rowsPerPage * ROW_HEIGHT + 2;

    const handleFilterChange = (columnId, value) => {
        setFilters((prev) => ({ ...prev, [columnId]: value }));
        setPage(0);
    };

    const handleSort = (columnId) => {
        const isAsc = orderBy === columnId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(columnId);
    };

    const getStatusChipProps = (status, type = "default") => {
        const statusLower = status?.toLowerCase() || "";

        // Booking status
        if (type === "booking") {
            switch (statusLower) {
                case "confirmed":
                    return { label: status, color: "primary", variant: "filled" };
                case "checked-in":
                    return { label: status, color: "success", variant: "filled" };
                case "checked-out":
                    return { label: status, color: "default", variant: "outlined" };
                case "cancelled":
                    return { label: status, color: "error", variant: "outlined" };
                case "no-show":
                    return { label: status, color: "warning", variant: "outlined" };
                default:
                    return { label: status, color: "default", variant: "outlined" };
            }
        }

        // Payment status
        if (type === "payment") {
            switch (statusLower) {
                case "paid":
                    return { label: status, color: "success", variant: "filled" };
                case "pending":
                    return { label: status, color: "warning", variant: "outlined" };
                case "partial":
                    return { label: status, color: "info", variant: "outlined" };
                case "refunded":
                    return { label: status, color: "error", variant: "outlined" };
                default:
                    return { label: status, color: "default", variant: "outlined" };
            }
        }

        // Room status
        if (type === "room") {
            switch (statusLower) {
                case "available":
                    return { label: status, color: "success", variant: "filled" };
                case "occupied":
                    return { label: status, color: "error", variant: "filled" };
                case "reserved":
                    return { label: status, color: "warning", variant: "filled" };
                case "maintenance":
                    return { label: status, color: "default", variant: "outlined" };
                default:
                    return { label: status, color: "default", variant: "outlined" };
            }
        }

        // Property/Owner status
        if (type === "approval") {
            switch (statusLower) {
                case "approved":
                case "verified":
                    return { label: status, color: "success", variant: "filled" };
                case "pending":
                    return { label: status, color: "warning", variant: "filled" };
                case "rejected":
                    return { label: status, color: "error", variant: "filled" };
                default:
                    return { label: status, color: "default", variant: "outlined" };
            }
        }

        // Default
        switch (statusLower) {
            case "active":
            case "completed":
            case "success":
                return { label: status, color: "success", variant: "filled" };
            case "inactive":
            case "pending":
                return { label: status, color: "warning", variant: "outlined" };
            case "error":
            case "failed":
                return { label: status, color: "error", variant: "outlined" };
            default:
                return { label: status, color: "default", variant: "outlined" };
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((row) =>
            columns.every((col) => {
                const filterValue = filters[col.id];
                const rowValue = row[col.id];
                if (!filterValue || filterValue === "") return true;
                if (col.type === "text" || col.type === "select" || col.type === "status") {
                    return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                }
                if (col.type === "number" || col.type === "currency") {
                    return String(rowValue).includes(String(filterValue));
                }
                return true;
            })
        );
    }, [data, columns, filters]);

    const sortedData = useMemo(() => {
        if (!orderBy) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal < bVal) return order === "asc" ? -1 : 1;
            if (aVal > bVal) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, orderBy, order]);

    const paginatedData = useMemo(() => {
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const hasActions = actions && actions.length > 0;

    const renderCellContent = (column, row) => {
        const value = row[column.id];

        switch (column.type) {
            case "currency":
                return formatCurrency(value);
            case "date":
                return formatDate(value);
            case "status":
                return (
                    <Chip
                        {...getStatusChipProps(value, column.statusType)}
                        size="small"
                        sx={{ fontWeight: 500 }}
                    />
                );
            case "avatar":
                return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>
                            {value?.charAt(0) || "?"}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={500}>
                                {value}
                            </Typography>
                            {column.subField && (
                                <Typography variant="caption" color="text.secondary">
                                    {row[column.subField]}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                );
            case "boolean":
                return value ? (
                    <Chip label="Yes" color="success" size="small" variant="outlined" />
                ) : (
                    <Chip label="No" color="default" size="small" variant="outlined" />
                );
            default:
                return value ?? "-";
        }
    };

    return (
        <TableContainer
            component={Paper}
            sx={{ borderRadius: "12px", overflowX: "auto", minWidth: "100%" }}
        >
            <Table stickyHeader aria-label="data table">
                <TableHead>
                    {/* Header Row */}
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    width: column.width || "auto",
                                    minWidth: column.minWidth || column.width || "auto",
                                }}
                            >
                                {column.sortable !== false ? (
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={orderBy === column.id ? order : "asc"}
                                        onClick={() => handleSort(column.id)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                ) : (
                                    column.label
                                )}
                            </TableCell>
                        ))}
                        {hasActions && (
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    width: `${actions.length * 40 + 20}px`,
                                }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>

                    {/* Filter Row */}
                    {showFilters && (
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={`filter-${column.id}`}
                                    sx={{ py: 1, borderBottom: "2px solid #ddd" }}
                                >
                                    {column.filterable !== false && (
                                        <>
                                            {(column.type === "text" ||
                                                column.type === "avatar" ||
                                                column.type === "date") && (
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        fullWidth
                                                        placeholder={`Search...`}
                                                        value={filters[column.id] || ""}
                                                        onChange={(e) =>
                                                            handleFilterChange(column.id, e.target.value)
                                                        }
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon fontSize="small" color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { height: 36, borderRadius: "8px" },
                                                        }}
                                                    />
                                                )}
                                            {(column.type === "select" || column.type === "status") && (
                                                <TextField
                                                    select
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={filters[column.id] || ""}
                                                    onChange={(e) =>
                                                        handleFilterChange(column.id, e.target.value)
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <TuneIcon fontSize="small" color="action" />
                                                            </InputAdornment>
                                                        ),
                                                        sx: { height: 36, borderRadius: "8px" },
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontStyle: "italic",
                                                                color: theme.palette.text.secondary,
                                                            }}
                                                        >
                                                            All
                                                        </Typography>
                                                    </MenuItem>
                                                    {(column.options || []).map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                            {(column.type === "number" || column.type === "currency") && (
                                                <TextField
                                                    size="small"
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Filter..."
                                                    value={filters[column.id] || ""}
                                                    onChange={(e) =>
                                                        handleFilterChange(column.id, e.target.value)
                                                    }
                                                    InputProps={{
                                                        sx: { height: 36, borderRadius: "8px" },
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            ))}
                            {hasActions && <TableCell sx={{ borderBottom: "2px solid #ddd" }} />}
                        </TableRow>
                    )}
                </TableHead>

                <TableBody sx={{ minHeight: minTableBodyHeight }}>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                sx={{
                                    "&:last-child td, &:last-child th": { border: 0 },
                                    "&:nth-of-type(odd)": {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                    },
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${row.id}-${column.id}`}
                                        sx={{
                                            width: column.width || "auto",
                                            minWidth: column.minWidth || column.width || "auto",
                                        }}
                                    >
                                        {renderCellContent(column, row)}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 0.5 }}>
                                            {actions.map((actionName) => {
                                                const actionKey = actionName.toLowerCase();
                                                const actionConfig = actionIconMap[actionKey];
                                                if (!actionConfig) return null;

                                                const ActionIcon = actionConfig.icon;

                                                return (
                                                    <Tooltip key={actionName} title={actionConfig.tooltip}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                onActionClick && onActionClick(actionKey, row)
                                                            }
                                                            sx={{
                                                                color: actionConfig.color,
                                                                "&:hover": {
                                                                    backgroundColor: alpha(
                                                                        theme.palette.primary.main,
                                                                        0.1
                                                                    ),
                                                                },
                                                            }}
                                                        >
                                                            <ActionIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                );
                                            })}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (hasActions ? 1 : 0)}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <Typography color="text.secondary">
                                    No results found matching your filters.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {/* Empty rows for consistent height */}
                    {paginatedData.length > 0 &&
                        paginatedData.length < rowsPerPage &&
                        Array.from({ length: rowsPerPage - paginatedData.length }).map((_, index) => (
                            <TableRow key={`empty-${index}`} style={{ height: ROW_HEIGHT }}>
                                <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} />
                            </TableRow>
                        ))}
                </TableBody>
            </Table>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={sortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
            />
        </TableContainer>
    );
};

export default CustomTable;