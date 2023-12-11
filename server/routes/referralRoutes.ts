const express = require("express");
const referralController = require("../controllers/referralController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/details")

  .delete(referralController.deleteReferral)
  .put()
  .get(referralController.filterID, referralController.getReferral);

router
  .route("")
  .get(
    authController.checkIfLoggedIn,
    referralController.addFilter,
    referralController.getAllReferrals
  )
  .post(
    authController.checkIfLoggedIn,
    referralController.addFilter,
    referralController.createReferral
  )
  .patch(
    authController.checkIfLoggedIn,
    referralController.addFilter,
    referralController.updateReferral
  );

// router
//   .route("/my-referrals")
//   .get(
//     authController.checkIfLoggedIn,
//     referralController.filterApplicant,
//     referralController.getAllApplicantReferrals
//   );

module.exports = router;
