//@ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  FormGroup,
  Switch,
  Radio,
  FormControl,
  RadioGroup,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NameForm from "components/NameForm";
import SingleForm from "components/SingleForm";
import StatusForm from "components/StatusForm";
import PermissionForm from "components/PermissionForm";
import Person from "components/Person";
import NewEntryDropdown from "components/NewEntryDropdown";
import SingleDate from "components/SingleDate";
import {
  GET_AND_DELETE,
  GET_AND_DELETE_AND_CREATE,
  GET_AND_DELETE_AND_CREATE_AND_UPDATE,
} from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import SubBox from "components/SubBox";

export default function Users() {
  const { user: userAuth } = useAuthContext();
  const [usersInfo, setUsersInfo] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get, isLoading: getIsLoading } = useGet();
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
    setUsersInfo,
    usersInfo
  );

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        Username: usersInfo[index].Username,
      },
      "http://localhost:3000/api/users/details",
      index,
      false,
      null,
      {},
      false
    );
  }

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      data,
      "http://localhost:3000/api/users/details",
      null,
      false,
      null,
      {},
      false
    );
  }

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
  React.useEffect(() => {
    const fetchUsersInfo = async () => {
      const response = await get({}, "http://localhost:3000/api/users/details");

      setUsersInfo(response.user); //TODO: check
    };

    fetchUsersInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuth]);

  return (
    <MainBox>
      <FormGroup
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          marginBottom: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={handleSubmit(handleGet)}>
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: "column", xl: "row" },
            }}
            alignItems="center"
            marginRight="2.5rem"
            width="100%"
          >
            <FormControl sx={{ width: "100%" }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Compensation-ASC"
                name="radio-buttons-group"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
                row
              >
                <Box
                  display="flex"
                  maxWidth={{ xs: "100%", sm: "50%" }}
                  flexDirection="column"
                  paddingRight="2rem"
                >
                  <FormControlLabel
                    value="Username-ASC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by Username Ascending"
                    labelPlacement="start"
                    sx={{ width: "100%" }}
                  />
                  <FormControlLabel
                    value="Fname-ASC,Lname-ASC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by First Name Ascending"
                    labelPlacement="start"
                    sx={{
                      marginTop: { xs: "1rem", sm: "0" },
                      width: "100%",
                    }}
                  />
                  <FormControlLabel
                    value="Lname-ASC,Fname-ASC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by Last Name Ascending"
                    labelPlacement="start"
                    sx={{
                      marginTop: { xs: "1rem", sm: "0" },
                      width: "100%",
                    }}
                  />
                </Box>

                <Box
                  display="flex"
                  maxWidth={{ xs: "100%", sm: "50%" }}
                  flexDirection="column"
                  paddingRight="2rem"
                >
                  <FormControlLabel
                    value="Username-DESC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by Username Descending"
                    labelPlacement="start"
                    sx={{
                      marginTop: { xs: "1rem", sm: "0" },
                      width: "100%",
                    }}
                  />
                  <FormControlLabel
                    value="Fname-DESC,Lname-DESC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by First Name Descending"
                    labelPlacement="start"
                    sx={{
                      marginTop: { xs: "1rem", sm: "0" },
                      width: "100%",
                    }}
                  />

                  <FormControlLabel
                    value="Lname-DESC,Fname-DESC"
                    control={<Radio {...register("Sort")} />}
                    label="Sort by Last Name Descending"
                    labelPlacement="start"
                    sx={{
                      marginTop: { xs: "1rem", sm: "0" },
                      width: "100%",
                    }}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>

          <Box
            display="flex"
            sx={{
              marginTop: { xs: "1rem", md: "1rem" },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
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
                flexDirection: { xs: "column", sm: "row" },
              }}
              additionalLnameStyles={{
                marginTop: { xs: "1rem", sm: "0rem" },
                marginRight: { xs: "1rem" },
              }}
              allowUnauthenticated
            />
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: { xs: "0rem" },
                marginTop: { xs: "1rem", sm: "0rem" },
                flexShrink: 0,
              }}
              additionalFieldStyles={{
                width: "100%",
                marginRight: { xs: "1rem" },
              }}
              attributeName={"Username"}
              allowUnauthenticated
            />
            <Box
              display="flex"
              alignItems="center"
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
            </Box>
          </Box>
        </form>
      </FormGroup>

      <SubBox isLoading={getIsLoading}>
        {usersInfo &&
          usersInfo.map((user, index) => {
            return (
              <User
                key={index}
                user={user}
                index={index}
                handleOpenDeleteConfirmationDialog={
                  handleOpenDeleteConfirmationDialog
                }
              />
            );
          })}

        {userAuth &&
          userAuth.data.user.AdminFlag &&
          userAuth.data.user.PermissionLevel >= GET_AND_DELETE_AND_CREATE && (
            <AddNewUser setUsersInfo={setUsersInfo} usersInfo={usersInfo} />
          )}
        {deleteConfirmationDialogOpen && ( //TODO: check
          <DeleteConfirmationDialog
            open={deleteConfirmationDialogOpen}
            handleClose={handleCloseDeleteConfirmationDialog}
            handleConfirm={() => handleDelete(selectedIndexToDelete)}
            itemName={
              usersInfo[selectedIndexToDelete]?.Fname +
              " " +
              usersInfo[selectedIndexToDelete]?.Lname
            }
          />
        )}
      </SubBox>
    </MainBox>
  );
}

function User({ user, index, handleOpenDeleteConfirmationDialog }) {
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get, isLoading: getIsLoading } = useGet();

  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user: userAuth } = useAuthContext();

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Fname", user?.Fname);
    setValue("Lname", user?.Lname);
    setValue("Username", user?.Username);
    setValue("IsActive", user?.IsActive ? "Activated" : "Deactivated");
    setValue("PermissionLevel", user?.PermissionLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function updateNameOrLinkedInURL(data) {
    update(
      { ...data, Username: user?.Username },
      "http://localhost:3000/api/users/details"
    );
  }

  function updateAccountActive(data) {
    update(
      { ...data, Username: user?.Username, IsActive: true },
      "http://localhost:3000/api/users/details"
    );
    setValue("IsActive", "Activated");
  }

  function updateAccountDeactive(data) {
    update(
      { ...data, Username: user?.Username, IsActive: false },
      "http://localhost:3000/api/users/details"
    );
    setValue("IsActive", "Deactivated");
  }

  function resetAccountPassword(data) {
    update(
      {
        ...data,
        Username: user?.Username,
        NewPassword: "test",
        ConfirmNewPassword: "test",
      },
      "http://localhost:3000/api/auth/reset-password"
    );
  }

  console.log(userAuth);

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: { xs: "center", md: "flex-start" },
      }}
      paperKey={index}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          alignSelf: { xs: "center", md: "flex-start" },
          marginRight: { xs: "0", md: "2.5rem" },
          marginBottom: { xs: "1.5rem", md: "0" },
          order: { xs: 2, md: 1 },
        }}
      >
        <Person />
      </Box>
      <Box
        display="flex"
        sx={{
          alignItems: { xs: "center", md: "flex-start" },
          alignSelf: { xs: "center", md: "flex-start" },
          order: { xs: 3, md: 2 },
        }}
        flexDirection="column"
      >
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          attributeName={"Username"}
          maxLength={64}
          isLoading={updateIsLoading}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "1rem",
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
        />
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={
            userAuth &&
            userAuth.data.user.AdminFlag &&
            userAuth.data.user.PermissionLevel >=
              GET_AND_DELETE_AND_CREATE_AND_UPDATE
              ? updateNameOrLinkedInURL
              : undefined
          }
          isLoading={updateIsLoading}
          additionalStyles={{
            flexDirection: { xs: "column", sm: "row" },
            marginTop: "1rem",
          }}
          buttonName={"Update"}
        />
        <StatusForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={
            userAuth &&
            userAuth.data.user.AdminFlag &&
            userAuth.data.user.PermissionLevel >=
              GET_AND_DELETE_AND_CREATE_AND_UPDATE
              ? updateAccountActive
              : undefined
          }
          actionOnAttribute2={
            userAuth &&
            userAuth.data.user.AdminFlag &&
            userAuth.data.user.PermissionLevel >=
              GET_AND_DELETE_AND_CREATE_AND_UPDATE
              ? updateAccountDeactive
              : undefined
          }
          attributeName={"IsActive"}
          attributeLabel={"Account Status"}
          maxLength={64}
          isLoading={updateIsLoading}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "1rem",
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
        />
        <PermissionForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={
            userAuth &&
            userAuth.data.user.AdminFlag &&
            userAuth.data.user.PermissionLevel >=
              GET_AND_DELETE_AND_CREATE_AND_UPDATE
              ? updateNameOrLinkedInURL
              : undefined
          }
          isLoading={updateIsLoading}
          additionalStyles={{
            flexDirection: { xs: "column", sm: "row" },
            marginTop: "1rem",
          }}
          buttonName={"Update"}
        />
        {userAuth &&
          userAuth.data.user.AdminFlag &&
          userAuth.data.user.PermissionLevel >=
            GET_AND_DELETE_AND_CREATE_AND_UPDATE && (
            <Button
              onClick={handleSubmit(resetAccountPassword)}
              type="submit"
              variant="outlined"
              sx={{ mt: 1, mb: 1, color: "red", borderColor: "red" }}
              disabled={createIsLoading}
            >
              Reset Password
            </Button>
          )}
      </Box>

      {userAuth?.data?.user?.AdminFlag &&
        userAuth?.data?.user?.PermissionLevel >= GET_AND_DELETE && (
          <IconButton
            sx={{
              alignSelf: { xs: "flex-end", md: "flex-start" },
              order: { xs: 1, md: 3 },
            }}
            aria-label="delete"
            size="large"
            onClick={() => handleOpenDeleteConfirmationDialog(index)}
          >
            <Delete sx={{ width: "2rem", height: "2rem" }} />
          </IconButton>
        )}
    </MainPaper>
  );
}

function AddNewUser({ setUsersInfo, usersInfo }) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(reset, setUsersInfo, usersInfo);

  async function handleCreate(data) {
    const result = await executeHandle(
      "create",
      create,
      data,
      "http://localhost:3000/api/users/details",
      undefined,
      false,
      undefined,
      {},
      false
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it 
      isn't working.
    */
    if (result) {
      setValue("Fname", "");
      setValue("Lname", "");
      setValue("Username", "");
    }
  }

  return (
    <MainPaper overrideStyles={{ flexDirection: "column" }}>
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
        Add New User
      </Typography>
      <Box
        display="flex"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <Person
          additionalStyles={{ margin: { xs: "1.5rem 0", md: "0 1.5rem" } }}
        />
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          isLoading={createIsLoading}
          additionalStyles={{
            marginBottom: { md: "0", xs: "1rem" },
          }}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          attributeName={"Username"}
          isLoading={createIsLoading}
          maxLength={64}
        />
        <Button
          onClick={handleSubmit(handleCreate)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={createIsLoading}
        >
          Create
        </Button>
      </Box>
    </MainPaper>
  );
}
