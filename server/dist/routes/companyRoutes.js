"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const companyController = require("../controllers/companyController");
const router = express.Router();
router.post("/details", companyController.createCompany);
router.delete("/details", companyController.deleteCompany);
router.put("/details", companyController.updateCompany);
module.exports = router;
