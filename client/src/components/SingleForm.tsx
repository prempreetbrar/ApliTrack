import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { TextField, Button, Box, TextareaAutosize } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import throttle from "lodash/throttle";
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
  allowUnauthenticated,
  attributeLabel,
  textAreaStyles,
  formControlStyles,
}) {
  const { user } = useAuthContext();

  return (
    <Box sx={{ ...additionalStyles }}>
      {isTextArea && (
        <FormControl sx={{ ...formControlStyles }}>
          <FormLabel>{attributeLabel || attributeName}</FormLabel>
          <Textarea
            {...register(attributeName)}
            label={attributeLabel || attributeName}
            sx={{
              marginRight: { xs: "0", md: "1rem" },
              ...additionalFieldStyles,
            }}
            minRows={4}
            disabled={!user && !allowUnauthenticated}
            style={{ ...textAreaStyles }}
          />
        </FormControl>
      )}
      {!isTextArea && (
        <TextField
          {...register(attributeName)}
          label={attributeLabel || attributeName}
          sx={{
            marginRight: { xs: "0", md: "1rem" },
            ...additionalFieldStyles,
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            maxLength,
          }}
          disabled={!user && !allowUnauthenticated}
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
