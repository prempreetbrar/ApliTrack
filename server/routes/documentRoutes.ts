const express = require("express");
const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("").get(documentController.getAllDocuments);

router.route("/details")
.post(authController.checkIfLoggedIn, documentController.createDocument)
.delete(authController.checkIfLoggedIn, documentController.deleteDocument)
.get(authController.checkIfLoggedIn, documentController.filterID, documentController.getDocument)
.put(authController.checkIfLoggedIn, documentController.updateDocument);

router.route("/my-documents")
  .get(documentController.filterApplicant, documentController.getAllApplicantDocuments);

module.exports = router;