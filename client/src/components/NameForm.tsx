import { Box, TextField, Button } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function NameForm({
  register,
  handleSubmit,
  actionOnAttribute,
  isLoading,
  additionalStyles,
  additionalLnameStyles,
  buttonName,
  allowUnauthenticated,
}) {
  const { user } = useAuthContext();

  return (
    <Box display="flex" alignItems="center" sx={{ ...additionalStyles }}>
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Fname")}
        label="First Name"
        sx={{
          marginRight: "1rem",
        }}
        disabled={!user && !allowUnauthenticated}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Lname")}
        label="Last Name"
        sx={{
          marginRight: { xs: "0", md: "1rem" },
          ...additionalLnameStyles,
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
