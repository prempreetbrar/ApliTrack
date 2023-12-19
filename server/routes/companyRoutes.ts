const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");
const jobRouter = require("./jobRoutes");

const router = express.Router();

router
  .route("")
  .get(
    companyController.addSearchCompanyName,
    companyController.addSortCompanyName,
    companyController.getAllCompanies
  )
  .post(authController.checkIfLoggedIn, companyController.createCompany)
  .patch(authController.checkIfLoggedIn, companyController.updateCompany)
  .delete(
    authController.checkIfLoggedIn,
    authController.restrictTo(authController.GET_AND_DELETE),
    companyController.deleteCompany
  );

router
  .route("/company")
  .get(companyController.addFilterCompanyName, companyController.getCompany);

router.use("/company/jobs", jobRouter);

module.exports = router;
