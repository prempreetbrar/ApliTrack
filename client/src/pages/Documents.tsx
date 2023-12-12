import {
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  IconButton,
  Button,
  Input,
  Tooltip,
} from "@mui/material";
import DeleteConfirmationDialog from "components/DeleteConfirmationDialog";
import MainBox from "components/MainBox";
import SingleDate from "components/SingleDate";
import SingleForm from "components/SingleForm";
import useAuthContext from "hooks/useAuthContext";
import useHandleOperation from "hooks/useHandleOperation";
import { useGet, useDelete, useCreate, useUpdate } from "hooks/useHttpMethod";
import React from "react";
import { useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import { Delete } from "@mui/icons-material";
import { DELETE_ONLY } from "Constants";
import MainPaper from "components/MainPaper";
import NewEntryDropdown from "components/NewEntryDropdown";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function Documents() {
  const { user } = useAuthContext();
  const [documents, setDocuments] = React.useState([]);
  const { register, handleSubmit, setValue } = useForm();

  const { executeRequest: get } = useGet();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
    React.useState(false);
  const [selectedIndexToDelete, setSelectedIndexToDelete] =
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
    setDocuments,
    documents
  );

  async function handleDelete(index) {
    executeHandle(
      "delete",
      deleteInstance,
      {
        DocumentID: documents[index].OfferID,
      },
      "http://localhost:3000/api/applicants/documents",
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
      },
      "http://localhost:3000/api/applicants/documents",
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
          Sort: "DocFileName-ASC",
        },
        "http://localhost:3000/api/applicants/documents",
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
                  defaultValue="DocFileName-ASC"
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
                      value="DocFileName-ASC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Document Name Ascending"
                      labelPlacement="start"
                      sx={{ width: "100%" }}
                    />
                    <FormControlLabel
                      value="DocFileName-DESC"
                      control={<Radio {...register("Sort")} />}
                      label="Sort by Document Name Descending"
                      labelPlacement="start"
                      sx={{
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
                  attributeName={"DocFileName"}
                  allowUnauthenticated
                />
              </Box>

              <IconButton type="submit">
                <SearchIcon color="primary" />
              </IconButton>
            </Box>
          </form>
          {documents?.map((document, index) => (
            <Document
              key={index}
              document={document}
              setDocuments={setDocuments}
              documents={documents}
              index={index}
              handleOpenDeleteConfirmationDialog={
                handleOpenDeleteConfirmationDialog
              }
            />
          ))}
          <NewDocumentForm documents={documents} setDocuments={setDocuments} />
          {deleteConfirmationDialogOpen && (
            <DeleteConfirmationDialog
              open={deleteConfirmationDialogOpen}
              handleClose={handleCloseDeleteConfirmationDialog}
              handleConfirm={() => handleDelete(selectedIndexToDelete)}
              itemName={
                "your Document from " +
                documents[selectedIndexToDelete]?.Job.CompanyName +
                " for the " +
                documents[selectedIndexToDelete]?.Job.PositionName +
                ` [${documents[selectedIndexToDelete]?.Job.PositionID}] ` +
                " Position"
              }
            />
          )}
        </MainBox>
      )}
    </>
  );
}

function Document({
  document,
  index,
  setDocuments,
  documents,
  handleOpenDeleteConfirmationDialog,
}) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    undefined,
    setDocuments,
    documents
  );
  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();

  const [currentlyUploadedFileName, setCurrentlyUploadedFileName] =
    React.useState(document?.DocFileName?.split("/")?.pop());

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setCurrentlyUploadedFileName(document?.DocFileName?.split("/")?.pop());
    setValue("DocType", document?.DocType);
    setValue("Description", document?.Description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  async function updateDocument(data) {
    const DocFileName = data?.DocFileName?.[0];
    const newData = { ...data };
    delete newData.DocFileName;
    if (DocFileName !== "/") {
      newData.DocFileName = DocFileName;
    }

    const success = await update(
      {
        ...newData,
        DocumentID: document.DocumentID,
      },
      `http://localhost:3000/api/applicants/documents`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (success && DocFileName && DocFileName !== "/") {
      setCurrentlyUploadedFileName(success.document.DocFileName);
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
          <Typography variant="h2">Document</Typography>
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
        onSubmit={handleSubmit(updateDocument)}
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
              <SingleForm
                register={register}
                handleSubmit={handleSubmit}
                attributeName={"DocType"}
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
              <SingleForm
                register={register}
                handleSubmit={handleSubmit}
                attributeName={"Description"}
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
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ marginTop: { xs: "2rem", md: "-1.5rem" } }}
            marginLeft="2rem"
            flexGrow="1"
          >
            <Typography>Document File</Typography>
            {currentlyUploadedFileName && (
              <iframe
                src={`http://localhost:3000/uploads/documents/${currentlyUploadedFileName}`}
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
                {...register("DocFileName")}
                type="file"
                name="DocFileName"
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

function NewDocumentForm({ documents, setDocuments }) {
  const { register, handleSubmit, setValue } = useForm();
  const { executeHandle } = useHandleOperation(
    undefined,
    setDocuments,
    documents
  );
  const { executeRequest: get, isLoading: getIsLoading } = useGet();
  const { executeRequest: create, isLoading: createIsLoading } = useCreate();
  const { executeRequest: update, isLoading: updateIsLoading } = useUpdate();
  const { executeRequest: deleteInstance, isLoading: deleteIsLoading } =
    useDelete();
  const { user } = useAuthContext();

  React.useEffect(() => {
    /*
        We have forms that the user can change. However, we want to prepopulate them
        with their current values from the database.
      */
    setValue("DocType", "");
    setValue("Description", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createDocument(data) {
    const DocFileName = data?.DocFileName?.[0];
    const newData = { ...data };
    delete newData.DocFileName;
    if (DocFileName !== "/") {
      newData.DocFileName = DocFileName;
    }
    console.log(newData);

    const success = await executeHandle(
      "create",
      create,
      {
        ...newData,
      },
      `http://localhost:3000/api/applicants/documents`,
      null,
      false,
      null,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      false,
      null
    );
    if (success) {
      setValue("DocType", "");
      setValue("Description", "");
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
            <Typography variant="h3">Upload Document</Typography>

            <form
              onSubmit={handleSubmit(createDocument)}
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
                    <SingleForm
                      register={register}
                      handleSubmit={handleSubmit}
                      attributeName={"DocType"}
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
                    <SingleForm
                      register={register}
                      handleSubmit={handleSubmit}
                      attributeName={"Description"}
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
                    />
                  </Box>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  sx={{ marginTop: { xs: "2rem", md: "-1.5rem" } }}
                  marginLeft="2rem"
                  flexGrow="1"
                >
                  <Typography>File</Typography>

                  <Input
                    sx={{ marginTop: "1rem" }}
                    {...register("DocFileName")}
                    type="file"
                    name="DocFileName"
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