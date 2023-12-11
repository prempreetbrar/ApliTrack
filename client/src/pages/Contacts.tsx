import React from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  FormGroup,
  Switch,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

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
import { DELETE_ONLY } from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";

export default function Contacts() {
  const { user } = useAuthContext();
  const [contactsInfo, setContactsInfo] = React.useState([]);
  const [knownContactsInfo, setKnownContactsInfo] = React.useState({});
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [onlyShowContactsIKnow, setOnlyShowContactsIKnow] =
    React.useState(false);
  const [
    mostRecentEarliestLastContactDate,
    setMostRecentEarliestLastContactDate,
  ] = React.useState(null);
  const [mostRecentLatestLastContactDate, setMostRecentLatestLastContactDate] =
    React.useState(null);

  const handleOpenDeleteConfirmationDialog = (index) => {
    setSelectedIndexToDelete(index);
    setDeleteConfirmationDialogOpen(true);
  };

  const handleCloseDeleteConfirmationDialog = () => {
    setSelectedIndexToDelete(null);
    setDeleteConfirmationDialogOpen(false);
  };

  const { executeHandle } = useHandleOperation(
    undefined,
    setContactsInfo,
    contactsInfo
  );

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        ContactID: contactsInfo[index].ContactID,
      },
      "http://localhost:3000/api/contacts",
      index,
      false,
      null,
      {},
      false
    );
  }

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      data,
      "http://localhost:3000/api/contacts",
      null,
      false,
      null,
      {},
      false
    );
  }

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
  }, [user]);

  React.useEffect(() => {
    const fetchKnownContactsInfo = async () => {
      if (user && contactsInfo) {
        const knownResponse = await get(
          {
            EarliestLastContactDate: mostRecentEarliestLastContactDate,
            LatestLastContactDate: mostRecentLatestLastContactDate,
          },
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
    };
    fetchKnownContactsInfo();
  }, [user, contactsInfo, onlyShowContactsIKnow]);

  return (
    <MainBox>
      <FormGroup
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          marginBottom: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {user && (
          <FormControlLabel
            control={
              <Switch
                checked={onlyShowContactsIKnow}
                onChange={(event) => {
                  setOnlyShowContactsIKnow(event.target.checked);
                  if (!event.target.checked) {
                    setMostRecentEarliestLastContactDate(null);
                    setMostRecentLatestLastContactDate(null);
                  }
                }}
              />
            }
            label="Only Show Contacts I Know"
          />
        )}
        <form onSubmit={handleSubmit(handleGet)}>
          <Box
            display="flex"
            sx={{
              marginTop: { xs: "2rem", md: "0rem" },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: "1rem", marginRight: "1rem" }}
            >
              Search by:
            </Typography>
            <NameForm
              register={register}
              handleSubmit={handleSubmit}
              additionalStyles={{
                marginTop: { xs: "1rem", sm: "0rem" },
              }}
              additionalLnameStyles={{
                marginRight: { xs: "1rem" },
              }}
              allowUnauthenticated
            />
            <Box display="flex" alignItems="center">
              {user && onlyShowContactsIKnow && (
                <>
                  <SingleDate
                    handleSubmit={handleSubmit}
                    attributeName={"EarliestLastContactDate"}
                    maxLength={64}
                    additionalStyles={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: { xs: "0rem" },
                      marginTop: { xs: "1rem", sm: "0rem" },
                    }}
                    additionalFieldStyles={{
                      marginRight: { xs: "1rem" },
                    }}
                    date={mostRecentEarliestLastContactDate}
                    setDate={setMostRecentEarliestLastContactDate}
                  />
                  <SingleDate
                    handleSubmit={handleSubmit}
                    attributeName={"LatestLastContactDate"}
                    maxLength={64}
                    additionalStyles={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: { xs: "0rem" },
                      marginTop: { xs: "1rem", sm: "0rem" },
                    }}
                    additionalFieldStyles={{
                      marginRight: { xs: "1rem" },
                    }}
                    date={mostRecentLatestLastContactDate}
                    setDate={setMostRecentLatestLastContactDate}
                  />
                </>
              )}
              <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
            </Box>
          </Box>
        </form>
      </FormGroup>
      {contactsInfo &&
        contactsInfo.map((contact, index) => {
          if (
            onlyShowContactsIKnow &&
            !(contact.ContactID in knownContactsInfo)
          ) {
            return <></>;
          } else {
            return (
              <Contact
                key={index}
                contact={contact}
                isKnown={contact.ContactID in knownContactsInfo}
                Relationship={
                  knownContactsInfo[contact.ContactID]?.Relationship
                }
                Notes={knownContactsInfo[contact.ContactID]?.Notes}
                LastContactDate={
                  knownContactsInfo[contact.ContactID]?.LastContactDate
                }
                index={index}
                handleOpenDeleteConfirmationDialog={
                  handleOpenDeleteConfirmationDialog
                }
                setKnownContactsInfo={setKnownContactsInfo}
                knownContactsInfo={knownContactsInfo}
              />
            );
          }
        })}
      {user && (
        <AddNewContact
          setContactsInfo={setContactsInfo}
          contactsInfo={contactsInfo}
        />
      )}
      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={
            contactsInfo[selectedIndexToDelete]?.Fname +
            " " +
            contactsInfo[selectedIndexToDelete]?.Lname
          }
        />
      )}
    </MainBox>
  );
}

function Contact({
  contact,
  isKnown,
  Relationship,
  Notes,
  LastContactDate,
  index,
  setKnownContactsInfo,
  knownContactsInfo,
  handleOpenDeleteConfirmationDialog,
}) {
  const [referrals, setReferrals] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    undefined,
    setKnownContactsInfo,
    knownContactsInfo
  );
  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeHandle: executeHandleReferral } = useHandleOperation(
    undefined,
    setReferrals,
    referrals
  );
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();
  const [stillKnown, setStillKnown] = React.useState(isKnown);
  const [date, setDate] = React.useState(LastContactDate);

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
    setDate(LastContactDate);
  }, [LastContactDate]);

  React.useEffect(() => {
    executeHandleReferral(
      "get",
      get,
      { ContactID: contact.ContactID },
      "http://localhost:3000/api/applicants/referrals",
      undefined,
      false,
      false,
      {},
      true
    );
  }, []);

  function updateNameOrLinkedInURL(data) {
    update(
      { ...data, ContactID: contact.ContactID },
      "http://localhost:3000/api/contacts"
    );
  }

  function handleKnows(event) {
    if (event.target.checked) {
      setStillKnown(true);

      executeHandle(
        "create",
        create,
        { ContactID: contact.ContactID },
        "http://localhost:3000/api/applicants/known-contacts",
        null,
        true,
        "ContactID",
        {},
        false
      );
    }
    if (!event.target.checked) {
      executeHandle(
        "delete",
        deleteInstance,
        { ContactID: contact.ContactID },
        "http://localhost:3000/api/applicants/known-contacts",
        contact.ContactID,
        true,
        null,
        {},
        false
      );
      setStillKnown(false);
    }
  }

  function updateKnows(data) {
    update(
      {
        ContactID: contact.ContactID,
        ...data,
        LastContactDate: date,
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
      paperKey={index}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          alignSelf: { xs: "center", md: "flex-start" },
          marginRight: { xs: "0", md: "2.5rem" },
          marginBottom: { xs: "1.5rem", md: "0" },
          order: { xs: 2, md: 1 },
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
              <Box>
                <Box>
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
                  <SingleDate
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
                    date={date || null}
                    setDate={setDate}
                    additionalFieldStyles={{
                      marginRight: { xs: "1rem" },
                    }}
                  />
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
                </Box>

                <Box marginTop="2rem">
                  <Typography variant="h3" fontSize="1rem" marginBottom="1rem">
                    Referral(s)
                  </Typography>
                  {referrals.map((referral, index) => (
                    <Referral referral={referral} key={index} />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box
        display="flex"
        sx={{
          alignItems: { xs: "center", md: "flex-start" },
          order: { xs: 3, md: 2 },
        }}
        flexDirection="column"
      >
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateNameOrLinkedInURL}
          isLoading={updateIsLoading}
          additionalLnameStyles={{ marginRight: { xs: "1rem" } }}
          buttonName={"Update"}
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
            marginTop: "1rem",
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
      {user?.data?.user?.AdminFlag &&
        user?.data?.user?.PermissionLevel >= DELETE_ONLY && (
          <IconButton
            sx={{
              alignSelf: { xs: "flex-end", md: "flex-start" },
              order: { xs: 1, md: 3 },
            }}
            aria-label="delete"
            size="large"
            onClick={() => handleOpenDeleteConfirmationDialog(index)}
          >
            <Delete sx={{ width: "2rem", height: "2rem" }} />
          </IconButton>
        )}
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
      sectionURL,
      undefined,
      false,
      undefined,
      {},
      false
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
      index,
      false,
      undefined,
      {},
      false
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
      "http://localhost:3000/api/contacts",
      undefined,
      false,
      undefined,
      {},
      false
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

function Referral({ referral }) {
  const { register, getValues, reset, control, handleSubmit, setValue } =
    useForm();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();

  const [referralDate, setReferralDate] = React.useState(referral.Date);
  const [referralJob, setReferralJob] = React.useState(referral.Job);

  React.useEffect(() => {
    setValue("Notes", referral.Notes);
    setValue("Job", referral.Job);
  }, []);

  function updateReferral(data) {
    update(
      {
        ReferralID: referral.ReferralID,
        ...data,
        Date: referralDate,
        PositionID: referralJob.PositionID,
      },
      "http://localhost:3000/api/applicants/referrals"
    );
  }

  return (
    <form
      onSubmit={handleSubmit(updateReferral)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <SingleDate
        handleSubmit={handleSubmit}
        attributeName={"LastContactDate"}
        maxLength={64}
        isLoading={updateIsLoading}
        additionalStyles={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
        date={referralDate || null}
        setDate={setReferralDate}
        additionalFieldStyles={{
          marginRight: { xs: "1rem" },
        }}
      />
      <SingleForm
        register={register}
        handleSubmit={handleSubmit}
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
      <NewEntryDropdown
        entityName="Job"
        entityAttributeName="PositionID"
        entityAttributeName2="CompanyName"
        entityAttributeName3="PositionName"
        doNotShowButton
        createIsLoading={updateIsLoading}
        register={register}
        fetchAllOptionsURL={"http://localhost:3000/api/jobs"}
        dropdownValue={referralJob || {}}
        setDropdownValue={setReferralJob}
        isDropdownObject
      />
      <Button type="submit" variant="outlined">
        Submit
      </Button>
    </form>
  );
}

// function NewReferralForm({setReferrals, referrals}) {
//   const { executeRequest: create, isLoading: createIsLoading } = useCreate();
//   const { register, getValues, reset, handleSubmit, setValue } = useForm();
//   const { executeHandle } = useHandleOperation(
//     reset,
//     setReferrals,
//     referrals
//   );

//   async function handleCreate(data) {
//     const result = await executeHandle(
//       "create",
//       create,
//       data,
//       "http://localhost:3000/api/applicants/referrals",
//       undefined,
//       false,
//       undefined,
//       {},
//       false
//     );

//     /*
//       Done manually here because for some reason, when executeHandle is running reset(), it
//       isn't working.
//     */
//     if (result) {
//       setValue("Fname", "");
//       setValue("Lname", "");
//       setValue("LinkedInURL", "");
//     }
//   }

//   return (
//     <MainPaper overrideStyles={{ flexDirection: "column" }}>
//       <Typography variant="h2" sx={{ fontSize: "1.5rem", fontWeight: "500" }}>
//         Add New Contact
//       </Typography>
//       <Box
//         display="flex"
//         sx={{
//           flexDirection: { xs: "column", md: "row" },
//           alignItems: "center",
//         }}
//       >
//         <Person
//           additionalStyles={{ margin: { xs: "1.5rem 0", md: "0 1.5rem" } }}
//         />
//         <NameForm
//           register={register}
//           handleSubmit={handleSubmit}
//           actionOnAttribute={null}
//           isLoading={createIsLoading}
//           additionalStyles={{
//             marginBottom: { md: "0", xs: "1rem" },
//           }}
//         />
//         <SingleForm
//           register={register}
//           handleSubmit={handleSubmit}
//           actionOnAttribute={null}
//           attributeName={"LinkedInURL"}
//           isLoading={createIsLoading}
//           maxLength={64}
//         />
//         <Button
//           onClick={handleSubmit(handleCreate)}
//           type="submit"
//           variant="outlined"
//           sx={{ mt: 3, mb: 2 }}
//           disabled={createIsLoading}
//         >
//           Create
//         </Button>
//       </Box>
//     </MainPaper>
//   );
// }
