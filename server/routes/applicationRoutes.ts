const express = require("express");
const applicationController = require("../controllers/applicationController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/create-application", authController.checkIfLoggedIn, applicationController.createApplication);
router.post("/create-appl-URL", applicationController.createApplicationURL);
router.post("/create-appl-category", applicationController.createApplicationCategory);

router.put("/update-application", applicationController.updateApplication);

router.delete("/delete-application", applicationController.deleteApplication);
router.delete("/delete-appl-URL", applicationController.deleteApplicationURL);
router.delete("/delete-appl-category", applicationController.deleteApplicationCategory);

router
.route("/corresponding-jobs")
.post(applicationController.createApplicationCorrespondsToJob)
.delete(applicationController.deleteApplicationCorrespondsToJob)
.patch(applicationController.updateApplicationCorrespondsToJob);

module.exports = router;