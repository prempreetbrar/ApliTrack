import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Textarea } from "@mui/joy";
import EditExperienceForm from "./EditExperienceForm";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import { useCreate, useUpdate, useDelete } from "../../hooks/useHttpMethod";

export default function FormSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
  attributeDescName,
}) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update } = useUpdate();
  const { executeRequest: deleteInstance } = useDelete();

  const [editExperienceDialogOpen, setEditExperienceDialogOpen] =
    React.useState(false);
  const [selectedExperience, setSelectedExperience] = React.useState(null);
  const [selectedItemToDelete, setSelectedItemToDelete] = React.useState(null);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);

  const handleOpenEditExperienceDialog = (experience) => {
    setSelectedExperience(experience);
    setEditExperienceDialogOpen(true);
  };

  const handleCloseEditExperienceDialog = () => {
    setEditExperienceDialogOpen(false);
  };

  const handleOpenDeleteConfirmationDialog = (item) => {
    setSelectedItemToDelete(item);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setSelectedItemToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  const { register, getValues } = useForm();

  return (
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

      {/* Existing data */}
      {sectionArray &&
        sectionArray.map((entity, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="flex-start"
            sx={{ padding: "1rem" }}
          >
            <Box flexGrow="1">
              <Typography fontWeight="bold">{entity[attributeName]}</Typography>
              <Typography>{entity[attributeDescName]}</Typography>
            </Box>

            <IconButton
              aria-label="edit"
              onClick={() => handleOpenEditExperienceDialog(entity)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleOpenDeleteConfirmationDialog(entity)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

      {/* Form for new data */}
      <Box
        display="flex"
        marginTop="2rem"
        flexDirection="row"
        alignItems="center"
        padding="1rem"
      >
        <Box display="flex" flexGrow="1" flexDirection="column">
          <TextField
            {...register(attributeName)}
            placeholder={`Enter Title of New ${attributeName} (Max 32 Characters)`}
            fullWidth
            sx={{
              marginBottom: "1rem",
            }}
          />
          <Textarea
            {...register(attributeDescName)}
            minRows={4}
            variant="soft"
            placeholder={`Enter description of new ${attributeName}`}
          />
        </Box>
        <Button
          onClick={() =>
            create(
              {
                [attributeName]: getValues(attributeName),
                [attributeDescName]: getValues(attributeDescName),
              },
              sectionURL
            )
          }
          sx={{ ml: 1, fontSize: "1.5rem" }}
          disabled={createIsLoading}
        >
          +
        </Button>
      </Box>

      {/* Editing existing data */}
      <EditExperienceForm
        open={editExperienceDialogOpen}
        handleClose={handleCloseEditExperienceDialog}
        experienceTitle={selectedExperience?.[attributeName]}
        experienceDesc={selectedExperience?.[attributeDescName]}
        onSubmit={update}
      />

      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() =>
            deleteInstance(
              { [attributeName]: selectedItemToDelete[attributeName] },
              sectionURL
            )
          }
          itemName={selectedItemToDelete?.[attributeName]}
        />
      )}
    </Paper>
  );
}
