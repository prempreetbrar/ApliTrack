import React from "react";

import { Box } from "@mui/material";
import { CircularProgress } from "@mui/joy";

export default function SubBox({ isLoading, children }) {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {isLoading && <CircularProgress />}
      {!isLoading && children}
    </Box>
  );
}
