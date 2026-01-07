import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { 
            main: "#2196F3",
            light: "#64B5F6",
            dark: "#1976D2",
        },
        secondary: { 
            main: "#FFC107",
            light: "#FFD54F",
            dark: "#FFA000",
        },
        success: {
            main: "#4CAF50",
            light: "#81C784",
            dark: "#388E3C",
        },
        error: {
            main: "#F44336",
            light: "#E57373",
            dark: "#D32F2F",
        },
        warning: {
            main: "#FF9800",
            light: "#FFB74D",
            dark: "#F57C00",
        },
        info: {
            main: "#00BCD4",
            light: "#4DD0E1",
            dark: "#0097A7",
        },
        background: {
            default: "#F4F6F8",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
        },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 500 },
        button: { textTransform: "none", fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: "none",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    margin: "4px 8px",
                    "&:hover": {
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                    },
                    "&.Mui-selected": {
                        backgroundColor: "#2196F3",
                        color: "#FFFFFF",
                        "&:hover": {
                            backgroundColor: "#1976D2",
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    },
                },
                containedPrimary: {
                    "&:hover": {
                        backgroundColor: "#1976D2",
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: "#F4F6F8",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    minWidth: 100,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: "12px",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                },
            },
        },
    },
});

export default theme;