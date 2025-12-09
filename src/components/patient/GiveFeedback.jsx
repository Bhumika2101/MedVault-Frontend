import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Rating,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { Star, Send, Delete, Edit, ArrowBack } from "@mui/icons-material";
import { motion } from "framer-motion";
import { feedbackAPI, appointmentAPI } from "../../api/endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ROUTES } from "../../utils/constants";

const ITEMS_PER_PAGE = 10;

const GiveFeedback = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, feedbacksRes] = await Promise.all([
        appointmentAPI.getMyAppointments(),
        feedbackAPI.getMyFeedbacks(),
      ]);

      // Filter appointments that have already occurred (past appointments)
      const now = new Date();
      const pastAppointments = appointmentsRes.data.data.filter((apt) => {
        const appointmentDate = new Date(apt.appointmentDateTime);
        return appointmentDate < now && apt.status !== "REJECTED";
      });

      setCompletedAppointments(pastAppointments);
      setMyFeedbacks(feedbacksRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedAppointment) {
      toast.error("Please select an appointment");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("Comment must be at least 3 characters");
      return;
    }

    if (comment.length > 2000) {
      toast.error("Comment cannot exceed 2000 characters");
      return;
    }

    setSubmitting(true);
    try {
      const feedbackData = {
        doctorId: selectedAppointment.doctorId,
        appointmentId: selectedAppointment.id,
        rating,
        comment: comment.trim(),
      };

      if (editingFeedback) {
        await feedbackAPI.updateFeedback(editingFeedback.id, feedbackData);
        toast.success("Feedback updated successfully!");
      } else {
        await feedbackAPI.create(feedbackData);
        toast.success("Feedback submitted successfully!");
      }

      // Reset form
      setSelectedAppointment(null);
      setRating(5);
      setComment("");
      setEditingFeedback(null);

      // Refresh data
      fetchData();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFeedback = (feedback) => {
    const appointment = completedAppointments.find(
      (apt) => apt.id === feedback.appointmentId
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setRating(feedback.rating);
      setComment(feedback.comment);
      setEditingFeedback(feedback);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Original appointment not found");
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await feedbackAPI.deleteFeedback(feedbackId);
      toast.success("Feedback deleted successfully!");
      setDeleteDialog(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const hasFeedback = (appointmentId) => {
    return myFeedbacks.some((fb) => fb.appointmentId === appointmentId);
  };

  // Pagination for appointments
  const appointmentStartIndex = (appointmentPage - 1) * ITEMS_PER_PAGE;
  const appointmentEndIndex = appointmentStartIndex + ITEMS_PER_PAGE;
  const paginatedAppointments = completedAppointments.slice(
    appointmentStartIndex,
    appointmentEndIndex
  );
  const appointmentTotalPages = Math.ceil(
    completedAppointments.length / ITEMS_PER_PAGE
  );

  // Pagination for feedbacks
  const feedbackStartIndex = (feedbackPage - 1) * ITEMS_PER_PAGE;
  const feedbackEndIndex = feedbackStartIndex + ITEMS_PER_PAGE;
  const paginatedFeedbacks = myFeedbacks.slice(
    feedbackStartIndex,
    feedbackEndIndex
  );
  const feedbackTotalPages = Math.ceil(myFeedbacks.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ mb: 3, borderRadius: 3 }}
        />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate(ROUTES.PATIENT_DASHBOARD)}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Doctor Feedback
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share your experience with our doctors
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Feedback Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {editingFeedback ? "Edit Feedback" : "Give Feedback"}
            </Typography>

            {/* Select Appointment */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Select Past Appointment
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Showing {Math.min(ITEMS_PER_PAGE, completedAppointments.length)}{" "}
                of {completedAppointments.length}
              </Typography>
            </Box>

            <Box sx={{ mb: 2, maxHeight: 400, overflow: "auto" }}>
              {completedAppointments.length === 0 ? (
                <Alert severity="info">
                  No past appointments available for feedback. Complete an
                  appointment first.
                </Alert>
              ) : (
                paginatedAppointments.map((apt) => (
                  <Card
                    key={apt.id}
                    sx={{
                      mb: 2,
                      cursor: hasFeedback(apt.id) ? "default" : "pointer",
                      border: 2,
                      borderColor:
                        selectedAppointment?.id === apt.id
                          ? "primary.main"
                          : "transparent",
                      opacity: hasFeedback(apt.id) ? 0.7 : 1,
                      "&:hover": {
                        borderColor: hasFeedback(apt.id)
                          ? "transparent"
                          : "primary.light",
                      },
                    }}
                    onClick={() =>
                      !hasFeedback(apt.id) && setSelectedAppointment(apt)
                    }
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {apt.doctorName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {apt.doctorSpecialization}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {format(new Date(apt.appointmentDateTime), "PPP p")}
                          </Typography>
                          <Chip
                            label={apt.status}
                            size="small"
                            color={
                              apt.status === "COMPLETED"
                                ? "success"
                                : apt.status === "APPROVED"
                                ? "primary"
                                : "default"
                            }
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        {hasFeedback(apt.id) && (
                          <Chip
                            label="Reviewed"
                            color="success"
                            size="small"
                            icon={<Star />}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>

            {/* Appointment Pagination */}
            {appointmentTotalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Pagination
                  count={appointmentTotalPages}
                  page={appointmentPage}
                  onChange={(e, page) => setAppointmentPage(page)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}

            {/* Rating */}
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Rating
            </Typography>
            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                size="large"
              />
              <Typography variant="h6" color="primary">
                {rating}/5
              </Typography>
            </Box>

            {/* Comment */}
            <TextField
              label="Your Feedback"
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with the doctor..."
              helperText={`${comment.length}/2000 characters (minimum 3)`}
              error={comment.length > 2000}
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Send />}
                onClick={handleSubmitFeedback}
                disabled={
                  !selectedAppointment ||
                  comment.trim().length < 3 ||
                  comment.length > 2000 ||
                  submitting
                }
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {submitting
                  ? "Submitting..."
                  : editingFeedback
                  ? "Update Feedback"
                  : "Submit Feedback"}
              </Button>
              {editingFeedback && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditingFeedback(null);
                    setSelectedAppointment(null);
                    setRating(5);
                    setComment("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* My Feedbacks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                My Feedbacks
              </Typography>
              <Chip
                label={`${myFeedbacks.length} Total`}
                color="primary"
                size="small"
              />
            </Box>

            {myFeedbacks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Star sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                <Typography color="text.secondary">
                  No feedbacks yet. Submit your first feedback!
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ maxHeight: 600, overflow: "auto" }}>
                  {paginatedFeedbacks.map((feedback) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {feedback.doctorName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {feedback.doctorSpecialization}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditFeedback(feedback)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => setDeleteDialog(feedback)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </Box>

                          <Rating
                            value={feedback.rating}
                            readOnly
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {feedback.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(feedback.createdAt), "PPP")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>

                {/* Feedback Pagination */}
                {feedbackTotalPages > 1 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Pagination
                      count={feedbackTotalPages}
                      page={feedbackPage}
                      onChange={(e, page) => setFeedbackPage(page)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Feedback</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDeleteFeedback(deleteDialog.id)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GiveFeedback;
