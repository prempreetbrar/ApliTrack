import { enqueueSnackbar } from "notistack";

export function authErrorHandler(error, errors) {
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
    console.error(error);
    enqueueSnackbar(error.message, {
      variant: "error",
      autoHideDuration: 3000,
    });
  }
}
