import { Box, TextField, Button, Autocomplete } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import { useGet } from "hooks/useHttpMethod";
import React from "react";

export default function NewEntryDropdown({
  entityName,
  entityAttributeName,
  entityAttributeName2,
  entityAttributeName3,
  maxCreateLength,
  handleCreate,
  createIsLoading,
  register,
  fetchAllOptionsURL,
  additionalStyles,
  doNotShowButton,
  dropdownValue,
  setDropdownValue,
  isDropdownObject,
}) {
  const { user } = useAuthContext();
  const { executeRequest, isLoading, error } = useGet();
  const [allOptions, setAllOptions] = React.useState([]);
  const [allOptionsHashtable, setAllOptionsHashtable] = React.useState({});

  React.useEffect(() => {
    const fetchAllOptions = async () => {
      console.log(fetchAllOptionsURL);
      const response = await executeRequest(null, fetchAllOptionsURL);
      console.log(response);
      const newAllOptionsHashtable = {};
      console.log(response[entityName.toLowerCase()]);
      setAllOptions(
        response[entityName.toLowerCase()].map((entity, index) => {
          const string =
            entity[entityAttributeName] +
            (entity[entityAttributeName2]
              ? " - " + entity[entityAttributeName2]
              : "") +
            (entity[entityAttributeName3]
              ? " - " + entity[entityAttributeName3]
              : "");

          if (isDropdownObject) {
            newAllOptionsHashtable[string] = entity;
          }

          return string;
        })
      );
      console.log(newAllOptionsHashtable);
      console.log(isDropdownObject);
      setAllOptionsHashtable(newAllOptionsHashtable);
    };
    fetchAllOptions();
  }, []);
  console.log(allOptions, allOptionsHashtable);
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
            renderInput={(params) => (
              <TextField {...params} label={entityName} />
            )}
            value={
              !dropdownValue
                ? ""
                : isDropdownObject && dropdownValue
                ? dropdownValue[entityAttributeName] +
                  (dropdownValue[entityAttributeName2]
                    ? " - " + dropdownValue[entityAttributeName2]
                    : "") +
                  (dropdownValue[entityAttributeName3]
                    ? " - " + `[${dropdownValue[entityAttributeName3]}]`
                    : "")
                : dropdownValue
            }
            onChange={(event, value) => {
              if (isDropdownObject) {
                console.log(
                  allOptionsHashtable,
                  value,
                  allOptionsHashtable[value as any]
                );
                setDropdownValue(allOptionsHashtable[value as any]);
              } else {
                setDropdownValue(value);
              }
            }}
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
