import React from "react";

import { useForm } from "react-hook-form";

import useAuthContext from "hooks/useAuthContext";
import useHandleOperation from "hooks/useHandleOperation";
import { useGet, useDelete, useCreate, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import { Notes, Person, Delete } from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Input,
  Tooltip,
  Button,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { DELETE_ONLY } from "Constants";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import MainPaper from "components/MainPaper";
import NameForm from "components/NameForm";
import SingleDate from "components/SingleDate";
import SingleForm from "components/SingleForm";
import NewEntryDropdown from "components/NewEntryDropdown";

export default function Offers() {
  const { user } = useAuthContext();
  const [offers, setOffers] = React.useState([]);
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

  const { executeHandle } = useHandleOperation(undefined, setOffers, offers);

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        OfferID: offers[index].OfferID,
      },
      "http://localhost:3000/api/applicants/offers",
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
    const fetchOffers = async () => {
      if (user) {
        const response = await get(
          {},
          "http://localhost:3000/api/applicants/offers"
        );

        setOffers(response?.offer);
      }
    };

    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log(offers);

  return (
    <MainBox>
      {offers?.map((offer, index) => (
        <Offer
          key={index}
          offer={offer}
          index={index}
          handleOpenDeleteConfirmationDialog={
            handleOpenDeleteConfirmationDialog
          }
        />
      ))}
      {deleteConfirmationDialogOpen && (
        <DeleteConfirmationDialog
          open={deleteConfirmationDialogOpen}
          handleClose={handleCloseDeleteConfirmationDialog}
          handleConfirm={() => handleDelete(selectedIndexToDelete)}
          itemName={
            "your Offer from " +
            offers[selectedIndexToDelete]?.Job.CompanyName +
            " for the " +
            offers[selectedIndexToDelete]?.Job.PositionName +
            ` [${offers[selectedIndexToDelete]?.Job.PositionID}] ` +
            " Position"
          }
        />
      )}
    </MainBox>
  );
}

function Offer({
  offer,
  index,
  setOffers,
  offers,
  handleOpenDeleteConfirmationDialog,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(undefined, setOffers, offers);
  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();

  const [responseDeadline, setResponseDeadline] = React.useState(
    offer.ResponseDeadline
  );
  const [offerJob, setOfferJob] = React.useState(offer.Job);
  const [startDate, setStartDate] = React.useState(offer.StartDate);
  const [currentlyUploadedFileName, setCurrentlyUploadedFileName] =
    React.useState(offer?.OfferFileName?.split("/")?.pop());

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Compensation", offer.Compensation);
    setValue("Notes", offer?.Notes);
    setResponseDeadline(offer?.ResponseDeadline);
    setStartDate(offer?.StartDate);
    setCurrentlyUploadedFileName(offer?.OfferFileName?.split("/")?.pop());
    setOfferJob(offer?.Job);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer]);

  async function updateOffer(data) {
    const OfferFileName = data?.OfferFileName?.[0];
    const newData = { ...data };
    delete newData.OfferFileName;
    if (OfferFileName !== "/") {
      newData.OfferFileName = OfferFileName;
    }

    const success = await update(
      {
        OfferID: offer.OfferID,
        PositionID: offerJob.PositionID,
        ResponseDeadline: responseDeadline,
        StartDate: startDate,
        ...newData,
      },
      `http://localhost:3000/api/applicants/offers`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (success && OfferFileName && OfferFileName !== "/") {
      setCurrentlyUploadedFileName(success.offer.OfferFileName);
    }
  }

  return (
    <MainPaper
      overrideStyles={{
        display: "flex",
        flexDirection: { xs: "column", md: "column" },
        justifyContent: "center",
        alignItems: { xs: "center", md: "flex-start" },
      }}
      paperKey={index}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box display="flex">
          <Typography variant="h2">Offer</Typography>
          <EmojiEventsIcon
            sx={{ width: "4rem", height: "4rem", marginLeft: "2rem" }}
          />
        </Box>
        {user?.data?.user?.AdminFlag &&
          user?.data?.user?.PermissionLevel >= DELETE_ONLY && (
            <IconButton
              sx={{}}
              aria-label="delete"
              size="large"
              onClick={() => handleOpenDeleteConfirmationDialog(index)}
            >
              <Delete sx={{ width: "2rem", height: "2rem" }} />
            </IconButton>
          )}
      </Box>

      <form
        onSubmit={handleSubmit(updateOffer)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          display="flex"
          marginTop="2rem"
          width="100%"
          sx={{ flexDirection: { xs: "column", md: "row" } }}
        >
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
              <SingleDate
                handleSubmit={handleSubmit}
                attributeName={"ResponseDeadline"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: { xs: "100%", md: "50%" },
                }}
                date={responseDeadline || null}
                setDate={setResponseDeadline}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem", md: "1rem" },
                  width: "100%",
                }}
              />
              <SingleDate
                handleSubmit={handleSubmit}
                attributeName={"StartDate"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: { xs: "100%", md: "50%" },
                }}
                date={startDate || null}
                setDate={setStartDate}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem", md: "0rem" },
                  marginTop: { xs: "1rem", md: 0 },
                  width: "100%",
                }}
              />
            </Box>

            <Box
              display="flex"
              sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
              <SingleForm
                register={register}
                handleSubmit={handleSubmit}
                attributeName={"Compensation"}
                maxLength={64}
                isLoading={updateIsLoading}
                additionalStyles={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: { xs: "1rem" },
                  marginBottom: { xs: "0rem" },
                  width: { xs: "100%", md: "50%" },
                }}
                additionalFieldStyles={{
                  marginRight: { xs: "0rem", md: "1rem" },
                  width: "100%",
                }}
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
                dropdownValue={offerJob}
                setDropdownValue={setOfferJob}
                isDropdownObject
                additionalStyles={{
                  width: { xs: "100%", md: "50%" },
                  marginTop: { xs: "1rem" },
                  marginBottom: { xs: "0rem" },
                }}
              />
            </Box>

            <SingleForm
              register={register}
              handleSubmit={handleSubmit}
              attributeName={"Notes"}
              maxLength={64}
              isLoading={updateIsLoading}
              additionalStyles={{
                display: "flex",
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                marginTop: { xs: "1rem" },
                marginBottom: { xs: "0rem" },
                width: { xs: "100%" },
              }}
              additionalFieldStyles={{
                marginRight: { xs: "1rem" },
                width: "100%",
              }}
              isTextArea
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ marginTop: { xs: "2rem", md: "-1.5rem" } }}
            marginLeft="2rem"
            flexGrow="1"
          >
            <Typography>Job Posting</Typography>
            {currentlyUploadedFileName && (
              <iframe
                src={`http://localhost:3000/uploads/offers/${currentlyUploadedFileName}`}
                title={currentlyUploadedFileName}
                width="100%"
                style={{
                  height: "20rem",
                }}
              ></iframe>
            )}
            {user && (
              <Input
                sx={{ marginTop: "1rem" }}
                {...register("OfferFileName")}
                type="file"
                name="OfferFileName"
              />
            )}
            {currentlyUploadedFileName && (
              <Tooltip title={currentlyUploadedFileName} placement="top" arrow>
                <Typography
                  noWrap
                  sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
                >
                  Existing File: {currentlyUploadedFileName}
                </Typography>
              </Tooltip>
            )}
            {!currentlyUploadedFileName && (
              <Tooltip
                title={"No File Has Been Uploaded for this Offer"}
                placement="top"
                arrow
              >
                <Typography
                  noWrap
                  sx={{ marginTop: "1rem", maxWidth: "17.5rem" }}
                >
                  No File Has Been Uploaded for this Offer
                </Typography>
              </Tooltip>
            )}
          </Box>
        </Box>

        {user && (
          <Button
            sx={{
              marginTop: "1rem",
              width: "min-content",
            }}
            type="submit"
            variant="outlined"
          >
            Update
          </Button>
        )}
      </form>
    </MainPaper>
  );
}