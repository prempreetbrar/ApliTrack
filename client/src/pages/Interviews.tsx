// @ts-nocheck

import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
  IconButton,
  FormGroup,
  Switch,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

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
import NewEntryDropdownLabel from "components/NewEntryDropdownLabel";
import NewEntryDropdown from "components/NewEntryDropdown";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import SubBox from "components/SubBox";

export default function Interviews() {
  const { user } = useAuthContext();
  const [interviewInfo, setInterviewInfo] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [EarliestDate, setEarliestDate] = React.useState(null);
  const [LatestDate, setToDate] = React.useState(null);

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
      { ...data, EarliestDate, LatestDate },
      "http://localhost:3000/api/interviews/my-interviews",
      null,
      false,
      null
    );
  }

  React.useEffect(() => {
    if (user) {
      executeHandle(
        "get",
        get,
        {
          Sort: "Stage-ASC",
        },
        "http://localhost:3000/api/interviews/my-interviews",
        null,
        false,
        null,
        {},
        true,
        null
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
  React.useEffect(() => {
    const fetchInterviewInfo = async () => {
      const response = await get(
        {},
        "http://localhost:3000/api/interviews/my-interviews"
      );

      setInterviewInfo(response.interview);
    };

    fetchInterviewInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <MainBox>
      <form onSubmit={handleSubmit(handleGet)}>
        <FormGroup
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            marginBottom: "2rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: "column", xl: "row" },
            }}
            alignItems="center"
            justifyContent="center"
            marginRight="2.5rem"
          >
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Stage-ASC"
                name="radio-buttons-group"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", lg: "row" },
                }}
              >
                <FormControlLabel
                  value="Stage-ASC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Stage Ascending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="Stage-DESC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Stage Descending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="Date-ASC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Earliest Date"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="Date-DESC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Latest Date"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box
            display="flex"
            sx={{
              marginTop: { xs: "2rem", md: "2rem" },
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
              attributeName={"EarliestDate"}
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
              date={EarliestDate}
              setDate={setEarliestDate}
            />
            <SingleDate
              register={register}
              handleSubmit={handleSubmit}
              attributeName={"LatestDate"}
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
              date={LatestDate}
              setDate={setToDate}
            />
            <IconButton type="submit">
              <SearchIcon color="primary" />
            </IconButton>
          </Box>
        </FormGroup>
      </form>

      <SubBox isLoading={getIsLoading}>
        {interviewInfo &&
          interviewInfo.map((interview, index) => {
            return (
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
      </SubBox>
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
  const [dropdownValue, setDropdownValue] = React.useState(
    interview.Application
  );

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Stage", interview?.Stage);
    setValue("Date", interview?.Date);
    setValue("ApplicationID", interview?.Application);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview, AName]);

  React.useEffect(() => {
    setDate(interview.Date);
    setDropdownValue(interview.Application);
  }, [interview]);

  function updateStageorDateorAID(data) {
    update(
      {
        ...data,
        InterviewID: interview.InterviewID,
        Date: date,
        ApplicationID: dropdownValue.ApplicationID,
      },
      "http://localhost:3000/api/interviews/details"
    );
  }

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column" },
        justifyContent: "center",
        alignItems: "center",
      }}
      paperKey={index}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="h2"
            sx={{ fontSize: { xs: "2rem", sm: "3rem" } }}
          >
            Interview
          </Typography>
          <PeopleIcon
            sx={{ marginLeft: "1rem", width: "2rem", height: "2rem" }}
          />
        </Box>

        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => handleOpenDeleteConfirmationDialog(index)}
        >
          <Delete sx={{ width: "2rem", height: "2rem" }} />
        </IconButton>
      </Box>

      <Box
        display="flex"
        sx={{
          alignItems: { xs: "center", md: "center" },
          order: { xs: 3, md: 2 },
        }}
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <InterviewForm
            register={register}
            handleSubmit={handleSubmit}
            isLoading={updateIsLoading}
            additionalStyles={{ marginTop: { xs: "1rem", md: "0rem" } }}
            additionalLnameStyles={{
              marginRight: { xs: "1rem" },
            }}
            buttonName={"Update"}
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
              marginTop: { xs: "1rem", md: "0rem" },
            }}
            additionalFieldStyles={{
              marginRight: { xs: "1rem" },
            }}
            date={date}
            setDate={setDate}
          />
          <NewEntryDropdown
            entityName="Application"
            entityAttributeName="ApplicationID"
            entityAttributeName2="AName"
            maxCreateLength={64}
            handleSubmit={handleSubmit}
            register={register}
            fetchAllOptionsURL="http://localhost:3000/api/applications/my-applications"
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
            additionalStyles={{
              marginTop: { xs: "1rem", md: "0rem" },
              flexGrow: 1,
              width: { xs: "100%", sm: "50%" },
            }}
            isDropdownObject
            doNotShowButton
            additionalAutocompleteStyles={{ width: "100%" }}
          />
          <Button
            onClick={handleSubmit(updateStageorDateorAID)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2, ml: { xs: 0, md: 2 } }}
            disabled={updateIsLoading}
          >
            Update
          </Button>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          width="100%"
        >
          <Box width={{ xs: "100%", md: "50%" }}>
            <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
              Contacts Attending
            </Typography>
            <InfoSection
              entityIDName="InterviewID"
              entityID={interview.InterviewID}
              sectionTitle="Contact(s)"
              sectionArray={interview?.Contacts?.map(
                (contact, index) => contact
              )}
              entityName="Contact"
              entityTargetAttribute="ContactID"
              entityAttribute2="Fname"
              entityAttribute3="Lname"
              sectionURL="http://localhost:3000/api/contacts/attends"
              fetchAllOptionsURL="http://localhost:3000/api/contacts"
              maxCreateLength={64}
              isContact
            />
          </Box>

          <Box width={{ xs: "100%", md: "50%" }}>
            <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
              Jobs Mentioned
            </Typography>
            <InfoSection
              entityIDName="InterviewID"
              entityID={interview.InterviewID}
              sectionTitle="Job(s)"
              sectionArray={interview?.Jobs?.map((job, index) => job)}
              entityName="Job"
              entityTargetAttribute="PositionID"
              entityAttribute2="CompanyName"
              entityAttribute3="PositionName"
              sectionURL="http://localhost:3000/api/jobs/mentions"
              fetchAllOptionsURL="http://localhost:3000/api/jobs"
              maxCreateLength={64}
              isJob
            />
          </Box>
        </Box>
      </Box>
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
  entityAttribute2,
  entityAttribute3,
  isMarginRight,
  sectionURL,
  fetchAllOptionsURL,
  isContact,
  isJob,
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
    const success = await executeHandle(
      "create",
      create,
      {
        [entityTargetAttribute]:
          getValues(entityTargetAttribute) ||
          dropdownValue[entityTargetAttribute],
        [entityIDName]: entityID,
      },
      sectionURL,
      null,
      false,
      null,
      {},
      false,
      { ...dropdownValue }
    );

    if (success) {
      setDropdownValue("");
    }
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

  return (
    <Box
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
        secondAttributeName={entityAttribute2}
        thirdAttributeName={entityAttribute3}
        handleDelete={handleDelete}
        isContact={isContact}
        isJob={isJob}
      />

      {!isContact && !isJob && (
        <NewEntry
          attributeName={entityTargetAttribute}
          maxCreateLength={maxCreateLength}
          handleCreate={handleCreate}
          createIsLoading={createIsLoading}
          register={register}
        />
      )}
      {(isContact || isJob) && (
        <Box display="flex" flexDirection="row" alignItems="flex-end">
          <NewEntryDropdown
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            entityAttributeName2={entityAttribute2}
            entityAttributeName3={entityAttribute3}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            additionalStyles={{ width: "100%" }}
            doNotShowButton
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
            isDropdownObject
            isContact={isContact}
          />
          <Button
            onClick={handleCreate}
            sx={{ ml: 1, fontSize: "1.5rem", height: "100%" }}
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
  const [dropdownValue, setDropdownValue] = React.useState(null);
  const { executeHandle } = useHandleOperation(
    reset,
    setInterviewInfo,
    interviewInfo
  );

  async function handleCreate(data) {
    const result = await executeHandle(
      "create",
      create,
      { ...data, Date, ApplicationID: dropdownValue.ApplicationID },
      "http://localhost:3000/api/interviews/details",
      null,
      false,
      null,
      {},
      false,
      { Application: dropdownValue }
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it 
      isn't working.
    */
    if (result) {
      setValue("Stage", "");
      setDate(null);
      setDropdownValue(null);
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
            marginTop: "1rem",
            marginRight: { xs: "-1rem", md: "1rem" },
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
            marginTop: "1rem",
            marginRight: { xs: "0rem", md: "1rem" },
          }}
          date={Date}
          setDate={setDate}
        />

        <NewEntryDropdown
          entityName="Application"
          entityAttributeName="ApplicationID"
          entityAttributeName2="AName"
          maxCreateLength={64}
          handleSubmit={handleSubmit}
          register={register}
          fetchAllOptionsURL="http://localhost:3000/api/applications/my-applications"
          dropdownValue={dropdownValue}
          setDropdownValue={setDropdownValue}
          additionalStyles={{
            marginTop: { xs: "1rem" },
            flexGrow: 1,
            width: { xs: "100%", md: "50%" },
          }}
          isDropdownObject
          doNotShowButton
          additionalAutocompleteStyles={{ width: "100%" }}
        />

        <Button
          onClick={handleSubmit(handleCreate)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2, ml: { xs: 0, md: 2 } }}
          disabled={createIsLoading}
        >
          Create
        </Button>
      </Box>
    </MainPaper>
  );
}
