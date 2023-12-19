const express = require("express");
const applicationController = require("../controllers/applicationController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.checkIfLoggedIn);

router
  .route("")
  .get(
    applicationController.addFilterApplicant,
    applicationController.addSearchNameStatusDate,
    applicationController.addSort,
    applicationController.getAllApplications,
    applicationController.getAllApplicantApplications,
  );

router
  .route("/details")
  .get(
    applicationController.addFilterApplication,
    applicationController.getApplication
  )
  .post(applicationController.createApplication)
  .delete(applicationController.deleteApplication)
  .patch(applicationController.updateApplication);

router
  .route("/my-applications")
  .get(
    applicationController.addFilterApplicant,
    applicationController.getAllApplicantApplications
  );

router
  .route("/URL")
  .get(
    applicationController.addFilterApplication,
    applicationController.getAllApplicationURL
  )
  .post(applicationController.createApplicationURL)
  .delete(applicationController.deleteApplicationURL);

router
  .route("/category")
  .get(
    applicationController.getAllApplicationCategories
  )
  .post(applicationController.createApplicationCategory)
  .delete(applicationController.deleteApplicationCategory);

router
  .route("/submitWith")
  .post(applicationController.createApplicationSubmitWithDoc)
  .delete(applicationController.deleteApplicationSubmitWithDoc);

router
  .route("/corresponding-jobs")
  .get(applicationController.getApplicationCorrespondsToJob)
  .post(applicationController.createApplicationCorrespondsToJob)
  .delete(applicationController.deleteApplicationCorrespondsToJob)
  .patch(applicationController.updateApplicationCorrespondsToJob);

module.exports = router;
