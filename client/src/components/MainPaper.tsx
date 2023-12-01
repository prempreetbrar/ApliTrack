import React from "react";

import { Paper } from "@mui/material";

export default function MainPaper({ key, overrideStyles, children }) {
  return (
    <Paper
      sx={{
        display: "flex",
        padding: "2rem",
        marginBottom: "2rem",
        backgroundColor: "white",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center" },
        ...overrideStyles,
      }}
      key={key}
    >
      {children}
    </Paper>
  );
}
