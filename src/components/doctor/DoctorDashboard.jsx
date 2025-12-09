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
  Button,
  Chip,
  Avatar,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Assignment,
  CheckCircle,
  Star,
  Pending,
  ArrowForward,
  Schedule,
  Person,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { doctorAPI, appointmentAPI } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTES } from "../../utils/constants";

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <motion.div whileHover={{ scale: 1.05, y: -5 }}>
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
        border: `2px solid ${color}`,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            <Typography variant="h3" fontWeight={700} sx={{ color, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
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
      <Box
        sx={{
          position: "absolute",
          width: 150,
          height: 150,
          borderRadius: "50%",
          bgcolor: `${color}10`,
          top: -75,
          right: -75,
        }}
      />
    </Card>
  </motion.div>
);

const DoctorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashboardRes, appointmentsRes] = await Promise.all([
        doctorAPI.getDashboard(),
        appointmentAPI.getMyAppointments(),
      ]);
      setDashboard(dashboardRes.data.data);

      const pending = appointmentsRes.data.data
        .filter((apt) => apt.status === "PENDING")
        .sort(
          (a, b) =>
            new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
        )
        .slice(0, 5);
      setPendingAppointments(pending);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "rgba(255,255,255,0.3)",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {dashboard?.userName?.split(" ")[0]?.[0]}
              </Avatar>
              <Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                  {dashboard?.userName}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Welcome to your dashboard
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Schedule />}
              onClick={() => navigate(ROUTES.DOCTOR_APPOINTMENTS)}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              View All Appointments
            </Button>
          </Box>
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
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <StatCard
              title="Total Appointments"
              value={dashboard?.statistics?.totalAppointments || 0}
              icon={<Assignment sx={{ color: "#fff", fontSize: 30 }} />}
              color="#667eea"
              subtitle="All time"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              title="Pending"
              value={dashboard?.statistics?.pendingAppointments || 0}
              icon={<Pending sx={{ color: "#fff", fontSize: 30 }} />}
              color="#f093fb"
              subtitle="Awaiting review"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              title="Average Rating"
              value={(dashboard?.statistics?.averageRating || 0).toFixed(1)}
              icon={<Star sx={{ color: "#fff", fontSize: 30 }} />}
              color="#feca57"
              subtitle={`${dashboard?.statistics?.totalFeedbacks || 0} reviews`}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              title="Total Feedbacks"
              value={dashboard?.statistics?.totalFeedbacks || 0}
              icon={<CheckCircle sx={{ color: "#fff", fontSize: 30 }} />}
              color="#43e97b"
              subtitle="Patient reviews"
            />
          </Grid>
        </Grid>

        {/* Pending Appointments Section */}
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
                Pending Appointments
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Appointments awaiting your review
              </Typography>
            </Box>
            <IconButton
              color="primary"
              onClick={() => navigate(ROUTES.DOCTOR_APPOINTMENTS)}
              sx={{
                bgcolor: "primary.light",
                "&:hover": { bgcolor: "primary.main", color: "#fff" },
              }}
            >
              <ArrowForward />
            </IconButton>
          </Box>

          {pendingAppointments.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CheckCircle
                sx={{ fontSize: 64, color: "success.light", mb: 2 }}
              />
              <Typography color="text.secondary" variant="h6" gutterBottom>
                All caught up!
              </Typography>
              <Typography color="text.secondary" variant="body2">
                No pending appointments to review
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {pendingAppointments.map((appointment, index) => (
                <Grid item xs={12} key={appointment.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        border: "2px solid",
                        borderColor: "warning.light",
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
                          <Grid item xs={12} md={7}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 1,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "primary.light",
                                  width: 48,
                                  height: 48,
                                }}
                              >
                                <Person />
                              </Avatar>
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
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
                            </Box>
                            <Box sx={{ ml: 8 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <strong>Reason:</strong>{" "}
                                {appointment.reasonForVisit}
                              </Typography>
                              {appointment.symptoms && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  <strong>Symptoms:</strong>{" "}
                                  {appointment.symptoms}
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                                justifyContent: { md: "flex-end" },
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  navigate(ROUTES.DOCTOR_APPOINTMENTS)
                                }
                                fullWidth={isMobile}
                              >
                                Review
                              </Button>
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
        </Paper>
      </motion.div>
    </Container>
  );
};

export default DoctorDashboard;
