import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Stack, IconButton, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

  return (
    <Box p={4}>
      {!selectedGroup ? (
        <>
          <Typography variant="h5" className='p-2 rounded !bg-[#1C7293] text-white' gutterBottom>Teams List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Team Name</TableCell>
                  <TableCell>Coach</TableCell>
                  <TableCell>Athletes</TableCell>
                  <TableCell>Events</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupData.map((group) => (
                  <TableRow
                    key={group.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.coach.name}</TableCell>
                    <TableCell>{group.athletes.length}</TableCell>
                    <TableCell>{group.events}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedGroup(null)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4">{`Coach ${selectedGroup.coach.name}`}</Typography>
                <Typography variant="h6" color="primary">{selectedGroup.coach.title}</Typography>

                <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                  <Typography>{selectedGroup.coach.email}</Typography>
                  <Typography>{selectedGroup.coach.university}</Typography>
                  <Typography>{selectedGroup.coach.phone}</Typography>
                </Stack>
              </Box>
              <Avatar
                src={selectedGroup.coach.image}
                alt="coach"
                sx={{ width: 100, height: 100 }}
              />
            </Box>

            <Stack direction="row" spacing={2} mt={3}>
              <Button variant="outlined">{selectedGroup.teams} Teams</Button>
              <Button variant="outlined" color="error">{selectedGroup.athletes.length} Athletes</Button>
              <Button variant="outlined" color="primary">{selectedGroup.events} Events</Button>
            </Stack>

            {/* Athletes Section */}
            <Box mt={4}>
              <Typography variant="h6">Team Athletes</Typography>
              <Stack spacing={2} mt={2}>
                {selectedGroup.athletes.map((athlete) => (
                  <Paper key={athlete.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>{athlete.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight="bold">{athlete.name}</Typography>
                      <Typography variant="body2" color="text.secondary">ID: {athlete.id}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
}
