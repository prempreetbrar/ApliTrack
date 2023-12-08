import React from "react";
import { useForm } from "react-hook-form";

import { Box, Typography, Link, Avatar, Button } from "@mui/material";
import MainBox from "components/MainBox";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NameUpdater from "components/NameForm";
import SingleUpdater from "components/SingleForm";
import SimpleSection from "./profile/SimpleSection";
import NameForm from "components/NameForm";
import SingleForm from "components/SingleForm";
import Person from "components/Person";
import { register } from "module";

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
      {user && (
        <AddNewContact
          setContactsInfo={setContactsInfo}
          contactsInfo={contactsInfo}
        />
      )}
    </MainBox>
  );
}

function Contact({ key, contact }) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();

  console.log(contact);

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Fname", contact?.Fname);
    setValue("Lname", contact?.Lname);
    setValue("LinkedInURL", contact?.LinkedInURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  function updateNameOrLinkedInURL(data) {
    update(
      { ...data, ContactID: contact.ContactID },
      "http://localhost:3000/api/contacts/"
    );
  }

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
      }}
      key={key}
    >
      <Person
        additionalStyles={{
          alignSelf: { xs: "center", md: "flex-start" },
          marginRight: { xs: "0", md: "2.5rem" },
          marginBottom: { xs: "1.5rem", md: "0" },
        }}
      />
      <Box
        display="flex"
        sx={{ alignItems: { xs: "center", md: "flex-start" } }}
        flexDirection="column"
      >
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateNameOrLinkedInURL}
          isLoading={updateIsLoading}
          additionalLnameStyles={{ marginRight: { xs: "1rem" } }}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateNameOrLinkedInURL}
          attributeName={"LinkedInURL"}
          isLoading={updateIsLoading}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
        />

        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Contact Info
        </Typography>
        <Box display="flex" sx={{ flexDirection: { xs: "column", sm: "row" } }}>
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
    <Box
      padding="0.5rem"
      marginRight={`${isMarginRight ? "2rem" : "0"}`}
      sx={{ minWidth: { xs: "100%", sm: "50%" }, marginRight: { xs: "0" } }}
    >
      <Typography sx={{ textDecoration: "underline" }}>
        {sectionTitle}
      </Typography>
      <ChipDisplayer
        onUpdateSectionArray={onUpdateSectionArray}
        attributeName={attributeName}
        handleDelete={handleDelete}
      />

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

function AddNewContact({ setContactsInfo, contactsInfo }) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    reset,
    null,
    setContactsInfo,
    contactsInfo
  );

  async function handleCreate(data) {
    const result = await executeHandle(
      "create",
      create,
      data,
      "http://localhost:3000/api/contacts"
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it 
      isn't working.
    */
    if (result) {
      setValue("Fname", "");
      setValue("Lname", "");
      setValue("LinkedInURL", "");
    }
  }

  return (
    <MainPaper overrideStyles={{ flexDirection: "column" }}>
      <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
        Add New Contact
      </Typography>
      <Box
        display="flex"
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
        }}
      >
        <Person
          additionalStyles={{ margin: { xs: "1.5rem 0", md: "0 1.5rem" } }}
        />
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          isLoading={createIsLoading}
          additionalStyles={{
            marginBottom: { md: "0", xs: "1rem" },
          }}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={null}
          attributeName={"LinkedInURL"}
          isLoading={createIsLoading}
          maxLength={64}
        />
        <Button
          onClick={handleSubmit(handleCreate)}
          type="submit"
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={createIsLoading}
        >
          Create
        </Button>
      </Box>
    </MainPaper>
  );
}
