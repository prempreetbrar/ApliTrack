import React from "react";
import { useForm } from "react-hook-form";

import { Box, Typography, Link, Avatar } from "@mui/material";
import MainBox from "components/MainBox";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete } from "hooks/useHttpMethod";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";

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
    <MainBox>
      {contactsInfo &&
        contactsInfo.map((contact, index) => (
          <Contact key={index} contact={contact} />
        ))}
    </MainBox>
  );
}

function Contact({ key, contact }) {
  return (
    <MainPaper key={key}>
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
    </MainPaper>
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
  const { executeHandle } = useHandleOperation(
    reset,
    null,
    setOnUpdateSectionArray,
    onUpdateSectionArray
  );

  React.useEffect(() => {
    if (sectionArray) {
      setOnUpdateSectionArray([...sectionArray]);
    }
  }, [sectionArray]);

  async function handleCreate() {
    executeHandle(
      "create",
      create,
      { [attributeName]: getValues(attributeName), [entityIDName]: entityID },
      sectionURL
    );
  }

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        [attributeName]: onUpdateSectionArray[index][attributeName],
        [entityIDName]: entityID,
      },
      sectionURL
    );
  }

  return (
    <Box padding="0.5rem" marginRight={`${isMarginRight ? "2rem" : "0"}`}>
      <Typography sx={{ textDecoration: "underline" }}>
        {sectionTitle}
      </Typography>
      <Box>
        <ChipDisplayer
          onUpdateSectionArray={onUpdateSectionArray}
          attributeName={attributeName}
          handleDelete={handleDelete}
        />
      </Box>
      <NewEntry
        attributeName={attributeName}
        maxCreateLength={maxCreateLength}
        handleCreate={handleCreate}
        createIsLoading={createIsLoading}
        register={register}
      />
    </Box>
  );
}
