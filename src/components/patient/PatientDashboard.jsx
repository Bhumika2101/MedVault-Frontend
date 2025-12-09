  import React, { useEffect, useState } from "react";
  import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Chip,
    Button,
    Skeleton,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  import {
    CalendarMonth,
    Folder,
    Notifications,
    ArrowForward,
    EventAvailable,
    Add,
    TrendingUp,
  } from "@mui/icons-material";
  import { motion } from "framer-motion";
  import { patientAPI, appointmentAPI } from "../../api/endpoints";
  import { useNavigate } from "react-router-dom";
  import { format } from "date-fns";
  import { toast } from "react-toastify";
  import { ROUTES } from "../../utils/constants";

  const StatCard = ({ title, value, icon, color, onClick, trend }) => (
    <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }}>
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
          border: `2px solid ${color}`,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            boxShadow: `0 8px 24px ${color}40`,
          },
        }}
        onClick={onClick}
      >
        <CardContent sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                color="text.secondary"
                gutterBottom
                variant="body2"
                fontWeight={500}
              >
                {title}
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ color, mb: 1 }}>
                {value}
              </Typography>
              {trend && (
                <Chip
                  icon={<TrendingUp />}
                  label={trend}
                  size="small"
                  sx={{ bgcolor: `${color}20`, color, fontWeight: 600 }}
                />
              )}
            </Box>
            <Box
              sx={{
                bgcolor: color,
                borderRadius: "50%",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${color}40`,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
        {/* Decorative circle */}
        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            bgcolor: `${color}10`,
            top: -100,
            right: -100,
          }}
        />
      </Card>
    </motion.div>
  );

  const PatientDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
      fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [dashboardRes, appointmentsRes] = await Promise.all([
          patientAPI.getDashboard(),
          appointmentAPI.getMyAppointments(),
        ]);

        console.log("📊 Dashboard Response:", dashboardRes.data);
        console.log("📅 Appointments Response:", appointmentsRes.data);

        // Set dashboard data
        const dashboardData = dashboardRes.data.data;
        console.log("Dashboard Data:", dashboardData);
        setDashboard(dashboardData);

        // Filter upcoming appointments
        const allAppointments = appointmentsRes.data.data || [];
        console.log("All appointments:", allAppointments);

        const upcoming = allAppointments
          .filter((apt) => {
            const isUpcoming =
              apt.status === "APPROVED" || apt.status === "PENDING";
            const isFuture = new Date(apt.appointmentDateTime) > new Date();
            console.log(
              `Appointment ${apt.id}: status=${apt.status}, isFuture=${isFuture}`
            );
            return isUpcoming && isFuture;
          })
          .sort(
            (a, b) =>
              new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
          )
          .slice(0, 3);

        console.log("Upcoming appointments filtered:", upcoming);
        setUpcomingAppointments(upcoming);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        // Show more detailed error message
        if (error.response?.status === 500) {
          toast.error(
            "Server error loading dashboard. Please try again or contact support."
          );
        } else if (error.message === "Authentication required") {
          toast.error("Please login to continue");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
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
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ mb: 3, borderRadius: 3 }}
          />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={150}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))}
          </Grid>
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
          {/* Welcome Section */}
          <Paper
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Welcome back, {dashboard?.user?.firstName || dashboard?.userName}!
                👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                Here's an overview of your health records
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate(ROUTES.PATIENT_BOOK_APPOINTMENT)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                Book Appointment
              </Button>
            </Box>
            {/* Decorative circles */}
            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.1)",
                top: -150,
                right: -150,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.1)",
                bottom: -100,
                left: -50,
              }}
            />
          </Paper>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Total Appointments"
                value={dashboard?.statistics?.totalAppointments || 0}
                icon={<CalendarMonth sx={{ color: "#fff", fontSize: 30 }} />}
                color="#667eea"
                onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Upcoming"
                value={upcomingAppointments.length}
                icon={<EventAvailable sx={{ color: "#fff", fontSize: 30 }} />}
                color="#f093fb"
                onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Medical Records"
                value={dashboard?.statistics?.totalMedicalRecords || 0}
                icon={<Folder sx={{ color: "#fff", fontSize: 30 }} />}
                color="#4facfe"
                onClick={() => navigate(ROUTES.PATIENT_RECORDS)}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard
                title="Notifications"
                value={dashboard?.statistics?.unreadNotifications || 0}
                icon={<Notifications sx={{ color: "#fff", fontSize: 30 }} />}
                color="#43e97b"
                onClick={() => navigate(ROUTES.PATIENT_NOTIFICATIONS)}
              />
            </Grid>
          </Grid>

          {/* Upcoming Appointments Section */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Upcoming Appointments
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your scheduled consultations
                </Typography>
              </Box>
              <IconButton
                color="primary"
                onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
                sx={{
                  bgcolor: "primary.light",
                  "&:hover": { bgcolor: "primary.main", color: "#fff" },
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>

            {upcomingAppointments.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CalendarMonth
                  sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                />
                <Typography color="text.secondary" variant="h6" gutterBottom>
                  No upcoming appointments
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 3 }}>
                  Book an appointment with our specialists
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
                  Book Now
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {upcomingAppointments.map((appointment, index) => (
                  <Grid item xs={12} key={appointment.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: "none",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0. 3s ease",
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  mb: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background:
                                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 18,
                                  }}
                                >
                                  {appointment.doctorName?.split(" ")[0]?.[0]}
                                  {appointment.doctorName?.split(" ")[1]?.[0]}
                                </Box>
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {appointment.doctorName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {appointment.doctorSpecialization}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ ml: 8 }}>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  📅{" "}
                                  {format(
                                    new Date(appointment.appointmentDateTime),
                                    "PPP p"
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {appointment.reasonForVisit}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{ textAlign: { sm: "right" } }}
                            >
                              <Chip
                                label={appointment.status}
                                color={getStatusColor(appointment.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-4px)",
                  },
                  transition: "all 0. 3s ease",
                }}
                onClick={() => navigate(ROUTES.PATIENT_RECORDS)}
              >
                <Folder sx={{ fontSize: 40, color: "#4facfe", mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Medical Records
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your medical documents
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transform: "translateY(-4px)",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={() => navigate(ROUTES.PATIENT_UPLOAD_RECORD)}
              >
                <Add sx={{ fontSize: 40, color: "#43e97b", mb: 2 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Upload Record
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add new medical records to your vault
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    );
  };

  export default PatientDashboard;
