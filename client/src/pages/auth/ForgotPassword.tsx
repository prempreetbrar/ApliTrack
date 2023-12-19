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
import { useCreate } from "hooks/useHttpMethod";

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
  const username = register("Username", {
    required: "You must enter an email for your username.",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Entered value does not match email format",
    },
  });

  const { executeRequest: create, isLoading, error } = useCreate();
  function onSubmit(data) {
    create(
      { Username: data.Username },
      "http://localhost:3000/api/auth/forgot-password",
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
          Forgot Password
        </Typography>
        <Typography component="p" marginTop="1rem">
          Enter your email/username and we'll send you a link to reset your
          password.
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
                name={username.name}
                fullWidth
                label="Username"
                inputRef={username.ref}
                onChange={username.onChange}
                autoComplete="email"
                inputProps={{ maxLength: 32 }}
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
