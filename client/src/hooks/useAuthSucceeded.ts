/*
    When the user submits the form, try to log them in. If it succeeds, let them know!
  */
import { useSnackbar } from "notistack";

const useAuthSucceeded = (action, name) => {
  const { enqueueSnackbar } = useSnackbar();
  return async (data) => {
    const success = await action(data);

    if (success) {
      enqueueSnackbar(`${name} succeeded!`, {
        variant: "success",
        autoHideDuration: 3000,
      });
    }
  };
};

export default useAuthSucceeded;
