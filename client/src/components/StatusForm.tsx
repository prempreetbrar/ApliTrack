import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { TextField, Button, Box } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function SingleForm({
  register,
  handleSubmit,
  actionOnAttribute,
  actionOnAttribute2,
  attributeName,
  isLoading,
  maxLength,
  additionalStyles,
  additionalFieldStyles,
  isTextArea,
  allowUnauthenticated,
  attributeLabel,
}) {
  const { user } = useAuthContext();

  return (
    <Box sx={{ ...additionalStyles }}>
      {isTextArea && (
        <FormControl>
          <FormLabel>{attributeLabel || attributeName}</FormLabel>
          <Textarea
            {...register(attributeName)}
            label={attributeLabel || attributeName}
            sx={{
              marginRight: { xs: "0", md: "1rem" },
              ...additionalFieldStyles,
            }}
            minRows={3}
            disabled={!user && !allowUnauthenticated}
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
      {actionOnAttribute2 && user && (
        <Button
          onClick={handleSubmit(actionOnAttribute2)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          Activate
        </Button>
        
      )}
      {actionOnAttribute && user && (
        <Button
          onClick={handleSubmit(actionOnAttribute)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2, ml: 2, color: 'red', borderColor: 'red'}}
          disabled={isLoading}
        >
          Deactivate
        </Button>
        
      )}
    </Box>
  );
}
