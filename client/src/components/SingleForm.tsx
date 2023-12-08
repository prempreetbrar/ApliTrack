import { TextField, Button } from "@mui/material";
import React from "react";

export default function SingleForm({
  register,
  handleSubmit,
  actionOnAttribute,
  attributeName,
  isLoading,
  maxLength,
}) {
  return (
    <>
      <TextField
        {...register(attributeName)}
        label={attributeName}
        sx={{
          marginRight: { sm: "0", md: "1rem" },
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
    </>
  );
}
