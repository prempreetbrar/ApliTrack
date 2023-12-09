import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NameForm from "components/NameForm";
import SingleForm from "components/SingleForm";
import Person from "components/Person";
import NewEntryDropdown from "components/NewEntryDropdown";
import SingleDate from "components/SingleDate";

export default function Contacts() {
  const { user } = useAuthContext();
  const [contactsInfo, setContactsInfo] = React.useState([]);
  const [knownContactsInfo, setKnownContactsInfo] = React.useState({});
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
      if (user) {
        const knownResponse = await get(
          {},
          "http://localhost:3000/api/applicants/known-contacts"
        );

        const hashtableKnownContacts = {};
        for (const contact of knownResponse.knows) {
          hashtableKnownContacts[contact.ContactID] = {
            ...contact,
          };
        }

        setKnownContactsInfo(hashtableKnownContacts);
      }

      setContactsInfo(response.contact);
    };

    fetchContactsInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <MainBox>
      {contactsInfo &&
        contactsInfo.map((contact, index) => (
          <Contact
            key={index}
            contact={contact}
            isKnown={contact.ContactID in knownContactsInfo}
            Relationship={knownContactsInfo[contact.ContactID]?.Relationship}
            Notes={knownContactsInfo[contact.ContactID]?.Notes}
            LastContactDate={
              knownContactsInfo[contact.ContactID]?.LastContactDate
            }
          />
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

function Contact({
  key,
  contact,
  isKnown,
  Relationship,
  Notes,
  LastContactDate,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();
  const [stillKnown, setStillKnown] = React.useState(isKnown);
  const [mostRecentLastContactDate, setMostRecentLastContactDate] =
    React.useState(LastContactDate);

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Fname", contact?.Fname);
    setValue("Lname", contact?.Lname);
    setValue("LinkedInURL", contact?.LinkedInURL);
    setValue("Relationship", Relationship);
    setValue("Notes", Notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, Relationship, Notes]);

  React.useEffect(() => {
    setStillKnown(isKnown);
  }, [isKnown]);

  React.useEffect(() => {
    setMostRecentLastContactDate(LastContactDate);
  }, [LastContactDate]);

  function updateNameOrLinkedInURL(data) {
    update(
      { ...data, ContactID: contact.ContactID },
      "http://localhost:3000/api/contacts/"
    );
  }

  function handleKnows(event) {
    if (event.target.checked) {
      create(
        { ContactID: contact.ContactID },
        "http://localhost:3000/api/applicants/known-contacts"
      );
      setStillKnown(true);
    }
    if (!event.target.checked) {
      deleteInstance(
        { ContactID: contact.ContactID },
        "http://localhost:3000/api/applicants/known-contacts"
      );
      setStillKnown(false);
    }
  }

  function updateKnows(data) {
    update(
      {
        ContactID: contact.ContactID,
        ...data,
        LastContactDate: mostRecentLastContactDate,
      },
      "http://localhost:3000/api/applicants/known-contacts"
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          alignSelf: { xs: "center", md: "flex-start" },
          marginRight: { xs: "0", md: "2.5rem" },
          marginBottom: { xs: "1.5rem", md: "0" },
        }}
      >
        <Person />
        {user && (
          <>
            <FormControlLabel
              control={<Checkbox checked={stillKnown} onChange={handleKnows} />}
              label="I know this person!"
            />
            {stillKnown && (
              <SingleForm
                register={register}
                handleSubmit={handleSubmit}
                actionOnAttribute={updateKnows}
                attributeName={"Relationship"}
                maxLength={64}
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
            )}
            {stillKnown && (
              <SingleDate
                register={register}
                handleSubmit={handleSubmit}
                actionOnAttribute={updateKnows}
                attributeName={"LastContactDate"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                mostRecentLastContactDate={mostRecentLastContactDate || null}
                setMostRecentLastContactDate={setMostRecentLastContactDate}
                additionalFieldStyles={{
                  marginRight: { xs: "1rem" },
                }}
              />
            )}
            {stillKnown && (
              <SingleForm
                register={register}
                handleSubmit={handleSubmit}
                actionOnAttribute={updateKnows}
                attributeName={"Notes"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: { xs: "2rem", md: "0rem" },
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "1rem" },
                }}
                isTextArea
              />
            )}
          </>
        )}
      </Box>
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
          maxLength={64}
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
            entityName="Contact"
            entityTargetAttribute="Phone"
            isMarginRight
            sectionURL="http://localhost:3000/api/contacts/phones"
            maxCreateLength={16}
            additionalStyles={{
              minWidth: { xs: "100%", sm: "50%" },
              marginRight: { xs: "0" },
            }}
          />
          <InfoSection
            entityIDName="ContactID"
            entityID={contact.ContactID}
            sectionTitle="Email(s)"
            sectionArray={contact.Emails}
            entityName="Contact"
            entityTargetAttribute="Email"
            sectionURL="http://localhost:3000/api/contacts/emails"
            maxCreateLength={64}
            additionalStyles={{
              minWidth: { xs: "100%", sm: "50%" },
              marginRight: { xs: "0" },
            }}
          />
        </Box>
        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Employed At
        </Typography>
        <InfoSection
          entityIDName="ContactID"
          entityID={contact.ContactID}
          sectionTitle="Companie(s)"
          sectionArray={contact?.Companies?.map(
            (company, index) => company.WORKS_AT
          )}
          entityName="Company"
          entityTargetAttribute="CompanyName"
          entitySecondTargetAttribute="Role"
          sectionURL="http://localhost:3000/api/contacts/works-at"
          fetchAllOptionsURL="http://localhost:3000/api/companies"
          maxCreateLength={64}
          isCompany
        />
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
  entityName,
  entityTargetAttribute,
  entitySecondTargetAttribute,
  isMarginRight,
  sectionURL,
  fetchAllOptionsURL,
  isCompany,
  additionalStyles,
}) {
  const [onUpdateSectionArray, setOnUpdateSectionArray] = React.useState([]);
  const [dropdownValue, setDropdownValue] = React.useState("");
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: deleteInstance } = useDelete();
  const { register, getValues, reset, control } = useForm();
  const { executeHandle } = useHandleOperation(
    reset,
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
      {
        [entityTargetAttribute]:
          getValues(entityTargetAttribute) || dropdownValue,
        [entityIDName]: entityID,
        [entitySecondTargetAttribute]: getValues(entitySecondTargetAttribute),
      },
      sectionURL
    );
  }

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        [entityTargetAttribute]:
          onUpdateSectionArray[index][entityTargetAttribute],
        [entityIDName]: entityID,
      },
      sectionURL,
      index
    );
  }

  return (
    <Box
      minWidth="100%"
      padding="0.5rem"
      marginRight={`${isMarginRight ? "2rem" : "0"}`}
      sx={{ ...additionalStyles }}
    >
      <Typography sx={{ textDecoration: "underline" }}>
        {sectionTitle}
      </Typography>
      <ChipDisplayer
        onUpdateSectionArray={onUpdateSectionArray}
        attributeName={entityTargetAttribute}
        secondAttributeName={entitySecondTargetAttribute}
        handleDelete={handleDelete}
      />

      {!isCompany && (
        <NewEntry
          attributeName={entityTargetAttribute}
          maxCreateLength={maxCreateLength}
          handleCreate={handleCreate}
          createIsLoading={createIsLoading}
          register={register}
        />
      )}
      {isCompany && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <NewEntryDropdown
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            additionalStyles={{ width: "50%" }}
            doNotShowButton
            dropdownValue={dropdownValue}
            setDropdownValue={setDropdownValue}
          />
          <NewEntry
            attributeName={entitySecondTargetAttribute}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
          />
        </Box>
      )}
    </Box>
  );
}

function AddNewContact({ setContactsInfo, contactsInfo }) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    reset,
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
