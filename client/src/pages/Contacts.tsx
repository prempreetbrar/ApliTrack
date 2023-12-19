// @ts-nocheck

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
  RadioGroup,
  Radio,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";

import useAuthContext from "hooks/useAuthContext";
import { useGet, useCreate, useDelete, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import SubBox from "components/SubBox";
import MainPaper from "components/MainPaper";
import useHandleOperation from "hooks/useHandleOperation";
import NewEntry from "components/NewEntry";
import ChipDisplayer from "components/ChipDisplayer";
import NameForm from "components/NameForm";
import SingleForm from "components/SingleForm";
import Person from "components/Person";
import NewEntryDropdown from "components/NewEntryDropdown";
import SingleDate from "components/SingleDate";
import { GET_AND_DELETE } from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";

export default function Contacts() {
  const { user } = useAuthContext();
  const [contactsInfo, setContactsInfo] = React.useState([]);
  const [knownContactsInfo, setKnownContactsInfo] = React.useState({});
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get, isLoading: getIsLoading } = useGet();
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
    executeHandle(
      "get",
      get,
      { Sort: "Fname-ASC,Lname-ASC" },
      "http://localhost:3000/api/contacts",
      null,
      false,
      null,
      {},
      true
    );
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
          justifyContent: "center",
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
        <form
          onSubmit={handleSubmit(handleGet)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="Fname-ASC,Lname-ASC"
            name="radio-buttons-group"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "center",
              alignItems: "center",
              width: { xs: "100%" },
              marginBottom: "1rem",
            }}
          >
            <Box
              display="flex"
              width="100%"
              justifyContent="center"
              alignItems="center"
              flexDirection={{ xs: "column", md: "row" }}
              paddingRight="2rem"
            >
              <FormControlLabel
                value="Fname-ASC,Lname-ASC"
                control={<Radio {...register("Sort")} />}
                label="Sort by First Name Ascending"
                labelPlacement="start"
              />
              <FormControlLabel
                value="Fname-DESC,Lname-DESC"
                control={<Radio {...register("Sort")} />}
                label="Sort by First Name Descending"
                labelPlacement="start"
                sx={{
                  marginLeft: { xs: "0.5rem", md: "1rem" },
                  marginTop: { xs: "1rem", sm: "0rem" },
                }}
              />
              <FormControlLabel
                value="Lname-ASC,Fname-ASC"
                control={<Radio {...register("Sort")} />}
                label="Sort by Last Name Ascending"
                labelPlacement="start"
                sx={{
                  marginLeft: { xs: "1rem", md: "3rem" },
                  marginTop: { xs: "1rem", sm: "0rem" },
                }}
              />
              <FormControlLabel
                value="Lname-DESC,Fname-DESC"
                control={<Radio {...register("Sort")} />}
                label="Sort by Last Name Descending"
                labelPlacement="start"
                sx={{
                  marginLeft: { xs: "0.5rem", md: "0.5rem" },
                }}
              />
            </Box>
          </RadioGroup>
          <Box
            display="flex"
            sx={{
              marginTop: { xs: "1rem", md: "0rem" },
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
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
                flexDirection: { xs: "column", sm: "row" },
              }}
              additionalLnameStyles={{
                marginTop: { xs: "1rem", sm: "0rem" },
                marginRight: { xs: "1rem" },
              }}
              allowUnauthenticated
            />
            <Box
              display="flex"
              alignItems="center"
              flexDirection={{ xs: "column", sm: "row" }}
            >
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

      <SubBox isLoading={getIsLoading}>
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
      </SubBox>
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

  const [
    deleteReferralConfirmationDialogOpen,
    setDeleteReferralConfirmationDialogOpen,
  ] = React.useState(false);
  const [selectedReferralIndexToDelete, setSelectedReferralIndexToDelete] =
    React.useState(null);

  const handleOpenDeleteReferralConfirmationDialog = (index) => {
    setSelectedReferralIndexToDelete(index);
    setDeleteReferralConfirmationDialogOpen(true);
  };

  const handleCloseDeleteReferralConfirmationDialog = () => {
    setSelectedReferralIndexToDelete(null);
    setDeleteReferralConfirmationDialogOpen(false);
  };

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

  async function handleDelete(index) {
    executeHandleReferral(
      "delete",
      deleteInstance,
      {
        ReferralID: referrals[index].ReferralID,
      },
      "http://localhost:3000/api/applicants/referrals",
      index,
      false,
      undefined,
      {},
      false
    );
  }

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: { xs: "center", md: "flex-start" },
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
          justifyContent: "center",
          width: { xs: "100%", md: "30%" },
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
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <SingleForm
                  register={register}
                  handleSubmit={handleSubmit}
                  attributeName={"Relationship"}
                  maxLength={64}
                  isLoading={updateIsLoading}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "1.5rem",
                    width: "inherit",
                  }}
                  additionalFieldStyles={{
                    marginRight: "0rem",
                    width: "inherit",
                  }}
                />
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"LastContactDate"}
                  maxLength={64}
                  isLoading={updateIsLoading}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "1.5rem",
                    width: "inherit",
                  }}
                  date={date || null}
                  setDate={setDate}
                  additionalFieldStyles={{
                    marginRight: "0rem",
                    width: "inherit",
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
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "1.5rem",
                    marginBottom: { xs: "2rem", md: "0rem" },
                    width: "inherit",
                  }}
                  additionalFieldStyles={{
                    width: "inherit",
                  }}
                  isTextArea
                  formControlStyles={{ width: "inherit" }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
      <Box
        display="flex"
        sx={{
          alignItems: { xs: "center", md: "flex-start" },
          alignSelf: { xs: "center", md: "flex-start" },
          order: { xs: 3, md: 2 },
          width: { xs: "100%", md: "70%" },
        }}
        flexDirection="column"
      >
        <NameForm
          register={register}
          handleSubmit={handleSubmit}
          actionOnAttribute={updateNameOrLinkedInURL}
          isLoading={updateIsLoading}
          additionalStyles={{ flexDirection: { xs: "column", sm: "row" } }}
          additionalLnameStyles={{
            marginTop: { xs: "1rem", sm: 0 },
            marginRight: { xs: "1rem" },
          }}
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
        <Box
          display="flex"
          sx={{ flexDirection: { xs: "column", sm: "row" } }}
          width="100%"
        >
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
          Works At
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
        <Box marginTop="2rem" display="flex" flexDirection="column">
          <Typography
            variant="h3"
            fontSize="1rem"
            marginBottom="2rem"
            fontWeight="bold"
          >
            Referral(s)
          </Typography>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            {referrals.map((referral, index) => (
              <Referral
                referral={referral}
                key={index}
                index={index}
                setReferrals={setReferrals}
                referrals={referrals}
                handleOpenDeleteReferralConfirmationDialog={
                  handleOpenDeleteReferralConfirmationDialog
                }
              />
            ))}
            <NewReferralForm
              setReferrals={setReferrals}
              referrals={referrals}
              ContactID={contact.ContactID}
              additionalStyles={{ marginLeft: "2rem" }}
            />
          </Box>
        </Box>
      </Box>

      {user?.data?.user?.AdminFlag &&
        user?.data?.user?.PermissionLevel >= GET_AND_DELETE && (
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
      {deleteReferralConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteReferralConfirmationDialogOpen}
          handleClose={handleCloseDeleteReferralConfirmationDialog}
          handleConfirm={() => handleDelete(selectedReferralIndexToDelete)}
          itemName={
            "a referral to " +
            referrals[selectedReferralIndexToDelete]?.Job.CompanyName +
            " - " +
            referrals[selectedReferralIndexToDelete]?.Job.PositionName +
            " - " +
            `[${referrals[selectedReferralIndexToDelete]?.Job.PositionID}]`
          }
        />
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
  const { register, getValues, reset, control, setValue } = useForm();
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
    const success = await executeHandle(
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
    if (success) {
      setDropdownValue(null);
      setValue(entitySecondTargetAttribute, "");
    }
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
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
          <NewEntryDropdown
            entityName={entityName}
            entityAttributeName={entityTargetAttribute}
            maxCreateLength={maxCreateLength}
            handleCreate={handleCreate}
            createIsLoading={createIsLoading}
            register={register}
            fetchAllOptionsURL={fetchAllOptionsURL}
            additionalStyles={{ width: "50%", paddingRight: "2rem" }}
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

function Referral({
  referral,
  index,
  setReferrals,
  referrals,
  handleOpenDeleteReferralConfirmationDialog,
}) {
  const { user } = useAuthContext();
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
    <form onSubmit={handleSubmit(updateReferral)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginRight: { xs: "0rem", sm: "1rem", md: "2rem" },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          width="75%"
          justifyContent="center"
          marginRight="2rem"
        >
          <BadgeIcon
            sx={{
              width: "5rem",
              height: "5rem",
              marginBottom: "2rem",
              marginLeft: "5rem",
            }}
          />
          {user && (
            <IconButton
              sx={{
                alignSelf: { xs: "flex-start" },
                marginLeft: "auto",
              }}
              aria-label="delete"
              size="large"
              onClick={() => handleOpenDeleteReferralConfirmationDialog(index)}
            >
              <Delete sx={{ width: "2rem", height: "2rem" }} />
            </IconButton>
          )}
        </Box>
        <SingleDate
          handleSubmit={handleSubmit}
          attributeName={"Date"}
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
            marginTop: { xs: "1rem" },
            marginBottom: { xs: "0rem" },
          }}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
          }}
          isTextArea
        />
        <NewEntryDropdown
          entityName="Job"
          entityAttributeName="CompanyName"
          entityAttributeName2="PositionName"
          entityAttributeName3="PositionID"
          doNotShowButton
          createIsLoading={updateIsLoading}
          register={register}
          fetchAllOptionsURL={"http://localhost:3000/api/jobs"}
          dropdownValue={referralJob}
          setDropdownValue={setReferralJob}
          isDropdownObject
          additionalStyles={{
            width: "100%",
            marginTop: { xs: "1rem" },
            marginBottom: { xs: "0rem" },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            width: "min-content",
            alignSelf: "center",
            marginTop: "1rem",
            marginBottom: { xs: "3.5rem" },
          }}
        >
          Update
        </Button>
      </Box>
    </form>
  );
}

function NewReferralForm({
  setReferrals,
  referrals,
  ContactID,
  additionalStyles,
}) {
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { register, getValues, reset, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(reset, setReferrals, referrals);

  const [referralDate, setReferralDate] = React.useState("");
  const [referralJob, setReferralJob] = React.useState(null);

  React.useEffect(() => {
    setValue("Notes", "");
    setValue("Job", null);
  }, []);

  async function createReferral(data) {
    const result = await executeHandle(
      "create",
      create,
      {
        ...data,
        ContactID,
        Date: referralDate,
        PositionID: referralJob.PositionID,
      },
      "http://localhost:3000/api/applicants/referrals",
      undefined,
      false,
      undefined,
      {},
      false,
      { Job: referralJob }
    );

    /*
      Done manually here because for some reason, when executeHandle is running reset(), it
      isn't working.
    */
    if (result) {
      setValue("Date", "");
      setValue("Notes", "");
      setReferralJob(null);
      setReferralDate(null);
    }
  }

  return (
    <form onSubmit={handleSubmit(createReferral)}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...additionalStyles,
          marginTop: "1rem",
        }}
      >
        <Typography>Add New Referral</Typography>
        <SingleDate
          handleSubmit={handleSubmit}
          attributeName={"Date"}
          maxLength={64}
          isLoading={createIsLoading}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          date={referralDate || null}
          setDate={setReferralDate}
          additionalFieldStyles={{
            marginRight: { xs: "1rem" },
            marginTop: "1rem",
          }}
        />
        <SingleForm
          register={register}
          handleSubmit={handleSubmit}
          attributeName={"Notes"}
          maxLength={64}
          isLoading={createIsLoading}
          additionalStyles={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: { xs: "1rem" },
            marginBottom: { xs: "0rem" },
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
          createIsLoading={createIsLoading}
          register={register}
          fetchAllOptionsURL={"http://localhost:3000/api/jobs"}
          dropdownValue={referralJob}
          setDropdownValue={setReferralJob}
          isDropdownObject
          additionalStyles={{
            width: "100%",
            marginTop: { xs: "1rem" },
            marginBottom: { xs: "0rem" },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            width: "min-content",
            alignSelf: "center",
            marginTop: "1rem",
            marginBottom: { xs: "2rem", md: "0rem" },
          }}
        >
          Create
        </Button>
      </Box>
    </form>
  );
}
