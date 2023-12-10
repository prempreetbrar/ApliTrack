import React from "react";
import { useForm } from "react-hook-form";

import { Box, Button, Input, Tooltip, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";

import { useCreate, useDelete, useGet, useUpdate } from "hooks/useHttpMethod";

import NewEntry from "components/NewEntry";
import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import SingleForm from "components/SingleForm";
import ChipDisplayer from "components/ChipDisplayer";
import useHandleOperation from "hooks/useHandleOperation";
import SingleDate from "components/SingleDate";

export default function Companies() {
  const { executeRequest: get } = useGet();

  const [companies, setCompanies] = React.useState([]);

  React.useEffect(() => {
    const fetchCompanies = async () => {
      const response = await get({}, "http://localhost:3000/api/companies");

      setCompanies(response.company);
    };

    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainBox>
      {companies &&
        companies.map((company, index) => (
          <Company key={index} company={company} />
        ))}
      <NewCompanyForm companies={companies} setCompanies={setCompanies} />
    </MainBox>
  );
}

function Company({ company }) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const [jobs, setJobs] = React.useState(company?.jobs);

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
        {jobs?.map((job, index) => (
          <Job key={index} company={company} job={job} />
        ))}
        <NewJobForm
          companyName={company.CompanyName}
          jobs={jobs}
          setJobs={setJobs}
        />
      </Box>
    </MainPaper>
  );
}

function Job({ company, job, index }) {
  const [responsibilitiesArray, setResponsibilitiesArray] = React.useState([]);
  const [qualificationsArray, setQualificationsArray] = React.useState([]);

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
  const { executeRequest: deleteInstance } = useDelete();
  const [applicationDeadline, setApplicationDeadline] = React.useState(
    job.ApplicationDeadline
  );
  const [currentlyUploadedJobPostFile, setCurrentlyUploadedJobPostFile] =
    React.useState(job?.JobPostFile?.split("/")?.pop());

  async function updateJob(data) {
    const JobPostFile = data.JobPostFile[0];
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
    if (success && JobPostFile !== "/") {
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
      null
    );
    if (success) {
      setValue("Responsibility", "");
    }
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
            'Description Description Qualification Responsibility'
            'Description Description Qualification Responsibility'
            'JobPostFile JobPostFile TrackThisJob CheckMark'
            'JobPostFile JobPostFile DateToApply DateToApply'
            'JobPostFile JobPostFile Notes Notes'
            'JobPostFile JobPostFile Notes Notes'
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
          {job.JobPostFile && (
            <Tooltip
              title={job.JobPostFile.split("/").pop()}
              placement="top"
              arrow
            >
              <Typography
                noWrap
                sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
              >
                Existing File: {job.JobPostFile.split("/").pop()}
              </Typography>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ gridArea: "Qualification", marginLeft: "2rem" }}>
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

        <Box sx={{ gridArea: "Responsibility" }}>
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
      null
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
