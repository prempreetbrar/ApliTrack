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
  Radio,
  RadioGroup,
  Switch,
} from "@mui/material";

import { Delete } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";

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
import { GET_AND_DELETE } from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import MainBox from "components/MainBox";
import ApplicationForm from "components/ApplicationForm";

export default function Applications() {
  const { user } = useAuthContext();

  {
    /* declare state variables */
  }
  const [applicationsInfo, setApplicationsInfo] = React.useState([]);
  const [categoriesInfo, setCategoriesInfo] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [EarliestDateSubmitted, setEarliestDate] = React.useState(null);
  const [LatestDateSubmitted, setToDate] = React.useState(null);

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
      {},
      false
    );
  }

  //TODO: check get later
  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      {
        ...data,
        EarliestDateSubmitted,
        LatestDateSubmitted,
      },
      "http://localhost:3000/api/applications",
      null,
      false,
      null,
      {},
      false
    );
  }

  async function handleGetCategories(data) {
    executeHandle(
      "get",
      get,
      {
        ...data,
      },
      "http://localhost:3000/api/applications/category",
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
    const fetchApplicationsInfo = async () => {
      const response = await get({}, "http://localhost:3000/api/applications");

      console.log(response.application);
      setApplicationsInfo(response.application);
    };

    fetchApplicationsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <MainBox isLoading={getIsLoading}>
      <form onSubmit={handleSubmit(handleGet)}>
        <Box
          display="flex"
          sx={{
            flexDirection: { xs: "column", sm: "row", xl: "column" },
          }}
          alignItems="center"
          justifyContent="center"
          marginBottom="1rem"
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="CompanyName-ASC"
              name="radio-buttons-group"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControlLabel
                  value="AName-ASC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Application Name Ascending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="AName-DESC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Application Name Descending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="DateSubmitted-ASC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Earliest Submitted Date"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="DateSubmitted-DESC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort by Latest Submitted Date"
                  labelPlacement="start"
                />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: { xs: "2rem", md: "0rem" },

            alignItems: { xs: "center", sm: "center" },
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ flexDirection: { xs: "column", sm: "row" } }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: "1rem", marginRight: "1rem" }}
            >
              Search by:
            </Typography>
            <ApplicationForm
              register={register}
              handleSubmit={handleSubmit}
              additionalStyles={{
                marginTop: { xs: "1rem", sm: "0rem" },
                flexDirection: { xs: "column", sm: "row" },
              }}
              additionalLnameStyles={{
                marginRight: { xs: "1rem" },
                marginTop: { xs: "1rem", sm: "0" },
              }}
              allowUnauthenticated
            />
            <SingleDate
              register={register}
              handleSubmit={handleSubmit}
              attributeName={"EarliestDateSubmitted"}
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
              date={EarliestDateSubmitted}
              setDate={setEarliestDate}
            />
            <SingleDate
              register={register}
              handleSubmit={handleSubmit}
              attributeName={"LatestDateSubmitted"}
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
              date={LatestDateSubmitted}
              setDate={setToDate}
            />
          </Box>
          <IconButton type="submit">
            <SearchIcon color="primary" />
          </IconButton>
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
          ApplicantUsername={user?.Username}
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
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();
  const [dateSubmitted, setDateSubmitted] = React.useState(
    application?.DateSubmitted
  );

  React.useEffect(() => {
    /*
          We have forms that the user can change. However, we want to prepopulate them
          with their current values from the database.
        */
    setValue("AName", application?.AName);
    setValue("Notes", application?.Notes);
    setValue("Status", application?.Status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application]);

  function updateApplication(data) {
    update(
      {
        ...data,
        ApplicationID: application.ApplicationID,
        DateSubmitted: dateSubmitted,
      },
      "http://localhost:3000/api/applications/details"
    );
  }

  return (
    <MainPaper
      overrideStyles={{
        flexDirection: "column",
        alignItems: { xs: "center", md: "flex-start" },
        width: "100%",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Typography
          variant="h2"
          sx={{ fontSize: "2rem", fontWeight: "bold", display: "inline-block" }}
        >
          Application
        </Typography>
        <EmailIcon sx={{ width: "2rem", height: "2rem", marginLeft: "1rem" }} />
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
      </Box>

      <form onSubmit={handleSubmit(updateApplication)}>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row", md: "column" },
            alignItems: { xs: "center", sm: "flex-start", md: "center" },
            justifyContent: "center",
            width: { xs: "100%", md: "fit-content" },
            marginTop: { xs: "2rem" },
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            marginTop={{ xs: "2rem", md: "0" }}
            alignItems="center"
          >
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
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
              attributeLabel={"Application Name"}
            />
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
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
              handleSubmit={handleSubmit}
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
            />
            <SingleDate
              handleSubmit={handleSubmit}
              attributeName={"DateSubmitted"}
              maxLength={64}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: { xs: "1.5rem", md: "0rem" },
                marginBottom: { xs: "0rem" },
                gridArea: "Deadline",
              }}
              additionalFieldStyles={{
                paddingRight: "1rem",
              }}
              date={dateSubmitted}
              setDate={setDateSubmitted}
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
          </Box>

          <Box
            display="flex"
            marginTop={{ xs: "2rem", sm: "-2rem", md: "2rem" }}
            marginLeft={{ xs: "1rem", md: "0rem" }}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              marginTop={{ xs: "0rem", md: "1.5rem" }}
            >
              <InfoSection
                entityIDName="ApplicationID"
                entityID={application.ApplicationID}
                sectionTitle="Category"
                sectionArray={application.Category}
                entityName="Application"
                entityTargetAttribute="Category"
                isMarginRight
                sectionURL="http://localhost:3000/api/applications/category"
                maxCreateLength={16}
                additionalStyles={{
                  marginRight: { xs: "0" },
                }}
              />
              <InfoSection
                entityIDName="ApplicationID"
                entityID={application.ApplicationID}
                sectionTitle="Relevant URLs"
                sectionArray={application.RelevantURL}
                entityName="Application"
                entityTargetAttribute="RelevantURL"
                isMarginRight
                sectionURL="http://localhost:3000/api/applications/URL"
                maxCreateLength={16}
                additionalStyles={{
                  marginRight: { xs: "0" },
                }}
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              sx={{ marginTop: { xs: "2rem", md: "0rem" } }}
            >
              <Typography fontWeight="bold">Submit With</Typography>
              <InfoSection
                entityIDName="ApplicationID"
                entityID={application.ApplicationID}
                sectionTitle="Documents"
                sectionArray={application?.Documents?.map(
                  (document, index) => document
                )}
                entityName="Document"
                entityTargetAttribute="DocumentID"
                entityTargetAttribute2="DocFileName"
                sectionURL="http://localhost:3000/api/applications/submitWith"
                fetchAllOptionsURL="http://localhost:3000/api/documents"
                maxCreateLength={64}
                isDocument
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              sx={{ marginTop: { xs: "2rem", md: "0rem" } }}
            >
              <Typography fontWeight="bold">Corresponds To</Typography>
              <InfoSection
                entityIDName="ApplicationID"
                entityID={application.ApplicationID}
                sectionTitle="Jobs"
                sectionArray={application?.Jobs?.map(
                  (job, index) => job.CORRESPONDS_TO
                )}
                entityName="Job"
                entityTargetAttribute="PositionID"
                entityTargetAttribute2="PositionName"
                entitySecondTargetAttribute="JobPostURL"
                sectionURL="http://localhost:3000/api/applications/corresponding-jobs"
                fetchAllOptionsURL="http://localhost:3000/api/jobs"
                maxCreateLength={64}
                isJob
              />
            </Box>
          </Box>
        </FormControl>
      </form>
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
  entityTargetAttribute2,
  entitySecondTargetAttribute,
  isMarginRight,
  sectionURL,
  fetchAllOptionsURL,
  additionalStyles,
  isDocument,
  isJob,
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
  }

  async function handleCreateJob() {
    executeHandle(
      "create",
      create,
      {
        [entityTargetAttribute]:
          getValues(entityTargetAttribute) ||
          dropdownValue[entityTargetAttribute],
        [entityIDName]: entityID,
        [entitySecondTargetAttribute]: getValues(entitySecondTargetAttribute),
      },
      sectionURL,
      undefined,
      false,
      undefined,
      {},
      false
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
      index,
      false,
      undefined,
      {},
      false
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
      {!isJob && (
        <ChipDisplayer
          onUpdateSectionArray={onUpdateSectionArray}
          attributeName={entityTargetAttribute}
          secondAttributeName={entityTargetAttribute2}
          handleDelete={handleDelete}
        />
      )}
      {isJob && (
        <ChipDisplayer
          onUpdateSectionArray={onUpdateSectionArray}
          attributeName={entityTargetAttribute}
          secondAttributeName={entitySecondTargetAttribute}
          handleDelete={handleDelete}
        />
      )}

      {!isDocument && !isJob && (
        <NewEntry
          attributeName={entityTargetAttribute}
          maxCreateLength={maxCreateLength}
          handleCreate={handleCreate}
          createIsLoading={createIsLoading}
          register={register}
        />
      )}
      {isDocument && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <NewEntryDropdown
            isDropdownObject
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            entityAttributeName2={entityTargetAttribute2}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            additionalStyles={{ width: "50%" }}
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
          />
        </Box>
      )}
      {isJob && (
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
        >
          <NewEntryDropdown
            isDropdownObject
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            entityAttributeName2={entityTargetAttribute2}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreateJob}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            doNotShowButton
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
          />
          <NewEntry
            additionalStyles={{ marginLeft: "2rem" }}
            attributeName={entitySecondTargetAttribute}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreateJob}
            createIsLoading={createIsLoading}
            register={register}
          />
        </Box>
      )}
    </Box>
  );
}

function AddNewApplication({
  setApplicationsInfo,
  applicationsInfo,
  ApplicantUsername,
}) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const [dateSubmitted, setDateSubmitted] = React.useState(null);
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
        ...data,
        DateSubmitted: dateSubmitted,
      },
      "http://localhost:3000/api/applications/details",
      null,
      false,
      null,
      {},
      false
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
            attributeName={"AName"}
            isLoading={createIsLoading}
            maxLength={64}
            additionalStyles={{ marginTop: { xs: "1.5rem" } }}
            attributeLabel={"Application Name"}
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
          <SingleDate
            handleSubmit={handleSubmit}
            attributeName={"DateSubmitted"}
            maxLength={64}
            additionalStyles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: { xs: "1.5rem" },
              marginBottom: { xs: "0rem" },
              gridArea: "Deadline",
            }}
            date={dateSubmitted}
            setDate={setDateSubmitted}
          />

          <Button
            onClick={handleSubmit(handleCreate)}
            type="submit"
            variant="outlined"
            disabled={createIsLoading}
            sx={{ marginTop: "1.5rem" }}
          >
            Create
          </Button>
        </MainPaper>
      )}
    </>
  );
}
