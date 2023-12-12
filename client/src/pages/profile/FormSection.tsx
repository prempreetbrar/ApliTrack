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
import EditItemForm from "./EditItemForm";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";

import { useCreate, useDelete } from "../../hooks/useHttpMethod";

export default function FormSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
  attributeDescName,
}) {
  const [currentItemIndex, setcurrentItemIndex] = React.useState(null);
  const [onUpdateSectionArray, setOnUpdateSectionArray] = React.useState([]);
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset } = useForm();

  const [editItemDialogOpen, setEditItemDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);

  React.useEffect(() => {
    if (sectionArray) {
      setOnUpdateSectionArray([...sectionArray]);
    }
  }, [sectionArray]);

  async function handleCreate() {
    const data = await create(
      {
        [attributeName]: getValues(attributeName),
        [attributeDescName]: getValues(attributeDescName),
      },
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

  const handleOpenEditItemDialog = (item, index) => {
    setcurrentItemIndex(index);
    setSelectedItem(item);
    setEditItemDialogOpen(true);
  };

  const handleCloseEditItemDialog = () => {
    setEditItemDialogOpen(false);
  };

  const handleOpenDeleteConfirmationDialog = (index) => {
    setSelectedIndexToDelete(index);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setSelectedIndexToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        marginBottom: "2rem",
        width: "100%",
      }}
    >
      <Typography fontWeight="bold" sx={{ paddingBottom: "25px" }}>
        {sectionName}
      </Typography>

      {/* Existing data */}
      {onUpdateSectionArray &&
        onUpdateSectionArray.map((entity, index) => (
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
              onClick={() => handleOpenEditItemDialog(entity, index)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => handleOpenDeleteConfirmationDialog(index)}
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
        component="form"
      >
        <Box display="flex" flexGrow="1" flexDirection="column">
          <TextField
            {...register(attributeName)}
            placeholder={`Enter Title of New ${attributeName} (Max 32 Characters)`}
            fullWidth
            sx={{
              marginBottom: "1rem",
            }}
            required
          />
          <Textarea
            {...register(attributeDescName)}
            minRows={4}
            variant="soft"
            placeholder={`Enter description of new ${attributeName}`}
          />
        </Box>
        <Button
          onClick={handleCreate}
          sx={{ ml: 1, fontSize: "1.5rem" }}
          disabled={createIsLoading}
        >
          +
        </Button>
      </Box>

      {/* Editing existing data */}
      <EditItemForm
        open={editItemDialogOpen}
        handleClose={handleCloseEditItemDialog}
        sectionURL={sectionURL}
        itemTitle={selectedItem?.[attributeName]}
        itemTitleName={attributeName}
        itemDesc={selectedItem?.[attributeDescName]}
        itemDescName={attributeDescName}
        currentItemIndex={currentItemIndex}
        setOnUpdateSectionArray={setOnUpdateSectionArray}
        onUpdateSectionArray={onUpdateSectionArray}
      />

      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={
            onUpdateSectionArray[selectedIndexToDelete]?.[attributeName]
          }
        />
      )}
    </Paper>
  );
}
