import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Textarea from "@mui/joy/Textarea";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { useCreate } from "../hooks/useCreate";
import { useUpdate } from "../hooks/useUpdate";
import { useDelete } from "../hooks/useDelete";
import { useSnackbar } from "notistack";

import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuthContext();
  const { update, error, isLoading } = useUpdate();
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
      setValue("Education", response.data.data.applicant?.Education);
    };

    if (user) {
      fetchApplicantInfo();
    }
  }, [user, setValue]);

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

  async function updateEducation(data) {
    const success = await update(
      data,
      "http://localhost:3000/api/applicants/education"
    );
    snackbarLogic("Update", success);
  }

  console.log(applicantInfo);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        padding: "2rem",
        backgroundColor: "rgb(249, 250, 251)",
      }}
    >
      {/* EDUCATION */}
      <Paper
        sx={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        <Typography fontWeight="bold">EDUCATION</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            {...register("Education")}
            sx={{
              marginRight: "1rem",
            }}
          />
          <Button
            onClick={handleSubmit(updateEducation)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Update
          </Button>
        </Box>
      </Paper>
      {/* EXPERIENCES */}
      <FormSection
        sectionName={"EXPERIENCES"}
        sectionURL={"http://localhost:3000/api/applicants/experiences"}
        sectionArray={applicantInfo?.Experiences}
        attributeName="Experience"
        attributeDescName="ExperienceDesc"
        snackbarLogic={snackbarLogic}
      />
      {/* CERTIFICATIONS */}
      <ProfileSection
        sectionName={"CERTIFICATIONS"}
        sectionURL={"http://localhost:3000/api/applicants/certifications"}
        sectionArray={applicantInfo?.Certifications}
        attributeName="Certification"
        snackbarLogic={snackbarLogic}
      />
      {/* SKILLS */}
      <ProfileSection
        sectionName={"SKILLS"}
        sectionURL={"http://localhost:3000/api/applicants/skills"}
        sectionArray={applicantInfo?.Skills}
        attributeName="Skill"
        snackbarLogic={snackbarLogic}
      />
      {/* COMPETITION */}
      <ProfileSection
        sectionName={"COMPETITIONS"}
        sectionURL={"http://localhost:3000/api/applicants/competitions"}
        sectionArray={applicantInfo?.Competitions}
        attributeName="Competition"
        snackbarLogic={snackbarLogic}
      />
    </Box>
  );
}

function ProfileSection({
  sectionName,
  sectionURL,
  sectionArray,
  attributeName,
  snackbarLogic,
}) {
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

  async function createSomething(data, url) {
    const success = await create(data, url);
    snackbarLogic("Insert", success);
  }

  async function deleteSomething(data, url) {
    const success = await deleteItem(data, url);
    snackbarLogic("Delete", success);
  }

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
        <Stack direction="row" spacing={2}>
          {sectionArray &&
            sectionArray.map((entity, index) => (
              <Chip
                key={index}
                label={entity[attributeName]}
                onDelete={() =>
                  deleteSomething(
                    { [attributeName]: entity[attributeName] },
                    sectionURL
                  )
                }
              />
            ))}
        </Stack>

        <Box display="flex" marginTop="2rem" alignItems="center">
          <TextField
            {...register(attributeName)}
            placeholder={`Enter Name of New ${attributeName} (Max 32 Characters)`}
            fullWidth
          />
          <Button
            onClick={() =>
              createSomething(
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
  snackbarLogic,
}) {
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

  async function createSomething(data, url) {
    console.log(data);
    const success = await create(data, url);
    snackbarLogic("Insert", success);
  }

  async function deleteSomething(data, url) {
    const success = await deleteItem(data, url);
    snackbarLogic("Delete", success);
  }

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
              aria-label="delete"
              onClick={() =>
                deleteSomething(
                  { [attributeName]: entity[attributeName] },
                  sectionURL
                )
              }
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

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
            createSomething(
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
    </Paper>
  );
}
