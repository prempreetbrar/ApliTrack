import { TextField, Button, Box } from "@mui/material";
import React from "react";

export default function SingleForm({
  register,
  handleSubmit,
  actionOnAttribute,
  attributeName,
  isLoading,
  maxLength,
  additionalStyles,
  additionalFieldStyles,
}) {
  return (
    <Box sx={{ ...additionalStyles }}>
      <TextField
        {...register(attributeName)}
        label={attributeName}
        sx={{
          marginRight: { xs: "0", md: "1rem" },
          ...additionalFieldStyles,
        }}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          maxLength,
        }}
      />
      {actionOnAttribute && (
        <Button
          onClick={handleSubmit(actionOnAttribute)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          Update
        </Button>
      )}
    </Box>
  );
}
