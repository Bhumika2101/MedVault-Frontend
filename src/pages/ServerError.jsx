import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { CloudOff, Refresh, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ServerError = ({ onRetry }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={8}
            sx={{
              padding: { xs: 3, sm: 5 },
              borderRadius: 4,
              textAlign: "center",
              background: "white",
            }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CloudOff
                sx={{
                  fontSize: 120,
                  color: "#ff6b6b",
                  mb: 2,
                }}
              />
            </motion.div>

            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              500
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#2d3748",
                mb: 2,
              }}
            >
              Server Connection Failed
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              We're having trouble connecting to the server. The server might be
              down or undergoing maintenance. Please try again in a few moments.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Refresh />}
                onClick={handleRetry}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #65408b 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Try Again
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#667eea",
                    background: "rgba(102, 126, 234, 0.04)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Go Home
              </Button>
            </Stack>

            <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #e2e8f0" }}>
              <Typography variant="body2" color="text.secondary">
                If the problem persists, please contact support or try again
                later.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ServerError;
