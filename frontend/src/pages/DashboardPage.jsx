import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Grading as GradingIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  const statCards = [
    {
      title: 'Total Students',
      value: '1,245',
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#8155c6',
    },
    {
      title: 'Active Courses',
      value: '86',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#8155c6',
    },
    {
      title: 'Assignments Due',
      value: '12',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#8155c6',
    },
    {
      title: 'Graded Submissions',
      value: '157',
      icon: <GradingIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#8155c6',
    },
  ];

  const recentAssignments = [
    {
      title: 'Database Normalization Task',
      course: 'CS701',
      dueDate: '2025-10-15',
    },
    {
      title: 'Machine Learning Project',
      course: 'CS802',
      dueDate: '2025-10-20',
    },
    {
      title: 'Software Engineering Report',
      course: 'CS603',
      dueDate: '2025-10-18',
    },
    {
      title: 'Data Structures Assignment',
      course: 'CS501',
      dueDate: '2025-10-22',
    },
  ];

  return (
    <Box sx={{ backgroundColor: 'light.background', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Page Title */}
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 4,
            color: 'light.text',
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(129, 85, 198, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'light.text',
                      mb: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'light.muted.text',
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Results Overview Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 300 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    mb: 3,
                    color: 'light.text',
                    fontWeight: 600,
                  }}
                >
                  Results Overview
                </Typography>
                <Box 
                  sx={{ 
                    height: 200,
                    backgroundColor: 'light.muted.background',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px dashed ${''}`
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        gap: 2,
                        mb: 2,
                        justifyContent: 'center',
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 30,
                          height: 80,
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                        }}
                      />
                      <Box 
                        sx={{ 
                          width: 30,
                          height: 120,
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                          opacity: 0.7,
                        }}
                      />
                      <Box 
                        sx={{ 
                          width: 30,
                          height: 60,
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                          opacity: 0.5,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'light.muted.text' }}>
                      Bar Chart Placeholder
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: 300 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    mb: 3,
                    color: 'light.text',
                    fontWeight: 600,
                  }}
                >
                  Recent Activity
                </Typography>
                <Box 
                  sx={{ 
                    height: 200,
                    backgroundColor: 'light.muted.background',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 200,
                        height: 2,
                        backgroundColor: 'primary.main',
                        position: 'relative',
                        mb: 2,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -20,
                          left: 50,
                          width: 4,
                          height: 4,
                          backgroundColor: 'primary.main',
                          borderRadius: '50%',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -30,
                          left: 150,
                          width: 4,
                          height: 4,
                          backgroundColor: 'primary.main',
                          borderRadius: '50%',
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'light.muted.text' }}>
                      Line Chart Placeholder
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Assignments Table */}
        <Card>
          <CardContent>
            <Typography 
              variant="h5" 
              component="h3" 
              sx={{ 
                mb: 3,
                color: 'light.text',
                fontWeight: 600,
              }}
            >
              Recent Assignments
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        color: 'light.text',
                        backgroundColor: 'light.muted.background',
                      }}
                    >
                      Assignment Title
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        color: 'light.text',
                        backgroundColor: 'light.muted.background',
                      }}
                    >
                      Course
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        color: 'light.text',
                        backgroundColor: 'light.muted.background',
                      }}
                    >
                      Due Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAssignments.map((assignment, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'light.muted.background',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'light.text' }}>
                        {assignment.title}
                      </TableCell>
                      <TableCell sx={{ color: 'light.muted.text' }}>
                        {assignment.course}
                      </TableCell>
                      <TableCell sx={{ color: 'light.muted.text' }}>
                        {assignment.dueDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DashboardPage;