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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Folder,
  Add,
  Delete,
  Visibility,
  Description,
  Science,
  LocalHospital,
  Vaccines,
  Image as ImageIcon,
  MoreVert,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { medicalRecordAPI } from "../../api/endpoints";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ROUTES } from "../../utils/constants";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await medicalRecordAPI.getMyRecords();
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await medicalRecordAPI.deleteRecord(recordToDelete.id);
      toast.success("Record deleted successfully");
      setDeleteDialog(false);
      setRecordToDelete(null);
      fetchRecords();
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case "PRESCRIPTION":
        return <LocalHospital sx={{ fontSize: 40 }} />;
      case "TEST_REPORT":
        return <Science sx={{ fontSize: 40 }} />;
      case "DIAGNOSIS":
        return <Description sx={{ fontSize: 40 }} />;
      case "VACCINATION":
        return <Vaccines sx={{ fontSize: 40 }} />;
      case "IMAGING":
        return <ImageIcon sx={{ fontSize: 40 }} />;
      default:
        return <Folder sx={{ fontSize: 40 }} />;
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case "PRESCRIPTION":
        return "#667eea";
      case "TEST_REPORT":
        return "#f093fb";
      case "DIAGNOSIS":
        return "#4facfe";
      case "VACCINATION":
        return "#43e97b";
      case "IMAGING":
        return "#ff6b6b";
      default:
        return "#feca57";
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
            <Folder sx={{ fontSize: 40, mr: 2, color: "#667eea" }} />
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                Medical Records
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {records.length} records
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.PATIENT_UPLOAD_RECORD)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Upload New
          </Button>
        </Box>

        {/* Records Grid */}
        <AnimatePresence mode="wait">
          {records.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <Folder sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No medical records found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Upload your first medical record to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate(ROUTES.PATIENT_UPLOAD_RECORD)}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  Upload Record
                </Button>
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={3}>
              {records.map((record, index) => (
                <Grid item xs={12} sm={6} md={4} key={record.id}>
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
                        borderColor: getRecordColor(record.recordType),
                        background: `linear-gradient(135deg, ${getRecordColor(
                          record.recordType
                        )}10 0%, ${getRecordColor(record.recordType)}20 100%)`,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: `0 8px 24px ${getRecordColor(
                            record.recordType
                          )}40`,
                        },
                        transition: "all 0. 3s ease",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{ color: getRecordColor(record.recordType) }}
                          >
                            {getRecordIcon(record.recordType)}
                          </Box>
                          <Chip
                            label={record.recordType.replace("_", " ")}
                            size="small"
                            sx={{
                              bgcolor: getRecordColor(record.recordType),
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 1 }}
                          noWrap
                        >
                          {record.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, height: 40, overflow: "hidden" }}
                        >
                          {record.description?.substring(0, 80)}
                          {record.description?.length > 80 && "..."}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 2 }}
                        >
                          📅 {format(new Date(record.recordDate), "PPP")}
                        </Typography>

                        {record.fileName && (
                          <Chip
                            icon={<Description />}
                            label={record.fileName.substring(0, 15) + "..."}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 2, maxWidth: "100%" }}
                          />
                        )}

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Visibility />}
                            onClick={() => handleViewRecord(record)}
                            fullWidth
                            sx={{
                              bgcolor: getRecordColor(record.recordType),
                              "&:hover": {
                                bgcolor: getRecordColor(record.recordType),
                                opacity: 0.9,
                              },
                            }}
                          >
                            View
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(record)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>

        {/* View Record Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  color:
                    selectedRecord && getRecordColor(selectedRecord.recordType),
                }}
              >
                {selectedRecord && getRecordIcon(selectedRecord.recordType)}
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {selectedRecord?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Type:</strong>
                </Typography>
                <Chip
                  label={selectedRecord?.recordType.replace("_", " ")}
                  size="small"
                  sx={{
                    bgcolor:
                      selectedRecord &&
                      getRecordColor(selectedRecord.recordType),
                    color: "#fff",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Date:</strong>
                </Typography>
                <Typography variant="body1">
                  {selectedRecord &&
                    format(new Date(selectedRecord.recordDate), "PPP")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Description:</strong>
                </Typography>
                <Typography variant="body1">
                  {selectedRecord?.description || "No description provided"}
                </Typography>
              </Grid>
              {selectedRecord?.fileName && (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Attached File:</strong>
                  </Typography>
                  <Chip
                    icon={<Description />}
                    label={selectedRecord.fileName}
                    variant="outlined"
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Size: {(selectedRecord.fileSize / 1024).toFixed(2)} KB
                  </Typography>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>Delete Record</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{recordToDelete?.title}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default MedicalRecords;
