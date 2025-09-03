import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8155c6",
      light: "#ff7070",
      lighter: "#fc6f6f",
    },
    dark: {
      text: "#DFDFD6",
      background: "#1B1B1F",
      highlight: "#8155c6",
      muted: {
        text: "#FFFFFF",
        background: "#202127",
      },
      noisy: {
        text: "#98989F",
        background: "#161618",
      },
      hover: "#414853",
      secondary: "#32363F",
      tertiary: "#98989F",
    },
    light: {
      text: "#3C3C43",
      background: "#FFFFFF",
      highlight: "#8155c6",
      muted: {
        text: "#67676C",
        background: "#F6F6F7",
      },
      noisy: {
        text: "#67676C",
        background: "#C2C2C4",
      },
      hover: "#E4E4E9",
      secondary: "#EBEBEF",
      tertiary: "#98989F",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#3C3C43",
      secondary: "#67676C",
    },
  },
  typography: {
    fontFamily: ["DM Sans", "sans-serif"].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
        contained: {
          boxShadow: "0 4px 12px rgba(129, 85, 198, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 16px rgba(129, 85, 198, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid #EBEBEF",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default muiTheme;
