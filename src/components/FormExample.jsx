import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Box, Button, Grid, TextField,
  InputLabel, FormControl, Select, MenuItem, FormHelperText
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";

const FormDialog = ({
  open,
  isMobile,
  isEdit,
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  handleClose,
  options,
  setFormData,
  title,
  fields,
  primaryColor = "#1C7293",
  secondaryColor = "#fafdff",
  accentColor = "#daf1f9"
}) => {
  return (
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
          bgcolor: secondaryColor,
          borderLeft: `8px solid ${primaryColor}`,
          p: 0,
          overflow: "visible",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: -3 }}>
        <Avatar sx={{ bgcolor: primaryColor, width: 64, height: 64, boxShadow: 3, mb: 1 }}>
          <PersonIcon sx={{ fontSize: 36, color: "white" }} />
        </Avatar>
      </Box>

      <DialogTitle
        sx={{
          textAlign: "center",
          color: primaryColor,
          fontWeight: 700,
          fontSize: isMobile ? "1.25rem" : "1.5rem",
          letterSpacing: 1,
          py: isMobile ? 1.5 : 2,
          mb: -2,
        }}
      >
        {isEdit ? `Edit ${title}` : `Add New ${title}`}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: isMobile ? 2 : 6,
            pt: isMobile ? 4 : 6,
            pb: isMobile ? 2 : 4,
            maxHeight: isMobile ? "calc(100dvh - 180px)" : "calc(100vh - 220px)",
            overflowY: "auto",
            gap: 2,
          }}
        >
          {/* Profile Image Upload */}
          {fields.some(field => field.type === 'image') && (
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={formData.profileImage ? URL.createObjectURL(formData.profileImage) : ""}
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    bgcolor: formData.profileImage ? "transparent" : `${primaryColor}10`,
                    color: primaryColor,
                    boxShadow: 2,
                  }}
                />
                <Button
                  component="label"
                  className={`!bg-[${accentColor}] border border-white !text-[${primaryColor}]`}
                  sx={{
                    position: "absolute", bottom: 0, right: 0,
                    borderRadius: "50%", minWidth: "auto", padding: "4px",
                    width: { xs: "22px", sm: "28px" }, height: { xs: "22px", sm: "28px" },
                  }}
                >
                  <AddIcon fontSize="small" />
                  <input accept="image/*" type="file" hidden onChange={handleFileChange} />
                </Button>
              </Box>
              {formData.profileImage && (
                <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem" }}>{formData.profileImage.name}</span>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => setFormData({ ...formData, profileImage: null })}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Form Fields */}
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={field.width || 12} key={field.name}>
                {field.type === 'select' ? (
                  <FormControl fullWidth size="small">
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      label={field.label}
                    >
                      <MenuItem value=""><em>{field.placeholder || `Select ${field.label}`}</em></MenuItem>
                      {options[field.name]?.map((option) => (
                        <MenuItem key={option.value || option.id} value={option.value || option.id}>
                          {option.icon ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <img src={option.icon} alt={option.label || option.name} width={20} height={20} />
                              {option.label || option.name}
                            </Box>
                          ) : (
                            option.label || option.name
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    label={field.label}
                    name={field.name}
                    type={field.type || 'text'}
                    fullWidth
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    size="small"
                    multiline={field.multiline}
                    rows={field.rows}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, color: primaryColor }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ borderRadius: 2, bgcolor: primaryColor }}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
