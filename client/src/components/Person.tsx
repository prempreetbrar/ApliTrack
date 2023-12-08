import { Avatar } from "@mui/material";
import React from "react";

export default function Person({ additionalStyles }) {
  return (
    <Avatar
      src="/broken-image.jpg"
      sx={{
        width: 100,
        height: 100,
        ...additionalStyles,
      }}
    />
  );
}
