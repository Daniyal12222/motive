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
  TablePagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    schoolId: "",
    profileImage: null,
    bio: "",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      firstName: "",
      lastName: "",
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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current page data
  const paginatedCoaches = filteredCoaches.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditClick = (coach) => {
    setEditCoach(coach);
    // Extract first and last name from coach.name
    const nameParts = coach.name ? coach.name.split(' ') : ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    setFormData({
      firstName,
      lastName,
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

    // Combine first and last name
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    
    if (editCoach) {
      // Update existing coach
      const updatedCoaches = coaches.map((coach) =>
        coach.id === editCoach.id ? { ...coach, ...formData, name: fullName } : coach
      );
      setCoaches(updatedCoaches);
    } else {
      // Add new coach
      const newCoach = {
        id: coaches.length > 0 ? Math.max(...coaches.map((c) => c.id)) + 1 : 1,
        ...formData,
        name: fullName,
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
      {/* School Filter */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 }
          }}
        >
          <div className="flex items-center w-full">
            <FormControl sx={{ width: '100%', maxWidth: { sm: 300 } }} size="small">
              <Select
                id="school-filter"
                value={selectedSchool}
                onChange={handleSchoolFilterChange}
                displayEmpty
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                  <Typography>All Schools</Typography>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id} sx={{ fontSize: '0.875rem' }}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button
            className="!bg-[#1C7293]  !text-white"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            size="small"
            sx={{ 
              fontSize: '0.875rem',
              minWidth: '120px',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Add Coach
          </Button>
        </Box>
      </Paper>

      {/* Coaches Table */}
      <TableContainer component={Paper} sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: { xs: 500, sm: 650 } }} aria-label="coaches table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>Profile</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>Coach</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>Sport</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>School</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>Email</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', py: { xs: 1.5, sm: 2 } }}>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCoaches.map((coach) => (
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
                <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                  <Avatar
                    src={getProfileImage(coach)}
                    alt={coach.name}
                    sx={{ width: { xs: 35, sm: 40 }, height: { xs: 35, sm: 40 } }}
                  />
                </TableCell>
                <TableCell component="th" scope="row" sx={{ fontSize: '0.875rem', color: 'text.primary', py: { xs: 1, sm: 1.5 } }}>
                  {coach.name}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', py: { xs: 1, sm: 1.5 } }}>{coach.specialty}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', py: { xs: 1, sm: 1.5 } }}>{getSchoolName(coach.schoolId)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', py: { xs: 1, sm: 1.5 } }}>{coach.email}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', py: { xs: 1, sm: 1.5 } }}>{coach.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCoaches.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ 
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          },
          '.MuiTablePagination-select': {
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
          }
        }}
      />

      {/* Add/Edit Coach Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 8,
            bgcolor: "#fafdff",
            borderLeft: "8px solid #1C7293",
            p: 0,
            overflow: "visible",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: -3 }}>
          <Avatar sx={{ bgcolor: "#1C7293", width: 64, height: 64, boxShadow: 3, mb: 1 }}>
            <PersonIcon sx={{ fontSize: 36, color: "white" }} />
          </Avatar>
        </Box>
        <DialogTitle
          sx={{
            textAlign: "center",
            bgcolor: "transparent",
            color: "#1C7293",
            fontWeight: 700,
            fontSize: isMobile ? "1.25rem" : "1.5rem",
            letterSpacing: 1,
            py: isMobile ? 1.5 : 2,
            mb: -2,
          }}
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
              px: isMobile ? 2 : 6,
              pt: isMobile ? 4 : 6,
              pb: isMobile ? 2 : 4,
              width: "100%",
              maxWidth: 600,
              mx: "auto",
              bgcolor: "transparent",
              borderRadius: 3,
              boxShadow: "none",
              gap: 2,
              maxHeight: isMobile ? "calc(100dvh - 180px)" : "calc(100vh - 220px)",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#1C7293",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#14576F",
              },
            }}
          >
            <Grid container spacing={isMobile ? 2 : 3} sx={{ maxWidth: "100%", mt: 18 }}>
              {/* Profile Image Section */}
              <Grid item xs={12} sx={{ width: "100%", mb: { xs: 1, sm: 2 }, mt: 20 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    mb: 2,
                    gap: { xs: 1, sm: 3 },
                  }}
                >
                  <Box sx={{ position: "relative", mb: { xs: 2, sm: 0 } }}>
                    {formData.profileImage ? (
                      <Avatar
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Preview"
                        sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 }, boxShadow: 2 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                          bgcolor: "rgba(28,114,147,0.1)",
                          color: "#1C7293",
                        }}
                      />
                    )}
                    <Button
                      className="!bg-[#daf1f9] border border-white !text-[#1C7293]"
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        borderRadius: "50%",
                        minWidth: "auto",
                        padding: "4px",
                        width: { xs: "22px", sm: "28px" },
                        height: { xs: "22px", sm: "28px" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
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
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, fontSize: "0.875rem" }}>
                      Coach Profile Picture
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                      Upload a professional photo of the coach
                    </Typography>
                    {formData.profileImage && (
                      <Box sx={{ mt: 1, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem", mr: 2 }}>
                          {formData.profileImage.name}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setFormData({ ...formData, profileImage: null })}
                          color="error"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
              {/* Basic Information */}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  margin="normal"
                  name="firstName"
                  label="First Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  helperText="Enter the coach's first name"
                  placeholder="John"
                  size="small"
                  InputProps={{ sx: { borderRadius: 2, bgcolor: "white", fontWeight: 400, fontSize: "1rem", boxShadow: 1 } }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 600, color: "#1C7293" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  helperText="Enter the coach's last name"
                  placeholder="Doe"
                  size="small"
                  InputProps={{ sx: { borderRadius: 2, bgcolor: "white", fontWeight: 400, fontSize: "1rem", boxShadow: 1 } }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 600, color: "#1C7293" } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
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
                  size="small"
                  InputProps={{ sx: { borderRadius: 2, bgcolor: "white", fontWeight: 400, fontSize: "1rem", boxShadow: 1 } }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 600, color: "#1C7293" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  name="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  helperText="Format: (123) 456-7890"
                  placeholder="(123) 456-7890"
                  InputProps={{ sx: { borderRadius: 2, bgcolor: "white", fontWeight: 400, fontSize: "1rem", boxShadow: 1 } }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 600, color: "#1C7293" } }}
                  FormHelperTextProps={{ sx: { fontSize: "0.75rem" } }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="specialty-label" sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1C7293" }}>Specialty</InputLabel>
                  <Select
                    labelId="specialty-label"
                    id="specialty-select"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    label="Specialty"
                    sx={{ borderRadius: 2, bgcolor: "white", fontSize: "1rem", boxShadow: 1 }}
                  >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                      <em>Select a sport</em>
                    </MenuItem>
                    {sportOptions.map((sport) => (
                      <MenuItem key={sport.name} value={sport.name} sx={{ fontSize: "0.875rem" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <img src={sport.icon} alt={sport.name} style={{ width: 20, height: 20 }} />
                          {sport.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    Select the coach's specialty sport
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel id="school-label" sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1C7293" }}>School</InputLabel>
                  <Select
                    labelId="school-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    label="School"
                    sx={{ borderRadius: 2, bgcolor: "white", fontSize: "1rem", boxShadow: 1 }}
                  >
                    <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
                      <em>None</em>
                    </MenuItem>
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id} sx={{ fontSize: "0.875rem" }}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ fontSize: "0.75rem" }}>
                    Assign the coach to a school (optional)
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  value={formData.bio}
                  onChange={handleChange}
                  helperText="Enter coach's background and experience"
                  placeholder="Coach's professional background, achievements, and coaching philosophy..."
                  InputProps={{ sx: { borderRadius: 2, bgcolor: "white", fontWeight: 400, fontSize: "1rem", boxShadow: 1 } }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 600, color: "#1C7293" } }}
                  FormHelperTextProps={{ sx: { fontSize: "0.75rem" } }}
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", mt: 0 }}>
            <DialogActions
              sx={{
                bgcolor: "transparent",
                display: "flex",
                justifyContent: "center",
                py: isMobile ? 1.5 : 2,
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 1 : 2,
                px: isMobile ? 2 : 3,
                borderTop: "1px solid #e3e8ee",
                width: "100%",
                position: "relative",
                bottom: 0,
                zIndex: 2,
              }}
            >
              <Button
                onClick={handleClose}
                fullWidth={isMobile}
                variant={isMobile ? "outlined" : "text"}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  color: "#1C7293",
                  borderColor: "#1C7293",
                  bgcolor: isMobile ? "white" : "transparent",
                  "&:hover": { bgcolor: "#e3f2fd", borderColor: "#14576F", color: "#14576F" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth={isMobile}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  bgcolor: "#1C7293",
                  color: "white",
                  boxShadow: 2,
                  "&:hover": { bgcolor: "#14576F" },
                }}
              >
                {editCoach ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </Box>
        </form>
      </Dialog>
    </div>
  );
}

export default Coaches;
