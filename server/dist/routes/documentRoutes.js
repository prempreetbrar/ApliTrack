"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const documentController = require("../controllers/documentController");
const router = express.Router();
router.post("/create-document", documentController.createDocument);
router.delete("/delete-document", documentController.deleteDocument);
router.put("/update-document", documentController.updateDocument);
module.exports = router;
