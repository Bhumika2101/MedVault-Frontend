import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { PersonAdd, ArrowBack, ArrowForward } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { adminAPI } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const CreateDoctor = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    specialization: "",
    licenseNumber: "",
    qualification: "",
    experienceYears: "",
    bio: "",
    hospitalAffiliation: "",
    consultationFee: "",
    availableTimings: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const steps = [
    "Basic Information",
    "Professional Details",
    "Additional Information",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleNext = () => {
    // Validation for each step
    if (activeStep === 0) {
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.phoneNumber
      ) {
        setError("Please fill in all required fields");
        return;
      }
      if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
        setError("Phone number must be 10 digits");
        return;
      }
    } else if (activeStep === 1) {
      if (
        !formData.specialization ||
        !formData.licenseNumber ||
        !formData.qualification
      ) {
        setError("Please fill in all required fields");
        return;
      }
    }

    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminAPI.createDoctor(formData);
      toast.success(
        "Doctor created successfully!  Email sent for password setup."
      );
      navigate(ROUTES.ADMIN_DOCTORS_LIST);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                helperText="Activation email will be sent to this address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                helperText="10 digit number"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="e.g., Cardiologist, Dermatologist"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="e.g., MBBS, MD"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (Years)"
                name="experienceYears"
                type="number"
                value={formData.experienceYears}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Hospital Affiliation"
                name="hospitalAffiliation"
                value={formData.hospitalAffiliation}
                onChange={handleChange}
                placeholder="Current hospital or clinic"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consultation Fee"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="e.g., $100"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Available Timings"
                name="availableTimings"
                value={formData.availableTimings}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri: 9AM-5PM"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief professional biography..."
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: isMobile ? 10 : 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <PersonAdd sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Create New Doctor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new doctor to the MedVault system
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            An activation email will be automatically sent to the doctor's email
            address
          </Alert>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{ flex: 1 }}
                >
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    flex: 1,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                  }}
                >
                  {loading ? "Creating..." : "Create Doctor"}
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </form>

          {/* Info Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              📧 What happens next?
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              1. Doctor will receive an email with a secure link
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              2. They can set their password using the link (valid for 24 hours)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              3. Once password is set, they can login and access the system
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default CreateDoctor;
