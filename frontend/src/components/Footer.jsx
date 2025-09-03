// src/components/Footer.jsx
import React from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  IconButton,
  Link,
  Divider,
  useTheme
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  
  const socialLinks = [
    { icon: GitHub, url: "#", label: "GitHub" },
    { icon: LinkedIn, url: "#", label: "LinkedIn" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Email, url: "mailto:contact@trackademy.com", label: "Email" },
  ];

  const quickLinks = [
    { name: "About Us", url: "#" },
    { name: "Features", url: "#" },
    { name: "Pricing", url: "#" },
    { name: "Contact", url: "#" },
  ];

  const supportLinks = [
    { name: "Help Center", url: "#" },
    { name: "Documentation", url: "#" },
    { name: "API Reference", url: "#" },
    { name: "System Status", url: "#" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #161618 0%, #1B1B1F 100%)'
          : 'linear-gradient(135deg, #F6F6F7 0%, #EBEBEF 100%)',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  T
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Trackademy
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The all-in-one platform for students and faculty to manage academic work, 
                track progress, and collaborate seamlessly.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    component={Link}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.secondary',
                      background: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.03)',
                      '&:hover': {
                        color: 'primary.main',
                        background: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(129, 85, 198, 0.1)' 
                          : 'rgba(129, 85, 198, 0.08)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    aria-label={social.label}
                  >
                    <social.icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={6} md={2}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {supportLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  contact@trackademy.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  123 Education St, Learning City, LC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Trackademy. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
