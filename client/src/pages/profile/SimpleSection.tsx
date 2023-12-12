// @ts-nocheck

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
  const [onUpdateSectionArray, setOnUpdateSectionArray] = React.useState([]);
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset } = useForm();

  React.useEffect(() => {
    if (sectionArray) {
      setOnUpdateSectionArray([...sectionArray]);
    }
  }, [sectionArray]);

  async function handleCreate() {
    const data = await create(
      { [attributeName]: getValues(attributeName) },
      sectionURL
    );
    if (data) {
      const tableName = Object.keys(data)[0];
      setOnUpdateSectionArray([...onUpdateSectionArray, data[tableName]]);
      reset();
    }
  }

  async function handleDelete(index) {
    const data = await deleteInstance(
      { [attributeName]: onUpdateSectionArray[index][attributeName] },
      sectionURL
    );

    if (data) {
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, index),
        ...onUpdateSectionArray.slice(index + 1),
      ]);
    }
  }

  return (
    <>
      <Paper
        display="flex"
        flexDirection="column"
        sx={{
          padding: "1rem",
          marginBottom: "2rem",
          width: "100%",
        }}
      >
        <Typography fontWeight="bold" sx={{ paddingBottom: "25px" }}>
          {sectionName}
        </Typography>
        {/* Display all of the user's current data */}
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {onUpdateSectionArray &&
            onUpdateSectionArray.map((entity, index) => (
              <Chip
                key={index}
                label={entity[attributeName]}
                onDelete={() => handleDelete(index)}
                sx={{
                  marginLeft: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              />
            ))}
        </Box>

        {/* Allow the user to enter new data. */}
        <Box
          component="form"
          display="flex"
          marginTop="2rem"
          alignItems="center"
        >
          <TextField
            {...register(attributeName)}
            placeholder={`Enter Name of New ${attributeName} (Max 32 Characters)`}
            fullWidth
            required
          />
          <Button
            onClick={handleCreate}
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
