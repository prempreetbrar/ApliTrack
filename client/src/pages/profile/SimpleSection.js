import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  TextField,
  Button,
} from "@mui/material";

import { useCreate, useDelete } from "../../hooks/useHttpMethod";

export default function SimpleSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
}) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset } = useForm();

  function handleCreate() {
    create({ [attributeName]: getValues(attributeName) }, sectionURL);
    // reset();
  }

  return (
    <>
      <Paper
        display="flex"
        flexDirection="column"
        sx={{
          padding: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Typography fontWeight="bold" sx={{ paddingBottom: "25px" }}>
          {sectionName}
        </Typography>
        {/* Display all of the user's current data */}
        <Stack direction="row" spacing={2}>
          {sectionArray &&
            sectionArray.map((entity, index) => (
              <Chip
                key={index}
                label={entity[attributeName]}
                onDelete={() =>
                  deleteInstance(
                    { [attributeName]: entity[attributeName] },
                    sectionURL
                  )
                }
              />
            ))}
        </Stack>

        {/* Allow the user to enter new data. */}
        <Box display="flex" marginTop="2rem" alignItems="center">
          <TextField
            {...register(attributeName)}
            placeholder={`Enter Name of New ${attributeName} (Max 32 Characters)`}
            fullWidth
          />
          <Button
            onClick={() => handleCreate(attributeName, sectionURL)}
            sx={{ ml: 1, fontSize: "1.5rem" }}
            disabled={createIsLoading}
          >
            +
          </Button>
        </Box>
      </Paper>
    </>
  );
}
