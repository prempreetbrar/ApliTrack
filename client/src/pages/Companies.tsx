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
    </MainBox>
  );
}

function Company({ company }) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Industry", company.Industry);
    setValue("HomePageURL", company.HomePageURL);
    setValue("Description", company.Description);
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

  console.log(company);

  return (
    <MainPaper
      overrideStyles={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
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
                marginTop: "1rem",
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
          {company?.Jobs?.map((job, index) => (
            <Job key={index} company={company} job={job} />
          ))}
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

  function updateJob(data) {
    const JobPostFile = data.JobPostFile[0];
    const newData = { ...data };
    delete newData.JobPostFile;
    if (JobPostFile !== "/") {
      newData.JobPostFile = JobPostFile;
    }

    update(
      {
        PositionID: job.PositionID,
        ...newData,
      },
      "http://localhost:3000/api/companies/company/jobs",
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
    setValue("ApplicationDeadline", job.ApplicationDeadline);
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
    <form onSubmit={handleSubmit(updateJob)}>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
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
        <Typography sx={{ alignSelf: "flex-start", fontWeight: "bold" }}>
          Qualifications:
        </Typography>
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
        <Typography sx={{ alignSelf: "flex-start", fontWeight: "bold" }}>
          Responsibilities:
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
            <Typography noWrap sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}>
              Existing File: {job.JobPostFile.split("/").pop()}
            </Typography>
          </Tooltip>
        )}

        <Button
          sx={{ marginTop: "1rem", alignSelf: "center" }}
          type="submit"
          variant="outlined"
        >
          Update
        </Button>
      </Box>
    </form>
  );
}
