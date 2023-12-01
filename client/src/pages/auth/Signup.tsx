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

import { useSignup } from "../../hooks/useAuthAction";
import useAuthSucceeded from "hooks/useAuthSucceeded";
import { authErrorHandler } from "./authUtils";

/**
 * Signup component responsible for taking in username/password inputs and signing a user up.
 */
export default function Signup() {
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
  const password = register("Password", { required: "Password is required." });
  const passwordConfirm = register("PasswordConfirm", {
    required: "You must confirm your password.",
  });
  const firstName = register("Fname");
  const lastName = register("Lname");

  const { authAction: signup, error, isLoading } = useSignup();
  const onSubmit = useAuthSucceeded(signup, "Signup");

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
        <Typography component="h1" variant="h2">
          ApliTrack
        </Typography>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                name={firstName.name}
                label="First Name"
                inputRef={firstName.ref}
                onChange={firstName.onChange}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                autoComplete="family-name"
                name={lastName.name}
                label="Last Name"
                inputRef={lastName.ref}
                onChange={lastName.onChange}
                inputProps={{ maxLength: 16 }}
              />
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                name={password.name}
                fullWidth
                required
                label="Password"
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
                label="Confirm Password"
                type="password"
                inputRef={passwordConfirm.ref}
                onChange={passwordConfirm.onChange}
                inputProps={{ maxLength: 64 }}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            disabled={isLoading}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="http://localhost:3001/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
