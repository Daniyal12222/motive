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
import FormComponent from "../components/FormComponent";

function Coaches() {
  const navigate = useNavigate();
  const { coaches, setCoaches, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sports options for the specialty dropdown
  const sportOptions = [
    { label: "Basketball", value: "Basketball", icon: basketballIcon },
    { label: "Soccer", value: "Soccer", icon: soccerIcon },
    { label: "Football", value: "Football", icon: footballIcon },
    { label: "Track & Field", value: "Track & Field", icon: trackIcon },
    { label: "Swimming", value: "Swimming", icon: swimmingIcon },
    { label: "Baseball", value: "Baseball", icon: baseballIcon },
    { label: "Golf", value: "Golf", icon: golfIcon },
    { label: "Hockey", value: "Hockey", icon: hockeyIcon },
    { label: "Badminton", value: "Badminton", icon: badmintonIcon },
  ];

  // School options for dropdown
  const schoolOptions = schools.map((school) => ({
    label: school.name,
    value: school.id,
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCoach(null);
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
    
    handleOpen();
  };

  const handleDeleteClick = (coachId) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      const updatedCoaches = coaches.filter((coach) => coach.id !== coachId);
      setCoaches(updatedCoaches);
    }
  };

  const handleSubmit = (formValues) => {
    // Combine first and last name
    const fullName = `${formValues.firstName} ${formValues.lastName}`.trim();
    
    if (editCoach) {
      // Update existing coach
      const updatedCoaches = coaches.map((coach) =>
        coach.id === editCoach.id ? { ...coach, ...formValues, name: fullName } : coach
      );
      setCoaches(updatedCoaches);
    } else {
      // Add new coach
      const newCoach = {
        id: coaches.length > 0 ? Math.max(...coaches.map((c) => c.id)) + 1 : 1,
        ...formValues,
        name: fullName,
      };
      setCoaches([...coaches, newCoach]);
    }

    handleClose();
  };

  // Form fields configuration for FormComponent
  const formFields = [
    { name: "firstName", label: "First Name", type: "text", required: true, placeholder: "John", width: 6 },
    { name: "lastName", label: "Last Name", type: "text", required: true, placeholder: "Doe", width: 6 },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "coach@example.com", width: 6 },
    { name: "phone", label: "Phone", type: "text", placeholder: "(123) 456-7890", width: 6 },
    { name: "specialty", label: "Specialty", type: "select", options: sportOptions,  width: 6 },
    { name: "schoolId", label: "School", type: "select", options: schoolOptions, width: 6 },
    { name: "bio", label: "Bio", type: "textarea", placeholder: "Coach's professional background, achievements, and coaching philosophy...", width: 12 },
  ];

  // Get initial values for edit form
  const getInitialValues = () => {
    if (editCoach) {
      const nameParts = editCoach.name ? editCoach.name.split(' ') : ["", ""];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";
      
      return {
        firstName,
        lastName,
        email: editCoach.email || "",
        phone: editCoach.phone || "",
        specialty: editCoach.specialty || "",
        schoolId: editCoach.schoolId || "",
        profileImage: editCoach.profileImage || null,
        bio: editCoach.bio || "",
      };
    }
    
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      schoolId: "",
      profileImage: null,
      bio: "",
    };
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
    <div className="">
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
      <Box sx={{ width: '100%' , px: 5, py: 2 }}>
      <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: { xs: 500, sm: 650 } }} aria-label="coaches table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f0f0f0' }}>
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
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mt: 2,
        mb: 2,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            size="small"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {[5, 10, 25].map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: '0.875rem' }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton 
            onClick={(e) => handleChangePage(e, page - 1)} 
            disabled={page === 0}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </IconButton>
          
          <Typography sx={{ mx: 2, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredCoaches.length)} of ${filteredCoaches.length}`}
          </Typography>
          
          <IconButton 
            onClick={(e) => handleChangePage(e, page + 1)} 
            disabled={page >= Math.ceil(filteredCoaches.length / rowsPerPage) - 1}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </IconButton>
        </Box>
      </Box>

      {/* Coach Form Dialog using FormComponent */}
      <FormComponent
        title={editCoach ? "Edit Coach" : "Add New Coach"}
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={editCoach ? "Update" : "Add"}
        initialValues={getInitialValues()}
        showAvatar={true}
        isDialog={true}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
}

export default Coaches;
