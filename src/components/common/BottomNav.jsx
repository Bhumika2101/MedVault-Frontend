import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  CalendarMonth,
  Folder,
  Notifications,
  Person,
  Assignment,
  People,
  Star,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile || !user) {
    return null;
  }

  // Don't show on login/register pages
  const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.SET_PASSWORD];
  if (publicRoutes.includes(location.pathname)) {
    return null;
  }

  const patientNavItems = [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.PATIENT_DASHBOARD },
    {
      label: "Appointments",
      icon: <CalendarMonth />,
      path: ROUTES.PATIENT_APPOINTMENTS,
    },
    { label: "Records", icon: <Folder />, path: ROUTES.PATIENT_RECORDS },
    {
      label: "Feedback",
      icon: <Star />,
      path: ROUTES.PATIENT_FEEDBACK,
    },
    {
      label: "Alerts",
      icon: <Notifications />,
      path: ROUTES.PATIENT_NOTIFICATIONS,
    },
  ];

  const doctorNavItems = [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.DOCTOR_DASHBOARD },
    {
      label: "Appointments",
      icon: <Assignment />,
      path: ROUTES.DOCTOR_APPOINTMENTS,
    },
    { label: "Profile", icon: <Person />, path: ROUTES.DOCTOR_PROFILE },
  ];

  const adminNavItems = [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.ADMIN_DASHBOARD },
    { label: "Doctors", icon: <People />, path: ROUTES.ADMIN_DOCTORS_LIST },
  ];

  const getNavItems = () => {
    switch (user.role) {
      case "PATIENT":
        return patientNavItems;
      case "DOCTOR":
        return doctorNavItems;
      case "ADMIN":
        return adminNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const currentValue = navItems.findIndex(
    (item) => location.pathname === item.path
  );

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: "1px solid",
        borderColor: "divider",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentValue}
        onChange={(event, newValue) => {
          navigate(navItems[newValue].path);
        }}
        showLabels
        sx={{
          height: 70,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            padding: "6px 12px",
            color: "text.secondary",
            transition: "all 0.3s ease",
          },
          "& . Mui-selected": {
            color: "#667eea",
            transform: "translateY(-4px)",
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.75rem",
            "&.Mui-selected": {
              fontSize: "0.75rem",
              fontWeight: 600,
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
