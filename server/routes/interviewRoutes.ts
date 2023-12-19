const express = require("express");
const authController = require("../controllers/authController");
const interviewController = require("../controllers/interviewController");

const router = express.Router();

router.route("").get(interviewController.getAllInterviews);

/*
    For any route that comes after this, we will check if the user is loggedIn.
*/
router.use(authController.checkIfLoggedIn);

router
  .route("/details")
  .get(
    interviewController.addFilterInterviewID,
    interviewController.getInterview
  )
  .post(interviewController.createInterview)
  .delete(interviewController.deleteInterview)
  .patch(interviewController.updateInterview);

router
  .route("/my-interviews")
  .get(
    interviewController.addFilterApplicant,
    interviewController.addSearchStageDate,
    interviewController.addSortStageDate,
    interviewController.getAllApplicantInterviews
  );

module.exports = router;
