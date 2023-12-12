import { Box, TextField, Button, Autocomplete } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import { useGet } from "hooks/useHttpMethod";
import React from "react";

export default function NewEntryDropdown({
  entityName,
  entityAttributeName,
  maxCreateLength,
  handleCreate,
  createIsLoading,
  register,
  fetchAllOptionsURL,
  additionalStyles,
  doNotShowButton,
  dropdownValue,
  setDropdownValue,
}) {
  const { user } = useAuthContext();
  const { executeRequest, isLoading, error } = useGet();
  const [allOptions, setAllOptions] = React.useState([]);

  React.useEffect(() => {
    const fetchAllOptions = async () => {
      const response = await executeRequest(null, fetchAllOptionsURL);
      setAllOptions(
        response[entityName.toLowerCase()].map(
          (entity, index) => entity[entityAttributeName]
        )
      );
    };
    fetchAllOptions();
  }, []);

  return (
    <>
      {user && (
        <Box
          component="form"
          display="flex"
          marginTop="2rem"
          alignItems="center"
          sx={{ ...additionalStyles }}
        >
          <Autocomplete
            {...register(entityName, { maxLength: maxCreateLength })}
            placeholder={`Enter New ${entityName}`}
            fullWidth
            options={allOptions}
            renderInput={(params) => <TextField {...params} label={entityName} />}
            value={dropdownValue}
            onChange={(event, value) => setDropdownValue(value)}
          />
          {!doNotShowButton && (
            <Button
              onClick={handleCreate}
              sx={{ ml: 1, fontSize: "1.5rem" }}
              disabled={createIsLoading}
            >
              +
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
