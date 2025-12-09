import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  Lock,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../api/endpoints";
import { toast } from "react-toastify";
import { ROUTES } from "../utils/constants";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/\d/)) strength += 25;
    if (pwd.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthColor =
    strength <= 25
      ? "error"
      : strength <= 50
      ? "warning"
      : strength <= 75
      ? "info"
      : "success";
  const strengthLabel =
    strength <= 25
      ? "Weak"
      : strength <= 50
      ? "Fair"
      : strength <= 75
      ? "Good"
      : "Strong";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing token");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await authAPI.setPassword({ token, password, confirmPassword });
      toast.success("Password set successfully!  Please login.");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to set password. Token may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: "rgba(255,255,255,0.98)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <LocalHospital sx={{ fontSize: 40, color: "#fff" }} />
                </Box>
              </motion.div>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Set Your Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a secure password for your MedVault account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {!token && (
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                Invalid or missing token. Please check your email link.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {password && (
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Password Strength:
                    </Typography>
                    <Typography
                      variant="caption"
                      color={`${strengthColor}. main`}
                      fontWeight={600}
                    >
                      {strengthLabel}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={strength}
                    color={strengthColor}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="flex"
                      alignItems="center"
                      gap={0.5}
                    >
                      {password.length >= 8 && (
                        <CheckCircle
                          sx={{ fontSize: 14, color: "success.main" }}
                        />
                      )}
                      At least 8 characters
                    </Typography>
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                error={confirmPassword && password !== confirmPassword}
                helperText={
                  confirmPassword && password !== confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !token}
                sx={{
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  },
                }}
              >
                {loading
                  ? "Setting Password..."
                  : "Set Password & Activate Account"}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Password Requirements:</strong>
              </Typography>
              <Typography
                variant="caption"
                color="text. secondary"
                display="block"
              >
                • At least 8 characters long
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                • Mix of uppercase and lowercase letters
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                • Include numbers and special characters
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SetPassword;
