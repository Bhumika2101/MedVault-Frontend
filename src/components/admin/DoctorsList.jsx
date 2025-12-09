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
  Avatar,
  useMediaQuery,
  useTheme,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { People, CheckCircle, Cancel, Search, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import { adminAPI } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTES } from "../../utils/constants";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        `${doctor.firstName} ${doctor.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await adminAPI.getAllDoctors();
      setDoctors(response.data.data);
      setFilteredDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
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
            <People sx={{ fontSize: 40, mr: 2, color: "#667eea" }} />
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                Doctors List
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {doctors.length} doctors
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.ADMIN_CREATE_DOCTOR)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Add Doctor
          </Button>
        </Box>

        {/* Search */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search doctors by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <People sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text. secondary">
              No doctors found
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredDoctors.map((doctor, index) => (
              <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "2px solid",
                      borderColor: doctor.isActive
                        ? "success.light"
                        : "warning.light",
                      "&:hover": {
                        boxShadow: 4,
                      },
                      transition: "all 0. 3s ease",
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: doctor.isActive
                              ? "success. main"
                              : "warning.main",
                            mr: 2,
                            fontSize: 24,
                            fontWeight: 700,
                          }}
                        >
                          {doctor.firstName[0]}
                          {doctor.lastName[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight={600} noWrap>
                            Dr. {doctor.firstName} {doctor.lastName}
                          </Typography>
                          <Chip
                            size="small"
                            icon={
                              doctor.isActive ? <CheckCircle /> : <Cancel />
                            }
                            label={doctor.isActive ? "Active" : "Inactive"}
                            color={doctor.isActive ? "success" : "warning"}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          📧 {doctor.email}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          📞 {doctor.phoneNumber}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          📅 Joined: {format(new Date(doctor.createdAt), "PPP")}
                        </Typography>
                      </Box>

                      {!doctor.isActive && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 1.5,
                            bgcolor: "warning.light",
                            borderRadius: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="warning.dark"
                            fontWeight={600}
                          >
                            ⚠️ Awaiting password setup
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #667eea15 0%, #667eea30 100%)",
                border: "2px solid #667eea",
              }}
            >
              <Typography variant="h3" fontWeight={700} color="#667eea">
                {doctors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Doctors
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #43e97b15 0%, #43e97b30 100%)",
                border: "2px solid #43e97b",
              }}
            >
              <Typography variant="h3" fontWeight={700} color="#43e97b">
                {doctors.filter((d) => d.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #feca5715 0%, #feca5730 100%)",
                border: "2px solid #feca57",
              }}
            >
              <Typography variant="h3" fontWeight={700} color="#feca57">
                {doctors.filter((d) => !d.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background:
                  "linear-gradient(135deg, #f093fb15 0%, #f093fb30 100%)",
                border: "2px solid #f093fb",
              }}
            >
              <Typography variant="h3" fontWeight={700} color="#f093fb">
                {new Date().getFullYear()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default DoctorsList;
