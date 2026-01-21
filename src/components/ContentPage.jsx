import { useState } from 'react';
import { Box, Paper, Typography, Modal, Button } from '@mui/material';
import CustomFilterTable from './CustomTable';

const style = {
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

export default function ContentPage({ title }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const columns = [
        { id: 'name', label: 'Name', type: 'text', width: '200px' },
        { id: 'status', label: 'Status', type: 'select', options: ['Completed', 'In Progress', 'Pending'], width: '150px' },
        { id: 'budget', label: 'Budget', type: 'number', width: '120px' },
    ];

    const data = [
        { id: 1, name: 'Project Alpha', status: 'Completed', budget: 12000 },
        { id: 2, name: 'Project Beta', status: 'In Progress', budget: 8500 },
        { id: 3, name: 'Project Gamma', status: 'Pending', budget: 15000 },
    ];

    const actions = ['view', 'edit', 'delete']; 

    const handleActionClick = (action, row) => {
        if (action === 'view') {
            setSelectedRow(row);
            setModalOpen(true);

        } else if (action === 'edit') {
            alert(`Edit clicked for ${row.name}`);

        } else if (action === 'delete') {
            if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                alert(`Deleted ${row.name}`);
            }
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                {title} Overview
            </Typography>

            <Paper sx={{ p: 4, borderRadius: '12px' }}>
                <Typography variant="body1" color="text.secondary">
                    This is the main content area for the <strong>{title}</strong> section.
                </Typography>

                <Box sx={{ mt: 4 }}>
                    <CustomFilterTable
                        data={data}
                        columns={columns}
                        actions={actions}
                        onActionClick={handleActionClick}
                    />
                </Box>

                <Modal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
                            Project Details
                        </Typography>
                        {selectedRow ? (
                            <>
                                <Typography>Name: {selectedRow.name}</Typography>
                                <Typography>Status: {selectedRow.status}</Typography>
                                <Typography>Budget: Nu {selectedRow.budget}</Typography>
                            </>
                        ) : (
                            <Typography>No Details</Typography>
                        )}
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Paper>
        </Box>
    );
}
