import { Box, TextField, Button } from "@mui/material";
import React from "react";

export default function NewEntry({
  attributeName,
  maxCreateLength,
  handleCreate,
  createIsLoading,
  register,
}) {
  return (
    <Box component="form" display="flex" marginTop="2rem" alignItems="center">
      <TextField
        {...register(attributeName, { maxLength: maxCreateLength })}
        placeholder={`Enter New ${attributeName}`}
        fullWidth
        required
        inputProps={{ maxLength: maxCreateLength }}
      />
      <Button
        onClick={handleCreate}
        sx={{ ml: 1, fontSize: "1.5rem" }}
        disabled={createIsLoading}
      >
        +
      </Button>
    </Box>
  );
}
