//@ts-nocheck

import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
} from "@mui/material";

import { useUpdate } from "../../hooks/useHttpMethod";
import NameUpdater from "components/NameForm";
import MainPaper from "components/MainPaper";

export default function UserSection({ applicantInfo }) {
  const { register, handleSubmit, setValue, reset } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Education", applicantInfo?.Education);
    setValue("Fname", applicantInfo?.User?.Fname);
    setValue("Lname", applicantInfo?.User?.Lname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicantInfo?.Education,
    applicantInfo?.User?.Fname,
    applicantInfo?.User?.Lname,
  ]);

  function updateUser(data) {
    delete data["Password"];
    delete data["NewPassword"];
    delete data["ConfirmNewPassword"];
    if ((data.Fname || data.Lname) && data.Education) {
      update(data, "http://localhost:3000/api/users", {});
      update(data, "http://localhost:3000/api/applicants/education", {}, false);
    } else if (data.Education) {
      update(data, "http://localhost:3000/api/applicants/education", {});
    } else if (data.Fname || data.Lname) {
      update(data, "http://localhost:3000/api/users", {});
    }
  }

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        justifyContent: "center",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        marginRight={{ xs: "0rem", sm: "2rem" }}
        marginBottom={{ xs: "2rem", sm: "0rem" }}
      >
        <Avatar src="/broken-image.jpg" sx={{ width: 100, height: 100 }} />
        <Typography sx={{ marginTop: "1rem" }} fontWeight="bold">
          YOU
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexDirection={{ xs: "column", md: "row" }}
        >
          <NameUpdater
            register={register}
            handleSubmit={handleSubmit}
            updateIsLoading={updateIsLoading}
            additionalLnameStyles={{ marginRight: { xs: "0", sm: "1rem" } }}
          />

          <TextField
            {...register("Education")}
            label="Education"
            sx={{
              marginRight: { xs: "0rem", md: "1rem" },
              marginTop: { xs: "1rem", md: "0rem" },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            onClick={handleSubmit(updateUser)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            disabled={updateIsLoading}
          >
            Update
          </Button>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
        >
          <TextField
            {...register("Password")}
            label="Current Password"
            type="password"
            sx={{
              marginRight: { xs: "0rem", md: "1rem" },
            }}
          />
          <TextField
            {...register("NewPassword")}
            label="New Password"
            type="password"
            sx={{
              marginRight: { xs: "0rem", md: "1rem" },
              marginTop: { xs: "1rem", md: "0rem" },
            }}
          />
          <TextField
            {...register("ConfirmNewPassword")}
            label="Confirm New Password"
            type="password"
            sx={{
              marginRight: { xs: "0rem", md: "1rem" },
              marginTop: { xs: "1rem", md: "0rem" },
            }}
          />
          <Button
            onClick={handleSubmit(updateUser)}
            type="submit"
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
            disabled={updateIsLoading}
          >
            Update
          </Button>
        </Box>
      </Box>
    </MainPaper>
  );
}
