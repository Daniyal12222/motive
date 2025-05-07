import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Chip, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Group as GroupIcon, 
  Sports as SportsIcon, 
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`school-tabpanel-${index}`}
      aria-labelledby={`school-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SchoolDetail = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { schools, coaches, groups, athletes, events } = useAppContext();
  const [school, setSchool] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (schools.length > 0) {
      const foundSchool = schools.find(school => school.id === parseInt(schoolId));
      setSchool(foundSchool);
    }
  }, [schoolId, schools]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
  const schoolEvents = events.filter(event => event.schoolId === school.id);

  // Format date function
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 3 }, maxWidth: '1200px', margin: '0 auto' }}>
      <Button 
        className='!text-[#1C7293] !text-lg'
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/Schools')}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      {/* School Info Section */}
      <Paper 
        elevation={3}
        sx={{ 
          padding: { xs: 2, md: 4 }, 
          marginBottom: 4, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f9fc 100%)',
          position: 'relative'
        }}
      >
        <Tooltip title="Edit School Information">
          <IconButton 
            sx={{ position: 'absolute', top: 10, right: 10 }}
            onClick={() => alert('Edit functionality would go here')}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Avatar 
              sx={{ 
                width: { xs: 100, md: 140 }, 
                height: { xs: 100, md: 140 }, 
                bgcolor: 'rgba(28, 114, 147, 0.1)', 
                border: '4px solid rgba(28, 114, 147, 0.2)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <SchoolIcon sx={{ fontSize: { xs: 50, md: 70 }, color: '#1C7293' }} />
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#1C7293">
              {school.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <Typography variant="body1" color="text.secondary">
                {school.address}, {school.city}, {school.state} {school.zipCode}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              <Chip 
                label={`${schoolCoaches.length} Coaches`} 
                icon={<PersonIcon />} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`${schoolGroups.length} Teams`} 
                icon={<GroupIcon />} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`${schoolAthletes.length} Athletes`} 
                icon={<SportsIcon />} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`${schoolEvents.length} Events`} 
                icon={<EventIcon />} 
                color="primary" 
                variant="outlined" 
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="school details tabs"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: '#1C7293',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1C7293',
              height: 3,
            }
          }}
        >
          <Tab label="Coaches" icon={<PersonIcon />} iconPosition="start" />
          <Tab label="Teams" icon={<GroupIcon />} iconPosition="start" />
          <Tab label="Events" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Athletes" icon={<SportsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Coaches Tab Panel */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          {schoolCoaches.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">No coaches available</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Add Coach</Button>
              </Paper>
            </Grid>
          ) : (
            schoolCoaches.map((coach) => (
              <Grid item xs={12} sm={6} md={4} key={coach.id}>
                <Card 
                  sx={{ 
                    borderRadius: 2, 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => alert(`View coach details for ${coach.name}`)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#1C7293', width: 60, height: 60, mr: 2 }}>
                      <PersonIcon sx={{ color: 'white', fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{coach.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {coach.title || 'Coach'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      {/* Teams Tab Panel */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {schoolGroups.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">No teams/groups available</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Create Team</Button>
              </Paper>
            </Grid>
          ) : (
            schoolGroups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => alert(`View team details for ${group.name}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: '#1C7293', mr: 2 }}>
                        <GroupIcon sx={{ color: 'white' }} />
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">{group.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                      <Chip 
                        size="small" 
                        label={`${athletes.filter(a => a.groupId === group.id).length} Athletes`} 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ color: '#1C7293' }}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      {/* Events Tab Panel */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          {schoolEvents.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">No events available</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Schedule Event</Button>
              </Paper>
            </Grid>
          ) : (
            schoolEvents.map((event) => (
              <Grid item xs={12} sm={6} key={event.id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    },
                    overflow: 'visible'
                  }}
                  onClick={() => alert(`View event details for ${event.title}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#1C7293', 
                          width: 70, 
                          height: 70, 
                          mr: 2,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transform: 'translateY(-15px)'
                        }}
                      >
                        <EventIcon sx={{ color: 'white', fontSize: 30 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{event.title}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          {event.description?.substring(0, 60) || "No description available"}
                          {event.description?.length > 60 ? "..." : ""}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.date)}
                      </Typography>
                    </Box>
                    
                    {event.time && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        {event.location || "No location specified"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      {/* Athletes Tab Panel */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2}>
          {schoolAthletes.length === 0 ? (
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5'
              }}>
                <SportsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">No athletes available</Typography>
                <Button variant="contained" sx={{ mt: 2 }}>Add Athlete</Button>
              </Paper>
            </Grid>
          ) : (
            schoolAthletes.map((athlete) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={athlete.id}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => alert(`View athlete details for ${athlete.name}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: '#1C7293', mr: 2 }}>
                        <SportsIcon sx={{ color: 'white' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{athlete.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {groups.find(g => g.id === athlete.groupId)?.name || 'No Team'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default SchoolDetail;
