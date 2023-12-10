import { Box, TextField, Button } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function NewEntry({
  attributeName,
  maxCreateLength,
  handleCreate,
  createIsLoading,
  register,
  doNotShowButton,
  additionalStyles,
}) {
  const { user } = useAuthContext();

  return (
    <>
      {user && (
        <Box
          component="form"
          display="flex"
          marginTop="2rem"
          alignItems="center"
          sx={{ ...additionalStyles }}
        >
          <TextField
            {...register(attributeName, { maxLength: maxCreateLength })}
            placeholder={`Enter New ${attributeName}`}
            fullWidth
            required
            inputProps={{ maxLength: maxCreateLength }}
          />
          {!doNotShowButton && (
            <Button
              onClick={handleCreate}
              sx={{ ml: 1, fontSize: "1.5rem" }}
              disabled={createIsLoading}
            >
              +
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
