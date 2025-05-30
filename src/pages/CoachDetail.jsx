import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  IconButton,
  Checkbox,
} from "@mui/material";
import FormComponent from "../components/FormComponent";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";
import basketballImg from "../assets/basketball.jpg";
import soccerImg from "../assets/soccer.jpg";
import trackImg from "../assets/track.jpg";
import swimmingImg from "../assets/swimming.png";
import basketballIcon from "../assets/sportIcon/basketball.png";
import soccerIcon from "../assets/sportIcon/soccer.png";
import footballIcon from "../assets/sportIcon/american-football.png";
import baseballIcon from "../assets/sportIcon/baseball.png";
import swimmingIcon from "../assets/sportIcon/swimming.png";
import trackIcon from "../assets/sportIcon/track-and-field.png";
import golfIcon from "../assets/sportIcon/golf.png";
import hockeyIcon from "../assets/sportIcon/hockey.png";
import gymnasticsIcon from "../assets/sportIcon/gymnastic.png";
import badmintonIcon from "../assets/sportIcon/badminton.png";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import PoolIcon from "@mui/icons-material/Pool";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SportsHockeyIcon from "@mui/icons-material/SportsHockey";
import SportsIcon from "@mui/icons-material/Sports";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coach-tabpanel-${index}`}
      aria-labelledby={`coach-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function CoachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coaches, schools, groups, athletes, events } = useAppContext();
  const [coach, setCoach] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [addAthleteDialogOpen, setAddAthleteDialogOpen] = useState(false);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    schoolId: "",
    bio: "",
    avatar: null,
  });
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    sport: "",
    athletes: [],
  });
  const [newAthleteData, setNewAthleteData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    grade: "",
    position: "",
    jerseyNumber: "",
    teamId: "",
    notes: "",
    profileImage: null,
  });
  const [newEventData, setNewEventData] = useState({
    title: "",
    type: "practice",
    date: "",
    time: "",
    duration: 60,
    location: "",
    teamId: "",
    description: "",
  });

  // Array of common sports for the dropdown with icons
  const sportOptions = [
    {
      name: "Basketball",
      icon: basketballIcon,
      muiIcon: <SportsBasketballIcon />,
    },
    { name: "Soccer", icon: soccerIcon, muiIcon: <SportsSoccerIcon /> },
    { name: "Football", icon: footballIcon, muiIcon: <SportsFootballIcon /> },
    { name: "Baseball", icon: baseballIcon, muiIcon: <SportsBaseballIcon /> },
    { name: "Volleyball", icon: null, muiIcon: <SportsVolleyballIcon /> },
    { name: "Tennis", icon: null, muiIcon: <SportsTennisIcon /> },
    { name: "Swimming", icon: swimmingIcon, muiIcon: <PoolIcon /> },
    { name: "Track & Field", icon: trackIcon, muiIcon: <DirectionsRunIcon /> },
    { name: "Cross Country", icon: null, muiIcon: <DirectionsRunIcon /> },
    { name: "Golf", icon: golfIcon, muiIcon: <SportsIcon /> },
    { name: "Wrestling", icon: null, muiIcon: <SportsMmaIcon /> },
    { name: "Lacrosse", icon: null, muiIcon: <SportsIcon /> },
    { name: "Hockey", icon: hockeyIcon, muiIcon: <SportsHockeyIcon /> },
    { name: "Softball", icon: null, muiIcon: <SportsBaseballIcon /> },
    { name: "Gymnastics", icon: gymnasticsIcon, muiIcon: <SportsIcon /> },
    { name: "Badminton", icon: badmintonIcon, muiIcon: <SportsTennisIcon /> },
  ];

  useEffect(() => {
    // Find the coach by ID
    const coachId = parseInt(id);
    const foundCoach = coaches.find((c) => c.id === coachId);
    if (foundCoach) {
      setCoach(foundCoach);
      setEditFormData(foundCoach);
    }
  }, [id, coaches]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGroupChange = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const handleEventClick = (eventId) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  // Helper functions
  const getSchoolName = (schoolId) => {
    if (!schoolId) return "Not Assigned";
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  const getProfileImage = (specialty) => {
    const lowerSpecialty = specialty?.toLowerCase() || "";
    if (lowerSpecialty.includes("basketball")) return basketballImg;
    if (
      lowerSpecialty.includes("soccer") ||
      lowerSpecialty.includes("football")
    )
      return soccerImg;
    if (lowerSpecialty.includes("track") || lowerSpecialty.includes("running"))
      return trackImg;
    if (lowerSpecialty.includes("swim")) return swimmingImg;
    return basketballImg;
  };

  const getCoachGroups = () => {
    if (!coach) return [];
    return groups.filter((group) => group.coachId === coach.id);
  };

  const getGroupAthletes = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group || !group.athletes) return [];

    return group.athletes
      .map((athleteId) => {
        return athletes.find((a) => a.id === athleteId);
      })
      .filter(Boolean);
  };

  const getGroupEvents = (groupId) => {
    return events.filter((event) => event.groupId === groupId);
  };

  const getAttendanceCount = (event) => {
    if (!event.attendance) return 0;
    return Object.values(event.attendance).filter((attended) => attended)
      .length;
  };

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData({
        ...editFormData,
        avatar: e.target.files[0],
      });
    }
  };

  const handleSubmitEdit = () => {
    // Handle form submission
    handleCloseEditDialog();
  };

  const handleOpenAddTeamDialog = () => {
    setAddTeamDialogOpen(true);
  };

  const handleCloseAddTeamDialog = () => {
    setAddTeamDialogOpen(false);
    setNewTeamData({
      name: "",
      description: "",
      sport: "",
      athletes: [],
    });
  };

  const handleTeamFormChange = (e) => {
    setNewTeamData({
      ...newTeamData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNewTeam = () => {
    // Implementation for adding a new team
    console.log("Submitting new team:", newTeamData);
    handleCloseAddTeamDialog();
  };

  const handleOpenAddAthleteDialog = () => {
    setAddAthleteDialogOpen(true);
  };

  const handleCloseAddAthleteDialog = () => {
    setAddAthleteDialogOpen(false);
    setNewAthleteData({
      name: "",
      email: "",
      phone: "",
      age: "",
      grade: "",
      position: "",
      jerseyNumber: "",
      teamId: "",
      notes: "",
      profileImage: null,
    });
  };

  const handleOpenAddEventDialog = () => {
    setAddEventDialogOpen(true);
  };

  const handleCloseAddEventDialog = () => {
    setAddEventDialogOpen(false);
    setNewEventData({
      title: "",
      type: "practice",
      date: "",
      time: "",
      duration: 60,
      location: "",
      teamId: "",
      description: "",
    });
  };

  const handleSubmitNewAthlete = (athleteData) => {
    // Implementation for adding a new athlete
    console.log("Submitting new athlete:", athleteData);
    handleCloseAddAthleteDialog();
  };

  const handleSubmitNewEvent = (eventData) => {
    // Implementation for adding a new event
    console.log("Submitting new event:", eventData);
    handleCloseAddEventDialog();
  };

  if (!coach) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5">Coach not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/coaches")}
          sx={{ mt: 2 }}
        >
          Back to Coaches
        </Button>
      </Container>
    );
  }

  const coachGroups = getCoachGroups();
  const totalAthletes = coachGroups.reduce((sum, group) => {
    return sum + (group.athletes?.length || 0);
  }, 0);
  const totalEvents = coachGroups.reduce((sum, group) => {
    return sum + getGroupEvents(group.id).length;
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      {/* Navigation and Edit buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Button
          className="!text-[#1C7293] !text-base"
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate("/coaches")}
          size="small"
        >
          Back
        </Button>
        <Button
          variant="outlined"
          size="small"
          className="!bg-[#1C7293] !text-white !text-sm !px-3 !py-1 !font-medium !rounded-md !transition-all"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={handleOpenEditDialog}
          sx={{ borderRadius: "6px", textTransform: "none", px: 1.5 }}
        >
          Edit Coach
        </Button>
      </Box>

      {/* Coach Profile Card */}
      <Card
        elevation={1}
        sx={{
          mb: 2,
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container>
            <Grid item xs={12} md={8} sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: { xs: 1, md: 0 },
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ mb: 0.5, fontSize: "1.2rem", fontWeight: 600 }}
                  >
                    {coach.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ fontSize: "0.9rem" }}
                  >
                    {coach.specialty} Coach
                  </Typography>
                </Box>
                <Box sx={{ ml: "auto" }}>
                  <Avatar
                    src={getProfileImage(coach.specialty)}
                    alt={coach.specialty}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid rgba(28, 114, 147, 0.2)",
                    }}
                  />
                </Box>
              </Box>

              {/* Coach Bio */}
              <Box
                sx={{
                  mb: 1.5,
                  mt: 1,
                  p: 1,
                  borderRadius: "6px",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, fontSize: "0.85rem" }}
                  >
                    Bio
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-line",
                  }}
                >
                  {coach.bio ||
                    "No bio information available. Add a bio to help athletes and parents learn more about this coach's background and experience."}
                </Typography>
              </Box>

              <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
                    <EmailIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{coach.email}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {coach.phone || "No phone number"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.3 }}>
                    <SchoolIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {getSchoolName(coach.schoolId)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  icon={<GroupIcon sx={{ fontSize: 16 }} />}
                  label={`${coachGroups.length} Teams`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Teams Section */}
      <Card
        elevation={1}
        sx={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.04)",
          mb: 4,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            background: "linear-gradient(to right, #1C7293, #065a82)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontWeight: "medium",
              display: "flex",
              alignItems: "center",
            }}
          >
            <GroupIcon sx={{ mr: 1, fontSize: 18 }} /> Teams coached by{" "}
            {coach.name} ({coachGroups.length})
          </Typography>
          <Button
            variant="contained"
            className="!text-[#1C7293] !bg-white !rounded-md"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={handleOpenAddTeamDialog}
            size="small"
            sx={{ fontSize: "0.8rem", py: 0.5, textTransform: "none" }}
          >
            Add Team
          </Button>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {coachGroups.length > 0 ? (
            coachGroups.map((group, index) => (
              <Accordion
                key={group.id}
                expanded={expandedGroup === group.id}
                onChange={() => handleGroupChange(group.id)}
                sx={{
                  mb: 0,
                  boxShadow: "none",
                  borderBottom:
                    index !== coachGroups.length - 1
                      ? "1px solid rgba(0,0,0,0.04)"
                      : "none",
                  "&:before": { display: "none" },
                }}
                id={`group-${group.id}`}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 2,
                    minHeight: 56,
                    "&.Mui-expanded": { minHeight: 56 },
                    "& .MuiAccordionSummary-content": { margin: "12px 0" },
                    "&:hover": { bgcolor: "rgba(28, 114, 147, 0.02)" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: "0.95rem", fontWeight: 500 }}
                    >
                      {group.name}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Chip
                        size="small"
                        icon={<PersonIcon sx={{ fontSize: 14 }} />}
                        label={`${group.athletes?.length || 0} Athletes`}
                        color="primary"
                        variant="outlined"
                        sx={{
                          height: 24,
                          "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                        }}
                      />
                      <Chip
                        size="small"
                        icon={<EventIcon sx={{ fontSize: 14 }} />}
                        label={`${getGroupEvents(group.id).length} Events`}
                        color="secondary"
                        variant="outlined"
                        sx={{
                          height: 24,
                          "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                        }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, py: 1.5 }}>
                  {/* Tabs for Athletes and Events */}
                  <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                    <Tabs
                      value={tabValue || "athletes"}
                      onChange={(e, newValue) => setTabValue(newValue)}
                      aria-label="team tabs"
                      sx={{
                        minHeight: 40,
                        "& .MuiTab-root": {
                          minHeight: 40,
                          py: 0.5,
                          textTransform: "none",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        },
                        "& .Mui-selected": {
                          color: "#1C7293 !important"
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#1C7293"
                        }
                      }}
                    >
                      <Tab
                        icon={<PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                        iconPosition="start"
                        label="Athletes"
                        value="athletes"
                      />
                      <Tab
                        icon={<EventIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                        iconPosition="start"
                        label="Events"
                        value="events"
                      />
                    </Tabs>
                  </Box>

                  {/* Athletes Tab Content */}
                  {(tabValue || "athletes") === "athletes" && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> Athletes
                        </Typography>
                        <Button
                          variant="contained"
                          className="!bg-[#1C7293] !text-white"
                          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                          onClick={handleOpenAddAthleteDialog}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            textTransform: "none",
                          }}
                        >
                          <Typography
                            component="p"
                            sx={{ display: { xs: "none", md: "block", fontSize: "0.7rem" } }}
                            className="!text-white"
                          >
                            Add Athlete
                          </Typography>
                        </Button>
                      </Box>

                      {/* Athletes Table */}
                      {getGroupAthletes(group.id).length > 0 ? (
                        <TableContainer
                          component={Paper}
                          variant="outlined"
                          sx={{
                            mb: 3,
                            borderRadius: "8px",
                            overflow: "x-auto",
                          }}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                                <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                  Name
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                  Email
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                  Sport
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                  Position/Events
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getGroupAthletes(group.id).map((athlete) => (
                                <TableRow
                                  key={athlete.id}
                                  sx={{
                                    "&:hover": {
                                      bgcolor: "rgba(28, 114, 147, 0.02)",
                                    },
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    navigate(`/athletes/${athlete.id}`)
                                  }
                                >
                                  <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                    {athlete.name}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                    {athlete.email}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                    {athlete.sport}
                                  </TableCell>
                                  <TableCell sx={{ fontSize: "0.8rem", py: 1 }}>
                                    {athlete.position ||
                                      (athlete.events &&
                                        athlete.events.join(", ")) ||
                                      "-"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box
                          sx={{
                            py: 2,
                            px: 3,
                            textAlign: "center",
                            bgcolor: "rgba(0,0,0,0.01)",
                            borderRadius: "8px",
                            border: "1px dashed rgba(0,0,0,0.1)",
                            mb: 3,
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            No athletes in this team
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}

                  {/* Events Tab Content */}
                  {(tabValue || "athletes") === "events" && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <EventIcon sx={{ mr: 1, fontSize: 18 }} /> Events
                        </Typography>
                        <Button
                          variant="contained"
                          className="!bg-[#1C7293] !text-white"
                          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                          onClick={handleOpenAddEventDialog}
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            textTransform: "none",
                          }}
                        >
                          <Typography
                            component="p"
                            sx={{ display: { xs: "none", md: "block", fontSize: "0.7rem" } }}
                            className="!text-white"
                          >
                            Add Event
                          </Typography>
                        </Button>
                      </Box>

                      {/* Events List */}
                      {getGroupEvents(group.id).length > 0 ? (
                        <Box>
                          {getGroupEvents(group.id)
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((event) => (
                              <Accordion
                                key={event.id}
                                expanded={!!expandedEvents[event.id]}
                                onChange={() => handleEventClick(event.id)}
                                sx={{
                                  mb: 1,
                                  backgroundColor: "#f9fafb",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                  borderRadius: "8px !important",
                                  "&:before": { display: "none" },
                                  "&.Mui-expanded": {
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                    borderLeft: "3px solid #1C7293",
                                  },
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={
                                    <ExpandMoreIcon sx={{ fontSize: 20 }} />
                                  }
                                  sx={{
                                    minHeight: 48,
                                    "&.Mui-expanded": { minHeight: 48 },
                                    "& .MuiAccordionSummary-content": {
                                      margin: "12px 0",
                                    },
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(28, 114, 147, 0.04)",
                                    },
                                    borderRadius: "8px",
                                  }}
                                >
                                  <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                      <Typography
                                        variant="subtitle2"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: "0.85rem",
                                        }}
                                      >
                                        {event.title}
                                      </Typography>
                                      <Box sx={{display: "flex", alignItems: "center", gap: 1 , mt: 0.2}}>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: "text.secondary",
                                          fontSize: "0.75rem",
                                          display: "block",
                                        }}
                                        >
                                        {event.date}
                                      </Typography>
                                      <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <TimeIcon
                                            fontSize="small"
                                            sx={{
                                              mr: 0.5,
                                              color: "text.secondary",
                                              fontSize: 16,
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontSize: "0.75rem" }}
                                          >
                                            {event.startTime} - {event.endTime}
                                          </Typography>
                                        </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "flex-end",
                                          gap: 1.5,
                                        }}
                                      >
                                        {event.attendance && (
                                          <Chip
                                            size="small"
                                            icon={
                                              <PersonIcon
                                                sx={{ fontSize: 14 }}
                                              />
                                            }
                                            label={`${getAttendanceCount(
                                              event
                                            )}/${
                                              getGroupAthletes(group.id).length
                                            }`}
                                            color={
                                              getAttendanceCount(event) > 0
                                                ? "success"
                                                : "error"
                                            }
                                            variant="outlined"
                                            sx={{
                                              height: 24,
                                              "& .MuiChip-label": {
                                                px: 1,
                                                fontSize: "0.75rem",
                                              },
                                            }}
                                          />
                                        )}
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </AccordionSummary>

                                {/* Event Details */}
                                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                  <Divider sx={{ my: 1 }} />
                                  <Grid container>
                                    <Grid
                                      item
                                      sx={{ width: "100%", height: "auto" }}
                                    >
                                      <Paper
                                        className="!w-full"
                                        sx={{
                                          p: 2,
                                          borderRadius: "8px",
                                          backgroundColor: "#ffffff",
                                          border: "1px solid rgba(0,0,0,0.04)",
                                          boxShadow: "none",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 2,
                                          }}
                                        >
                                          <EventIcon
                                            sx={{
                                              color: "primary.main",
                                              mr: 1.5,
                                              fontSize: 20,
                                            }}
                                          />
                                          <Typography
                                            variant="subtitle1"
                                            sx={{
                                              fontWeight: 500,
                                              fontSize: "0.95rem",
                                            }}
                                          >
                                            Event Details
                                          </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                          <Grid item xs={12} sm={6}>
                                            <List dense sx={{ p: 0, mt: 0 }}>
                                              <ListItem sx={{ py: 1, px: 0 }}>
                                                <ListItemText
                                                  primary="Event Name"
                                                  secondary={event.title}
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                  secondaryTypographyProps={{
                                                    variant: "body2",
                                                    fontWeight: 500,
                                                    fontSize: "0.85rem",
                                                  }}
                                                />
                                              </ListItem>
                                              <ListItem sx={{  px: 0 }}>
                                                <ListItemText
                                                  primary="Date"
                                                  secondary={event.date}
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                  secondaryTypographyProps={{
                                                    variant: "body2",
                                                    fontSize: "0.85rem",
                                                  }}
                                                />
                                              </ListItem>
                                              <ListItem sx={{ py: 1, px: 0 , mt: 0.3}}>
                                                <ListItemText
                                                  primary="Time"
                                                  secondary={`${event.startTime} - ${event.endTime}`}
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                  secondaryTypographyProps={{
                                                    variant: "body2",
                                                    fontSize: "0.85rem",
                                                  }}
                                                />
                                              </ListItem>
                                            </List>
                                          </Grid>
                                          <Grid item xs={12} sm={6}>
                                            <List dense sx={{ p: 0 ,}}>
                                              <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                  primary="Location"
                                                  secondary={
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        mt: 0.5,
                                                      }}
                                                    >
                                                      <LocationIcon
                                                        fontSize="small"
                                                        sx={{
                                                          mr: 0.5,
                                                          color:
                                                            "text.secondary",
                                                          fontSize: 16,
                                                        }}
                                                      />
                                                      <Typography
                                                        variant="body2"
                                                        sx={{
                                                          fontSize: "0.85rem",
                                                        }}
                                                      >
                                                        {event.location ||
                                                          "No location specified"}
                                                      </Typography>
                                                    </Box>
                                                  }
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                />
                                              </ListItem>
                                              <ListItem sx={{ py: 1, px: 0 }}>
                                                <ListItemText
                                                  primary="Attendance"
                                                  secondary={
                                                    event.attendance ? (
                                                      <Box
                                                        sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          mt: 0.5,
                                                        }}
                                                      >
                                                        {getAttendanceCount(
                                                          event
                                                        ) > 0 ? (
                                                          <CheckCircleIcon
                                                            fontSize="small"
                                                            sx={{
                                                              mr: 0.5,
                                                              color:
                                                                "success.main",
                                                              fontSize: 16,
                                                            }}
                                                          />
                                                        ) : (
                                                          <CancelIcon
                                                            fontSize="small"
                                                            sx={{
                                                              mr: 0.5,
                                                              color:
                                                                "error.main",
                                                              fontSize: 16,
                                                            }}
                                                          />
                                                        )}
                                                        <Typography
                                                          variant="body2"
                                                          sx={{
                                                            fontSize: "0.85rem",
                                                          }}
                                                        >
                                                          {`${getAttendanceCount(
                                                            event
                                                          )}/${
                                                            getGroupAthletes(
                                                              group.id
                                                            ).length
                                                          } athletes present`}
                                                        </Typography>
                                                      </Box>
                                                    ) : (
                                                      "Attendance not recorded"
                                                    )
                                                  }
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                  secondaryTypographyProps={{
                                                    variant: "body2",
                                                    fontSize: "0.85rem",
                                                  }}
                                                />
                                              </ListItem>
                                              <ListItem sx={{ py: 1, px: 0 }}>
                                                <ListItemText
                                                  primary="Note"
                                                  secondary={
                                                    event.description ||
                                                    "No notes available"
                                                  }
                                                  primaryTypographyProps={{
                                                    variant: "caption",
                                                    color: "text.secondary",
                                                    fontSize: "0.75rem",
                                                  }}
                                                  secondaryTypographyProps={{
                                                    variant: "body2",
                                                    fontSize: "0.85rem",
                                                  }}
                                                />
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
                        <Box
                          sx={{
                            py: 2,
                            px: 3,
                            textAlign: "center",
                            bgcolor: "rgba(0,0,0,0.01)",
                            borderRadius: "8px",
                            border: "1px dashed rgba(0,0,0,0.1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            No events scheduled for this team
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box
              sx={{
                py: 3,
                px: 3,
                textAlign: "center",
                bgcolor: "rgba(0,0,0,0.01)",
                margin: 2,
                borderRadius: "8px",
                border: "1px dashed rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "0.9rem", mb: 1 }}
              >
                This coach doesn't have any teams assigned yet
              </Typography>
              <Button
                variant="contained"
                className="!bg-[#1C7293] !text-white"
                startIcon={<AddIcon />}
                onClick={handleOpenAddTeamDialog}
                size="small"
                sx={{ mt: 1, fontSize: "0.8rem", textTransform: "none" }}
              >
                Add Team
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Edit Coach Dialog */}
      <FormComponent
        title="Edit Coach Profile"
        isDialog={true}
        open={editDialogOpen}
        handleClose={handleCloseEditDialog}
        onSubmit={handleSubmitEdit}
        submitButtonText="Save Changes"
        showAvatar={true}
        initialValues={{
          ...editFormData,
          profileImage: editFormData.avatar
        }}
        fields={[
          {
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
            required: true,
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
          },
          {
            name: "specialty",
            label: "Specialty",
            type: "select",
            options: sportOptions.map(sport => ({
              value: sport.name,
              label: sport.name,
              icon: sport.icon
            })),
          },
          {
            name: "schoolId",
            label: "School",
            type: "select",
            options: schools.map(school => ({
              value: school.id,
              label: school.name
            })),
          },
          {
            name: "bio",
            label: "Biography",
            type: "textarea",
            width: 12,
          },
        ]}
      />

      {/* Add Team Dialog */}
      <FormComponent
        title="Add New Team"
        isDialog={true}
        open={addTeamDialogOpen}
        handleClose={handleCloseAddTeamDialog}
        onSubmit={handleSubmitNewTeam}
        submitButtonText="Create Team"
        initialValues={newTeamData}
        fields={[
          {
            name: "name",
            label: "Team Name",
            required: true,
          },
          {
            name: "sport",
            label: "Sport",
            type: "select",
            required: true,
            options: sportOptions.map(sport => ({
              value: sport.name,
              label: sport.name,
              icon: sport.icon
            })),
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            width: 12,
          },
        ]}
      />

      {/* Add Athlete Dialog */}
      <FormComponent
        title="Add New Athlete"
        isDialog={true}
        open={addAthleteDialogOpen}
        handleClose={handleCloseAddAthleteDialog}
        onSubmit={handleSubmitNewAthlete}
        submitButtonText="Add Athlete"
        showAvatar={true}
        initialValues={newAthleteData}
        fields={[
          {
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            name: "email",
            label: "Email Address",
            type: "email",
          },
          {
            name: "phone",
            label: "Phone Number",
            type: "tel",
          },
          {
            name: "age",
            label: "Age",
            type: "number",
            width: 6,
          },
          {
            name: "grade",
            label: "Grade",
            type: "select",
            width: 6,
            options: [
              { value: "9", label: "9th Grade" },
              { value: "10", label: "10th Grade" },
              { value: "11", label: "11th Grade" },
              { value: "12", label: "12th Grade" },
            ],
          },
          {
            name: "position",
            label: "Position",
            width: 6,
          },
          {
            name: "jerseyNumber",
            label: "Jersey Number",
            type: "number",
            width: 6,
          },
          {
            name: "teamId",
            label: "Team",
            type: "select",
            required: true,
            options: getCoachGroups().map(group => ({
              value: group.id,
              label: group.name
            })),
          },
          {
            name: "notes",
            label: "Notes",
            type: "textarea",
            width: 12,
          },
        ]}
      />

      {/* Add Event Dialog */}
      <FormComponent
        title="Add New Event"
        isDialog={true}
        open={addEventDialogOpen}
        handleClose={handleCloseAddEventDialog}
        onSubmit={handleSubmitNewEvent}
        submitButtonText="Create Event"
        initialValues={newEventData}
        fields={[
          {
            name: "title",
            label: "Event Title",
            required: true,
          },
          {
            name: "type",
            label: "Event Type",
            type: "select",
            required: true,
            options: [
              { value: "practice", label: "Practice" },
              { value: "game", label: "Game" },
              { value: "tournament", label: "Tournament" },
              { value: "meeting", label: "Meeting" },
              { value: "other", label: "Other" },
            ],
          },
          {
            name: "date",
            label: "Event Date",
            type: "date",
            required: true,
            width: 6,
          },
          {
            name: "time",
            label: "Event Time",
            type: "time",
            required: true,
            width: 6,
          },
          {
            name: "duration",
            label: "Duration (minutes)",
            type: "number",
            width: 6,
          },
          {
            name: "location",
            label: "Location",
            width: 6,
          },
          {
            name: "teamId",
            label: "Team",
            type: "select",
            required: true,
            options: getCoachGroups().map(group => ({
              value: group.id,
              label: group.name
            })),
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            width: 12,
          },
        ]}
      />
    </Container>
  );
}

export default CoachDetail;
