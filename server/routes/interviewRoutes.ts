const express = require("express");
const authController = require("../controllers/authController");
const interviewController = require("../controllers/interviewController");

const router = express.Router();
/*
    For any route that comes after this, we will check if the user is loggedIn.
*/
router.use(authController.checkIfLoggedIn);

router.route("").get(interviewController.getAllInterviews);

router
  .route("/details")
  .get(interviewController.filterID, interviewController.getInterview)
  .post(interviewController.createInterview)
  .delete(interviewController.deleteInterview)
  .patch(interviewController.updateInterview);

  router
  .route("/my-interviews")
  .get(interviewController.filterApplicant, interviewController.getAllApplicantInterviews);

module.exports = router;
