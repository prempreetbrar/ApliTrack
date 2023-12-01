import { Box, TextField, Button } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function NameUpdater({
  register,
  handleSubmit,
  updateName,
  updateIsLoading,
}) {
  const { user } = useAuthContext();

  return (
    <Box display="flex" alignItems="center">
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Fname")}
        label="First Name"
        sx={{
          marginRight: "1rem",
        }}
        disabled={!user}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Lname")}
        label="Last Name"
        sx={{
          marginRight: "1rem",
        }}
        disabled={!user}
      />
      {user && (
        <Button
          onClick={handleSubmit(updateName)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={updateIsLoading}
        >
          Update
        </Button>
      )}
    </Box>
  );
}
