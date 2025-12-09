import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import { Assignment, CheckCircle, Cancel, Person } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { appointmentAPI } from "../../api/endpoints";
import { format } from "date-fns";
import { toast } from "react-toastify";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [actionDialog, setActionDialog] = useState(false);
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
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
      case 0: // Pending
        filtered = filtered.filter((apt) => apt.status === "PENDING");
        break;
      case 1: // Approved
        filtered = filtered.filter((apt) => apt.status === "APPROVED");
        break;
      case 2: // Completed
        filtered = filtered.filter((apt) => apt.status === "COMPLETED");
        break;
      case 3: // All
        break;
      default:
        break;
    }

    setFilteredAppointments(filtered);
  };

  const handleActionClick = (appointment, actionType) => {
    setSelectedAppointment(appointment);
    setAction(actionType);
    setNotes("");
    setRejectionReason("");
    setActionDialog(true);
  };

  const handleActionConfirm = async () => {
    try {
      await appointmentAPI.updateStatus(
        selectedAppointment.id,
        action,
        action === "APPROVED" || action === "COMPLETED" ? notes : null,
        action === "REJECTED" ? rejectionReason : null
      );
      toast.success(`Appointment ${action.toLowerCase()} successfully`);
      setActionDialog(false);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment");
    }
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
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: isMobile ? 10 : 4 }}>
        <Typography>Loading...</Typography>
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Assignment sx={{ fontSize: 40, mr: 2, color: "#667eea" }} />
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
              Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your patient appointments
            </Typography>
          </Box>
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
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Completed" />
            <Tab label="All" />
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
                <CheckCircle
                  sx={{ fontSize: 80, color: "success.light", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  No appointments found
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {filteredAppointments.map((appointment, index) => (
                <Grid item xs={12} key={appointment.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "primary.light",
                                  width: 56,
                                  height: 56,
                                }}
                              >
                                <Person sx={{ fontSize: 32 }} />
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight={600}>
                                  {appointment.patientName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  📅{" "}
                                  {format(
                                    new Date(appointment.appointmentDateTime),
                                    "PPP p"
                                  )}
                                </Typography>
                              </Box>
                              <Chip
                                label={appointment.status}
                                color={getStatusColor(appointment.status)}
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>

                            <Box sx={{ pl: 9 }}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Reason:</strong>{" "}
                                {appointment.reasonForVisit}
                              </Typography>
                              {appointment.symptoms && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  <strong>Symptoms:</strong>{" "}
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
                                    <strong>Your Notes:</strong>{" "}
                                    {appointment.doctorNotes}
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
                              {appointment.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircle />}
                                    onClick={() =>
                                      handleActionClick(appointment, "APPROVED")
                                    }
                                    fullWidth
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Cancel />}
                                    onClick={() =>
                                      handleActionClick(appointment, "REJECTED")
                                    }
                                    fullWidth
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {appointment.status === "APPROVED" && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleActionClick(appointment, "COMPLETED")
                                  }
                                  fullWidth
                                >
                                  Mark Completed
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

        {/* Action Dialog */}
        <Dialog
          open={actionDialog}
          onClose={() => setActionDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>
            {action === "REJECTED"
              ? "Reject Appointment"
              : `${action} Appointment`}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {action === "REJECTED" ? (
                <TextField
                  fullWidth
                  label="Rejection Reason"
                  multiline
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  placeholder="Please provide a reason for rejection..."
                />
              ) : (
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes for the patient..."
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog(false)}>Cancel</Button>
            <Button
              onClick={handleActionConfirm}
              variant="contained"
              color={action === "REJECTED" ? "error" : "primary"}
              disabled={action === "REJECTED" && !rejectionReason}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AppointmentsList;
