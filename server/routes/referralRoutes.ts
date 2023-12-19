const express = require("express");
const referralController = require("../controllers/referralController");
const authController = require("../controllers/authController");

const router = express.Router();
router.use(authController.checkIfLoggedIn);

router
  .route("/details")
  .get(referralController.addFilterID, referralController.getReferral);

router
  .route("")
  .get(
    referralController.addFilterApplicantAndContact,
    referralController.getAllReferrals
  )
  .post(
    referralController.addFilterApplicantAndContact,
    referralController.createReferral
  )
  .patch(
    referralController.addFilterApplicantAndContact,
    referralController.updateReferral
  )
  .delete(
    referralController.addFilterApplicantAndContact,
    referralController.deleteReferral
  );

module.exports = router;
