import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ROUTES } from "./utils/constants";

// Common Components
import Navbar from "./components/common/Navbar";
import BottomNav from "./components/common/BottomNav";
import Loader from "./components/common/Loader";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Auth Pages
import Login from "./pages/Login";
import PatientRegistration from "./pages/PatientRegistration";
import SetPassword from "./pages/SetPassword";
import ServerError from "./pages/ServerError";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateDoctor from "./components/admin/CreateDoctor";
import DoctorsList from "./components/admin/DoctorsList";

// Patient Components
import PatientDashboard from "./components/patient/PatientDashboard";
import BookAppointment from "./components/patient/BookAppointment";
import MyAppointments from "./components/patient/MyAppointments";
import MedicalRecords from "./components/patient/MedicalRecords";
import UploadRecord from "./components/patient/UploadRecord";
import Notifications from "./components/patient/Notifications";
import GiveFeedback from "./components/patient/GiveFeedback";

// Doctor Components
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import AppointmentsList from "./components/doctor/AppointmentsList";

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8b9ff5",
      dark: "#4c5ed4",
    },
    secondary: {
      main: "#764ba2",
      light: "#9168b8",
      dark: "#5d3a81",
    },
    success: {
      main: "#43e97b",
      light: "#69ee95",
      dark: "#2ec762",
    },
    error: {
      main: "#ff6b6b",
      light: "#ff8888",
      dark: "#e85555",
    },
    warning: {
      main: "#feca57",
      light: "#fed778",
      dark: "#e5b44f",
    },
    info: {
      main: "#4facfe",
      light: "#72bdfe",
      dark: "#3a8bcd",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 600,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
        contained: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});

// App Content Component
function AppContent() {
  const { loading, serverConnected, serverError, retryConnection } = useAuth();

  if (loading) {
    return <Loader message="Connecting to server..." />;
  }

  if (serverError || !serverConnected) {
    return <ServerError onRetry={retryConnection} />;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "100vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<PatientRegistration />} />
          <Route path={ROUTES.SET_PASSWORD} element={<SetPassword />} />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_CREATE_DOCTOR}
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <CreateDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_DOCTORS_LIST}
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DoctorsList />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path={ROUTES.PATIENT_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_BOOK_APPOINTMENT}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_APPOINTMENTS}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_RECORDS}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <MedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_UPLOAD_RECORD}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <UploadRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_NOTIFICATIONS}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_FEEDBACK}
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <GiveFeedback />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path={ROUTES.DOCTOR_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DOCTOR_APPOINTMENTS}
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <AppointmentsList />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Box>
      <BottomNav />
    </>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
