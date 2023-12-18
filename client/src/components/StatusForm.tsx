import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { TextField, Button, Box } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";
import { useState, useEffect } from 'react';

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

  const [currentValue, setCurrentValue] = useState({...register("IsActive")});

  console.log({...register("IsActive")});

  useEffect(() => {
    if (user && user[attributeName] !== undefined) {
      setCurrentValue(user[attributeName]);
    }
  }, [user, attributeName]);

  const handleActivate = () => {
    handleSubmit(actionOnAttribute)();
    setCurrentValue(true);
  };

  const handleDeactivate = () => {
    handleSubmit(actionOnAttribute2)();
    setCurrentValue(false);
  };

  return (
    <Box sx={{ ...additionalStyles }}>
      {isTextArea && (
        <FormControl>
          <FormLabel>{attributeLabel || attributeName}</FormLabel>
          <Textarea
            {...register(attributeName)}
            label={attributeLabel || attributeName}
            value={currentValue ? 'Activated' : 'Deactivated'}
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
          label={attributeLabel || attributeName}
          value={currentValue ? 'Activated' : 'Deactivated'}
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
          onClick={handleActivate}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          Activate
        </Button>
        
      )}
      {actionOnAttribute2 && user && (
        <Button
          onClick={handleDeactivate}
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
