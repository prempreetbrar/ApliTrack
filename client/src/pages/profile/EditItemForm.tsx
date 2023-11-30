import React from "react";
import { useForm } from "react-hook-form";

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useUpdate } from "../../hooks/useHttpMethod";

export default function EditItemForm({
  open,
  handleClose,
  itemTitleName,
  itemDescName,
  itemTitle,
  itemDesc,
  currentItemIndex,
  sectionURL,
  setOnUpdateSectionArray,
  onUpdateSectionArray,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { executeRequest: update } = useUpdate();

  React.useEffect(() => {
    // Set initial form values when the item changes
    setValue(itemTitleName, itemTitle);
    setValue(itemDescName, itemDesc);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemTitleName, itemDescName, itemTitle, itemDesc]);

  async function handleFormSubmit(data) {
    const response = await update({ ...data }, `${sectionURL}/${itemTitle}`);

    if (response) {
      const tableName = Object.keys(response)[0];
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, currentItemIndex),
        response[tableName],
        ...onUpdateSectionArray.slice(
          currentItemIndex + 1,
          onUpdateSectionArray.length - 1
        ),
      ]);
    }

    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            margin="dense"
            label="Title"
            {...register(itemTitleName, { required: "Title is required" })}
            fullWidth
            error={!!errors.Item}
            helperText={errors.Item?.message}
            sx={{
              paddingBottom: "1rem",
            }}
          />
          <TextField
            label="Description"
            {...register(itemDescName)}
            fullWidth
            multiline
            rows={4}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit(handleFormSubmit)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
