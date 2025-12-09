import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
  Divider,
  ListItemIcon,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  Logout,
  LocalHospital,
  Dashboard,
  CalendarMonth,
  Folder,
  Notifications,
  Star,
  People,
  Assignment,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
    handleClose();
  };

  const handleDashboard = () => {
    const dashboardPath =
      user?.role === "ADMIN"
        ? ROUTES.ADMIN_DASHBOARD
        : user?.role === "DOCTOR"
        ? ROUTES.DOCTOR_DASHBOARD
        : ROUTES.PATIENT_DASHBOARD;
    navigate(dashboardPath);
    handleClose();
  };

  const handleProfile = () => {
    if (user?.role === "PATIENT") {
      navigate(ROUTES.PATIENT_PROFILE);
    } else if (user?.role === "DOCTOR") {
      navigate(ROUTES.DOCTOR_PROFILE);
    }
    handleClose();
  };

  // Don't show navbar on login/register pages
  const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.SET_PASSWORD];
  if (publicRoutes.includes(window.location.pathname)) {
    return null;
  }

  // Don't show if no user
  if (!user) {
    return null;
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { opacity: 0.9 },
          }}
          onClick={handleDashboard}
        >
          <LocalHospital sx={{ mr: 1.5, fontSize: 32 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 700, letterSpacing: "0.05em" }}
          >
            MedVault
          </Typography>
        </Box>

        {/* Navigation Links - Show on desktop only */}
        {user && !isMobile && (
          <Box sx={{ display: "flex", gap: 1, ml: 4 }}>
            {user.role === "PATIENT" && (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => navigate(ROUTES.PATIENT_DASHBOARD)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  startIcon={<CalendarMonth />}
                  onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Appointments
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Folder />}
                  onClick={() => navigate(ROUTES.PATIENT_RECORDS)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Records
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Star />}
                  onClick={() => navigate(ROUTES.PATIENT_FEEDBACK)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Feedback
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Notifications />}
                  onClick={() => navigate(ROUTES.PATIENT_NOTIFICATIONS)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Alerts
                </Button>
              </>
            )}
            {user.role === "DOCTOR" && (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => navigate(ROUTES.DOCTOR_DASHBOARD)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  startIcon={<Assignment />}
                  onClick={() => navigate(ROUTES.DOCTOR_APPOINTMENTS)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Appointments
                </Button>
              </>
            )}
            {user.role === "ADMIN" && (
              <>
                <Button
                  color="inherit"
                  startIcon={<Dashboard />}
                  onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  startIcon={<People />}
                  onClick={() => navigate(ROUTES.ADMIN_DOCTORS_LIST)}
                  sx={{
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Doctors
                </Button>
              </>
            )}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.3,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  display: "inline-block",
                }}
              >
                {user.role}
              </Typography>
            </Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.3)",
                  fontWeight: 700,
                }}
              >
                {user.firstName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleDashboard}>
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
              {(user.role === "PATIENT" || user.role === "DOCTOR") && (
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "error. main" }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
