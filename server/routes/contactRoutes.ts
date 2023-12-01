const express = require("express");
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .get(contactController.getAllContacts)
  .post(authController.checkIfLoggedIn, contactController.createContact)
  .delete(authController.checkIfLoggedIn, contactController.deleteContact)
  .patch(authController.checkIfLoggedIn, contactController.updateContact);

// router.delete("/details", contactController.deleteContact);
router
  .route("/phones")
  .post(authController.checkIfLoggedIn, contactController.createContactPhone)
  .delete(authController.checkIfLoggedIn, contactController.deleteContactPhone);

router
  .route("/emails")
  .post(authController.checkIfLoggedIn, contactController.createContactEmail)
  .delete(authController.checkIfLoggedIn, contactController.deleteContactEmail);

module.exports = router;
