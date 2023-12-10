const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .get(companyController.getAllCompanies)
  .post(authController.checkIfLoggedIn, companyController.createCompany)
  .patch(authController.checkIfLoggedIn, companyController.updateCompany)
  .delete(companyController.deleteCompany);

router
  .route("/company")
  .get(companyController.addFilter, companyController.getCompany);

module.exports = router;
