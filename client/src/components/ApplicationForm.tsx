import { Box, TextField, Button } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function NameForm({
  register,
  handleSubmit,
  actionOnAttribute,
  isLoading,
  additionalStyles,
  buttonName,
  allowUnauthenticated,
}) {
  const { user } = useAuthContext();

  return (
    <Box display="flex" alignItems="center" sx={{ ...additionalStyles }}>
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("AName")}
        label="Application Name"
        sx={{
          marginTop: { xs: "1rem", md: "0rem" },
          marginRight: "1rem",
        }}
        disabled={!user && !allowUnauthenticated}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Status")}
        label="Status"
        sx={{
          marginRight: "1rem",
          marginTop: { xs: "1rem", md: "0rem" },
        }}
        disabled={!user && !allowUnauthenticated}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Category")}
        label="Category"
        sx={{
          marginTop: { xs: "1rem", md: "0rem" },
          marginRight: "1rem",
        }}
        disabled={!user && !allowUnauthenticated}
      />
      {user && actionOnAttribute && (
        <Button
          onClick={handleSubmit(actionOnAttribute)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {buttonName}
        </Button>
      )}
    </Box>
  );
}
