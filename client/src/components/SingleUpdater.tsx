import { TextField, Button } from "@mui/material";
import React from "react";

export default function SingleUpdater({
  register,
  handleSubmit,
  updateAttribute,
  attributeName,
  updateIsLoading,
}) {
  return (
    <>
      <TextField
        {...register(attributeName)}
        label={attributeName}
        sx={{
          marginRight: "1rem",
        }}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        onClick={handleSubmit(updateAttribute)}
        type="submit"
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        disabled={updateIsLoading}
      >
        Update
      </Button>
    </>
  );
}
