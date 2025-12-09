import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  useMediaQuery,
  useTheme,
  Alert,
  LinearProgress,
  Chip,
} from "@mui/material";
import { CloudUpload, Folder, CheckCircle, Cancel } from "@mui/icons-material";
import { motion } from "framer-motion";
import { medicalRecordAPI } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES, RECORD_TYPES, FILE_SIZE_LIMIT } from "../../utils/constants";

const UploadRecord = () => {
  const [formData, setFormData] = useState({
    recordType: "",
    title: "",
    description: "",
    recordDate: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const recordTypes = Object.values(RECORD_TYPES);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > FILE_SIZE_LIMIT) {
        toast.error("File size should not exceed 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > FILE_SIZE_LIMIT) {
        toast.error("File size should not exceed 10MB");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append("recordType", formData.recordType);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("recordDate", formData.recordDate);

      if (file) {
        data.append("file", file);
      }

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await medicalRecordAPI.createRecord(data);

      clearInterval(interval);
      setUploadProgress(100);

      toast.success("Medical record uploaded successfully!");
      setTimeout(() => {
        navigate(ROUTES.PATIENT_RECORDS);
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload record");
    } finally {
      setLoading(false);
    }
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      PRESCRIPTION: "#667eea",
      TEST_REPORT: "#f093fb",
      DIAGNOSIS: "#4facfe",
      VACCINATION: "#43e97b",
      IMAGING: "#ff6b6b",
      OTHER: "#feca57",
    };
    return colors[type] || "#667eea";
  };

  return (
    <Container
      maxWidth="md"
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
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <Folder sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Upload Medical Record
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new medical record to your vault
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>File Requirements:</strong> Maximum size 10MB. Supported
            formats: PDF, JPG, PNG, DOCX
          </Alert>

          {loading && (
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text. secondary">
                  Uploading...
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={600}>
                  {uploadProgress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Record Type */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Record Type"
                  name="recordType"
                  value={formData.recordType}
                  onChange={handleChange}
                  required
                >
                  {recordTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: getRecordTypeColor(type),
                          }}
                        />
                        {type.replace("_", " ")}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="E.g., Blood Test Report - January 2025"
                />
              </Grid>

              {/* Record Date */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Record Date"
                  name="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: new Date().toISOString().split("T")[0] }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Add any relevant notes, observations, or additional information..."
                />
              </Grid>

              {/* File Upload */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: file ? "success.main" : "#ccc",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: file ? "success.light" : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#667eea",
                      bgcolor: "rgba(102, 126, 234, 0.05)",
                    },
                  }}
                  onClick={() =>
                    !file && document.getElementById("file-input").click()
                  }
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    id="file-input"
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                  />

                  {file ? (
                    <Box>
                      <CheckCircle
                        sx={{ fontSize: 48, color: "success.main", mb: 1 }}
                      />
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="success.dark"
                      >
                        {file.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 2 }}
                      >
                        Size: {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                      >
                        Remove File
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload
                        sx={{ fontSize: 48, color: "#667eea", mb: 1 }}
                      />
                      <Typography variant="body1" fontWeight={600}>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        PDF, JPG, PNG, DOCX (Max 10MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  },
                }}
              >
                {loading ? `Uploading...  ${uploadProgress}%` : "Upload Record"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate(ROUTES.PATIENT_RECORDS)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>

          {/* Tips Section */}
          <Box sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              💡 Tips for uploading records:
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              • Ensure files are clear and readable
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              • Use descriptive titles for easy identification
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              • Add detailed descriptions for context
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              • Organize records by type for better management
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UploadRecord;
