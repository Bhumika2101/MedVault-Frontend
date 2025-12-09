import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle,
  CheckCircle,
  DoneAll,
  NotificationsActive,
  NotificationsNone,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { notificationAPI } from "../../api/endpoints";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "APPOINTMENT":
        return "#667eea";
      case "PRESCRIPTION":
        return "#f093fb";
      case "CHECKUP":
        return "#43e97b";
      default:
        return "#4facfe";
    }
  };

  const getNotificationIcon = (type) => {
    return "🔔";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: isMobile ? 10 : 4 }}>
        <Typography>Loading... </Typography>
      </Container>
    );
  }

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
              <NotificationsIcon sx={{ color: "#fff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700}>
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount} unread notification{unreadCount !== 1 && "s"}
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DoneAll />}
              onClick={handleMarkAllAsRead}
              size="small"
            >
              Mark All Read
            </Button>
          )}
        </Box>

        {/* Notifications List */}
        <AnimatePresence mode="wait">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
                <NotificationsNone
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You're all caught up!
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
              <List disablePadding>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ListItem
                        sx={{
                          bgcolor: notification.isRead
                            ? "transparent"
                            : "rgba(102, 126, 234, 0.05)",
                          py: 2,
                          "&:hover": {
                            bgcolor: notification.isRead
                              ? "rgba(0,0,0,0.02)"
                              : "rgba(102, 126, 234, 0.08)",
                          },
                          transition: "background-color 0.3s ease",
                        }}
                        secondaryAction={
                          !notification.isRead && (
                            <IconButton
                              edge="end"
                              onClick={() => handleMarkAsRead(notification.id)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  bgcolor: "primary.light",
                                },
                              }}
                            >
                              <CheckCircle />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              bgcolor: notification.isRead
                                ? "transparent"
                                : getNotificationColor(
                                    notification.notificationType
                                  ),
                              color: notification.isRead
                                ? "text.disabled"
                                : "#fff",
                              border: notification.isRead
                                ? "2px solid #e0e0e0"
                                : "none",
                            }}
                          >
                            {notification.isRead ? (
                              <NotificationsNone />
                            ) : (
                              <NotificationsActive />
                            )}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight={notification.isRead ? 400 : 600}
                                sx={{ flexGrow: 1 }}
                              >
                                {notification.title}
                              </Typography>
                              <Chip
                                label={notification.notificationType}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: 10,
                                  bgcolor: getNotificationColor(
                                    notification.notificationType
                                  ),
                                  color: "#fff",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                color="text. secondary"
                                sx={{ mb: 0.5 }}
                                component="span"
                                display="block"
                              >
                                {notification.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                🕒{" "}
                                {format(
                                  new Date(notification.createdAt),
                                  "PPp"
                                )}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    </motion.div>
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </AnimatePresence>

        {/* Stats */}
        {notifications.length > 0 && (
          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary. main"
                  >
                    {notifications.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Notifications
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="success.main"
                  >
                    {unreadCount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Unread
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
};

export default Notifications;
