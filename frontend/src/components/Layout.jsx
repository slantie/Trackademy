// src/components/Layout.jsx
import { Box, Container } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1B1B1F 0%, #161618 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F7 100%)',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{ 
          mt: 0, 
          mb: 0, 
          flexGrow: 1,
          px: { xs: 0, md: 0 },
          width: '100%',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
