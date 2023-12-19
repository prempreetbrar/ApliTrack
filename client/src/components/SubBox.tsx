import React from "react";

import { Box } from "@mui/material";
import { CircularProgress } from "@mui/joy";

export default function SubBox({ isLoading, children }) {
  return (
    <Box>
      {isLoading && <CircularProgress />}
      {!isLoading && children}
    </Box>
  );
}
