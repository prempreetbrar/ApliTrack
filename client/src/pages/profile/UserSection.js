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

export default function UserSection({ applicantInfo }) {
  const { register, handleSubmit, setValue } = useForm();
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

  function updateEducation(data) {
    update(data, "http://localhost:3000/api/applicants/education");
  }

  function updateName(data) {
    update(data, "http://localhost:3000/api/users/");
  }

  async function updatePassword(data) {
    update(data, "http://localhost:3000/api/auth/change-password");
  }

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "white",
        height: "40rem",
      }}
    >
      <Avatar src="/broken-image.jpg" sx={{ width: 100, height: 100 }} />
      <Typography fontWeight="bold">YOU</Typography>
      <Box display="flex" alignItems="center">
        <TextField
          InputLabelProps={{ shrink: true }}
          {...register("Fname")}
          label="First Name"
          sx={{
            marginRight: "1rem",
          }}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          {...register("Lname")}
          label="Last Name"
          sx={{
            marginRight: "1rem",
          }}
        />
        <Button
          onClick={handleSubmit(updateName)}
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
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          {...register("Education")}
          label="Education"
          sx={{
            marginRight: "1rem",
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          onClick={handleSubmit(updateEducation)}
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
        flexDirection="column"
        alignItems="center"
        justifyContent="space-evenly"
        height="25rem"
      >
        <Typography fontWeight="bold">Update Password</Typography>
        <TextField
          {...register("Password")}
          label="Current Password"
          type="password"
        />
        <TextField
          {...register("NewPassword")}
          label="New Password"
          type="password"
        />
        <TextField
          {...register("ConfirmNewPassword")}
          label="Confirm New Password"
          type="password"
        />
        <Button
          onClick={handleSubmit(updatePassword)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={updateIsLoading}
        >
          Update Password
        </Button>
      </Box>
    </Paper>
  );
}
