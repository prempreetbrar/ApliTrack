import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Paper,
  TextField,
  Button,
  Chip,
  Typography,
  Link,
  Avatar,
  Tooltip,
} from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete } from "hooks/useHttpMethod";

export default function Contacts() {
  const { user } = useAuthContext();
  const [contactsInfo, setContactsInfo] = React.useState(null);
  const { executeRequest: get } = useGet();

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
  React.useEffect(() => {
    const fetchContactsInfo = async () => {
      const response = await get({}, "http://localhost:3000/api/contacts");
      setContactsInfo(response.contact);
    };

    fetchContactsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: "100vh",
        padding: "2rem",
        backgroundColor: "rgb(249, 250, 251)",
      }}
    >
      {contactsInfo &&
        contactsInfo.map((contact, index) => (
          <Contact key={index} contact={contact} />
        ))}
    </Box>
  );
}

function Contact({ key, contact }) {
  return (
    <Paper
      key={key}
      sx={{
        display: "flex",
        padding: "2rem",
        marginBottom: "2rem",
        backgroundColor: "white",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center" },
      }}
    >
      <Avatar
        src="/broken-image.jpg"
        sx={{
          width: 100,
          height: 100,
          marginRight: { xs: 0, sm: "2rem" },
          marginBottom: { xs: "2rem", sm: 0 },
          alignSelf: { xs: "center", sm: "flex-start" },
        }}
      />
      <Box
        display="flex"
        sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography fontWeight="bold">
          {contact.Fname} {contact.Lname}
        </Typography>
        <Link href={contact.LinkedInURL}>{contact.LinkedInURL}</Link>

        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Contact Info
        </Typography>
        <Box display="flex">
          <InfoSection
            entityIDName="ContactID"
            entityID={contact.ContactID}
            sectionTitle="Phone Number(s)"
            sectionArray={contact.Phones}
            attributeName="Phone"
            isMarginRight
            sectionURL="http://localhost:3000/api/contacts/phones"
            maxCreateLength={16}
          />
          <InfoSection
            entityIDName="ContactID"
            entityID={contact.ContactID}
            sectionTitle="Email(s)"
            sectionArray={contact.Emails}
            attributeName="Email"
            sectionURL="http://localhost:3000/api/contacts/emails"
            maxCreateLength={64}
          />
        </Box>
        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Employed At
        </Typography>
        {/* <Box padding="0.5rem">
          <Typography>(587) 917 - 4521, Role - Cashier</Typography>
          <Typography>(587) 917 - 4521, Role - Supervisor</Typography>
          <Typography>(587) 917 - 4521, Role - Manager</Typography>
        </Box> */}
      </Box>
    </Paper>
  );
}

function InfoSection({
  maxCreateLength,
  entityIDName,
  entityID,
  sectionTitle,
  sectionArray,
  attributeName,
  isMarginRight,
  sectionURL,
}) {
  const [onUpdateSectionArray, setOnUpdateSectionArray] = React.useState([]);
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset } = useForm();

  React.useEffect(() => {
    if (sectionArray) {
      setOnUpdateSectionArray([...sectionArray]);
    }
  }, [sectionArray]);

  async function handleCreate() {
    const data = await create(
      { [attributeName]: getValues(attributeName), [entityIDName]: entityID },
      sectionURL
    );
    if (data) {
      const tableName = Object.keys(data)[0];
      setOnUpdateSectionArray([...onUpdateSectionArray, data[tableName]]);
      reset();
    }
  }

  async function handleDelete(index) {
    const data = await deleteInstance(
      {
        [attributeName]: onUpdateSectionArray[index][attributeName],
        [entityIDName]: entityID,
      },
      sectionURL
    );

    if (data) {
      setOnUpdateSectionArray([
        ...onUpdateSectionArray.slice(0, index),
        ...onUpdateSectionArray.slice(index + 1),
      ]);
    }
  }

  return (
    <Box padding="0.5rem" marginRight={`${isMarginRight ? "2rem" : "0"}`}>
      <Typography sx={{ textDecoration: "underline" }}>
        {sectionTitle}
      </Typography>
      <Box>
        {onUpdateSectionArray.map((entity, index) => (
          <Tooltip
            key={index}
            title={entity[attributeName]}
            arrow
            placement="top"
          >
            <Chip
              label={<EllipsisText>{entity[attributeName]}</EllipsisText>}
              onDelete={() => handleDelete(index)}
              sx={{ marginBottom: "0.5rem", marginRight: "0.25rem" }}
            />
          </Tooltip>
        ))}
      </Box>
      {/* Allow the user to enter new data. */}
      <Box component="form" display="flex" marginTop="2rem" alignItems="center">
        <TextField
          {...register(attributeName, { maxLength: maxCreateLength })}
          placeholder={`Enter New ${attributeName}`}
          fullWidth
          required
          inputProps={{ maxLength: maxCreateLength }}
        />
        <Button
          onClick={handleCreate}
          sx={{ ml: 1, fontSize: "1.5rem" }}
          disabled={createIsLoading}
        >
          +
        </Button>
      </Box>
    </Box>
  );
}

// {/* Allow the user to enter new data. */}
// <Box
//   component="form"
//   display="flex"
//   marginTop="2rem"
//   alignItems="center"
// >
//   <TextField
//     {...register(attributeName)}
//     placeholder={`Enter Name of New ${attributeName} (Max 32 Characters)`}
//     fullWidth
//   />
//   <Button
//     onClick={handleCreate}
//     sx={{ ml: 1, fontSize: "1.5rem" }}
//     disabled={createIsLoading}
//   >
//     +
//   </Button>
// </Box>

const CHIP_MAX_WIDTH = 150;
const CHIP_ICON_WIDTH = 30;

const EllipsisText = (props) => {
  const { children } = props;

  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: CHIP_MAX_WIDTH - CHIP_ICON_WIDTH,
      }}
    >
      {children}
    </div>
  );
};
