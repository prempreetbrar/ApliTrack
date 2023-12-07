"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const permissionController = require("../controllers/permissionController");
const router = express.Router();
router.route("/details")
    .post(permissionController.createPermission)
    .delete(permissionController.deletePermission);
router.route("/abilities")
    .post(permissionController.createPermissionAbility)
    .delete(permissionController.deletePermissionAbility);
module.exports = router;
