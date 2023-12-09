import { Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";

export default function SingleDate({
  register,
  handleSubmit,
  actionOnAttribute,
  attributeName,
  isLoading,
  maxLength,
  additionalStyles,
  additionalFieldStyles,
  mostRecentLastContactDate,
  setMostRecentLastContactDate,
}) {
  return (
    <Box sx={{ ...additionalStyles }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          {...register(attributeName)}
          label={attributeName}
          sx={{
            marginRight: { xs: "0", md: "1rem" },
            ...additionalFieldStyles,
          }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            maxLength,
          }}
          slotProps={{
            textField: {
              error: false,
            },
          }}
          onChange={(newValue) => setMostRecentLastContactDate(newValue)}
          value={dayjs(mostRecentLastContactDate)}
        />
      </LocalizationProvider>

      {actionOnAttribute && (
        <Button
          onClick={handleSubmit(actionOnAttribute)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          Update
        </Button>
      )}
    </Box>
  );
}
