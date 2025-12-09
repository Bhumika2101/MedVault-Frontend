import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Divider,
  Alert,
} from "@mui/material";
import {
  CalendarMonth,
  Search,
  LocalHospital,
  Person,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { doctorAPI, appointmentAPI } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    appointmentDateTime: "",
    reasonForVisit: "",
    symptoms: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingDoctors, setFetchingDoctors] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllActiveDoctors();
      setDoctors(response.data.data);
    } catch (error) {
      toast.error("Failed to load doctors");
    } finally {
      setFetchingDoctors(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Please select a doctor");
      return;
    }

    setLoading(true);
    try {
      await appointmentAPI.bookAppointment({
        doctorId: selectedDoctor.id,
        ...formData,
      });
      toast.success("Appointment booked successfully!");
      navigate(ROUTES.PATIENT_APPOINTMENTS);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().slice(0, 16);

  return (
    <Container
      maxWidth="lg"
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
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <CalendarMonth sx={{ fontSize: 40, mr: 2, color: "#667eea" }} />
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
              Book Appointment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a doctor and schedule your consultation
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Doctors List */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Select Doctor
              </Typography>

              <TextField
                fullWidth
                placeholder="Search doctors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
                {fetchingDoctors ? (
                  <Typography color="text.secondary" textAlign="center" py={4}>
                    Loading doctors...
                  </Typography>
                ) : filteredDoctors.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Person
                      sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      No doctors found
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {filteredDoctors.map((doctor) => (
                      <Grid item xs={12} key={doctor.id}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            sx={{
                              cursor: "pointer",
                              border: "2px solid",
                              borderColor:
                                selectedDoctor?.id === doctor.id
                                  ? "primary.main"
                                  : "divider",
                              bgcolor:
                                selectedDoctor?.id === doctor.id
                                  ? "primary.light"
                                  : "background.paper",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: 3,
                                borderColor: "primary.main",
                              },
                            }}
                            onClick={() => setSelectedDoctor(doctor)}
                          >
                            <CardContent>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: "primary.main",
                                    fontSize: 24,
                                    fontWeight: 700,
                                  }}
                                >
                                  {doctor.firstName[0]}
                                  {doctor.lastName[0]}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    Dr. {doctor.firstName} {doctor.lastName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {doctor.email}
                                  </Typography>
                                </Box>
                                {selectedDoctor?.id === doctor.id && (
                                  <Chip
                                    label="Selected"
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Appointment Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Appointment Details
              </Typography>

              <AnimatePresence mode="wait">
                {selectedDoctor ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <form onSubmit={handleSubmit}>
                      {/* Selected Doctor Info */}
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {selectedDoctor.firstName[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Dr. {selectedDoctor.firstName}{" "}
                              {selectedDoctor.lastName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {selectedDoctor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Alert>

                      <Divider sx={{ mb: 3 }} />

                      <TextField
                        fullWidth
                        label="Appointment Date & Time"
                        name="appointmentDateTime"
                        type="datetime-local"
                        value={formData.appointmentDateTime}
                        onChange={handleChange}
                        required
                        sx={{ mb: 3 }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}
                      />

                      <TextField
                        fullWidth
                        label="Reason for Visit"
                        name="reasonForVisit"
                        value={formData.reasonForVisit}
                        onChange={handleChange}
                        required
                        multiline
                        rows={3}
                        sx={{ mb: 3 }}
                        placeholder="E.g., Regular checkup, Follow-up consultation..."
                      />

                      <TextField
                        fullWidth
                        label="Symptoms (Optional)"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        sx={{ mb: 3 }}
                        placeholder="Describe any symptoms you're experiencing..."
                      />

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          fullWidth
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            },
                          }}
                        >
                          {loading ? "Booking..." : "Book Appointment"}
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="large"
                          onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Box sx={{ textAlign: "center", py: 8 }}>
                      <LocalHospital
                        sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Select a Doctor
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Choose a doctor from the list to continue
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default BookAppointment;
