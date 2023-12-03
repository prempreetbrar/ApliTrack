"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const router = express.Router();
router.route("/details")
    .post(authController.checkIfLoggedIn, adminController.createAdmin)
    .delete(authController.checkIfLoggedIn, adminController.deleteAdmin)
    .put(authController.checkIfLoggedIn, adminController.updateAdmin);
router.route("/responsibilities")
    .post(authController.checkIfLoggedIn, adminController.createAdminResp)
    .delete(authController.checkIfLoggedIn, adminController.deleteAdminResp);
router.route("/developer-specializations")
    .post(authController.checkIfLoggedIn, adminController.createDevSpec)
    .delete(authController.checkIfLoggedIn, adminController.deleteDevSpec);
router.route("/permissions")
    .post(authController.checkIfLoggedIn, adminController.createAdminHasPerm)
    .delete(authController.checkIfLoggedIn, adminController.deleteAdminHasPerm);
module.exports = router;