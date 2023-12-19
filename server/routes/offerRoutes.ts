const express = require("express");

const offerController = require("../controllers/offerController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("")
  .get(
    authController.checkIfLoggedIn,
    offerController.addFilterApplicant,
    offerController.addSearchCompensationResponseDeadlineStartDate,
    offerController.addSortCompensationResponseDeadlineStartDate,
    offerController.getAllOffers
  )
  .post(
    offerController.uploadOfferStorage.single("OfferFileName"),
    authController.checkIfLoggedIn,
    offerController.uploadOfferFile,
    offerController.createOffer
  )
  .delete(offerController.addFilterApplicant, offerController.deleteOffer)
  .patch(
    offerController.uploadOfferStorage.single("OfferFileName"),
    authController.checkIfLoggedIn,
    offerController.addFilterApplicant,
    offerController.uploadOfferFile,
    offerController.updateOffer
  );

module.exports = router;
