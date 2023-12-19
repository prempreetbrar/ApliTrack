const express = require("express");

const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .post(
    documentController.uploadDocumentStorage.single("DocFileName"),
    authController.checkIfLoggedIn,
    documentController.uploadDocFile,
    documentController.createDocument
  )
  .delete(
    authController.checkIfLoggedIn,
    documentController.addFilterApplicant,
    documentController.deleteDocument
  )
  .get(
    authController.checkIfLoggedIn,
    documentController.addFilterApplicant,
    documentController.addSort,
    documentController.addSearchDocFileName,
    documentController.getAllDocuments
  )
  .patch(
    documentController.uploadDocumentStorage.single("DocFileName"),
    authController.checkIfLoggedIn,
    documentController.uploadDocFile,
    documentController.updateDocument
  );

module.exports = router;
