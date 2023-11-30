import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Textarea from "@mui/joy/Textarea";
import axios from "axios";

import React from "react";
import { useForm } from "react-hook-form";
import useAuthContext from "../hooks/useAuthContext";
import { useCreate } from "../hooks/useCreate";
import { useUpdate } from "../hooks/useUpdate";
import { useDelete } from "../hooks/useDelete";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuthContext();
  const [applicantInfo, setApplicantInfo] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    create,
    error: createError,
    isLoading: createIsLoading,
  } = useCreate();
  const {
    deleteItem,
    error: deleteError,
    isLoading: deleteIsLoading,
  } = useDelete();
  const {
    update,
    error: updateError,
    isLoading: updateIsLoading,
  } = useUpdate();

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
  React.useEffect(() => {
    const fetchApplicantInfo = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/applicants/profile",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setApplicantInfo(response.data.data.applicant);
    };

    if (user) {
      fetchApplicantInfo();
    }
  }, [user, setValue]);

  /*
    Any time the user makes a change, refresh the page
    if the change succeeded.
  */
  function snackbarLogic(method, success) {
    const refreshPage = () => {
      navigate(0);
    };

    if (success) {
      enqueueSnackbar(`${method} succeeded!`, {
        variant: "success",
        autoHideDuration: 1000,
      });
      setTimeout(() => {
        refreshPage();
      }, 1000);
    } else {
      enqueueSnackbar(`${method} failed!`, {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  }

  async function updateInstance(data, url) {
    const success = await update(data, url);
    snackbarLogic("Update", success);
  }

  async function createInstance(data, url) {
    const success = await create(data, url);
    snackbarLogic("Insert", success);
  }

  async function deleteInstance(data, url) {
    const success = await deleteItem(data, url);
    snackbarLogic("Delete", success);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        padding: "2rem",
        backgroundColor: "rgb(249, 250, 251)",
      }}
    >
      {/* YOU */}
      <UserSection
        applicantInfo={applicantInfo}
        updateInstance={updateInstance}
        updateIsLoading={updateIsLoading}
      />
      {/* EXPERIENCES */}
      <FormSection
        sectionName={"EXPERIENCES"}
        sectionURL={"http://localhost:3000/api/applicants/experiences"}
        sectionArray={applicantInfo?.Experiences}
        attributeName="Experience"
        attributeDescName="ExperienceDesc"
        createInstance={createInstance}
        deleteInstance={deleteInstance}
        updateInstance={updateInstance}
        createIsLoading={createIsLoading}
      />
      {/* CERTIFICATIONS */}
      <SimpleSection
        sectionName={"CERTIFICATIONS"}
        sectionURL={"http://localhost:3000/api/applicants/certifications"}
        sectionArray={applicantInfo?.Certifications}
        attributeName="Certification"
        createInstance={createInstance}
        deleteInstance={deleteInstance}
        createIsLoading={createIsLoading}
      />
      {/* SKILLS */}
      <SimpleSection
        sectionName={"SKILLS"}
        sectionURL={"http://localhost:3000/api/applicants/skills"}
        sectionArray={applicantInfo?.Skills}
        attributeName="Skill"
        createInstance={createInstance}
        deleteInstance={deleteInstance}
        createIsLoading={createIsLoading}
      />
      {/* COMPETITION */}
      <SimpleSection
        sectionName={"COMPETITIONS"}
        sectionURL={"http://localhost:3000/api/applicants/competitions"}
        sectionArray={applicantInfo?.Competitions}
        attributeName="Competition"
        createInstance={createInstance}
        deleteInstance={deleteInstance}
        createIsLoading={createIsLoading}
      />
    </Box>
  );
}

function UserSection({ applicantInfo, updateInstance, updateIsLoading }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Education", applicantInfo?.Education);
    setValue("Fname", applicantInfo?.User?.Fname);
    setValue("Lname", applicantInfo?.User?.Lname);
  }, [
    applicantInfo?.Education,
    applicantInfo?.User?.Fname,
    applicantInfo?.User?.Lname,
    setValue,
  ]);

  function updateEducation(data) {
    updateInstance(data, "http://localhost:3000/api/applicants/education");
  }

  function updateName(data) {
    updateInstance(data, "http://localhost:3000/api/users/");
  }

  return (
    <>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
          height: "22.5rem",
        }}
      >
        <Avatar src="/broken-image.jpg" sx={{ width: 100, height: 100 }} />
        <Typography fontWeight="bold">YOU</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            InputLabelProps={{ shrink: true }}
            {...register("Fname")}
            label="First Name"
            sx={{
              marginRight: "1rem",
            }}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            {...register("Lname")}
            label="Last Name"
            sx={{
              marginRight: "1rem",
            }}
          />
          <Button
            onClick={handleSubmit(updateName)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            disabled={updateIsLoading}
          >
            Update
          </Button>
        </Box>
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            {...register("Education")}
            label="Education"
            sx={{
              marginRight: "1rem",
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            onClick={handleSubmit(updateEducation)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            disabled={updateIsLoading}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </>
  );
}

function SimpleSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
  createInstance,
  deleteInstance,
  createIsLoading,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

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
            onClick={() =>
              createInstance(
                { [attributeName]: getValues(attributeName) },
                sectionURL
              )
            }
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

function FormSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
  attributeDescName,
  deleteInstance,
  createInstance,
  updateInstance,
  createIsLoading,
}) {
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

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
            createInstance(
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
        onSubmit={updateInstance}
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

function EditExperienceForm({
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
  }, [experienceTitle, experienceDesc, setValue]);

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

function DeleteConfirmationDialog({
  open,
  handleClose,
  handleConfirm,
  itemName,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Delete ${itemName}?`}</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {itemName}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleConfirm();
            handleClose();
          }}
          color="error"
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}