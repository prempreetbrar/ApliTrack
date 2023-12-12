const express = require("express");
const multer = require("multer");

const documentController = require("../controllers/documentController");
const controllerFactory = require("../controllers/controllerFactory");
const authController = require("../controllers/authController");

const router = express.Router();

const upload = multer({
  storage: controllerFactory.uploadStorage("./uploads/documents"),
});

router
  .route("")
  .post(
    upload.single("DocFileName"),
    authController.checkIfLoggedIn,
    documentController.uploadDocFile,
    documentController.createDocument
  )
  .delete(authController.checkIfLoggedIn, documentController.deleteDocument)
  .get(
    authController.checkIfLoggedIn,
    documentController.filterApplicant,
    documentController.addSearch,
    documentController.getAllDocuments
  )
  .patch(
    upload.single("DocFileName"),
    authController.checkIfLoggedIn,
    documentController.uploadDocFile,
    documentController.updateDocument
  );

router
  .route("/my-documents")
  .get(
    documentController.filterApplicant,
    documentController.getAllApplicantDocuments
  );

module.exports = router;
