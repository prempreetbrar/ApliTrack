import React from "react";
import { useForm } from "react-hook-form";

import { Box, Button, Typography } from "@mui/material";

import { useGet, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import SingleForm from "components/SingleForm";

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

  return (
    <MainPaper
      overrideStyles={{ flexDirection: "column", alignItems: "flex-start" }}
    >
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        {company.CompanyName}
      </Typography>

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
          />
          <Button sx={{ marginTop: "1rem" }} type="submit" variant="outlined">
            Update
          </Button>
        </Box>
      </form>
    </MainPaper>
  );
}

function Job() {}
