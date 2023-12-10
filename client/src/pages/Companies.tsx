import React from "react";
import { useForm } from "react-hook-form";

import { Box, Button, Input, Tooltip, Typography } from "@mui/material";

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
      <Typography variant="h2" sx={{ fontSize: "3rem", fontWeight: "bold" }}>
        {company.CompanyName}
      </Typography>

      <Box display="flex" flexDirection="row">
        <form onSubmit={handleSubmit(updateCompany)}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <SingleForm
              register={register}
              attributeName={"Industry"}
              maxLength={64}
              isLoading={updateIsLoading}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "2.5rem",
              }}
              additionalFieldStyles={{
                marginRight: { xs: "0rem" },
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
                marginTop: "1rem",
              }}
              additionalFieldStyles={{
                marginRight: { xs: "0rem" },
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
                marginTop: "1rem",
              }}
              additionalFieldStyles={{
                marginRight: { xs: "0rem" },
              }}
              isTextArea
            />
            <Button sx={{ marginTop: "1rem" }} type="submit" variant="outlined">
              Update
            </Button>
          </Box>
        </form>
        <Box marginLeft="2.5rem">
          <Typography sx={{ fontWeight: "bold" }}>Jobs</Typography>
          {jobs?.map((job, index) => (
            <Job key={index} company={company} job={job} />
          ))}
          <NewJobForm
            companyName={company.CompanyName}
            jobs={jobs}
            setJobs={setJobs}
          />
        </Box>
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
      <form onSubmit={handleSubmit(updateJob)}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="5rem"
        >
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <Box>
              <SingleForm
                register={register}
                attributeName={"PositionName"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem" },
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
                  marginTop: "1rem",
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem" },
                }}
                isTextArea
              />
              <SingleForm
                register={register}
                attributeName={"PositionType"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem" },
                }}
              />
              <SingleForm
                register={register}
                attributeName={"Salary"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem" },
                }}
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
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              paddingLeft="2.5rem"
              paddingRight="2.5rem"
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
              />
              <Typography sx={{ alignSelf: "flex-start", marginTop: "2.5rem" }}>
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
              />
            </Box>
            <Box display="flex" flexDirection="column">
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
          </Box>

          <Button
            sx={{ marginTop: "1rem", alignSelf: "center" }}
            type="submit"
            variant="outlined"
          >
            Update
          </Button>
        </Box>
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
    console.log(data);
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
