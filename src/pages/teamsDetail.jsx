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
      image: 'https://picsum.photos/80/80?1',
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
      image: 'https://picsum.photos/80/80?2',
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
    <Box p={2} sx={{ maxWidth: 900, margin: '0 auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        size="small"
        sx={{ 
          mb: 2,
          borderRadius: 2,
          color: '#1C7293'
        }}
      >
        Back
      </Button>
      
      {!selectedGroup ? (
        <>
          <Typography 
            variant="h6" 
            className='p-2 rounded-lg !bg-gradient-to-r !from-[#1C7293] !to-[#065A82] text-white shadow-md mb-3 flex items-center'
          >
            <GroupsIcon sx={{ mr: 1, fontSize: 18 }} /> Teams List
          </Typography>
          <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Team Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Coach</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Athletes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', py: 1 }}>Events</TableCell>
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
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }
                    }}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <TableCell sx={{ fontWeight: 'medium', py: 1 }}>{group.name}</TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={group.coach.image} sx={{ width: 24, height: 24, marginRight: 1 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>{group.coach.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Chip 
                        icon={<PersonIcon sx={{ fontSize: 16 }} />} 
                        label={group.athletes.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Chip 
                        icon={<EventIcon sx={{ fontSize: 16 }} />} 
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
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', sm: 'center' }} gap={1}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{`Coach ${selectedGroup.coach.name}`}</Typography>
                <Typography variant="subtitle1" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, fontSize: 16 }} />
                  {selectedGroup.coach.title}
                </Typography>

                <Stack spacing={1} mt={1}>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{selectedGroup.coach.university}</Typography>
                  </Box>
                </Stack>
              </Box>
              <Avatar
                src={selectedGroup.coach.image}
                alt={selectedGroup.coach.name}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  border: '3px solid #f0f7ff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1} 
              mt={2}
              sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <Button 
                variant="contained"
                size="small" 
                startIcon={<SportsTennisIcon sx={{ fontSize: 16 }} />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.teams} Teams
              </Button>
              <Button 
                variant="contained"
                size="small" 
                color="error" 
                startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.athletes.length} Athletes
              </Button>
              <Button 
                variant="contained"
                size="small" 
                color="secondary"
                startIcon={<EventIcon sx={{ fontSize: 16 }} />}
                sx={{ borderRadius: 2 }}
              >
                {selectedGroup.events} Events
              </Button>
            </Stack>

            {/* Athletes Section */}
            <Box mt={3}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  borderLeft: '3px solid #1C7293', 
                  pl: 1, 
                  py: 0.5,
                  mb: 2,
                  fontWeight: 'bold'
                }}
              >
                Team Athletes
              </Typography>
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 2 
                }}
              >
                {selectedGroup.athletes.map((athlete) => (
                  <Card 
                    key={athlete.id} 
                    elevation={1}
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#1C7293', 
                          width: 32, 
                          height: 32,
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}
                      >
                        {athlete.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{athlete.name}</Typography>
                        <Chip
                          label={`ID: ${athlete.id}`}
                          size="small"
                          sx={{ mt: 0.5, height: 20, '& .MuiChip-label': { fontSize: '0.65rem', px: 1 } }}
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
