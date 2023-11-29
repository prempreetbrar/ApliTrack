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
import { useLogin } from "../hooks/useLogin";
import { useSnackbar } from "notistack";

/**
 * Login component
 */
export default function Login() {
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

  const { login, error, isLoading } = useLogin();

  /*
    When the user submits the form, try to log them in. If it succeeds, let them know!
  */
  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      enqueueSnackbar("Login succeeded!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    }
  };

  React.useEffect(() => {
    /*
      Check if we have errors coming from the form. If we do, show those
      (because that means the form wasn't even able to be submitted). Otherwise,
      that means the form was able to be submitted, so instead show the error
      returned by the database backend.
    */
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
          Log in
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
          </Grid>
          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="http://localhost:3001/signup" variant="body2">
                Don't have an account? Sign up
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
