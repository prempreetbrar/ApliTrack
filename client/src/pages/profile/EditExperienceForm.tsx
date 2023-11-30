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

export default function EditExperienceForm({
  open,
  handleClose,
  experienceTitle,
  experienceDesc,
  currentExperienceIndex,
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
    // Set initial form values when the experience changes
    setValue("Experience", experienceTitle);
    setValue("ExperienceDesc", experienceDesc);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceTitle, experienceDesc]);

  async function handleFormSubmit(data) {
    const response = await update(
      { ...data },
      `http://localhost:3000/api/applicants/experiences/${experienceTitle}`
    );

    if (response) {
      const tableName = Object.keys(response)[0];
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, currentExperienceIndex),
        response[tableName],
        ...onUpdateSectionArray.slice(
          currentExperienceIndex + 1,
          onUpdateSectionArray.length - 1
        ),
      ]);
    }

    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Experience</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            margin="dense"
            label="Title"
            {...register("Experience", { required: "Title is required" })}
            fullWidth
            error={!!errors.Experience}
            helperText={errors.Experience?.message}
            sx={{
              paddingBottom: "1rem",
            }}
          />
          <TextField
            label="Description"
            {...register("ExperienceDesc")}
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
