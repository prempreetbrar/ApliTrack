// @ts-nocheck

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
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import SingleForm from "components/SingleForm";
import useHandleOperation from "hooks/useHandleOperation";
import InterviewForm from "components/InterviewForm";
import SingleDate from "components/SingleDate";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NewEntryDropdownInterview from "components/NewEntryDropdownInterview";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";

export default function Interviews() {

  const { user } = useAuthContext();
  const [interviewInfo, setInterviewInfo] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();
  
  const { executeRequest: get } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [Date, setDate] = React.useState(null);

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
    setInterviewInfo,
    interviewInfo
  );

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        InterviewID: interviewInfo[index].InterviewID,
      },
      "http://localhost:3000/api/interviews/details",
      index,
      false,
      null
    );
  }

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      data,
      "http://localhost:3000/api/interviews/my-interviews",
      null,
      false,
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
      const fetchInterviewInfo = async () => {
        const response = await get({}, "http://localhost:3000/api/interviews/my-interviews");
  
        setInterviewInfo(response.interview);
      };
  
      fetchInterviewInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

  return (
    <MainBox>
      <FormGroup
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          marginBottom: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
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
            <InterviewForm
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
            <SingleDate
              register={register}
              handleSubmit={handleSubmit}
              attributeName={"Date"}
              maxLength={64}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: { xs: "0rem" },
                marginTop: { xs: "1rem", sm: "0rem" },
              }}
              additionalFieldStyles={{
                marginRight: { xs: "1rem" },
              }}
              date={Date}
              setDate={setDate}
            />
            <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
          </Box>
        </form>
      </FormGroup>
      {interviewInfo &&
        interviewInfo.map((interview, index) => {
          return(
            <Interview
                key={index}
                interview={interview}
                index={index}
                handleOpenDeleteConfirmationDialog={
                  handleOpenDeleteConfirmationDialog
                }
              />
          );
        })}
      {user && (
        <AddNewInterview
          setInterviewInfo={setInterviewInfo}
          interviewInfo={interviewInfo}
        />
      )}
      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={
            interviewInfo[selectedIndexToDelete]?.Stage +
            " " +
            interviewInfo[selectedIndexToDelete]?.Date
          }
        />
      )}
    </MainBox>
  );
}

function Interview({
  interview,
  ApplicantUsername,
  Stage,
  Date,
  AName,
  index,
  handleOpenDeleteConfirmationDialog,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();
  const [date, setDate] = React.useState(interview.Date);

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Stage", interview?.Stage);
    setValue("Date", interview?.Date);
    setValue("ApplicationID", interview?.ApplicationID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview, AName]);

  console.log(interview?.Stage, interview?.Date, interview?.ApplicationID);

  React.useEffect(() => {
    setDate(interview.Date);
  }, [interview]);

  function updateStageorDateorAID(data) {
    update(
      { ...data, InterviewID: interview.InterviewID},
      "http://localhost:3000/api/interviews/details"
    );
  }

  return(
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
      }}
      paperKey={index}
    >
      <Box
        display="flex"
        sx={{
          alignItems: { xs: "center", md: "flex-start" },
          order: { xs: 3, md: 2 },
        }}
        flexDirection="column"
      >
        <InterviewForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateStageorDateorAID}
          isLoading={updateIsLoading}
          additionalLnameStyles={{ marginRight: { xs: "1rem" } }}
          buttonName={"Update"}
        />
        <SingleDate
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateStageorDateorAID}
          attributeName={"Date"}
          maxLength={64}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: { xs: "0rem" },
            marginTop: { xs: "1rem", sm: "0rem" },
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
          date={date}
          setDate={setDate}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateStageorDateorAID}
          attributeName={"ApplicationID"}
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

        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Contacts Attending
        </Typography>
        <InfoSection
          entityIDName="InterviewID"
          entityID={interview.InterviewID}
          sectionTitle="Contact(s)"
          sectionArray={interview?.Contacts?.map(
            (contact, index) => contact.ATTENDS
          )}
          entityName="Contact"
          entityTargetAttribute="ContactID"
          sectionURL="http://localhost:3000/api/contacts/attends"
          fetchAllOptionsURL="http://localhost:3000/api/contacts"
          maxCreateLength={64}
          isContact
        />
      </Box>
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
    </MainPaper>
  );
}

function InfoSection({
  maxCreateLength,
  entityIDName,
  entityID,
  sectionTitle,
  sectionArray,
  entityName,
  entityTargetAttribute,
  isMarginRight,
  sectionURL,
  fetchAllOptionsURL,
  isContact,
  additionalStyles,
}) {
  const [onUpdateSectionArray, setOnUpdateSectionArray] = React.useState([]);
  const [dropdownValue, setDropdownValue] = React.useState("");
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset, control } = useForm();
  const { executeHandle } = useHandleOperation(
    reset,
    setOnUpdateSectionArray,
    onUpdateSectionArray
  );

  React.useEffect(() => {
    if (sectionArray) {
      setOnUpdateSectionArray([...sectionArray]);
    }
  }, [sectionArray]);

  async function handleCreate() {
    executeHandle(
      "create",
      create,
      {
        [entityTargetAttribute]:
          getValues(entityTargetAttribute) || dropdownValue,
        [entityIDName]: entityID,
      },
      sectionURL
    );
  }

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        [entityTargetAttribute]:
          onUpdateSectionArray[index][entityTargetAttribute],
        [entityIDName]: entityID,
      },
      sectionURL,
      index
    );
  }

  return(
    <Box
      minWidth="100%"
      padding="0.5rem"
      marginRight={`${isMarginRight ? "2rem" : "0"}`}
      sx={{ ...additionalStyles }}
    >
      <Typography sx={{ textDecoration: "underline" }}>
        {sectionTitle}
      </Typography>
      <ChipDisplayer
        onUpdateSectionArray={onUpdateSectionArray}
        attributeName={entityTargetAttribute}
        handleDelete={handleDelete}
      />

      {!isContact && (
        <NewEntry
          attributeName={entityTargetAttribute}
          maxCreateLength={maxCreateLength}
          handleCreate={handleCreate}
          createIsLoading={createIsLoading}
          register={register}
        />
      )}
      {isContact && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <NewEntryDropdownInterview
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            additionalStyles={{ width: "50%" }}
            doNotShowButton
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
          />
          <Button
            onClick={handleCreate}
            sx={{ ml: 1, fontSize: "1.5rem" }}
            disabled={createIsLoading}
          >
            +
          </Button>
        </Box>
      )}
    </Box>

  );
}


function AddNewInterview({ setInterviewInfo, interviewInfo }) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const [Date, setDate] = React.useState(null);
  const { executeHandle } = useHandleOperation(
    reset,
    setInterviewInfo,
    interviewInfo
  );

    //console.log(setInterviewInfo, interviewInfo);

  async function handleCreate(data) {
    console.log(data);
    const result = await executeHandle(
      "create",
      create,
      {...data, Date},
      "http://localhost:3000/api/interviews/details"
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it 
      isn't working.
    */
    if (result) {
      setValue("Stage", "");
      setValue("Date", "");
      setValue("ApplicationID", "");
    }
  }

  return (
    <MainPaper overrideStyles={{ flexDirection: "column" }}>
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
        Add New Interview
      </Typography>
      <Box
        display="flex"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <InterviewForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          isLoading={createIsLoading}
          additionalStyles={{
            marginBottom: { md: "0", xs: "1rem" },
          }}
        />
        <SingleDate
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          isLoading={createIsLoading}
          attributeName={"Date"}
          maxLength={64}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: { xs: "0rem" },
            marginTop: { xs: "1rem", sm: "0rem" },
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
          date={Date}
          setDate={setDate}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          attributeName={"ApplicationID"}
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