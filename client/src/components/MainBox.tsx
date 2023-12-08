import React from "react";

import { Box } from "@mui/material";

export default function MainBox({ children }) {
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
      {children}
    </Box>
  );
}
