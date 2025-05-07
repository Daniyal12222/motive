import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";
import basketballImg from "../assets/basketball.jpg";
import soccerImg from "../assets/soccer.jpg";
import trackImg from "../assets/track.jpg";
import swimmingImg from "../assets/swimming.png";

// Import sport icons for dropdown
import basketballIcon from "../assets/sportIcon/basketball.png";
import soccerIcon from "../assets/sportIcon/soccer.png";
import trackIcon from "../assets/sportIcon/track-and-field.png";
import swimmingIcon from "../assets/sportIcon/swimming.png";
import baseballIcon from "../assets/sportIcon/baseball.png";
import footballIcon from "../assets/sportIcon/american-football.png";
import golfIcon from "../assets/sportIcon/golf.png";
import badmintonIcon from "../assets/sportIcon/badminton.png";
import hockeyIcon from "../assets/sportIcon/hockey.png";

function Coaches() {
  const navigate = useNavigate();
  const { coaches, setCoaches, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    schoolId: "",
    profileImage: null,
    bio: "",
  });

  // Sports options for the specialty dropdown
  const sportOptions = [
    { name: "Basketball", icon: basketballIcon },
    { name: "Soccer", icon: soccerIcon },
    { name: "Football", icon: footballIcon },
    { name: "Track & Field", icon: trackIcon },
    { name: "Swimming", icon: swimmingIcon },
    { name: "Baseball", icon: baseballIcon },
    { name: "Golf", icon: golfIcon },
    { name: "Hockey", icon: hockeyIcon },
    { name: "Badminton", icon: badmintonIcon },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCoach(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialty: "",
      schoolId: "",
      profileImage: null,
      bio: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0],
    });
  };

  const handleSchoolFilterChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Filter coaches by selected school
  const filteredCoaches = selectedSchool
    ? coaches.filter((coach) => coach.schoolId === selectedSchool)
    : coaches;

  const handleEditClick = (coach) => {
    setEditCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialty: coach.specialty,
      schoolId: coach.schoolId || "",
      profileImage: coach.profileImage || null,
      bio: coach.bio || "",
    });
    setOpen(true);
  };

  const handleDeleteClick = (coachId) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      const updatedCoaches = coaches.filter((coach) => coach.id !== coachId);
      setCoaches(updatedCoaches);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editCoach) {
      // Update existing coach
      const updatedCoaches = coaches.map((coach) =>
        coach.id === editCoach.id ? { ...coach, ...formData } : coach
      );
      setCoaches(updatedCoaches);
    } else {
      // Add new coach
      const newCoach = {
        id: coaches.length > 0 ? Math.max(...coaches.map((c) => c.id)) + 1 : 1,
        ...formData,
      };
      setCoaches([...coaches, newCoach]);
    }

    handleClose();
  };

  // Get school name by ID
  const getSchoolName = (schoolId) => {
    if (!schoolId) return "Not Assigned";
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Unknown School";
  };

  // Get profile image based on specialty or uploaded image
  const getProfileImage = (coach) => {
    if (coach.profileImage) {
      return URL.createObjectURL(coach.profileImage);
    }

    const specialty = coach.specialty?.toLowerCase() || "";
    if (specialty.includes("basketball")) return basketballImg;
    if (specialty.includes("soccer")) return soccerImg;
    if (specialty.includes("football")) return footballIcon;
    if (specialty.includes("track") || specialty.includes("running"))
      return trackImg;
    if (specialty.includes("swim")) return swimmingImg;
    if (specialty.includes("baseball")) return baseballIcon;
    if (specialty.includes("golf")) return golfIcon;
    if (specialty.includes("hockey")) return hockeyIcon;
    if (specialty.includes("badminton")) return badmintonIcon;
    // Default image if no match
    return basketballImg;
  };

  // Navigate to coach detail page when clicking on a row
  const handleRowClick = (coachId) => {
    navigate(`/coach/${coachId}`);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      ></Box>

      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex items-center">
            <FilterIcon sx={{ mr: 2, color: "text.secondary" }} />
            <FormControl sx={{ width: 300 }}>
              <Select
                id="school-filter"
                value={selectedSchool}
                onChange={handleSchoolFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Schools</em>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button
            className="!bg-[#1C7293] !text-white"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Coach
          </Button>
        </Box>
      </Paper>

      {/* Coaches Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="coaches table">
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoaches.map((coach) => (
              <TableRow
                key={coach.id}
                onClick={() => handleRowClick(coach.id)}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                    cursor: "pointer",
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    src={getProfileImage(coach)}
                    alt={coach.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {coach.name}
                </TableCell>
                <TableCell>{coach.specialty}</TableCell>
                <TableCell>{getSchoolName(coach.schoolId)}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Coach Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", bgcolor: "#1C7293", color: "white" }}
        >
          {editCoach ? "Edit Coach" : "Add New Coach"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: 4,
            }}
          >
            <Grid container spacing={2} sx={{ maxWidth: "95%" }}>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <FormControl fullWidth margin="dense">
                  <Box
                    sx={{
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formData.profileImage ? (
                      <>
                        <Avatar
                          src={URL.createObjectURL(formData.profileImage)}
                          alt="Preview"
                          sx={{ width: 100, height: 100, boxShadow: 2 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {formData.profileImage.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              setFormData({ ...formData, profileImage: null })
                            }
                            color="error"
                          >
                            Remove
                          </Button>
                          <Button
                          
                            variant="outlined"
                            component="label"
                            size="small"
                          >
                            Change Image
                            <input
                              accept="image/*"
                              type="file"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: "rgba(28,114,147,0.1)",
                              color: "#1C7293",
                            }}
                          >
                            
                          </Avatar>
                          <Button
                            className="!bg-[#daf1f9] border border-white !text-[#1C7293]"
                            component="label"
                            sx={{ 
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              borderRadius: '50%', 
                              minWidth: 'auto',
                              padding: '4px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <AddIcon fontSize="small" />
                            <input
                              accept="image/*"
                              type="file"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ width: "48%" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Full Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  helperText="Enter the coach's full name"
                  placeholder="John Doe"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ width: "48%" }}>
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  helperText="Enter a valid email address"
                  placeholder="coach@example.com"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <TextField
                  margin="dense"
                  name="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  helperText="Format: (123) 456-7890"
                  placeholder="(123) 456-7890"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ width: "48%" }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="specialty-label">Specialty</InputLabel>
                  <Select
                    labelId="specialty-label"
                    id="specialty-select"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    label="Specialty"
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <em>Select a sport</em>
                    </MenuItem>
                    {sportOptions.map((sport) => (
                      <MenuItem key={sport.name} value={sport.name}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <img
                            src={sport.icon}
                            alt={sport.name}
                            style={{ width: 24, height: 24 }}
                          />
                          {sport.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select the coach's specialty sport
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="school-label">School</InputLabel>
                  <Select
                    labelId="school-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    label="School"
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Assign the coach to a school (optional)
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ width: "100%" }}>
                <TextField
                  margin="dense"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={formData.bio}
                  onChange={handleChange}
                  helperText="Enter coach's background and experience"
                  placeholder="Coach's professional background, achievements, and coaching philosophy..."
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                px: 3,
                borderRadius: 6,
                color: "text.secondary",
                borderColor: "text.secondary",
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: "rgba(0,0,0,0.03)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 4,
                borderRadius: 6,
                bgcolor: "#1C7293",
                "&:hover": {
                  bgcolor: "#14576F",
                },
              }}
            >
              {editCoach ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Coaches;
