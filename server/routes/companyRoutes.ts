const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .get(companyController.getAllCompanies)
  .post(authController.checkIfLoggedIn, companyController.createCompany);

router
  .route("/details")
  .delete(companyController.deleteCompany)
  .put(companyController.updateCompany)
  .get(companyController.addFilter, companyController.getCompany);

module.exports = router;
