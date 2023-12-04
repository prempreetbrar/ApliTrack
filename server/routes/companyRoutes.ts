const express = require("express");
const companyController = require("../controllers/companyController");

const router = express.Router();

router
.route("/details")
.post(companyController.createCompany)
.delete(companyController.deleteCompany)
.put(companyController.updateCompany)
.get(companyController.addFilter, companyController.getCompany);

router
.route("")
.get(companyController.getAllCompanies);

module.exports = router;