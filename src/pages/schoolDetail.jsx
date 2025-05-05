import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Grid, Avatar, Divider, Chip } from '@mui/material';
import { Person as PersonIcon, School as SchoolIcon, Group as GroupIcon, Sports as SportsIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import {
    ArrowBack as ArrowBackIcon,
  } from '@mui/icons-material';

const SchoolDetail = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { schools, coaches, groups, athletes } = useAppContext();
  const [school, setSchool] = useState(null);

  useEffect(() => {
    if (schools.length > 0) {
      const foundSchool = schools.find(school => school.id === parseInt(schoolId));
      setSchool(foundSchool);
    }
  }, [schoolId, schools]);

  if (!school) {
    return (
      <Box sx={{ textAlign: 'center', padding: 5 }}>
        <Typography variant="h4" color="textSecondary" gutterBottom>School Not Found</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We couldn't find a school with the provided ID. Please check the URL or go back to the schools list.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/schools')}
          sx={{ marginTop: 3 }}
        >
          Back to Schools
        </Button>
      </Box>
    );
  }

  const schoolCoaches = coaches.filter(coach => coach.schoolId === school.id);
  const schoolGroups = groups.filter(group => schoolCoaches.some(coach => coach.id === group.coachId));
  const schoolAthletes = athletes.filter(athlete => schoolGroups.some(group => group.id === athlete.groupId));

  return (
    <Box sx={{ padding: 3 }}>
        <Button 
        className='!text-[#1C7293] !text-lg'
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/Schools')}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      {/* School Info Section */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Avatar sx={{ width: 120, height: 120, bgcolor: 'rgba(28, 114, 147, 0.2)', marginBottom: 2 }}>
              <SchoolIcon sx={{ fontSize: 60, color: '#1C7293' }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{school.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{school.address}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{school.city}, {school.state} {school.zipCode}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{school.phone}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{school.email}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Coaches Section */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Coaches</Typography>
        {schoolCoaches.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No coaches available</Typography>
        ) : (
          schoolCoaches.map((coach) => (
            <Box key={coach.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Avatar sx={{ bgcolor: '#1C7293', marginRight: 2 }}>
                <PersonIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="body1" fontWeight="bold">{coach.name}</Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* Groups Section */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Teams/Groups</Typography>
        {schoolGroups.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No teams/groups available</Typography>
        ) : (
          schoolGroups.map((group) => (
            <Box key={group.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip icon={<GroupIcon />} label={group.name} color="primary" variant="outlined" />
            </Box>
          ))
        )}
      </Paper>

      {/* Athletes Section */}
      <Paper sx={{ padding: 3, marginBottom: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Athletes</Typography>
        {schoolAthletes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No athletes available</Typography>
        ) : (
          schoolAthletes.map((athlete) => (
            <Box key={athlete.id} sx={{ display: 'flex', alignItems: 'center', mb: 2, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Avatar sx={{ bgcolor: '#1C7293', marginRight: 2 }}>
                <SportsIcon sx={{ color: 'white' }} />
              </Avatar>
              <Typography variant="body1" fontWeight="bold">{athlete.name}</Typography>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default SchoolDetail;
