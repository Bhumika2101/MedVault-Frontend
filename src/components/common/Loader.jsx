import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const Loader = ({ message = "Loading.. ." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "inline-flex",
            mb: 3,
          }}
        >
          <CircularProgress size={80} thickness={4} sx={{ color: "#fff" }} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          MedVault
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ position: "absolute", bottom: 30 }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255, 255, 255, 0. 7)",
            textAlign: "center",
          }}
        >
          Your Health, Our Priority
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Loader;
