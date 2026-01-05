import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const actionIconMap = {
    view: ViewIcon,
    edit: EditIcon,
    delete: DeleteIcon,
};

const ROW_HEIGHT = 56;

const CustomFilterTable = ({ data, columns, actions = [], onActionClick }) => {
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();

    const minTableBodyHeight = rowsPerPage * ROW_HEIGHT + 2;

    const handleFilterChange = (columnId, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [columnId]: value,
        }));
        setPage(0);
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case 'Completed': return { label: status, color: 'success', variant: 'filled' };
            case 'In Progress': return { label: status, color: 'primary', variant: 'outlined' };
            case 'Pending': return { label: status, color: 'warning', variant: 'outlined' };
            default: return { label: status, color: 'default', variant: 'outlined' };
        }
    };

    const filteredData = useMemo(() => {
        return data.filter(row =>
            columns.every(col => {
                const filterValue = filters[col.id];
                const rowValue = row[col.id];
                if (!filterValue || filterValue === '') return true;
                if (col.type === 'text' || col.type === 'select') {
                    return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                }
                if (col.type === 'number') {
                    return String(rowValue).includes(String(filterValue));
                }
                return true;
            })
        );
    }, [data, columns, filters]);

    const paginatedData = useMemo(() => {
        return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

    const hasActions = actions && actions.length > 0;

    return (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', overflowX: 'auto', minWidth: '100%' }}>
            <Table stickyHeader aria-label="custom filter table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                sx={{
                                    fontWeight: 700,
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    width: column.width || 'auto',
                                    minWidth: column.width || 'auto',
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {hasActions && (
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    width: '100px',
                                }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={`filter-${column.id}`} sx={{ py: 1, borderBottom: '2px solid #ddd' }}>
                                {column.type === 'text' && (
                                    <TextField
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        placeholder={`Search ${column.label}`}
                                        value={filters[column.id] || ''}
                                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { height: 36, borderRadius: '8px' },
                                        }}
                                    />
                                )}
                                {(column.type === 'select' || column.type === 'number') && (
                                    <TextField
                                        select
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        value={filters[column.id] || ''}
                                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                                        displayEmpty
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TuneIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { height: 36, borderRadius: '8px' },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                                All {column.label}
                                            </Typography>
                                        </MenuItem>
                                        {column.type === 'select' && (column.options || []).map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </TableCell>
                        ))}
                        {hasActions && <TableCell />}
                    </TableRow>
                </TableHead>
                <TableBody sx={{ minHeight: minTableBodyHeight }}> 
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:nth-of-type(odd)': { backgroundColor: theme.palette.background.default },
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell key={`${row.id}-${column.id}`} sx={{ width: column.width || 'auto', minWidth: column.width || 'auto' }}>
                                        {column.id === 'budget'
                                            ? formatCurrency(row[column.id])
                                            : column.id === 'status'
                                                ? <Chip {...getStatusChipProps(row[column.id])} size="small" />
                                                : row[column.id]}
                                    </TableCell>
                                ))}
                                {hasActions && (
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {actions.map((actionName) => {
                                                const ActionIcon = actionIconMap[actionName.toLowerCase()];
                                                if (!ActionIcon) return null;

                                                let iconColor = 'primary';
                                                if (actionName.toLowerCase() === 'view') iconColor = 'grey.600';
                                                if (actionName.toLowerCase() === 'delete') iconColor = 'error.main';

                                                const handleClick = () => {
                                                    if (onActionClick) onActionClick(actionName.toLowerCase(), row);
                                                };

                                                return (
                                                    <IconButton
                                                        key={actionName}
                                                        size="small"
                                                        color={iconColor === 'primary' ? 'primary' : undefined}
                                                        onClick={handleClick}
                                                        title={actionName.charAt(0).toUpperCase() + actionName.slice(1)}
                                                        sx={iconColor !== 'primary' ? { color: iconColor } : {}}
                                                    >
                                                        <ActionIcon fontSize="small" />
                                                    </IconButton>
                                                );
                                            })}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} align="center" sx={{ py: 4, height: minTableBodyHeight }}>
                                <Typography color="text.secondary">No results found matching your filters.</Typography>
                            </TableCell>
                        </TableRow>
                    )}

                    {paginatedData.length > 0 && Array.from({ length: rowsPerPage - paginatedData.length }).map((_, index) => (
                        <TableRow key={`empty-${index}`} style={{ height: ROW_HEIGHT }}>
                            <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default CustomFilterTable;