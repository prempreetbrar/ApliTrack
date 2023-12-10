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

router
  .route("/contact")
  .get(contactController.addFilter, contactController.getContact);

// router.delete("/details", contactController.deleteContact);
router
  .route("/phones")
  .post(authController.checkIfLoggedIn, contactController.createContactPhone)
  .delete(authController.checkIfLoggedIn, contactController.deleteContactPhone);

router
  .route("/emails")
  .post(authController.checkIfLoggedIn, contactController.createContactEmail)
  .delete(authController.checkIfLoggedIn, contactController.deleteContactEmail);

router
.route("/works-at")
.post(authController.checkIfLoggedIn, contactController.createContactWorksAtCompany)
.delete(authController.checkIfLoggedIn, contactController.deleteContactWorksAtCompany)
.patch(authController.checkIfLoggedIn, contactController.updateContactWorksAtCompany);

//TODO: CHECK
router.route("/attends")
.post(authController.checkIfLoggedIn, contactController.createContactAttendsInterview)
.delete(authController.checkIfLoggedIn, contactController.deleteContactAttendsInterview);

module.exports = router;
