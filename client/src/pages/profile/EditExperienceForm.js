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

export default function EditExperienceForm({
  open,
  handleClose,
  experienceTitle,
  experienceDesc,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    // Set initial form values when the experience changes
    setValue("Experience", experienceTitle);
    setValue("ExperienceDesc", experienceDesc);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceTitle, experienceDesc]);

  const handleFormSubmit = (data) => {
    onSubmit(data, "http://localhost:3000/api/applicants/experiences");
    handleClose();
  };

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
