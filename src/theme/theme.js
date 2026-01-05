import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#2196F3" },
        secondary: { main: "#FFC107" },
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
        h5: { fontWeight: 600 },
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
    },
});

export default theme;
