// src/components/Footer.jsx
import React from "react";
import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        backgroundColor: "light.muted.background",
        borderTop: "1px solid",
        borderColor: "light.secondary",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="light.muted.text" align="center">
          © 2025 Trackademy. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
