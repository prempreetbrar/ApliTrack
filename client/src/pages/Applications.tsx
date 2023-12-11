//@ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  FormGroup,
  Switch,
} from "@mui/material";

import { Delete } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NameForm from "components/NameForm";
import SingleForm from "components/SingleForm";
import Person from "components/Person";
import NewEntryDropdown from "components/NewEntryDropdown";
import SingleDate from "components/SingleDate";
import { DELETE_ONLY } from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import MainBox from "components/MainBox";

export default function Applications() {
  const { user } = useAuthContext();

  {
    /* declare state variables */
  }
  const [applicationsInfo, setApplicationsInfo] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);

  const handleOpenDeleteConfirmationDialog = (index) => {
    setSelectedIndexToDelete(index);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setSelectedIndexToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  const { executeHandle } = useHandleOperation(
    undefined,
    setApplicationsInfo,
    applicationsInfo
  );

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        ApplicationID: applicationsInfo[index].ApplicationID,
      },
      "http://localhost:3000/api/applications/details",
      index,
      false,
      null,
      null
    );
  }

  //TODO: check get later
  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      data,
      "http://localhost:3000/api/applications",
      null,
      false,
      null,
      null
    );
  }

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
    React.useEffect(() => {
        const fetchApplicationsInfo = async () => {
          const response = await get({}, "http://localhost:3000/api/applications");
    
          setApplicationsInfo(response.contact);
        };
    
        fetchApplicationsInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user]);

  return (
    <MainBox>
        <form onSubmit={handleSubmit(handleGet)}>
          <Box
            display="flex"
            sx={{
              marginTop: { xs: "2rem", md: "0rem" },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: "1rem", marginRight: "1rem" }}
            >
              Search by:
            </Typography>
            <NameForm
              register={register}
              handleSubmit={handleSubmit}
              additionalStyles={{
                marginTop: { xs: "1rem", sm: "0rem" },
              }}
              additionalLnameStyles={{
                marginRight: { xs: "1rem" },
              }}
              allowUnauthenticated
            />
            <Box display="flex" alignItems="center">
              <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
            </Box>
          </Box>
        </form>
      {applicationsInfo &&
        applicationsInfo.map((application, index) => {
            return (
              <Application
                key={index}
                application={application}
                index={index}
                handleOpenDeleteConfirmationDialog={
                  handleOpenDeleteConfirmationDialog
                }
              />
            );
          
        })}
      {user && (
        <AddNewApplication
          setApplicationsInfo={setApplicationsInfo}
          applicationsInfo={applicationsInfo}
        />
      )}
      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={applicationsInfo[selectedIndexToDelete]?.ApplicationID}
        />
      )}
    </MainBox>
  );
}

function Application({
  application,
  index,
  handleOpenDeleteConfirmationDialog,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } = useDelete();
  const { user } = useAuthContext();

  React.useEffect(() => {
    /*
          We have forms that the user can change. However, we want to prepopulate them
          with their current values from the database.
        */
    setValue("Aname", application?.AName);
    setValue("Notes", application?.Notes);
    setValue("Status", application?.LinkedInURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application]);

  function updateApplication(data) {
    update(
      {ApplicationID: application.ApplicationID, ...data },
      "http://localhost:3000/api/applications/details"
    );
  }

  return (
    <MainPaper
      overrideStyles={{
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        width="100%"
      >
        <Typography
          variant="h2"
          sx={{ fontSize: "3rem", fontWeight: "bold", display: "inline-block" }}
        >
          {application.ApplicationID}
        </Typography>

        <FormControl
          onSubmit={handleSubmit(updateApplication)}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            width: { xs: "100%", md: "fit-content" },
            marginTop: { xs: "2rem", md: 0 },
            marginLeft: { xs: "0rem", lg: "5rem" },
            order: { xs: 4, lg: 3 },
          }}
        >
          <SingleForm
            register={register}
            attributeName={"AName"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            additionalFieldStyles={{
              marginRight: { xs: "1rem" },
            }}
          />
          <SingleForm
            register={register}
            attributeName={"Notes"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            additionalFieldStyles={{
              marginTop: { xs: "1.5rem", md: 0 },
              marginRight: { xs: "1rem" },
            }}
          />
          <SingleForm
            register={register}
            attributeName={"Status"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: { xs: "1.5rem", md: 0 },
            }}
            additionalFieldStyles={{
              marginRight: { xs: "1rem" },
            }}
            isTextArea
          />
          {user && (
            <Button
              sx={{ marginTop: "1rem", height: "min-content" }}
              type="submit"
              variant="outlined"
            >
              Update
            </Button>
          )}
        </FormControl>
        {user?.data?.user?.AdminFlag &&
          user?.data?.user?.PermissionLevel >= DELETE_ONLY && (
            <IconButton
              sx={{
                marginLeft: "auto",
                order: { xs: 3, lg: 4 },
              }}
              aria-label="delete"
              size="large"
              onClick={() => handleOpenDeleteConfirmationDialog(index)}
            >
              <Delete sx={{ width: "2rem", height: "2rem" }} />
            </IconButton>
          )}
      </Box>

      <Box
        sx={{ marginLeft: { xs: 0, md: "1rem" } }}
        marginTop="2.5rem"
        width="100%"
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            Jobs
          </Typography>
          <WorkIcon
            sx={{ marginLeft: "1rem", width: "2rem", height: "2rem" }}
          />
        </Box>
      </Box>
    </MainPaper>
  );
}

function AddNewApplication({ setApplicationsInfo, applicationsInfo }) {
    const { executeRequest: create, isLoading: createIsLoading } = useCreate();
    const { register, getValues, reset, handleSubmit, setValue } = useForm();
    const { executeHandle } = useHandleOperation(
      reset,
      setApplicationsInfo,
      applicationsInfo
    );
    const { user } = useAuthContext();
  
    async function handleCreate(data) {
      const result = await executeHandle(
        "create",
        create,
        {
            ...data
        },
        "http://localhost:3000/api/applications/details",
        null,
        false,
        null,
        null
      );
    }
  
    return (
        <>
        {user && (
          <MainPaper
            overrideStyles={{
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "500",
              }}
            >
              Add New Application
            </Typography>
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              actionOnAttribute={null}
              attributeName={"Application Name"}
              isLoading={createIsLoading}
              maxLength={64}
              additionalStyles={{ marginTop: { xs: "1.5rem" } }}
            />
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              actionOnAttribute={null}
              attributeName={"Notes"}
              isLoading={createIsLoading}
              maxLength={64}
              isTextArea
              additionalStyles={{ marginTop: { xs: "1.5rem" } }}
            />
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              actionOnAttribute={null}
              attributeName={"Status"}
              isLoading={createIsLoading}
              maxLength={64}
              additionalStyles={{ marginTop: { xs: "1.5rem" } }}
            />
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              actionOnAttribute={null}
              attributeName={"Description"}
              isLoading={createIsLoading}
              maxLength={64}
              additionalStyles={{ marginTop: { xs: "1.5rem" } }}
            />
  
            <Button
              onClick={handleSubmit(handleCreate)}
              type="submit"
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              disabled={createIsLoading}
              sx={{ marginTop: { xs: "1.5rem" } }}
            >
              Create
            </Button>
          </MainPaper>
        )}
      </>
    );
  }
