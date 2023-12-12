// @ts-nocheck

import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Radio,
  FormControlLabel,
  Input,
  Tooltip,
  Typography,
  IconButton,
  Switch,
  RadioGroup,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import { Delete } from "@mui/icons-material";

import { useCreate, useDelete, useGet, useUpdate } from "hooks/useHttpMethod";

import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import NewEntry from "components/NewEntry";
import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import SingleForm from "components/SingleForm";
import ChipDisplayer from "components/ChipDisplayer";
import useHandleOperation from "hooks/useHandleOperation";
import SingleDate from "components/SingleDate";
import useAuthContext from "hooks/useAuthContext";

import { DELETE_ONLY } from "Constants";

export default function Companies() {
  const [companies, setCompanies] = React.useState([]);
  const [onlyShowJobsITrack, setOnlyShowJobsITrack] = React.useState(false);
  const [mostRecentEarliestDateToApply, setMostRecentEarliestDateToApply] =
    React.useState(null);
  const [mostRecentLatestDateToApply, setMostRecentLatestDateToApply] =
    React.useState(null);
  const [
    savedEarliestApplicationDeadline,
    setSavedEarliestApplicationDeadline,
  ] = React.useState(null);
  const [savedLatestApplicationDeadline, setSavedLatestApplicationDeadline] =
    React.useState(null);
  const [
    mostRecentEarliestApplicationDeadline,
    setMostRecentEarliestApplicationDeadline,
  ] = React.useState(null);
  const [
    mostRecentLatestApplicationDeadline,
    setMostRecentLatestApplicationDeadline,
  ] = React.useState(null);

  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);

  const { user } = useAuthContext();
  const { executeRequest: get } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    undefined,
    setCompanies,
    companies
  );

  const handleOpenDeleteConfirmationDialog = (index) => {
    setSelectedIndexToDelete(index);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setSelectedIndexToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  React.useEffect(() => {
    executeHandle(
      "get",
      get,
      {
        Sort: "ASC",
      },
      "http://localhost:3000/api/companies",
      null,
      false,
      null,
      {},
      true,
      null
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      {
        ...data,
      },
      "http://localhost:3000/api/companies",
      null,
      false,
      null,
      {},
      false,
      null
    );

    setSavedEarliestApplicationDeadline(mostRecentEarliestApplicationDeadline);
    setSavedLatestApplicationDeadline(mostRecentLatestApplicationDeadline);
  }

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        CompanyName: companies[index].CompanyName,
      },
      "http://localhost:3000/api/companies",
      index,
      false,
      null,
      {},
      false,
      null
    );
  }

  return (
    <MainBox>
      <form onSubmit={handleSubmit(handleGet)} style={{ width: "100%" }}>
        <Box
          display="flex"
          sx={{
            flexDirection: { xs: "row", xl: "column" },
          }}
          alignItems="center"
          justifyContent="center"
          marginBottom="1rem"
        >
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: "column", xl: "row" },
            }}
            alignItems="center"
            marginRight="2.5rem"
          >
            {user && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={onlyShowJobsITrack}
                    onChange={(event) => {
                      setOnlyShowJobsITrack(event.target.checked);
                      if (!event.target.checked) {
                        setMostRecentEarliestDateToApply(null);
                        setMostRecentLatestDateToApply(null);
                      }
                    }}
                  />
                }
                label="Only Show Jobs I Track"
              />
            )}

            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ASC"
                name="radio-buttons-group"
                sx={{ display: "flex" }}
                row
              >
                <FormControlLabel
                  value="ASC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort Ascending"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="DESC"
                  control={<Radio {...register("Sort")} />}
                  label="Sort Descending"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginTop="1rem"
            sx={{
              flexDirection: { xs: "column", xl: "row" },
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: "1rem", marginRight: "1rem", flexShrink: 0 }}
            >
              Search by:
            </Typography>
            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              additionalStyles={{
                marginTop: { xs: "1rem", xl: "0rem" },
                flexShrink: 0,
              }}
              attributeName={"CompanyName"}
              allowUnauthenticated
            />
            <SingleDate
              handleSubmit={handleSubmit}
              attributeName={"EarliestApplicationDeadline"}
              maxLength={64}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: { xs: "0rem" },
                marginTop: { xs: "1rem", xl: "0rem" },
                flexShrink: 0,
              }}
              additionalFieldStyles={{
                marginRight: { xs: "1rem" },
              }}
              date={mostRecentEarliestApplicationDeadline}
              setDate={setMostRecentEarliestApplicationDeadline}
              allowUnauthenticated
            />
            <SingleDate
              handleSubmit={handleSubmit}
              attributeName={"LatestApplicationDeadline"}
              maxLength={64}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: { xs: "0rem" },
                marginTop: { xs: "1rem", xl: "0rem" },
                flexShrink: 0,
              }}
              additionalFieldStyles={{
                marginRight: { xs: "1rem" },
              }}
              date={mostRecentLatestApplicationDeadline}
              setDate={setMostRecentLatestApplicationDeadline}
              allowUnauthenticated
            />

            {user && onlyShowJobsITrack && (
              <SingleDate
                handleSubmit={handleSubmit}
                attributeName={"EarliestDateToApply"}
                maxLength={64}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: { xs: "0rem" },
                  marginTop: { xs: "1rem", xl: "0rem" },
                  flexShrink: 0,
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "1rem" },
                }}
                date={mostRecentEarliestDateToApply}
                setDate={setMostRecentEarliestDateToApply}
              />
            )}
            {user && onlyShowJobsITrack && (
              <SingleDate
                handleSubmit={handleSubmit}
                attributeName={"LatestDateToApply"}
                maxLength={64}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: { xs: "0rem" },
                  marginTop: { xs: "1rem", xl: "0rem" },
                  flexShrink: 0,
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "1rem" },
                }}
                date={mostRecentLatestDateToApply}
                setDate={setMostRecentLatestDateToApply}
              />
            )}
            <IconButton type="submit">
              <SearchIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      </form>

      {companies &&
        companies.map((company, index) => (
          <Company
            key={index}
            index={index}
            handleOpenDeleteConfirmationDialog={
              handleOpenDeleteConfirmationDialog
            }
            company={company}
            onlyShowJobsITrack={onlyShowJobsITrack}
            mostRecentEarliestDateToApply={mostRecentEarliestDateToApply}
            mostRecentLatestDateToApply={mostRecentLatestDateToApply}
            earliestApplicationDeadline={savedEarliestApplicationDeadline}
            latestApplicationDeadline={savedLatestApplicationDeadline}
          />
        ))}
      <NewCompanyForm companies={companies} setCompanies={setCompanies} />
      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={companies[selectedIndexToDelete]?.CompanyName}
        />
      )}
    </MainBox>
  );
}

function Company({
  index,
  handleOpenDeleteConfirmationDialog,
  company,
  onlyShowJobsITrack,
  mostRecentEarliestDateToApply,
  mostRecentLatestDateToApply,
  earliestApplicationDeadline,
  latestApplicationDeadline,
}) {
  const { user } = useAuthContext();
  const { register, handleSubmit, setValue, reset } = useForm();
  const { executeRequest: get } = useGet();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const [jobs, setJobs] = React.useState(company?.Jobs || []);

  const [trackedJobs, setTrackedJobs] = React.useState({});

  const [deleteJobConfirmationDialogOpen, setDeleteJobConfirmationDialogOpen] =
    React.useState(false);
  const [selectedJobIndexToDelete, setSelectedJobIndexToDelete] =
    React.useState(null);

  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { executeHandle } = useHandleOperation(reset, setJobs, jobs);

  const handleOpenDeleteJobConfirmationDialog = (index) => {
    setSelectedJobIndexToDelete(index);
    setDeleteJobConfirmationDialogOpen(true);
  };

  React.useEffect(() => {
    if (jobs === undefined) {
      setJobs([]);
    }
  }, [jobs]);

  const handleCloseDeleteJobConfirmationDialog = () => {
    setSelectedJobIndexToDelete(null);
    setDeleteJobConfirmationDialogOpen(false);
  };

  React.useEffect(() => {
    const fetchTrackedJobs = async () => {
      if (user && company) {
        const trackedResponse = await get(
          {
            EarliestDateToApply: mostRecentEarliestDateToApply,
            LatestDateToApply: mostRecentLatestDateToApply,
          },
          "http://localhost:3000/api/applicants/tracks-job"
        );

        const hashtableTrackedJobs = {};
        for (const job of trackedResponse.tracks) {
          hashtableTrackedJobs[job.PositionID] = {
            ...job,
          };
        }
        setTrackedJobs(hashtableTrackedJobs);
      }
    };
    fetchTrackedJobs();
  }, [user, company, onlyShowJobsITrack]);

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Industry", company.Industry);
    setValue("HomePageURL", company.HomePageURL);
    setValue("Description", company.Description);
    setJobs(company.Jobs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  function updateCompany(data) {
    update(
      {
        CompanyName: company.CompanyName,
        ...data,
      },
      "http://localhost:3000/api/companies"
    );
  }

  async function handleDeleteJob(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        PositionID: jobs[index].PositionID,
      },
      "http://localhost:3000/api/companies/company/jobs",
      index,
      false,
      null,
      {},
      false,
      null
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
          {company.CompanyName}
        </Typography>
        <BusinessIcon
          sx={{ marginLeft: "1rem", width: "4rem", height: "4rem" }}
        />

        <FormControl
          onSubmit={handleSubmit(updateCompany)}
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
            attributeName={"Industry"}
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
            attributeName={"HomePageURL"}
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
            attributeName={"Description"}
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
        {jobs?.map((job, index) => {
          if (onlyShowJobsITrack && !(job.PositionID in trackedJobs)) {
            return <></>;
          } else if (
            job.ApplicationDeadline < earliestApplicationDeadline ||
            job.ApplicationDeadline > latestApplicationDeadline
          ) {
            return <></>;
          } else {
            return (
              <Job
                key={index}
                index={index}
                company={company}
                job={job}
                isTracked={job.PositionID in trackedJobs}
                trackedJobs={trackedJobs}
                setTrackedJobs={setTrackedJobs}
                Notes={trackedJobs[job.PositionID]?.Notes}
                DateToApply={trackedJobs[job.PositionID]?.DateToApply}
                handleOpenDeleteJobConfirmationDialog={
                  handleOpenDeleteJobConfirmationDialog
                }
              />
            );
          }
        })}
        <NewJobForm
          companyName={company.CompanyName}
          jobs={jobs}
          setJobs={setJobs}
        />
      </Box>
      {deleteJobConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteJobConfirmationDialogOpen}
          handleClose={handleCloseDeleteJobConfirmationDialog}
          handleConfirm={() => handleDeleteJob(selectedJobIndexToDelete)}
          itemName={jobs[selectedJobIndexToDelete]?.PositionName}
        />
      )}
    </MainPaper>
  );
}

function Job({
  company,
  job,
  index,
  trackedJobs,
  setTrackedJobs,
  isTracked,
  Notes,
  DateToApply,
  handleOpenDeleteJobConfirmationDialog,
}) {
  const [responsibilitiesArray, setResponsibilitiesArray] = React.useState([]);
  const [qualificationsArray, setQualificationsArray] = React.useState([]);

  const { user } = useAuthContext();
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle: executeHandleResponsibilities } = useHandleOperation(
    undefined,
    setResponsibilitiesArray,
    responsibilitiesArray
  );
  const { executeHandle: executeHandleQualifications } = useHandleOperation(
    undefined,
    setQualificationsArray,
    qualificationsArray
  );
  const { executeHandle: executeHandleTracks } = useHandleOperation(
    undefined,
    setTrackedJobs,
    trackedJobs
  );
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [applicationDeadline, setApplicationDeadline] = React.useState(
    job.ApplicationDeadline
  );
  const [stillTracks, setStillTracks] = React.useState(isTracked);
  React.useEffect(() => {
    setStillTracks(isTracked);
  }, [isTracked]);

  const [date, setDate] = React.useState(DateToApply);
  const [currentlyUploadedJobPostFile, setCurrentlyUploadedJobPostFile] =
    React.useState(job?.JobPostFile?.split("/")?.pop());

  async function updateJob(data) {
    const JobPostFile = data?.JobPostFile?.[0];
    const newData = { ...data };
    delete newData.JobPostFile;
    if (JobPostFile !== "/") {
      newData.JobPostFile = JobPostFile;
    }

    const success = await update(
      {
        PositionID: job.PositionID,
        ApplicationDeadline: applicationDeadline,
        ...newData,
      },
      "http://localhost:3000/api/companies/company/jobs",
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (success && JobPostFile && JobPostFile !== "/") {
      setCurrentlyUploadedJobPostFile(success.job.JobPostFile);
    }
  }

  async function handleDeleteQualifications(index) {
    executeHandleQualifications(
      "delete",
      deleteInstance,
      {
        PositionID: job.PositionID,
        Qualification: qualificationsArray[index]["Qualification"],
      },
      "http://localhost:3000/api/companies/company/jobs/qualifications",
      index,
      false,
      undefined,
      {},
      false,
      null
    );
  }

  async function handleDeleteResponsibilities(index) {
    executeHandleResponsibilities(
      "delete",
      deleteInstance,
      {
        PositionID: job.PositionID,
        Responsibility: qualificationsArray[index]["Responsibility"],
      },
      "http://localhost:3000/api/companies/company/jobs/responsibilities",
      index,
      false,
      undefined,
      {},
      false,
      null
    );
  }

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("PositionName", job.PositionName);
    setValue("Description", job.Description);
    setValue("JobPostFile", job.JobPostFile);
    setValue("PositionType", job.PositionType);
    setApplicationDeadline(job.ApplicationDeadline);
    setValue("Salary", job.Salary);

    const fetchQualifications = async () => {
      const response = await get(
        {},
        `http://localhost:3000/api/companies/company/jobs/${job.PositionID}`
      );
      setQualificationsArray(response.job.Qualifications);
    };
    const fetchResponsibilities = async () => {
      const response = await get(
        {},
        `http://localhost:3000/api/companies/company/jobs/${job.PositionID}`
      );
      setResponsibilitiesArray(response.job.Responsibilities);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps

    if (job) {
      fetchQualifications();
      fetchResponsibilities();
    }
  }, [job]);

  React.useEffect(() => {
    setDate(DateToApply);
    setValue("Notes", Notes);
  }, [DateToApply, Notes]);

  async function handleCreateQualification() {
    const success = await executeHandleQualifications(
      "create",
      create,
      {
        PositionID: job.PositionID,
        Qualification: getValues("Qualification"),
      },
      `http://localhost:3000/api/companies/company/jobs/qualifications`,
      null,
      false,
      null,
      {},
      false,
      null
    );
    if (success) {
      setValue("Qualification", "");
    }
  }

  async function handleCreateResponsibility() {
    const success = await executeHandleResponsibilities(
      "create",
      create,
      {
        PositionID: job.PositionID,
        Responsibility: getValues("Responsibility"),
      },
      `http://localhost:3000/api/companies/company/jobs/responsibilities`,
      null,
      false,
      null,
      {},
      false,
      null
    );
    if (success) {
      setValue("Responsibility", "");
    }
  }

  function handleTracks(event) {
    if (event.target.checked) {
      setStillTracks(true);

      executeHandleTracks(
        "create",
        create,
        { PositionID: job.PositionID },
        "http://localhost:3000/api/applicants/tracks-job",
        null,
        true,
        "PositionID",
        {},
        false,
        null
      );
    }
    if (!event.target.checked) {
      executeHandleTracks(
        "delete",
        deleteInstance,
        { PositionID: job.PositionID },
        "http://localhost:3000/api/applicants/tracks-job",
        job.PositionID,
        true,
        null,
        {},
        false,
        null
      );
      setStillTracks(false);
    }
  }

  function updateTracks(data) {
    update(
      {
        PositionID: job.PositionID,
        ...data,
        DateToApply: date,
      },
      "http://localhost:3000/api/applicants/tracks-job"
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(updateJob)}>
        <Box
          sx={{
            display: "grid",
            gridTemplateAreas: {
              lg: `
            'PositionName ApplicationDeadline Qualification Responsibility' 
            'PositionType Salary Qualification Responsibility'
            '. .  Qualification Responsibility'
            'Description Description Track Track'
            'Description Description Track Track'
            'JobPostFile JobPostFile Track Track'
            'JobPostFile JobPostFile Track Track'
            'JobPostFile JobPostFile Track Track'
            'Update Update d d'
          `,

              md: `
          'PositionName ApplicationDeadline Qualification Qualification' 
          'PositionType Salary Responsibility Responsibility'
          'Description Description Track Track'
          'Description Description Track Track'
          'JobPostFile JobPostFile Track Track'
          'JobPostFile JobPostFile Track Track'
          'JobPostFile JobPostFile Track Track'
          'Update Update d d'
        `,
              xs: `
        'PositionName ApplicationDeadline' 
        'PositionType Salary'
        'Description Description'
        'Qualification Qualification'
        'Responsibility Responsibility'
        'JobPostFile JobPostFile'
        'JobPostFile JobPostFile'
        'JobPostFile JobPostFile'
        'Update Update'
        'Track Track'
        'Track Track'
        'd d'
      `,
            },
            marginTop: "2rem",
            alignItems: "start",
            gridGap: "0.75rem",
          }}
        >
          <SingleForm
            register={register}
            attributeName={"PositionName"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              gridArea: "PositionName",
            }}
          />

          <SingleForm
            register={register}
            attributeName={"PositionType"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              gridArea: "PositionType",
            }}
            additionalFieldStyles={{
              marginTop: "1rem",
            }}
          />
          <SingleDate
            handleSubmit={handleSubmit}
            attributeName={"ApplicationDeadline"}
            maxLength={64}
            additionalStyles={{
              gridArea: "ApplicationDeadline",
            }}
            additionalFieldStyles={{
              width: "100%",
            }}
            date={applicationDeadline}
            setDate={setApplicationDeadline}
          />
          <SingleForm
            register={register}
            attributeName={"Salary"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              gridArea: "Salary",
            }}
            additionalFieldStyles={{
              marginTop: "1rem",
              width: "100%",
            }}
          />
          <SingleForm
            register={register}
            attributeName={"Description"}
            maxLength={64}
            isLoading={updateIsLoading}
            additionalStyles={{
              gridArea: "Description",
              marginTop: "1rem",
            }}
            additionalFieldStyles={{
              marginRight: { xs: "0rem" },
            }}
            isTextArea
          />

          <Box
            sx={{
              gridArea: "JobPostFile",
              display: "flex",
              flexDirection: "column",
              marginTop: "2rem",
            }}
          >
            <Typography>Job Posting</Typography>
            {currentlyUploadedJobPostFile && (
              <iframe
                src={`http://localhost:3000/uploads/jobPosts/${currentlyUploadedJobPostFile}`}
                title={currentlyUploadedJobPostFile}
                width="fit-content"
                style={{
                  height: "20rem",
                }}
              ></iframe>
            )}
            {user && (
              <Input
                sx={{ marginTop: "1rem" }}
                {...register("JobPostFile")}
                type="file"
                name="JobPostFile"
              />
            )}
            {currentlyUploadedJobPostFile && (
              <Tooltip
                title={currentlyUploadedJobPostFile}
                placement="top"
                arrow
              >
                <Typography
                  noWrap
                  sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
                >
                  Existing File: {currentlyUploadedJobPostFile}
                </Typography>
              </Tooltip>
            )}
            {!currentlyUploadedJobPostFile && (
              <Tooltip
                title={"No File Has Been Uploaded for the Job Posting"}
                placement="top"
                arrow
              >
                <Typography
                  noWrap
                  sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
                >
                  No File Has Been Uploaded for the Job Posting
                </Typography>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              gridArea: "Qualification",
              marginLeft: "2rem",
              marginTop: { sm: 0, md: "-1.5rem" },
            }}
          >
            <Typography>Qualifications</Typography>
            <ChipDisplayer
              onUpdateSectionArray={qualificationsArray}
              attributeName={"Qualification"}
              handleDelete={handleDeleteQualifications}
            />
            <NewEntry
              attributeName={"Qualification"}
              maxCreateLength={64}
              handleCreate={handleCreateQualification}
              createIsLoading={createIsLoading}
              register={register}
              additionalStyles={{ marginTop: 0 }}
            />
          </Box>

          {user?.data?.user?.AdminFlag &&
            user?.data?.user?.PermissionLevel >= DELETE_ONLY && (
              <Box
                sx={{
                  gridArea: "d",
                  textAlign: "center",
                }}
              >
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleOpenDeleteJobConfirmationDialog(index)}
                >
                  <Delete sx={{ width: "2rem", height: "2rem" }} />
                </IconButton>
              </Box>
            )}

          <Box
            sx={{
              gridArea: "Responsibility",
              marginTop: { xs: "-0.5rem", lg: "-1.5rem" },
              marginLeft: { xs: "2rem", lg: 0 },
            }}
          >
            <Typography sx={{ alignSelf: "flex-start" }}>
              Responsibilities
            </Typography>
            <ChipDisplayer
              onUpdateSectionArray={responsibilitiesArray}
              attributeName={"Responsibility"}
              handleDelete={handleDeleteResponsibilities}
            />
            <NewEntry
              attributeName={"Responsibility"}
              maxCreateLength={64}
              handleCreate={handleCreateResponsibility}
              createIsLoading={createIsLoading}
              register={register}
              additionalStyles={{ marginTop: 0 }}
            />
          </Box>

          {user && (
            <Box
              sx={{
                gridArea: "Track",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: { xs: "2rem", md: 0 },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox checked={stillTracks} onChange={handleTracks} />
                }
                label="Track This Job"
              />
              {stillTracks && (
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"DateToApply"}
                  maxLength={64}
                  isLoading={updateIsLoading}
                  date={date || null}
                  setDate={setDate}
                  additionalStyles={{
                    marginTop: "1rem",
                  }}
                />
              )}
              {stillTracks && (
                <SingleForm
                  register={register}
                  handleSubmit={handleSubmit}
                  actionOnAttribute={updateTracks}
                  attributeName={"Notes"}
                  maxLength={64}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "1rem",
                  }}
                  isLoading={updateIsLoading}
                  isTextArea
                />
              )}
            </Box>
          )}

          {user && (
            <Button
              sx={{
                marginTop: "1rem",
                gridArea: "Update",
                width: "min-content",
                justifySelf: "center",
              }}
              type="submit"
              variant="outlined"
            >
              Update
            </Button>
          )}
        </Box>
      </form>

      <hr
        style={{
          overflow: "hidden",
          margin: "5rem auto",
        }}
      />
    </>
  );
}

function NewJobForm({ companyName, jobs, setJobs }) {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle } = useHandleOperation(reset, setJobs, jobs);
  const [applicationDeadline, setApplicationDeadline] = React.useState(null);
  const { user } = useAuthContext();

  async function handleCreate(data) {
    const JobPostFile = data.JobPostFile[0];
    const newData = { ...data };
    delete newData.JobPostFile;
    if (JobPostFile !== "/") {
      newData.JobPostFile = JobPostFile;
    }

    const result = await executeHandle(
      "create",
      create,
      {
        ...newData,
        CompanyName: companyName,
        ApplicationDeadline: applicationDeadline,
      },
      "http://localhost:3000/api/companies/company/jobs",
      null,
      false,
      null,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      false,
      null
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it 
      isn't working.
    */
    if (result) {
      setValue("PositionName", "");
      setValue("Description", "");
      setValue("PositionType", "");
      setValue("Salary", "");
      setValue("JobPostFile", "");
      setApplicationDeadline(null);
    }
  }

  return (
    <>
      {user && (
        <Box
          display="grid"
          sx={{
            gridTemplateAreas: {
              md: `'Title Name Description Deadline Create'
              'Title Type Salary File Create'
            `,
              xs: `'. Title Title .'
            'Name Name Type Type'
            'Salary Salary Deadline Deadline'
            'Description Description File File'
            '. Create Create .'
          `,
            },
            alignItems: "center",
            justifyItems: "center",
            gridGap: "1rem",
          }}
        >
          <Typography
            flexWrap="wrap"
            variant="h2"
            sx={{
              fontSize: "1.5rem",
              fontWeight: "500",
              gridArea: "Title",
            }}
          >
            Add New Job
          </Typography>
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"PositionName"}
            isLoading={createIsLoading}
            maxLength={64}
            additionalStyles={{ gridArea: "Name" }}
          />
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"Description"}
            isLoading={createIsLoading}
            maxLength={64}
            additionalStyles={{
              gridArea: "Description",
              marginTop: { xs: 0 },
            }}
            isTextArea
          />
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"PositionType"}
            additionalStyles={{ gridArea: "Type" }}
            isLoading={createIsLoading}
            maxLength={64}
          />
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"Salary"}
            additionalStyles={{ gridArea: "Salary" }}
            isLoading={createIsLoading}
            maxLength={64}
          />
          <SingleDate
            handleSubmit={handleSubmit}
            attributeName={"ApplicationDeadline"}
            maxLength={64}
            additionalStyles={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: { xs: "0rem" },
              gridArea: "Deadline",
            }}
            date={applicationDeadline}
            setDate={setApplicationDeadline}
          />
          <Input
            sx={{ marginTop: "1rem", gridArea: "File" }}
            {...register("JobPostFile")}
            type="file"
            name="JobPostFile"
          />
          <Button
            onClick={handleSubmit(handleCreate)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2, gridArea: "Create" }}
            disabled={createIsLoading}
          >
            Create
          </Button>
        </Box>
      )}
    </>
  );
}

function NewCompanyForm({ companies, setCompanies }) {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle } = useHandleOperation(reset, setCompanies, companies);
  const { user } = useAuthContext();

  async function handleCreate(data) {
    const result = await executeHandle(
      "create",
      create,
      {
        ...data,
      },
      "http://localhost:3000/api/companies",
      null,
      false,
      null,
      {},
      false,
      null
    );
    if (result) {
      setValue("CompanyName", "");
      setValue("Industry", "");
      setValue("HomePageURL", "");
      setValue("Description", "");
    }
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
            Add New Company
          </Typography>
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"CompanyName"}
            isLoading={createIsLoading}
            maxLength={64}
            additionalStyles={{ marginTop: { xs: "1.5rem" } }}
          />
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"Industry"}
            isLoading={createIsLoading}
            maxLength={64}
            isTextArea
            additionalStyles={{ marginTop: { xs: "1.5rem" } }}
          />
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            actionOnAttribute={null}
            attributeName={"HomePageURL"}
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
