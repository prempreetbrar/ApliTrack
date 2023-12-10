import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { TextField, Button, Box } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
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
  isTextArea,
}) {
  const { user } = useAuthContext();
  return (
    <Box sx={{ ...additionalStyles }}>
      {isTextArea && (
        <FormControl>
          <FormLabel>{attributeName}</FormLabel>
          <Textarea
            {...register(attributeName)}
            label={attributeName}
            sx={{
              marginRight: { xs: "0", md: "1rem" },
              ...additionalFieldStyles,
            }}
            minRows={3}
            disabled={!user}
          />
        </FormControl>
      )}
      {!isTextArea && (
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
          disabled={!user}
        />
      )}
      {actionOnAttribute && user && (
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
