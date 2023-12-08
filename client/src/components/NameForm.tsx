import { Box, TextField, Button } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function NameForm({
  register,
  handleSubmit,
  onSubmit,
  isLoading,
  additionalStyles,
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
        disabled={!user}
      />
      <TextField
        InputLabelProps={{ shrink: true }}
        {...register("Lname")}
        label="Last Name"
        sx={{
          marginRight: { sm: "0", md: "1rem" },
        }}
        disabled={!user}
      />
      {user && onSubmit && (
        <Button
          onClick={handleSubmit(onSubmit)}
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
