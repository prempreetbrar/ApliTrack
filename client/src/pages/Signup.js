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
import React from "react";
import { useForm } from "react-hook-form";
import { useSignup } from "../hooks/useSignup";
import { useSnackbar } from "notistack";

/**
 * Signup component responsible for taking in username/password inputs and signing a user up.
 */
export default function Signup() {
  /*
    register allows us to track the user input implicitly (without defining state). HandleSubmit
    validates any specified requirements (ie. minLength, in this case we have none) 
    before submitting the form.
  */
  const { enqueueSnackbar } = useSnackbar();
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

  const { signup, error, isLoading } = useSignup();

  const onSubmit = async (data) => {
    const success = await signup(data);
    if (success) {
      enqueueSnackbar("Login succeeded!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    }
  };

  React.useEffect(() => {
    // Moved the enqueueSnackbar calls here to avoid updating state during rendering
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(async (err) => {
        enqueueSnackbar(err.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
    } else if (error) {
      console.log(error);
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name={passwordConfirm.name}
                label="Confirm Password"
                type="password"
                inputRef={passwordConfirm.ref}
                onChange={passwordConfirm.onChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
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

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        ApliTrack
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
