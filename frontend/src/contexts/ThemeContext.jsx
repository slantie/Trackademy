import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? {
        primary: {
          main: "#8155c6",
          light: "#a478d1",
          dark: "#5d3c8b",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#667eea",
          light: "#8fa3ee",
          dark: "#4756b3",
        },
        background: {
          default: "#FFFFFF",
          paper: "#FFFFFF",
          surface: "#F6F6F7",
        },
        text: {
          primary: "#3C3C43",
          secondary: "#67676C",
          tertiary: "#98989F",
        },
        divider: "#EBEBEF",
        success: {
          main: "#43e97b",
          light: "#69ed95",
          dark: "#2fb563",
        },
        error: {
          main: "#f5576c",
          light: "#f77588",
          dark: "#d13851",
        },
        warning: {
          main: "#f093fb",
          light: "#f3a8fc",
          dark: "#e673f8",
        },
        info: {
          main: "#38bdf8",
          light: "#5ccafc",
          dark: "#0284c7",
        },
        grey: {
          50: "#F6F6F7",
          100: "#EBEBEF",
          200: "#C2C2C4",
          300: "#98989F",
          400: "#67676C",
          500: "#3C3C43",
          600: "#2C2C32",
          700: "#1F1F23",
          800: "#161618",
          900: "#0F0F10",
        },
      } : {
        primary: {
          main: "#8155c6",
          light: "#a478d1",
          dark: "#5d3c8b",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#667eea",
          light: "#8fa3ee",
          dark: "#4756b3",
        },
        background: {
          default: "#1B1B1F",
          paper: "#202127",
          surface: "#161618",
        },
        text: {
          primary: "#DFDFD6",
          secondary: "#FFFFFF",
          tertiary: "#98989F",
        },
        divider: "#32363F",
        success: {
          main: "#43e97b",
          light: "#69ed95",
          dark: "#2fb563",
        },
        error: {
          main: "#f5576c",
          light: "#f77588",
          dark: "#d13851",
        },
        warning: {
          main: "#f093fb",
          light: "#f3a8fc",
          dark: "#e673f8",
        },
        info: {
          main: "#38bdf8",
          light: "#5ccafc",
          dark: "#0284c7",
        },
        grey: {
          50: "#F6F6F7",
          100: "#EBEBEF",
          200: "#C2C2C4",
          300: "#98989F",
          400: "#67676C",
          500: "#3C3C43",
          600: "#32363F",
          700: "#202127",
          800: "#1B1B1F",
          900: "#161618",
        },
      }),
    },
    typography: {
      fontFamily: ["Poppins", "DM Sans", "Inter", "sans-serif"].join(","),
      h1: {
        fontWeight: 800,
        fontSize: "3.5rem",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontWeight: 700,
        fontSize: "2.75rem",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h3: {
        fontWeight: 700,
        fontSize: "2.25rem",
        lineHeight: 1.4,
        letterSpacing: "-0.01em",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.875rem",
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.25rem",
        lineHeight: 1.5,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: "1.125rem",
        lineHeight: 1.6,
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.7,
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
        fontWeight: 400,
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.4,
        fontWeight: 400,
      },
      button: {
        fontWeight: 600,
        fontSize: "0.875rem",
        textTransform: "none",
        letterSpacing: "0.02em",
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.04)',
      '0px 4px 8px rgba(0, 0, 0, 0.04)',
      '0px 8px 16px rgba(0, 0, 0, 0.04)',
      '0px 12px 24px rgba(0, 0, 0, 0.06)',
      '0px 16px 32px rgba(0, 0, 0, 0.08)',
      '0px 20px 40px rgba(0, 0, 0, 0.08)',
      '0px 24px 48px rgba(0, 0, 0, 0.1)',
      '0px 32px 64px rgba(0, 0, 0, 0.12)',
      ...Array(15).fill('none'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            padding: "12px 24px",
            fontSize: "0.95rem",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: "0 4px 14px 0 rgba(129, 85, 198, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px 0 rgba(129, 85, 198, 0.4)",
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? "0 4px 20px rgba(0, 0, 0, 0.08)" 
              : "0 4px 20px rgba(0, 0, 0, 0.25)",
            border: `1px solid ${mode === 'light' ? '#EBEBEF' : '#32363F'}`,
            backdropFilter: 'blur(10px)',
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light' 
                ? "0 8px 30px rgba(0, 0, 0, 0.12)" 
                : "0 8px 30px rgba(0, 0, 0, 0.35)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: mode === 'light' ? '#8155c6' : '#a478d1',
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: '#8155c6',
                },
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px)',
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(27, 27, 31, 0.8)',
            borderBottom: `1px solid ${mode === 'light' ? '#EBEBEF' : '#32363F'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: "all 0.2s ease-in-out",
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
    },
  });

  const value = {
    mode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
