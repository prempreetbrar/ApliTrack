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

import { useCreate, useDelete, useGet, useUpdate } from "hooks/useHttpMethod";

import NewEntry from "components/NewEntry";
import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import SingleForm from "components/SingleForm";
import ChipDisplayer from "components/ChipDisplayer";
import useHandleOperation from "hooks/useHandleOperation";
import SingleDate from "components/SingleDate";
import useAuthContext from "hooks/useAuthContext";

export default function Companies() {
  const [companies, setCompanies] = React.useState([]);
  const [onlyShowJobsITrack, setOnlyShowJobsITrack] = React.useState(false);
  const [mostRecentEarliestDateToApply, setMostRecentEarliestDateToApply] =
    React.useState(null);
  const [mostRecentLatestDateToApply, setMostRecentLatestDateToApply] =
    React.useState(null);
  const [mostRecentApplicationDeadline, setMostRecentApplicationDeadline] =
    React.useState(null);

  const { user } = useAuthContext();
  const { executeRequest: get } = useGet();
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    undefined,
    setCompanies,
    companies
  );

  React.useEffect(() => {
    const fetchCompanies = async () => {
      const response = await get({}, "http://localhost:3000/api/companies");

      setCompanies(response.company);
    };

    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      data,
      "http://localhost:3000/api/companies",
      null,
      false,
      null,
      {}
    );
  }

  return (
    <MainBox>
      <Box
        display="flex"
        alignItems="center"
        marginBottom="1rem"
        justifyContent="space-between"
      >
        <form onSubmit={handleSubmit(handleGet)}>
          {user && (
            <FormControlLabel
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
            >
              <FormControlLabel
                value="ASC"
                control={<Radio />}
                label="Sort Ascending"
                labelPlacement="start"
              />
              <FormControlLabel
                value="DESC"
                control={<Radio />}
                label="Sort Descending"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>

          <Typography
            variant="h3"
            sx={{ fontSize: "1rem", marginRight: "1rem" }}
          >
            Search by:
          </Typography>
          <SingleForm
            register={register}
            handleSubmit={handleSubmit}
            additionalStyles={{
              marginTop: { xs: "1rem", sm: "0rem" },
            }}
            attributeName={"CompanyName"}
            allowUnauthenticated
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
              marginTop: { xs: "1rem", sm: "0rem" },
            }}
            additionalFieldStyles={{
              marginRight: { xs: "1rem" },
            }}
            date={mostRecentApplicationDeadline}
            setDate={setMostRecentApplicationDeadline}
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
                marginTop: { xs: "1rem", sm: "0rem" },
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
                marginTop: { xs: "1rem", sm: "0rem" },
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
        </form>
      </Box>

      {companies &&
        companies.map((company, index) => (
          <Company
            key={index}
            company={company}
            onlyShowJobsITrack={onlyShowJobsITrack}
          />
        ))}
      <NewCompanyForm companies={companies} setCompanies={setCompanies} />
    </MainBox>
  );
}

function Company({
  company,
  onlyShowJobsITrack,
  mostRecentEarliestDateToApply,
  mostRecentLatestDateToApply,
}) {
  const { user } = useAuthContext();
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: get } = useGet();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const [jobs, setJobs] = React.useState(company?.jobs || []);
  const [trackedJobs, setTrackedJobs] = React.useState({});

  React.useEffect(() => {
    const fetchTrackedJobs = async () => {
      if (user && company) {
        const trackedResponse = await get(
          {
            // EarliestLastContactDate: mostRecentEarliestLastContactDate,
            // LatestLastContactDate: mostRecentLatestLastContactDate,
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
  }, [
    user,
    company,
    mostRecentEarliestDateToApply,
    mostRecentLatestDateToApply,
  ]);

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

  return (
    <MainPaper
      overrideStyles={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography
          variant="h2"
          sx={{ fontSize: "3rem", fontWeight: "bold", display: "inline-block" }}
        >
          {company.CompanyName}
        </Typography>
        <BusinessIcon
          sx={{ marginLeft: "1rem", width: "4rem", height: "4rem" }}
        />

        <form
          onSubmit={handleSubmit(updateCompany)}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "5rem",
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
            }}
            additionalFieldStyles={{
              marginRight: { xs: "1rem" },
            }}
            isTextArea
          />
          <Button
            sx={{ marginTop: "1rem", height: "min-content" }}
            type="submit"
            variant="outlined"
          >
            Update
          </Button>
        </form>
      </Box>

      <Box marginLeft="2.5rem">
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
                // handleOpenDeleteConfirmationDialog={
                //   handleOpenDeleteConfirmationDialog
                // }
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
      setCurrentlyUploadedJobPostFile(JobPostFile.name);
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
      undefined
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
      undefined
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
      {}
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
      {}
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
        {}
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
        {}
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
      <form
        onSubmit={handleSubmit(updateJob)}
        style={{
          display: "grid",
          gridTemplateAreas: `
            'PositionName ApplicationDeadline Qualification Responsibility' 
            'PositionType Salary Qualification Responsibility'
            '. .  Qualification Responsibility'
            'Description Description Track Track'
            'Description Description Track Track'
            'JobPostFile JobPostFile Track Track'
            'JobPostFile JobPostFile Track Track'
            'JobPostFile JobPostFile Track Track'
            '. Update Update .'
          `,
          marginTop: "2rem",
          alignItems: "start",
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
          {job.JobPostFile && (
            <iframe
              src={`http://localhost:3000/uploads/jobPosts/${currentlyUploadedJobPostFile}`}
              title={currentlyUploadedJobPostFile}
              width="fit-content"
              style={{
                height: "20rem",
              }}
            ></iframe>
          )}
          <Input
            sx={{ marginTop: "1rem" }}
            {...register("JobPostFile")}
            type="file"
            name="JobPostFile"
          />
          {currentlyUploadedJobPostFile && (
            <Tooltip title={currentlyUploadedJobPostFile} placement="top" arrow>
              <Typography
                noWrap
                sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
              >
                Existing File: {currentlyUploadedJobPostFile}
              </Typography>
            </Tooltip>
          )}
        </Box>

        <Box
          sx={{
            gridArea: "Qualification",
            marginLeft: "2rem",
            marginTop: "-1.5rem",
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

        <Box sx={{ gridArea: "Responsibility", marginTop: "-1.6rem" }}>
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
            }}
          >
            <FormControlLabel
              control={
                <Checkbox checked={stillTracks} onChange={handleTracks} />
              }
              label="Track this job"
            />
            {stillTracks && (
              <SingleDate
                handleSubmit={handleSubmit}
                attributeName={"DateToApply"}
                maxLength={64}
                isLoading={updateIsLoading}
                date={date || null}
                setDate={setDate}
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
                }}
                isLoading={updateIsLoading}
                isTextArea
              />
            )}
          </Box>
        )}

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
      </form>
      <hr style={{ marginTop: "5rem", marginBottom: "5rem" }} />
    </>
  );
}

function NewJobForm({ companyName, jobs, setJobs }) {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle } = useHandleOperation(reset, setJobs, jobs);
  const [applicationDeadline, setApplicationDeadline] = React.useState(null);

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
      }
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
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
        Add New Job
      </Typography>
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"PositionName"}
        isLoading={createIsLoading}
        maxLength={64}
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"Description"}
        isLoading={createIsLoading}
        maxLength={64}
        isTextArea
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"PositionType"}
        isLoading={createIsLoading}
        maxLength={64}
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"Salary"}
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
          marginTop: { xs: "1rem" },
        }}
        date={applicationDeadline}
        setDate={setApplicationDeadline}
      />
      <Input
        sx={{ marginTop: "1rem" }}
        {...register("JobPostFile")}
        type="file"
        name="JobPostFile"
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
    </>
  );
}

function NewCompanyForm({ companies, setCompanies }) {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle } = useHandleOperation(reset, setCompanies, companies);

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
      {}
    );
  }

  return (
    <MainPaper>
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
        Add New Company
      </Typography>
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"CompanyName"}
        isLoading={createIsLoading}
        maxLength={64}
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"Industry"}
        isLoading={createIsLoading}
        maxLength={64}
        isTextArea
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"HomePageURL"}
        isLoading={createIsLoading}
        maxLength={64}
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
        actionOnAttribute={null}
        attributeName={"Description"}
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
    </MainPaper>
  );
}
