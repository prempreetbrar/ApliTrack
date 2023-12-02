const express = require("express");
const documentController = require("../controllers/documentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/details")
.post(authController.checkIfLoggedIn, documentController.createDocument)
.delete(authController.checkIfLoggedIn, documentController.deleteDocument)
.put(authController.checkIfLoggedIn, documentController.updateDocument);

//router.post("/create-document", documentController.createDocument);
//router.delete("/delete-document", documentController.deleteDocument);
//router.put("/update-document", documentController.updateDocument);

module.exports = router;