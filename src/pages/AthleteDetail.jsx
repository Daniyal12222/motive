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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  SportsSoccer as SportsIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";

// Import athlete images
import athlete1 from "../assets/athlete/athlete1.webp";
import athlete2 from "../assets/athlete/athlete2.jpg";
import athlete3 from "../assets/athlete/athlete3.jpg";
import athlete4 from "../assets/athlete/athlete4.jpg";
import athlete5 from "../assets/athlete/athlete5.jpg";
import athlete6 from "../assets/athlete/athlete6.jpg";
import athlete7 from "../assets/athlete/athlete7.jpg";
import athlete8 from "../assets/athlete/athlete8.jpg";

// Import sport icons for dropdown
import basketballIcon from "../assets/sportIcon/basketball.png";
import soccerIcon from "../assets/sportIcon/soccer.png";
import trackIcon from "../assets/sportIcon/track-and-field.png";
import swimmingIcon from "../assets/sportIcon/swimming.png";
import baseballIcon from "../assets/sportIcon/baseball.png";
import footballIcon from "../assets/sportIcon/american-football.png";
import golfIcon from "../assets/sportIcon/golf.png";
import badmintonIcon from "../assets/sportIcon/hockey.png";
import hockeyIcon from "../assets/sportIcon/badminton.png";

// Helper: Sport options for dropdown, similar to Coaches.jsx
const sportOptionsList = [
  { name: "Basketball", icon: basketballIcon },
  { name: "Soccer", icon: soccerIcon },
  { name: "Track & Field", icon: trackIcon },
  { name: "Swimming", icon: swimmingIcon },
  { name: "Baseball", icon: baseballIcon },
  { name: "Football", icon: footballIcon },
  { name: "Golf", icon: golfIcon },
  { name: "Hockey", icon: hockeyIcon },
  { name: "Badminton", icon: badmintonIcon }, // Assuming badminton uses hockey icon as per original imports
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`athlete-tabpanel-${index}`}
      aria-labelledby={`athlete-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AthleteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { athletes, schools, groups, coaches, events, updateAthlete } =
    useAppContext();
  const [athlete, setAthlete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedEvents, setExpandedEvents] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolId: "",
    coachId: "",
    sport: "",
    bio: "",
    profileImage: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});
  const [saveAttempted, setSaveAttempted] = useState(false);

  useEffect(() => {
    // Find the athlete by ID
    const athleteId = parseInt(id);
    const foundAthlete = athletes.find((a) => a.id === athleteId);
    if (foundAthlete) {
      setAthlete(foundAthlete);
      // Populate form data, split name into first and last
      const nameParts = foundAthlete.name
        ? foundAthlete.name.split(" ")
        : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setEditFormData({
        name: foundAthlete.name || "",
        firstName: firstName,
        lastName: lastName,
        email: foundAthlete.email || "",
        phone: foundAthlete.phone || "",
        schoolId: foundAthlete.schoolId || "",
        coachId: foundAthlete.coachId || "",
        sport: foundAthlete.sport || "",
        bio: foundAthlete.bio || "",
        profileImage: getAthleteImage(foundAthlete.id),
      });
    }
  }, [id, athletes]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEventClick = (eventId) => {
    setExpandedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setFormTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation (using firstName and lastName)
    if (!editFormData.firstName.trim()) {
      errors.firstName = "First Name is required";
    }
    if (!editFormData.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }

    // Email validation
    if (!editFormData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      errors.email = "Email is invalid";
    }

    // Phone validation (optional but must be valid if provided)
    if (
      editFormData.phone &&
      !/^[0-9\-\(\)\s\+]{10,15}$/.test(editFormData.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    // Sport validation
    if (!editFormData.sport) {
      errors.sport = "Please select a sport";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = () => {
    setSaveAttempted(true);

    // Mark all fields as touched
    const allTouched = Object.keys(editFormData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFormTouched(allTouched);

    const isValid = validateForm();

    if (isValid && athlete) {
      const fullName =
        `${editFormData.firstName} ${editFormData.lastName}`.trim();
      const updatedAthleteData = {
        ...editFormData,
        name: fullName,
      };
      // Remove temp fields not part of athlete object structure if necessary
      delete updatedAthleteData.firstName;
      delete updatedAthleteData.lastName;
      // profileImage might be a file object or a string path, handle accordingly
      // For now, assume updateAthlete handles it or it's just for display in form
      // delete updatedAthleteData.profileImage;

      const finalAthletePayload = {
        ...athlete,
        ...updatedAthleteData,
      };

      updateAthlete(finalAthletePayload);
      setAthlete(finalAthletePayload);
      setEditDialogOpen(false);
      setSaveAttempted(false);

      // Reset touched state
      setFormTouched({});
    }
  };

  const handleOpenEditDialog = () => {
    // Repopulate form with current athlete data before opening
    if (athlete) {
      const nameParts = athlete.name ? athlete.name.split(" ") : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      setEditFormData({
        name: athlete.name || "",
        firstName: firstName,
        lastName: lastName,
        email: athlete.email || "",
        phone: athlete.phone || "",
        schoolId: athlete.schoolId || "",
        coachId: athlete.coachId || "",
        sport: athlete.sport || "",
        bio: athlete.bio || "",
        profileImage: getAthleteImage(athlete.id),
      });
    }
    setFormErrors({});
    setFormTouched({});
    setSaveAttempted(false);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    // Optionally reset form or errors if needed upon simple close
    setFormErrors({});
    setFormTouched({});
    setSaveAttempted(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData((prev) => ({
        ...prev,
        profileImage: e.target.files[0],
      }));
    }
  };

  // Helper function to determine if a field has an error
  const hasError = (fieldName) => {
    return (formTouched[fieldName] || saveAttempted) && !!formErrors[fieldName];
  };

  // Helper functions
  const getSchoolName = (schoolId) => {
    if (!schoolId) return "Not Assigned";
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  const getCoachName = (coachId) => {
    if (!coachId) return "Not Assigned";
    const coach = coaches.find((c) => c.id === coachId);
    return coach ? coach.name : "Unknown Coach";
  };

  const getAthleteGroups = () => {
    if (!athlete) return [];
    return groups.filter(
      (group) => group.athletes && group.athletes.includes(athlete.id)
    );
  };

  const getGroupEvents = (groupId) => {
    return events.filter((event) => event.groupId === groupId);
  };

  // Get athlete profile image
  const getAthleteImage = (id) => {
    // Use modulo to cycle through available images
    const imageIndex = (id % 8) + 1;
    switch (imageIndex) {
      case 1:
        return athlete1;
      case 2:
        return athlete2;
      case 3:
        return athlete3;
      case 4:
        return athlete4;
      case 5:
        return athlete5;
      case 6:
        return athlete6;
      case 7:
        return athlete7;
      case 8:
        return athlete8;
      default:
        return athlete1;
    }
  };

  // Get sport icon based on sport name
  const getSportIcon = (sportName) => {
    if (!sportName) return basketballIcon;

    const sportLower = sportName.toLowerCase();
    if (sportLower.includes("basketball")) return basketballIcon;
    if (sportLower.includes("soccer")) return soccerIcon;
    if (sportLower.includes("track") || sportLower.includes("field"))
      return trackIcon;
    if (sportLower.includes("swimming")) return swimmingIcon;
    if (sportLower.includes("baseball")) return baseballIcon;
    if (sportLower.includes("football")) return footballIcon;
    if (sportLower.includes("golf")) return golfIcon;
    if (sportLower.includes("hockey")) return hockeyIcon;
    if (sportLower.includes("badminton")) return badmintonIcon;

    return basketballIcon; // Default fallback
  };

  if (!athlete) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5">Athlete not found</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/athletes")}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

  const athleteGroups = getAthleteGroups();
  const athleteEvents = athleteGroups.flatMap((group) =>
    getGroupEvents(group.id)
  );
  const attendedEvents = athleteEvents.filter(
    (event) => event.attendance && event.attendance[athlete.id] === true
  ).length;
  const missedEvents = athleteEvents.filter(
    (event) => event.attendance && event.attendance[athlete.id] === false
  ).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
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
          onClick={() => navigate("/athletes")}
          size="small"
        >
          Back
        </Button>
        <Button
          variant="outlined"
          size="small"
          className=" !bg-[#1C7293] !text-white !text-sm !px-3 !py-1 !font-medium !rounded-md !transition-all"
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          onClick={handleOpenEditDialog}
          sx={{ borderRadius: "6px", textTransform: "none", px: 1.5 }}
        >
          Edit Athlete
        </Button>
      </Box>

      {/* Athlete Profile Card */}
      <Card
        elevation={1}
        sx={{
          mb: 2,
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container alignItems="center">
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
                    {athlete.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={getSportIcon(athlete.sport)}
                      alt={athlete.sport}
                      sx={{ width: 18, height: 18, mr: 0.75 }}
                    />
                    {athlete.sport} Athlete
                  </Typography>
                </Box>
                <Box sx={{ ml: "auto" }}>
                  <Avatar
                    src={getAthleteImage(athlete.id)}
                    alt={athlete.name}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid rgba(28, 114, 147, 0.2)",
                    }}
                  />
                </Box>
              </Box>
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
                  {athlete.bio}
                </Typography>
              </Box>

              <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
                    <EmailIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">{athlete.email}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PhoneIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {athlete.phone || "No phone number"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.75 }}>
                    <SchoolIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {getSchoolName(athlete.schoolId)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Coach: {getCoachName(athlete.coachId)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  icon={<GroupIcon sx={{ fontSize: 16 }} />}
                  label={`${athleteGroups.length} Teams`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                  }}
                />
                <Chip
                  icon={<EventIcon sx={{ fontSize: 16 }} />}
                  label={`${athleteEvents.length} Events`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: 24,
                    "& .MuiChip-label": { px: 1, fontSize: "0.75rem" },
                  }}
                />
                <Chip
                  icon={<SportsIcon sx={{ fontSize: 16 }} />}
                  label={athlete.sport}
                  color="secondary"
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

      {/* Athlete Edit Dialog - New Structure based on Coach Edit Form */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "8px" } }}
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
          Edit Athlete Profile
        </DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit();
          }}
        >
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
              {/* Profile Image Section - Similar to Coach Form */}
              <Grid item xs={12} sx={{ width: "100%" }}>
                <FormControl fullWidth margin="dense">
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ position: "relative", mb: 1 }}>
                      <Avatar
                        src={
                          editFormData.profileImage instanceof File
                            ? URL.createObjectURL(editFormData.profileImage)
                            : editFormData.profileImage
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
                          accept="image/*"
                          type="file"
                          hidden
                          onChange={handleFileChange}
                        />
                      </IconButton>
                    </Box>
                    {editFormData.profileImage instanceof File && (
                      <Typography variant="caption" color="textSecondary">
                        {editFormData.profileImage.name}
                      </Typography>
                    )}
                  </Box>
                </FormControl>
              </Grid>

              {/* First Name and Last Name */}
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="firstName"
                  label="First Name *"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editFormData.firstName}
                  onChange={handleEditChange}
                  required
                  error={hasError("firstName")}
                  helperText={
                    hasError("firstName") ? formErrors.firstName : " "
                  }
                  placeholder="John"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Last Name *"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editFormData.lastName}
                  onChange={handleEditChange}
                  required
                  error={hasError("lastName")}
                  helperText={hasError("lastName") ? formErrors.lastName : " "}
                  placeholder="Doe"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                  size="small"
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  margin="dense"
                  name="email"
                  label="Email Address *"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                  error={hasError("email")}
                  helperText={
                    hasError("email")
                      ? formErrors.email
                      : "We will never share your email."
                  }
                  placeholder="athlete@example.com"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    },
                    startAdornment: (
                      <EmailIcon
                        color={hasError("email") ? "error" : "action"}
                        sx={{ mr: 1, fontSize: 18 }}
                      />
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                  size="small"
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  margin="dense"
                  name="phone"
                  label="Phone Number"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  error={hasError("phone")}
                  helperText={
                    hasError("phone")
                      ? formErrors.phone
                      : "Format: (123) 456-7890"
                  }
                  placeholder="(123) 456-7890"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    },
                    startAdornment: (
                      <PhoneIcon
                        color={hasError("phone") ? "error" : "action"}
                        sx={{ mr: 1, fontSize: 18 }}
                      />
                    ),
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                  size="small"
                />
              </Grid>

              {/* Sport Select */}
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  error={hasError("sport")}
                  required
                  size="small"
                >
                  <InputLabel
                    id="athlete-sport-select-label"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Sport *
                  </InputLabel>
                  <Select
                    labelId="athlete-sport-select-label"
                    name="sport"
                    value={editFormData.sport}
                    onChange={handleEditChange}
                    label="Sport *"
                    sx={{
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a sport</em>
                    </MenuItem>
                    {sportOptionsList.map((sport) => (
                      <MenuItem key={sport.name} value={sport.name}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={sport.icon}
                            alt={sport.name}
                            sx={{ width: 20, height: 20, mr: 0.5 }}
                          />
                          {sport.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {hasError("sport") ? (
                    <FormHelperText error>{formErrors.sport}</FormHelperText>
                  ) : (
                    <FormHelperText> </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* School Select */}
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                >
                  <InputLabel
                    id="athlete-school-select-label"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    School
                  </InputLabel>
                  <Select
                    labelId="athlete-school-select-label"
                    name="schoolId"
                    value={editFormData.schoolId}
                    onChange={handleEditChange}
                    label="School"
                    sx={{
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    }}
                    startAdornment={
                      <SchoolIcon
                        color={"action"}
                        sx={{ mr: 1, fontSize: 18 }}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em>Not Assigned</em>
                    </MenuItem>
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText> </FormHelperText>
                </FormControl>
              </Grid>

              {/* Coach Select */}
              <Grid item xs={12} sm={6} sx={{ width: "98%" }}>
                <FormControl
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  size="small"
                >
                  <InputLabel
                    id="athlete-coach-select-label"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Coach
                  </InputLabel>
                  <Select
                    labelId="athlete-coach-select-label"
                    name="coachId"
                    value={editFormData.coachId}
                    onChange={handleEditChange}
                    label="Coach"
                    placeholder="Select a coach"
                    sx={{
                      borderRadius: 1.5,
                      height: "36px",
                      fontSize: "0.825rem",
                    }}
                    startAdornment={
                      <PersonIcon
                        color={"action"}
                        sx={{ mr: 1, fontSize: 18 }}
                      />
                    }
                  >
                    <MenuItem value="">
                      <em>Not Assigned</em>
                    </MenuItem>
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText> </FormHelperText>
                </FormControl>
              </Grid>

              {/* Bio TextField */}
              <Grid item xs={12} sx={{ width: "98%" }}>
                <TextField
                  margin="dense"
                  name="bio"
                  label="Athlete Bio"
                  value={editFormData.bio}
                  onChange={handleEditChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Enter a brief biography or notable achievements..."
                  helperText="Add any relevant information about the athlete."
                  InputProps={{
                    sx: { borderRadius: 1.5, fontSize: "0.825rem" },
                  }}
                  InputLabelProps={{ sx: { fontSize: "0.875rem" } }}
                  size="small"
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
              type="submit"
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
        </form>
      </Dialog>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 1 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="athlete tabs"
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              fontSize: "0.85rem",
              textTransform: "none",
              py: 0.5,
              px: 2,
            },
            "& .Mui-selected": {
              color: "#1C7293",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1C7293",
            },
          }}
        >
          <Tab label="Teams" id="athlete-tab-0" />
          <Tab label="Events" id="athlete-tab-1" />
        </Tabs>
      </Box>

      {/* Teams Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  background: "linear-gradient(to right, #1C7293, #065a82)",
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
                  <GroupIcon sx={{ mr: 1, fontSize: 18 }} /> Teams (
                  {athleteGroups.length})
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {athleteGroups.length > 0 ? (
                  <Box>
                    {athleteGroups.map((group, index) => {
                      const groupCoach = coaches.find(
                        (c) => c.id === group.coachId
                      );
                      const upcomingEvents = getGroupEvents(group.id).filter(
                        (e) => new Date(e.date) >= new Date()
                      );
                      const totalEvents = getGroupEvents(group.id).length;
                      const attendedGroupEvents = getGroupEvents(
                        group.id
                      ).filter(
                        (e) => e.attendance && e.attendance[athlete.id] === true
                      ).length;

                      // Generate a consistent color based on group id
                      const colorIndex = group.id % 5;
                      const backgroundColors = [
                        "rgba(28, 114, 147, 0.8)", // Blue
                        "rgba(76, 175, 80, 0.8)", // Green
                        "rgba(156, 39, 176, 0.8)", // Purple
                        "rgba(255, 152, 0, 0.8)", // Orange
                        "rgba(233, 30, 99, 0.8)", // Pink
                      ];
                      const bgColor = backgroundColors[colorIndex];

                      return (
                        <Box
                          key={group.id}
                          sx={{
                            p: 1.5,
                            borderRadius:
                              index === athleteGroups.length - 1
                                ? "0 0 8px 8px"
                                : 0,
                            borderBottom:
                              index !== athleteGroups.length - 1
                                ? "1px solid rgba(0,0,0,0.04)"
                                : "none",
                            transition: "all 0.2s ease",
                            position: "relative",
                            "&:hover": {
                              bgcolor: "rgba(28, 114, 147, 0.02)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                            },
                          }}
                        >
                          <Grid container spacing={1.5} alignItems="center">
                            <Grid item xs={12} sm={5} md={4}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: bgColor,
                                    width: 36,
                                    height: 36,
                                    mr: 1.5,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {group.name.substring(0, 2).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 600,
                                      mb: 0.25,
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {group.name}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      flexWrap: "wrap",
                                      gap: 0.75,
                                    }}
                                  >
                                    <Chip
                                      icon={
                                        <PersonIcon sx={{ fontSize: 14 }} />
                                      }
                                      label={`${
                                        group.athletes
                                          ? group.athletes.length
                                          : 0
                                      } Members`}
                                      size="small"
                                      sx={{
                                        bgcolor: "rgba(0,0,0,0.02)",
                                        height: 20,
                                        "& .MuiChip-label": {
                                          fontSize: "0.7rem",
                                          px: 0.75,
                                        },
                                      }}
                                    />
                                    {upcomingEvents.length > 0 && (
                                      <Chip
                                        icon={
                                          <EventIcon sx={{ fontSize: 14 }} />
                                        }
                                        label={`${upcomingEvents.length} Upcoming`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{
                                          height: 20,
                                          "& .MuiChip-label": {
                                            fontSize: "0.7rem",
                                            px: 0.75,
                                          },
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={3} md={3}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                  justifyContent: "center",
                                  px: { xs: 0, sm: 0.75 },
                                  py: { xs: 0.75, sm: 0 },
                                  borderLeft: {
                                    xs: "none",
                                    sm: "1px solid rgba(0,0,0,0.02)",
                                  },
                                  borderRight: {
                                    xs: "none",
                                    sm: "1px solid rgba(0,0,0,0.02)",
                                  },
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  className="!font-bold !text-black"
                                  sx={{ fontSize: "0.8rem" }}
                                >
                                  Coach
                                </Typography>
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 18,
                                      height: 18,
                                      mr: 0.75,
                                      bgcolor: bgColor,
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    {groupCoach
                                      ? groupCoach.name.charAt(0)
                                      : "C"}
                                  </Avatar>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 400, fontSize: "0.8rem" }}
                                  >
                                    {groupCoach
                                      ? groupCoach.name
                                      : "Not Assigned"}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={4} md={5}>
                              <Grid container spacing={1.5}>
                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      bgcolor: "rgba(28, 114, 147, 0.04)",
                                      borderRadius: "6px",
                                      p: 0.75,
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      color="primary"
                                      sx={{
                                        fontWeight: 600,
                                        mb: 0,
                                        fontSize: "1rem",
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {upcomingEvents.length}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        textAlign: "center",
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      Upcoming Events
                                    </Typography>
                                  </Box>
                                </Grid>

                                <Grid item xs={6}>
                                  <Box
                                    sx={{
                                      borderRadius: "6px",
                                      p: 0.75,
                                      height: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      position: "relative",
                                      overflow: "hidden",
                                      bgcolor: "rgba(0,0,0,0.01)",
                                      border: "1px solid rgba(0,0,0,0.03)",
                                      "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        width: "100%",
                                        height: `${
                                          totalEvents > 0
                                            ? (attendedGroupEvents /
                                                totalEvents) *
                                              100
                                            : 0
                                        }%`,
                                        bgcolor:
                                          totalEvents > 0
                                            ? attendedGroupEvents /
                                                totalEvents >
                                              0.7
                                              ? "rgba(76, 175, 80, 0.08)"
                                              : "rgba(255, 152, 0, 0.08)"
                                            : "transparent",
                                        transition: "height 0.6s ease-out",
                                      },
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      color={
                                        totalEvents > 0
                                          ? attendedGroupEvents / totalEvents >
                                            0.7
                                            ? "success.main"
                                            : "warning.main"
                                          : "text.secondary"
                                      }
                                      sx={{
                                        fontWeight: 600,
                                        mb: 0,
                                        position: "relative",
                                        zIndex: 1,
                                        fontSize: "1rem",
                                        lineHeight: 1.2,
                                      }}
                                    >
                                      {totalEvents > 0
                                        ? Math.round(
                                            (attendedGroupEvents /
                                              totalEvents) *
                                              100
                                          )
                                        : 0}
                                      %
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{
                                        textAlign: "center",
                                        position: "relative",
                                        zIndex: 1,
                                        fontSize: "0.7rem",
                                      }}
                                    >
                                      Attendance Rate
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "rgba(28, 114, 147, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <GroupIcon sx={{ color: "#1C7293", fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Teams Found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 250,
                        mx: "auto",
                        mb: 1.5,
                        fontSize: "0.8rem",
                      }}
                    >
                      This athlete is not part of any team yet.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<GroupIcon sx={{ fontSize: 16 }} />}
                      onClick={() => navigate("/groups")}
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontSize: "0.8rem",
                        borderRadius: "6px",
                      }}
                    >
                      View All Teams
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Events Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card
              elevation={1}
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  background: "linear-gradient(to right, #1C7293, #065a82)",
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
                  <EventIcon sx={{ mr: 1, fontSize: 18 }} /> Events (
                  {athleteEvents.length})
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {athleteEvents.length > 0 ? (
                  <Box>
                    {athleteEvents.map((event, index) => {
                      const attended =
                        event.attendance && event.attendance[athlete.id];
                      const eventDate = new Date(event.date);
                      const isPast = eventDate < new Date();
                      const group = groups.find((g) => g.id === event.groupId);

                      // Status colors
                      const getStatusColor = () => {
                        if (!isPast) return "info";
                        return attended ? "success" : "error";
                      };

                      const statusColor = getStatusColor();
                      const formattedDate = eventDate.toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year:
                            eventDate.getFullYear() !== new Date().getFullYear()
                              ? "numeric"
                              : undefined,
                        }
                      );

                      return (
                        <Box
                          key={event.id}
                          sx={{
                            p: 0,
                            borderBottom:
                              index !== athleteEvents.length - 1
                                ? "1px solid rgba(0,0,0,0.04)"
                                : "none",
                            transition: "all 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              bgcolor: "rgba(28, 114, 147, 0.01)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 2,
                              height: "100%",
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bgcolor: `${statusColor}.main`,
                            }}
                          />

                          <Accordion
                            elevation={0}
                            sx={{
                              "&:before": { display: "none" },
                              bgcolor: "transparent",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ fontSize: 18 }} />
                              }
                              sx={{ px: 1.5, py: 0.75, ml: 1 }}
                            >
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item xs={12} md={5}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        bgcolor: `${statusColor}.light`,
                                        color: `${statusColor}.dark`,
                                        width: 28,
                                        height: 28,
                                        mr: 1,
                                      }}
                                    >
                                      {isPast ? (
                                        attended ? (
                                          <CheckCircleIcon
                                            sx={{ fontSize: 16 }}
                                          />
                                        ) : (
                                          <CancelIcon sx={{ fontSize: 16 }} />
                                        )
                                      ) : (
                                        <EventIcon sx={{ fontSize: 16 }} />
                                      )}
                                    </Avatar>
                                    <Box component="div" className="flex items-end gap-2">
                                      <Box>
                                        <Typography
                                          variant="subtitle2"
                                          sx={{
                                            fontWeight: 500,
                                            mb: 0,
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          {event.title}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ fontSize: "0.7rem" }}
                                        >
                                          {formattedDate}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <GroupIcon
                                          sx={{
                                            color: "text.secondary",
                                            mr: 0.5,
                                            fontSize: 14,
                                          }}
                                        />
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ fontSize: "0.75rem" }}
                                        >
                                          {group ? group.name : "Unknown Team"}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TimeIcon
                                          color="text.secondary"
                                          sx={{ mr: 0.5, fontSize: 14 }}
                                        />
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ fontSize: "0.75rem" }}
                                        >
                                          {event.startTime} - {event.endTime}
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "flex-end",
                                        }}
                                      >
                                        <Chip
                                          icon={
                                            !isPast ? (
                                              <EventIcon
                                                sx={{ fontSize: 14 }}
                                              />
                                            ) : attended ? (
                                              <CheckCircleIcon
                                                sx={{ fontSize: 14 }}
                                              />
                                            ) : (
                                              <CancelIcon
                                                sx={{ fontSize: 14 }}
                                              />
                                            )
                                          }
                                          label={
                                            !isPast
                                              ? "Upcoming"
                                              : attended
                                              ? "Attended"
                                              : "Missed"
                                          }
                                          color={statusColor}
                                          size="small"
                                          variant={
                                            isPast ? "filled" : "outlined"
                                          }
                                          sx={{
                                            height: 20,
                                            "& .MuiChip-label": {
                                              fontSize: "0.7rem",
                                              px: 0.75,
                                            },
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </AccordionSummary>

                            <AccordionDetails
                              sx={{
                                px: 1.5,
                                py: 1,
                                bgcolor: "rgba(0,0,0,0.01)",
                                borderTop: "1px dashed rgba(0,0,0,0.04)",
                                ml: 1,
                              }}
                            >
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{
                                      fontSize: "0.7rem",
                                      display: "block",
                                    }}
                                  >
                                    Description
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    paragraph
                                    sx={{ mb: 0.75, fontSize: "0.8rem" }}
                                  >
                                    {event.description ||
                                      "No description provided."}
                                  </Typography>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <Box sx={{ mb: 0.75 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      gutterBottom
                                      display="block"
                                      sx={{ fontSize: "0.7rem" }}
                                    >
                                      Date & Time
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <EventIcon
                                        color="action"
                                        sx={{ mr: 0.5, fontSize: 14 }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ fontSize: "0.8rem" }}
                                      >
                                        {eventDate.toLocaleDateString("en-US", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mt: 0.25,
                                      }}
                                    >
                                      <TimeIcon
                                        color="action"
                                        sx={{ mr: 0.5, fontSize: 14 }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ fontSize: "0.8rem" }}
                                      >
                                        {event.startTime} - {event.endTime}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    gutterBottom
                                    display="block"
                                    sx={{ fontSize: "0.7rem" }}
                                  >
                                    Team
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <GroupIcon
                                      color="action"
                                      sx={{ mr: 0.5, fontSize: 14 }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{ fontSize: "0.8rem" }}
                                    >
                                      {group ? group.name : "Unknown Team"}
                                    </Typography>
                                  </Box>

                                  {isPast && (
                                    <Box sx={{ mt: 0.75 }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        gutterBottom
                                        display="block"
                                        sx={{ fontSize: "0.7rem" }}
                                      >
                                        Attendance
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {attended ? (
                                          <CheckCircleIcon
                                            color="success"
                                            sx={{ mr: 0.5, fontSize: 14 }}
                                          />
                                        ) : (
                                          <CancelIcon
                                            color="error"
                                            sx={{ mr: 0.5, fontSize: 14 }}
                                          />
                                        )}
                                        <Typography
                                          variant="body2"
                                          color={
                                            attended
                                              ? "success.main"
                                              : "error.main"
                                          }
                                          sx={{ fontSize: "0.8rem" }}
                                        >
                                          {attended
                                            ? "You attended this event"
                                            : "You missed this event"}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "rgba(28, 114, 147, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <EventIcon sx={{ color: "#1C7293", fontSize: 24 }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      No Events Found
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 250, mx: "auto", fontSize: "0.8rem" }}
                    >
                      There are no events scheduled for this athlete yet.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
}

export default AthleteDetail;
