const express = require("express");
const applicationController = require("../controllers/applicationController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .get(
    applicationController.addFilter,
    applicationController.addFilterApplicant,
    applicationController.getAllApplications
  );

router
  .route("/details")
  .get(
    authController.checkIfLoggedIn,
    applicationController.addFilterID,
    applicationController.getApplication
  )
  .post(authController.checkIfLoggedIn, applicationController.createApplication)
  .delete(
    authController.checkIfLoggedIn,
    applicationController.deleteApplication
  )
  .patch(
    authController.checkIfLoggedIn,
    applicationController.updateApplication
  );

router
  .route("/my-applications")
  .get(
    authController.checkIfLoggedIn,
    applicationController.addFilterApplicant,
    applicationController.getAllApplicantApplications
  );

router
  .route("/URL")
  .get(
    authController.checkIfLoggedIn,
    applicationController.addFilterID,
    applicationController.getAllApplicationURL
  )
  .post(
    authController.checkIfLoggedIn,
    applicationController.createApplicationURL
  )
  .delete(
    authController.checkIfLoggedIn,
    applicationController.deleteApplicationURL
  );

router
  .route("/category")
  .get(
    authController.checkIfLoggedIn,
    applicationController.addFilter,
    applicationController.getAllApplicationCategories
  )
  .post(
    authController.checkIfLoggedIn,
    applicationController.createApplicationCategory
  )
  .delete(
    authController.checkIfLoggedIn,
    applicationController.deleteApplicationCategory
  );

router
  .route("/submitWith")
  .post(
    authController.checkIfLoggedIn,
    applicationController.createApplicationSubmitWithDoc
  )
  .delete(
    authController.checkIfLoggedIn,
    applicationController.deleteApplicationSubmitWithDoc
  );

router
  .route("/corresponding-jobs")
  .get(applicationController.getApplicationCorrespondsToJob)
  .post(applicationController.createApplicationCorrespondsToJob)
  .delete(applicationController.deleteApplicationCorrespondsToJob)
  .patch(applicationController.updateApplicationCorrespondsToJob);

module.exports = router;
