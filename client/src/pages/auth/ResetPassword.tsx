import React from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  TextField,
  Avatar,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Copyright from "components/Copyright";

import { useLogin } from "../../hooks/useAuthAction";
import useAuthSucceeded from "hooks/useAuthSucceeded";
import { authErrorHandler } from "./authUtils";
import { useUpdate } from "hooks/useHttpMethod";
import { useParams, useSearchParams } from "react-router-dom";

/**
 * Login component
 */
export default function Login() {
  /*
    register allows us to track the user input implicitly (without defining state). HandleSubmit
    validates any specified requirements (ie. minLength, in this case we have none) 
    before submitting the form.
  */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { Token } = useParams();
  const passwordConfirm = register("PasswordConfirm", {
    required: "Password is required.",
  });
  const password = register("Password", { required: "Password is required." });

  const { authAction: login, error, isLoading } = useLogin();
  const { executeRequest: update } = useUpdate();
  function onSubmit(data) {
    update(
      data,
      `http://localhost:3000/api/auth/reset-password/${Token}`,
      {},
      true
    );
  }

  React.useEffect(() => {
    authErrorHandler(error, errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, errors, isLoading]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Typography component="p" marginTop="1rem">
          Enter and confirm your new password.
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name={password.name}
                fullWidth
                required
                label="New Password"
                type="password"
                autoComplete="new-password"
                inputRef={password.ref}
                onChange={password.onChange}
                inputProps={{ maxLength: 64 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name={passwordConfirm.name}
                fullWidth
                required
                type="password"
                label="Confirm New Password"
                inputRef={passwordConfirm.ref}
                onChange={passwordConfirm.onChange}
                autoComplete="password"
                inputProps={{ maxLength: 64 }}
              />
            </Grid>
          </Grid>

          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
