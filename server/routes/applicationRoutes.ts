const express = require("express");
const applicationController = require("../controllers/applicationController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/details")
.post(authController.checkIfLoggedIn, applicationController.createApplication)
.delete(authController.checkIfLoggedIn, applicationController.deleteApplication)
.put(authController.checkIfLoggedIn, applicationController.updateApplication);

router.route("/URL")
.post(authController.checkIfLoggedIn, applicationController.createApplicationURL)
.delete(authController.checkIfLoggedIn, applicationController.deleteApplicationURL);

router.route("/category")
.post(authController.checkIfLoggedIn, applicationController.createApplicationCategory)
.delete(authController.checkIfLoggedIn, applicationController.deleteApplicationCategory);

router.route("/submitWith")
.post(authController.checkIfLoggedIn, applicationController.createApplicationSubmitWithDoc)
.delete(authController.checkIfLoggedIn, applicationController.deleteApplicationSubmitWithDoc);

//router.post("/create-application", authController.checkIfLoggedIn, applicationController.createApplication);
//router.post("/create-appl-URL", applicationController.createApplicationURL);
//router.post("/create-appl-category", applicationController.createApplicationCategory);

//router.put("/update-application", applicationController.updateApplication);

//router.delete("/delete-application", applicationController.deleteApplication);
//router.delete("/delete-appl-URL", applicationController.deleteApplicationURL);
//router.delete("/delete-appl-category", applicationController.deleteApplicationCategory);

module.exports = router;