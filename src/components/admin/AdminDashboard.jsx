import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  PersonAdd,
  People,
  Dashboard as DashboardIcon,
  LocalHospital,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const ActionCard = ({ title, description, icon, color, action, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.03, y: -5 }}
  >
    <Paper
      sx={{
        p: 4,
        height: "100%",
        cursor: "pointer",
        borderRadius: 3,
        border: `2px solid ${color}`,
        background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)`,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: `0 12px 28px ${color}40`,
        },
      }}
      onClick={action}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            boxShadow: `0 4px 12px ${color}60`,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: color,
            "&:hover": {
              background: color,
              opacity: 0.9,
            },
          }}
        >
          Get Started
        </Button>
      </Box>
      {/* Decorative circle */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: `${color}15`,
          bottom: -100,
          right: -100,
        }}
      />
    </Paper>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const actions = [
    {
      title: "Create New Doctor",
      description:
        "Add a new doctor to the MedVault system and send them an activation email",
      icon: <PersonAdd sx={{ fontSize: 32, color: "#fff" }} />,
      color: "#667eea",
      action: () => navigate(ROUTES.ADMIN_CREATE_DOCTOR),
      delay: 0.1,
    },
    {
      title: "Manage Doctors",
      description: "View and manage all registered doctors in the system",
      icon: <People sx={{ fontSize: 32, color: "#fff" }} />,
      color: "#f093fb",
      action: () => navigate(ROUTES.ADMIN_DOCTORS_LIST),
      delay: 0.2,
    },
  ];

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
        {/* Header Section */}
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
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <DashboardIcon sx={{ fontSize: 36 }} />
              </Box>
              <Box>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Manage doctors and system settings
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* Decorative elements */}
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

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, #667eea15 0%, #667eea30 100%)",
                border: "2px solid #667eea",
              }}
            >
              <LocalHospital sx={{ fontSize: 40, color: "#667eea", mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="#667eea">
                MedVault
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Status: Active
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Action Cards */}
        <Grid container spacing={3}>
          {actions.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <ActionCard {...item} />
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Paper
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            📋 Admin Guidelines
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text. secondary" gutterBottom>
                ✓ When creating a doctor, an activation email will be sent
                automatically
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ✓ Doctors must set their password before accessing the system
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ✓ Monitor doctor registrations and account statuses
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ✓ Ensure all doctor credentials are properly verified
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;
