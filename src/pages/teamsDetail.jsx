import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Sports as SportsIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

//  teamsDetail dammy data
const teams = [
  {
    id: 1,
    name: 'Team 1',
    sport: 'Football',
    coachId: 1,
    schoolId: 1,
    athletes: [1, 2, 3],
    events: [1, 2, 3], 

  },
];

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, coaches, athletes, events, schools } = useAppContext();
  const [group, setGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const groupId = parseInt(id);
    const foundGroup = groups.find(g => g.id === groupId);
    setGroup(foundGroup || teams[0]);
  }, [id, groups]);

  const getCoach = (coachId) => coaches.find(c => c.id === coachId);
  const getSchool = (schoolId) => schools.find(s => s.id === schoolId);
  const getGroupAthletes = () => {
    if (!group || !group.athletes) return [];
    return group.athletes
      .map(aid => athletes.find(a => a.id === aid))
      .filter(Boolean);
  };
  const getGroupEvents = () => events.filter(e => e.groupId === group?.id);

  if (!group) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5">Team not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Back
        </Button>
      </Container>
    );
  }

  const coach = getCoach(group.coachId);
  const school = getSchool(group.schoolId);
  const groupAthletes = getGroupAthletes();
  const groupEvents = getGroupEvents();

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Button
          className="!text-[#1C7293] !text-base"
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          size="small"
        >
          Back
        </Button>
      </Box>

      {/* Team Profile Card */}
      <Card elevation={1} sx={{ mb: 2, borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container>
            <Grid item xs={12} md={8} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1, md: 0 }, justifyContent: 'space-between', width: '100%' }}>
                <Box>
                  <Typography variant="h5" sx={{ mb: 0.5, fontSize: '1.2rem', fontWeight: 600 }}>{group.name}</Typography>
                  <Typography variant="subtitle1" className='!text-[#1C7293]' sx={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                    <SportsIcon sx={{ width: 18, height: 18, mr: 0.75 }} />
                    {group.sport || 'Sport'} Team
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Avatar sx={{ width: 64, height: 64, border: '2px solid rgba(28, 114, 147, 0.2)' }}>
                    <GroupIcon />
                  </Avatar>
                </Box>
              </Box>
              <Grid container spacing={1} sx={{ mb: 1.5, mt: 1 }} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                    <SchoolIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{school ? school.name : 'No School'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">Coach: {coach ? coach.name : 'No Coach'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                    <GroupIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{groupAthletes.length} Athletes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{groupEvents.length} Events</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for Athletes and Events */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          aria-label="team tabs"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.85rem',
              textTransform: 'none',
              py: 0.5,
              px: 2,
              '&.Mui-selected': {
                color: '#1C7293 !important',
              },
             "& .MuiTabs-indicator": {
                          backgroundColor: "#1C7293 !important"
                        }
            },
          }}
        >
          <Tab label="Athletes" id="team-tab-0" />
          <Tab label="Events" id="team-tab-1" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {tabValue === 0 && (
        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> Athletes
            </Typography>
            <Button
              variant="contained"
              className="!bg-[#1C7293] !text-white"
              startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
              onClick={() => navigate(`/add-athlete?groupId=${group.id}`)}
              size="small"
              sx={{ fontSize: '0.75rem', py: 0.5, textTransform: 'none' }}
            >
              <Typography component="p" sx={{ display: { xs: 'none', md: 'block', fontSize: '0.7rem' } }} className="!text-white">
                Add Athlete
              </Typography>
            </Button>
          </Box>
          {groupAthletes.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: '8px', overflow: 'x-auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Name</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Email</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Sport</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Position/Events</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupAthletes.map(athlete => (
                    <TableRow
                      key={athlete.id}
                      sx={{ '&:hover': { bgcolor: 'rgba(28, 114, 147, 0.02)' }, cursor: 'pointer' }}
                      onClick={() => navigate(`/athletes/${athlete.id}`)}
                    >
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{athlete.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{athlete.email}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{athlete.sport}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{athlete.position || (athlete.events && athlete.events.join(', ')) || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 2, px: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.01)', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.1)', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                No athletes in this team
              </Typography>
            </Box>
          )}
        </Paper>
      )}
      {tabValue === 1 && (
        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Events
          </Typography>
          {groupEvents.length > 0 ? (
            <Box>
              {groupEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <Accordion key={event.id} sx={{ mb: 1, backgroundColor: '#f9fafb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderRadius: '8px !important', '&:before': { display: 'none' }, '&.Mui-expanded': { boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderLeft: '3px solid #1C7293' } }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />}
                      sx={{ minHeight: 48, '&.Mui-expanded': { minHeight: 48 }, '& .MuiAccordionSummary-content': { margin: '12px 0' }, '&:hover': { backgroundColor: 'rgba(28, 114, 147, 0.04)' }, borderRadius: '8px' }}
                    >
                      <Grid container alignItems="center">
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{event.title}</Typography>
                          <Box component="div" className='flex items-end gap-2'>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: 'block' }}>{event.date}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{event.startTime} - {event.endTime}</Typography>
                            </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                            
                            {event.attendance && (
                              <Chip
                                size="small"
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                label={`${event.attendance ? Object.values(event.attendance).filter(Boolean).length : 0}/${groupAthletes.length}`}
                                color={event.attendance && Object.values(event.attendance).filter(Boolean).length > 0 ? 'success' : 'error'}
                                variant="outlined"
                                sx={{ height: 24, '& .MuiChip-label': { px: 1, fontSize: '0.75rem' } }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                      <Divider sx={{ my: 1 }} />
                      <Grid container>
                        <Grid item sx={{ width: '100%', height: 'auto' }}>
                          <Paper className="!w-full" sx={{ p: 2, borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <EventIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 20 }} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>Event Details</Typography>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <List dense sx={{ p: 0 }}>
                                  <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Event Name" secondary={event.title} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }} secondaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontSize: '0.85rem' }} />
                                  </ListItem>
                                  <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Date" secondary={event.date} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }} secondaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem' }} />
                                  </ListItem>
                                  <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Time" secondary={`${event.startTime} - ${event.endTime}`} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }} secondaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem' }} />
                                  </ListItem>
                                </List>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <List dense sx={{ p: 0 }}>
                                  <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Location" secondary={<Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}><LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} /><Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{event.location || 'No location specified'}</Typography></Box>} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }} />
                                  </ListItem>
                                  <ListItem sx={{ py: 1, px: 0 }}>
                                    <ListItemText primary="Attendance" secondary={event.attendance ? (<Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>{Object.values(event.attendance).filter(Boolean).length > 0 ? (<CheckCircleIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main', fontSize: 16 }} />) : (<CancelIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main', fontSize: 16 }} />)}<Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{`${Object.values(event.attendance).filter(Boolean).length}/${groupAthletes.length} athletes present`}</Typography></Box>) : ('Attendance not recorded')} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }} secondaryTypographyProps={{ variant: 'body2', fontSize: '0.85rem' }} />
                                  </ListItem>
                                </List>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No events for this team
            </Typography>
          )}
        </Paper>
      )}
    </Container>
  );
}
