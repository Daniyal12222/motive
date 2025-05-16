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
    // Reset form data
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
    // Here you would add logic to create a new team
    // For example, dispatch an action to add the team to the store
    // or make an API call to create the team
    console.log("Creating new team:", {
      ...newTeamData,
      coachId: coach.id,
    });

    // Close the dialog after submission
    handleCloseAddTeamDialog();
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
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
                          onClick={() =>
                            navigate(`/add-athlete?groupId=${group.id}`)
                          }
                          size="small"
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            textTransform: "none",
                          }}
                        >
                          <Typography
                            component="p"
                            sx={{ display: { xs: "none", md: "block"  , fontSize: "0.7rem" }  }}
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
                                            <List dense sx={{ p: 0 }}>
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
                                              <ListItem sx={{ py: 1, px: 0 }}>
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
                                              <ListItem sx={{ py: 1, px: 0 }}>
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
                                            <List dense sx={{ p: 0 }}>
                                              <ListItem sx={{ py: 1, px: 0 }}>
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
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            bgcolor: "#1C7293",
            color: "white",
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Edit Coach Profile
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
            py: 2,
          }}
        >
          <Grid container spacing={2} sx={{ maxWidth: "100%" }}>
            <Grid item xs={12} sx={{ width: "100%" }}>
              <Box
                sx={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ position: "relative", mb: 1 }}>
                  <Avatar
                    src={
                      editFormData.avatar
                        ? URL.createObjectURL(editFormData.avatar)
                        : getProfileImage(editFormData.specialty)
                    }
                    alt={editFormData.name}
                    sx={{ width: 80, height: 80, boxShadow: 2 }}
                  />
                  <IconButton
                    component="label"
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: -5,
                      bgcolor: "rgba(255,255,255,0.9)",
                      border: "1px solid #1C7293",
                      color: "#1C7293",
                      "&:hover": {
                        bgcolor: "#1C7293",
                        color: "white",
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                </Box>
                {editFormData.avatar && (
                  <Typography variant="caption" color="textSecondary">
                    {editFormData.avatar.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editFormData.name}
                onChange={handleFormChange}
                required
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: 1.5, fontSize: "0.825rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleFormChange}
                required
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: 1.5, fontSize: "0.825rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleFormChange}
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: 1.5, fontSize: "0.825rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialty"
                name="specialty"
                value={editFormData.specialty}
                onChange={handleFormChange}
                required
                size="small"
                sx={{ mb: 2 }}
                InputProps={{ sx: { borderRadius: 1.5, fontSize: "0.825rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel sx={{ fontSize: "0.875rem" }}>School</InputLabel>
                <Select
                  name="schoolId"
                  value={editFormData.schoolId}
                  onChange={handleFormChange}
                  label="School"
                  sx={{ borderRadius: 1.5, fontSize: "0.825rem" }}
                >
                  <MenuItem value="">None</MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={editFormData.bio}
                onChange={handleFormChange}
                multiline
                rows={3}
                size="small"
                placeholder="Enter a brief biography or relevant experience..."
                helperText="Add information to help athletes and parents learn more about this coach."
                InputProps={{ sx: { borderRadius: 1.5, fontSize: "0.825rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
            pt: 1,
            gap: 2,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mr: "auto", fontSize: "0.7rem", ml: 1 }}
          >
            * Required fields
          </Typography>
          <Button
            onClick={handleCloseEditDialog}
            variant="outlined"
            size="small"
            sx={{
              px: 2,
              borderRadius: "6px",
              color: "text.secondary",
              borderColor: "text.secondary",
              textTransform: "none",
              fontSize: "0.8rem",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "rgba(0,0,0,0.03)",
              },
            }}
            startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitEdit}
            variant="contained"
            size="small"
            sx={{
              px: 2,
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "0.8rem",
              background: "linear-gradient(to right, #1C7293, #065a82)",
              "&:hover": {
                background: "linear-gradient(to right, #065a82, #054c6a)",
              },
            }}
            startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Team Dialog */}
      <Dialog
        open={addTeamDialogOpen}
        onClose={handleCloseAddTeamDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            bgcolor: "#1C7293",
            color: "white",
            py: 1.5,
            fontSize: "1.1rem",
          }}
        >
          Add New Team
        </DialogTitle>
        <DialogContent
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2.5,
          }}
        >
          <Grid container spacing={2.5}>
            {/* First row: Team Name and Sport fields side by side */}
            <Grid item xs={12} sx={{ display: "flex", gap: 2, width: "100%", paddingTop: 1 }}>
              <Box sx={{ width: "50%" }}>
                <TextField
                  fullWidth
                  label="Team Name"
                  name="name"
                  value={newTeamData.name}
                  onChange={handleTeamFormChange}
                  required
                  size="small"
                  InputProps={{
                    sx: { borderRadius: 1.5, fontSize: "0.825rem" },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                />
              </Box>
              <Box sx={{ width: "50%" }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel sx={{ fontSize: "0.875rem" }}>Sport</InputLabel>
                  <Select
                    name="sport"
                    value={newTeamData.sport}
                    onChange={handleTeamFormChange}
                    label="Sport"
                    sx={{ borderRadius: 1.5, fontSize: "0.825rem" }}
                  >
                    {sportOptions.map((sport) => (
                      <MenuItem key={sport.name} value={sport.name}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {sport.icon ? (
                              <img
                                src={sport.icon}
                                alt={sport.name}
                                style={{ width: 20, height: 20 }}
                              />
                            ) : (
                              sport.muiIcon
                            )}
                          </ListItemIcon>
                          <Typography variant="body2">{sport.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                    <MenuItem value="Other">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <SportsIcon />
                        </ListItemIcon>
                        <Typography variant="body2">Other</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            {/* Second row: Athlete selection */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                Athletes
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: "8px",
                  maxHeight: 200,
                  overflow: "auto",
                  bgcolor: "rgba(0,0,0,0.01)",
                }}
              >
                {athletes.length > 0 ? (
                  <Grid container spacing={2}>
                    {athletes.map((athlete, index) => (
                      <Grid item xs={12} sm={4} key={athlete.id}>
                        <Box 
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1,
                            borderRadius: "4px",
                            border: "1px solid rgba(0,0,0,0.08)",
                            bgcolor: "white",
                            "&:hover": {
                              bgcolor: "rgba(28, 114, 147, 0.05)",
                              cursor: "pointer",
                            },
                            transition: "all 0.2s ease",
                            height: "60px", // Fixed height for all boxes
                            width: "100%",
                          }}
                          onClick={() => {
                            const isSelected = newTeamData.athletes.includes(athlete.id);
                            const newAthletes = isSelected
                              ? newTeamData.athletes.filter(id => id !== athlete.id)
                              : [...newTeamData.athletes, athlete.id];
                            setNewTeamData({
                              ...newTeamData,
                              athletes: newAthletes,
                            });
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked={newTeamData.athletes.includes(athlete.id)}
                            sx={{
                              color: "rgba(0,0,0,0.3)",
                              "&.Mui-checked": {
                                color: "#1C7293",
                              },
                              padding: '2px',
                            }}
                          />
                          <Box 
                            sx={{ 
                              ml: 1,
                              width: "calc(100% - 30px)", // Ensure consistent width
                              overflow: "hidden",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 500, 
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {athlete.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.7rem",
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {athlete.sport}{" "}
                              {athlete.position ? `- ${athlete.position}` : ""}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    No athletes available to add
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Team Info */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SchoolIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    School: {getSchoolName(coach?.schoolId)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                    Coach: {coach?.name}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            p: 2.5,
            gap: 1.5,
            borderTop: "1px solid rgba(0,0,0,0.08)",
            bgcolor: "rgba(0,0,0,0.01)",
          }}
        >
          <Button
            onClick={handleCloseAddTeamDialog}
            variant="outlined"
            size="small"
            sx={{
              px: 2,
              borderRadius: "6px",
              color: "text.secondary",
              borderColor: "text.secondary",
              textTransform: "none",
              fontSize: "0.8rem",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "rgba(0,0,0,0.03)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitNewTeam}
            variant="contained"
            size="small"
            className="!text-white"
            disabled={!newTeamData.name || !newTeamData.sport}
            sx={{
              px: 2,
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "0.8rem",
              background: "linear-gradient(to right, #1C7293, #065a82)",
              "&:hover": {
                background: "linear-gradient(to right, #065a82, #054c6a)",
              },
            }}
          >
            Add Team
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CoachDetail;
