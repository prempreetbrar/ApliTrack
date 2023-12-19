// @ts-nocheck

import React from "react";

import { useForm } from "react-hook-form";

import useAuthContext from "hooks/useAuthContext";
import useHandleOperation from "hooks/useHandleOperation";
import { useGet, useDelete, useCreate, useUpdate } from "hooks/useHttpMethod";

import MainBox from "components/MainBox";
import SubBox from "components/SubBox";
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
  FormControl,
  Radio,
  RadioGroup,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";

import { GET_AND_DELETE } from "Constants";
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

  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
    React.useState(null);
  const [EarliestResponseDeadline, setEarliestResponseDeadline] =
    React.useState(null);
  const [LatestResponseDeadline, setLatestResponseDeadline] =
    React.useState(null);
  const [EarliestStartDate, setEarliestStartDate] = React.useState(null);
  const [LatestStartDate, setLatestStartDate] = React.useState(null);

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
      false,
      null
    );
  }

  async function handleGet(data) {
    executeHandle(
      "get",
      get,
      {
        ...data,
        EarliestResponseDeadline,
        LatestResponseDeadline,
        EarliestStartDate,
        LatestStartDate,
      },
      "http://localhost:3000/api/applicants/offers",
      null,
      false,
      null,
      {},
      false,
      null
    );
  }

  React.useEffect(() => {
    if (user) {
      executeHandle(
        "get",
        get,
        {
          Sort: "ResponseDeadline-ASC",
        },
        "http://localhost:3000/api/applicants/offers",
        null,
        false,
        null,
        {},
        true,
        null
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {user && (
        <MainBox>
          <form
            onSubmit={handleSubmit(handleGet)}
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <Box
              display="flex"
              sx={{
                flexDirection: { xs: "column", xl: "row" },
              }}
              alignItems="center"
              marginRight="2.5rem"
              width="100%"
            >
              <FormControl sx={{ width: "100%" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Compensation-ASC"
                  name="radio-buttons-group"
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                  row
                >
                  <Box
                    display="flex"
                    maxWidth={{ xs: "100%", sm: "50%" }}
                    flexDirection="column"
                    paddingRight="2rem"
                  >
                    <FormControlLabel
                      value="Compensation-ASC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Compensation Ascending"
                      labelPlacement="start"
                      sx={{ width: "100%" }}
                    />
                    <FormControlLabel
                      value="ResponseDeadline-ASC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Response Deadline Ascending"
                      labelPlacement="start"
                      sx={{
                        marginTop: { xs: "1rem", sm: "0" },
                        width: "100%",
                      }}
                    />
                    <FormControlLabel
                      value="StartDate-ASC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Start Date Ascending"
                      labelPlacement="start"
                      sx={{
                        marginTop: { xs: "1rem", sm: "0" },
                        width: "100%",
                      }}
                    />
                  </Box>

                  <Box
                    display="flex"
                    maxWidth={{ xs: "100%", sm: "50%" }}
                    flexDirection="column"
                    paddingRight="2rem"
                  >
                    <FormControlLabel
                      value="Compensation-DESC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Compensation Descending"
                      labelPlacement="start"
                      sx={{
                        marginTop: { xs: "1rem", sm: "0" },
                        width: "100%",
                      }}
                    />
                    <FormControlLabel
                      value="ResponseDeadline-DESC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Response Deadline Descending"
                      labelPlacement="start"
                      sx={{
                        marginTop: { xs: "1rem", sm: "0" },
                        width: "100%",
                      }}
                    />

                    <FormControlLabel
                      value="StartDate-DESC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Start Date Descending"
                      labelPlacement="start"
                      sx={{
                        marginTop: { xs: "1rem", sm: "0" },
                        width: "100%",
                      }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginTop="1rem"
              marginBottom="1rem"
              sx={{
                flexDirection: { xs: "column", xl: "row" },
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontSize: "1rem", marginRight: "1rem", flexShrink: 0 }}
              >
                Search by:
              </Typography>
              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                <SingleForm
                  register={register}
                  handleSubmit={handleSubmit}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    width: "100%",
                    marginRight: { xs: "1rem" },
                  }}
                  attributeName={"LowestCompensation"}
                  allowUnauthenticated
                />
                <SingleForm
                  register={register}
                  handleSubmit={handleSubmit}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    width: "100%",
                    marginRight: { xs: "1rem" },
                  }}
                  attributeName={"HighestCompensation"}
                  allowUnauthenticated
                />
              </Box>

              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"EarliestResponseDeadline"}
                  maxLength={64}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    marginRight: { xs: "1rem" },
                  }}
                  date={EarliestResponseDeadline}
                  setDate={setEarliestResponseDeadline}
                  allowUnauthenticated
                />
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"LatestResponseDeadline"}
                  maxLength={64}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    marginRight: { xs: "1rem" },
                  }}
                  date={LatestResponseDeadline}
                  setDate={setLatestResponseDeadline}
                  allowUnauthenticated
                />
              </Box>

              <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"EarliestStartDate"}
                  maxLength={64}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    marginRight: { xs: "1rem" },
                  }}
                  date={EarliestStartDate}
                  setDate={setEarliestStartDate}
                />
                <SingleDate
                  handleSubmit={handleSubmit}
                  attributeName={"LatestStartDate"}
                  maxLength={64}
                  additionalStyles={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: { xs: "0rem" },
                    marginTop: { xs: "1rem", xl: "0rem" },
                    flexShrink: 0,
                  }}
                  additionalFieldStyles={{
                    marginRight: { xs: "1rem" },
                  }}
                  date={LatestStartDate}
                  setDate={setLatestStartDate}
                />
              </Box>
              <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
            </Box>
          </form>

          <SubBox isLoading={getIsLoading}>
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
            <NewOfferForm offers={offers} setOffers={setOffers} />
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
          </SubBox>
        </MainBox>
      )}
    </>
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
        ...newData,
        OfferID: offer.OfferID,
        PositionID: offerJob.PositionID,
        ResponseDeadline: responseDeadline,
        StartDate: startDate,
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
        <Box display="flex" alignItems="center">
          <Typography variant="h2">Offer</Typography>
          <EmojiEventsIcon
            sx={{
              width: { xs: "2rem", sm: "4rem" },
              height: { xs: "2rem", sm: "4rem" },
              marginLeft: { xs: "1rem", sm: "2rem" },
            }}
          />
        </Box>
        {user && (
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
              formControlStyles={{ width: "100%" }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              marginTop: { xs: "2rem", md: "-1.5rem" },
              marginLeft: { xs: "0rem", md: "2rem" },
            }}
            flexGrow="1"
          >
            <Typography>Offer Letter</Typography>
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

function NewOfferForm({ offers, setOffers }) {
  const { register, handleSubmit, setValue, reset, getValues } = useForm();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeHandle } = useHandleOperation(reset, setOffers, offers);
  const { user } = useAuthContext();

  const [responseDeadline, setResponseDeadline] = React.useState(null);
  const [offerJob, setOfferJob] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("Compensation", "");
    setValue("Notes", "");
    setResponseDeadline(null);
    setStartDate(null);
    setOfferJob(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createOffer(data) {
    const OfferFileName = data?.OfferFileName?.[0];
    const newData = { ...data };
    delete newData.OfferFileName;
    if (OfferFileName !== "/") {
      newData.OfferFileName = OfferFileName;
    }

    const success = await executeHandle(
      "create",
      create,
      {
        ...newData,
        PositionID: offerJob?.PositionID,
        ResponseDeadline: responseDeadline,
        StartDate: startDate,
      },
      `http://localhost:3000/api/applicants/offers`,
      null,
      false,
      null,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      false,
      {
        Job: {
          PositionID: offerJob?.PositionID,
          CompanyName: offerJob?.CompanyName,
          PositionName: offerJob?.PositionName,
        },
      }
    );
    if (success) {
      setValue("Compensation", "");
      setValue("Notes", "");
      setResponseDeadline(null);
      setStartDate(null);
      setOfferJob(null);
    }
  }

  return (
    <>
      {user && (
        <MainPaper
          overrideStyles={{
            display: "flex",
            flexDirection: { xs: "column", md: "column" },
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="h3">Create Offer</Typography>

            <form
              onSubmit={handleSubmit(createOffer)}
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
                      isLoading={createIsLoading}
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
                      isLoading={createIsLoading}
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
                      isLoading={createIsLoading}
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
                      createIsLoading={createIsLoading}
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
                    isLoading={createIsLoading}
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
                    formControlStyles={{ width: "100%" }}
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{
                    marginTop: { xs: "2rem", md: "-1.5rem" },
                    marginLeft: { xs: "0rem", md: "2rem" },
                  }}
                  flexGrow="1"
                >
                  <Typography>Offer Letter</Typography>

                  <Input
                    sx={{ marginTop: "1rem" }}
                    {...register("OfferFileName")}
                    type="file"
                    name="OfferFileName"
                  />
                </Box>
              </Box>

              <Button
                sx={{
                  marginTop: "1rem",
                  width: "min-content",
                }}
                type="submit"
                variant="outlined"
              >
                Create
              </Button>
            </form>
          </Box>
        </MainPaper>
      )}
    </>
  );
}
