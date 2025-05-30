import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  FormHelperText,
  CircularProgress,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

/**
 * Reusable Form Component
 * 
 * @param {Object} props
 * @param {string} props.title - Form title
 * @param {Array} props.fields - Array of field objects
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {string} props.submitButtonText - Text for the submit button
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.initialValues - Initial values for the form fields
 * @param {Function} props.validate - Custom validation function
 * @param {boolean} props.showAvatar - Whether to show avatar upload option
 * @param {Function} props.onCancel - Function to handle cancel button click
 * @param {boolean} props.isDialog - Whether the form is in a dialog
 * @param {boolean} props.open - Whether the dialog is open (if isDialog is true)
 * @param {Function} props.handleClose - Function to close the dialog (if isDialog is true)
 */
const FormComponent = ({
  title,
  fields = [],
  onSubmit,
  submitButtonText = 'Submit',
  loading = false,
  initialValues = {},
  validate = null,
  showAvatar = false,
  onCancel = null,
  isDialog = false,
  open = false,
  handleClose = null,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormValues({
        ...formValues,
        profileImage: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    let formErrors = {};
    let isValid = true;

    // Basic validation for required fields
    fields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        formErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    // Custom validation if provided
    if (validate) {
      const customErrors = validate(formValues);
      if (customErrors && Object.keys(customErrors).length > 0) {
        formErrors = { ...formErrors, ...customErrors };
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(formErrors);
      return;
    }

    // Submit form if valid
    onSubmit(formValues);
  };

  const renderField = (field) => {
    const { type, name, label, options, helperText, placeholder, width = 12, ...rest } = field;
    
    switch (type) {
      case 'select':
        return (
          <Grid item xs={6} sm={width} sx={{ width: width === 6 ? '48%' : '100%' }}>
            <FormControl 
              fullWidth 
              margin="dense" 
              error={!!errors[name]}
            >
              <InputLabel id={`${name}-label`}>{label}</InputLabel>
              <Select
                labelId={`${name}-label`}
                id={name}
                name={name}
                value={formValues[name] || ''}
                onChange={handleChange}
                label={label}
                sx={{ borderRadius: 1.5 }}
                {...rest}
              >
                <MenuItem value="">
                  <em>Select {label.toLowerCase()}</em>
                </MenuItem>
                {options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.icon && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                          src={option.icon} 
                          alt={option.label} 
                          style={{ width: 24, height: 24 }} 
                        />
                        {option.label}
                      </Box>
                    )}
                    {!option.icon && option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors[name] || helperText || ''}</FormHelperText>
            </FormControl>
          </Grid>
        );
        
      case 'checkbox':
        return (
          <Grid item xs={12} sm={width} sx={{ width: width === 6 ? '48%' : '100%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  name={name}
                  checked={!!formValues[name]}
                  onChange={handleChange}
                  {...rest}
                />
              }
              label={label}
            />
            {errors[name] && <FormHelperText error>{errors[name]}</FormHelperText>}
          </Grid>
        );
        
      case 'textarea':
        return (
            <Grid item xs={6} sm={width} sx={{ width: width === 6 ? '48%' : '100%' }}>
            <TextField
              fullWidth
              margin="dense"
              id={name}
              name={name}
              label={label}
              value={formValues[name] || ''}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              error={!!errors[name]}
              helperText={errors[name] || helperText || ''}
              placeholder={placeholder || ''}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
              {...rest}
            />
          </Grid>
        );
        
      default: // text, email, password, number, etc.
        return (
          <Grid item xs={12} sm={width} sx={{ width: width === 6 ? '48%' : '100%' }}>
            <TextField
              fullWidth
              margin="dense"
              id={name}
              name={name}
              label={label}
              type={type || 'text'}
              variant="outlined"
              value={formValues[name] || ''}
              onChange={handleChange}
              error={!!errors[name]}
              helperText={errors[name] || helperText || ''}
              placeholder={placeholder || ''}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
              {...rest}
            />
          </Grid>
        );
    }
  };

  const formContent = (
    <>
      {title && !isDialog && (
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            color: '#1C7293',
            fontWeight: 'bold'
          }}
        >
          {title}
        </Typography>
      )}
      
      <Grid container spacing={2} sx={{ maxWidth: '95%' }}>
        {showAvatar && (
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
                {formValues.profileImage ? (
                  <>
                    <Avatar 
                      src={URL.createObjectURL(formValues.profileImage)} 
                      alt="Preview"
                      sx={{ width: 100, height: 100, mb: 1, boxShadow: 1 }}
                    />
                    <Typography variant="body2" color="primary">
                      {formValues.profileImage.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => setFormValues({...formValues, profileImage: null})}
                        color="error"
                      >
                        Remove
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        component="label"
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
                          mb: 2, 
                          bgcolor: "rgba(28,114,147,0.2)",
                          color: "#1C7293"
                        }}
                      >
                      </Avatar>
                      <Button
                        className="!bg-[#daf1f9] border border-white !text-[#1C7293]"
                        component="label"
                        sx={{ 
                          position: 'absolute',
                          bottom: 12,
                          right: -2,
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
        )}
        
        {fields.map(renderField)}
      </Grid>
    </>
  );

  const formActions = (
    <Box sx={isDialog ? { justifyContent: 'center', pb: 3, gap: 2 } : { display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
      {(onCancel || handleClose) && (
        <Button 
          onClick={onCancel || handleClose} 
          variant="outlined"
          sx={{ 
            px: 3, 
            borderRadius: 6,
            color: 'text.secondary',
            borderColor: 'text.secondary',
            '&:hover': {
              borderColor: 'text.primary',
              bgcolor: 'rgba(0,0,0,0.03)'
            },
            mx: 2
          }}
        >
          Cancel
        </Button>
      )}
      <Button 
        type="submit" 
        variant="contained" 
        sx={{ 
          px: 4, 
          borderRadius: 6,
          bgcolor: '#1C7293',
          '&:hover': {
            bgcolor: '#14576F'
          }
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : submitButtonText}
      </Button>
    </Box>
  );

  if (isDialog) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#1C7293', color: 'white' }}>{title}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            px: 4 
          }}>
            {formContent}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
            {formActions}
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ 
      mt: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      
      {formContent}
      {formActions}
    </Box>
  );
};

export default FormComponent; 