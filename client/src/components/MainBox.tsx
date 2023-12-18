import React from "react";

import { Box } from "@mui/material";
import { CircularProgress } from "@mui/joy";

export default function MainBox({ isLoading, children }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        height: "100%",
        padding: "2rem",
        backgroundColor: "rgb(249, 250, 251)",
        width: "100%",
      }}
    >
      {isLoading && <CircularProgress />}
      {!isLoading && children}
    </Box>
  );
}
