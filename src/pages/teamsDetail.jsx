import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Stack, IconButton, Button,
  Chip, Divider, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';

const groupData = [
  {
    id: 1,
    name: 'Basketball Juniors',
    coach: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      university: 'Central University',
      title: 'Basketball Coach',
      image: 'https://picsum.photos/100/100?1',
    },
    teams: 1,
    athletes: [
      { id: 'A1', name: 'Michael Jordan' },
      { id: 'A2', name: 'Kobe Bryant' }
    ],
    events: 2
  },
  {
    id: 2,
    name: 'Soccer Stars',
    coach: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-987-6543',
      university: 'West College',
      title: 'Soccer Coach',
      image: 'https://picsum.photos/100/100?2',
    },
    teams: 2,
    athletes: [
      { id: 'B1', name: 'Lionel Messi' },
      { id: 'B2', name: 'Cristiano Ronaldo' }
    ],
    events: 3
  }
];

export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box p={4} sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          color: '#1C7293'
        }}
      >
        Back
      </Button>
      
      {!selectedGroup ? (
        <>
          <Typography 
            variant="h5" 
            className='p-3 rounded-lg !bg-gradient-to-r !from-[#1C7293] !to-[#065A82] text-white shadow-md mb-4 flex items-center'
            gutterBottom
          >
            <GroupsIcon sx={{ mr: 1 }} /> Teams List
          </Typography>
          <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Team Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Coach</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Athletes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Events</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupData.map((group) => (
                  <TableRow
                    key={group.id}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        bgcolor: '#f0f7ff',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                      }
                    }}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{group.name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={group.coach.image} sx={{ width: 30, height: 30, marginRight: 1 }} />
                        {group.coach.name}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<PersonIcon />} 
                        label={group.athletes.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={<EventIcon />} 
                        label={group.events} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
         

          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', sm: 'center' }} gap={2}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{`Coach ${selectedGroup.coach.name}`}</Typography>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1, fontSize: 20 }} />
                  {selectedGroup.coach.title}
                </Typography>

                <Stack spacing={1.5} mt={2}>
                  <Box display="flex" alignItems="center">
                    <EmailIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.coach.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.coach.university}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{selectedGroup.coach.phone}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Avatar
                src={selectedGroup.coach.image}
                alt={selectedGroup.coach.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid #f0f7ff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              mt={3}
              sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <Button 
                variant="contained" 
                startIcon={<SportsTennisIcon />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.teams} Teams
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<PersonIcon />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.athletes.length} Athletes
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                startIcon={<EventIcon />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.events} Events
              </Button>
            </Stack>

            {/* Athletes Section */}
            <Box mt={5}>
              <Typography 
                variant="h6" 
                sx={{ 
                  borderLeft: '4px solid #1C7293', 
                  pl: 2, 
                  py: 1,
                  mb: 3,
                  fontWeight: 'bold'
                }}
              >
                Team Athletes
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 3 
                }}
              >
                {selectedGroup.athletes.map((athlete) => (
                  <Card 
                    key={athlete.id} 
                    elevation={2}
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#1C7293', 
                          width: 50, 
                          height: 50,
                          fontWeight: 'bold'
                        }}
                      >
                        {athlete.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{athlete.name}</Typography>
                        <Chip
                          label={`ID: ${athlete.id}`}
                          size="small"
                          sx={{ mt: 0.5 }}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
