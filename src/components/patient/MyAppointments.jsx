import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import { CalendarMonth, Add, EventBusy } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { appointmentAPI } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTES } from "../../utils/constants";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [tabValue, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    switch (tabValue) {
      case 0: // All
        break;
      case 1: // Pending
        filtered = filtered.filter((apt) => apt.status === "PENDING");
        break;
      case 2: // Approved
        filtered = filtered.filter((apt) => apt.status === "APPROVED");
        break;
      case 3: // Completed
        filtered = filtered.filter((apt) => apt.status === "COMPLETED");
        break;
      default:
        break;
    }

    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      case "COMPLETED":
        return "info";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      APPROVED: "✓",
      PENDING: "⏳",
      REJECTED: "✗",
      COMPLETED: "✓",
      CANCELLED: "⊘",
    };
    return icons[status] || "•";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: isMobile ? 10 : 4 }}>
        <Typography>Loading... </Typography>
      </Container>
    );
  }

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonth sx={{ fontSize: 40, mr: 2, color: "#667eea" }} />
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                My Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {appointments.length} appointments
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.PATIENT_BOOK_APPOINTMENT)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Book New
          </Button>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                py: 2,
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Completed" />
          </Tabs>
        </Paper>

        {/* Appointments List */}
        <AnimatePresence mode="wait">
          {filteredAppointments.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <EventBusy
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No appointments found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Book your first appointment to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate(ROUTES.PATIENT_BOOK_APPOINTMENT)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Book Appointment
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {filteredAppointments.map((appointment, index) => (
                <Grid item xs={12} key={appointment.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: "2px solid",
                        borderColor: `${getStatusColor(
                          appointment.status
                        )}.light`,
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(-4px)",
                        },
                        transition: "all 0. 3s ease",
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 56,
                                  height: 56,
                                  bgcolor: "primary. main",
                                  fontSize: 20,
                                  fontWeight: 700,
                                }}
                              >
                                {appointment.doctorName?.split(" ")[0]?.[0]}
                                {appointment.doctorName?.split(" ")[1]?.[0]}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight={600}>
                                  {appointment.doctorName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {appointment.doctorSpecialization}
                                </Typography>
                              </Box>
                              <Chip
                                label={`${getStatusIcon(appointment.status)} ${
                                  appointment.status
                                }`}
                                color={getStatusColor(appointment.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>

                            <Box sx={{ pl: 9 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                📅 <strong>Date:</strong>{" "}
                                {format(
                                  new Date(appointment.appointmentDateTime),
                                  "PPP p"
                                )}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                💬 <strong>Reason:</strong>{" "}
                                {appointment.reasonForVisit}
                              </Typography>
                              {appointment.symptoms && (
                                <Typography
                                  variant="body2"
                                  sx={{ mb: 1 }}
                                  color="text.secondary"
                                >
                                  🩺 <strong>Symptoms:</strong>{" "}
                                  {appointment.symptoms}
                                </Typography>
                              )}
                              {appointment.doctorNotes && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: "info.light",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography variant="body2" color="info.dark">
                                    <strong>Doctor's Notes:</strong>{" "}
                                    {appointment.doctorNotes}
                                  </Typography>
                                </Box>
                              )}
                              {appointment.rejectionReason && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: "error.light",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="error. dark"
                                  >
                                    <strong>Rejection Reason:</strong>{" "}
                                    {appointment.rejectionReason}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              {appointment.status === "COMPLETED" && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                >
                                  Leave Feedback
                                </Button>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
};

export default MyAppointments;
