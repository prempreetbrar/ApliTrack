const express = require("express");
const multer = require("multer");

const offerController = require("../controllers/offerController");
const authController = require("../controllers/authController");
const controllerFactory = require("../controllers/controllerFactory");

const router = express.Router();

const upload = multer({
  storage: controllerFactory.uploadStorage("./uploads/offers"),
});

router
  .route("/details")
  .post(authController.checkIfLoggedIn, offerController.createOffer)

  .put(authController.checkIfLoggedIn, offerController.updateOffer)
  .get(
    authController.checkIfLoggedIn,
    offerController.filterApplicantFile,
    offerController.getOffer
  );

router
  .route("")
  .get(
    authController.checkIfLoggedIn,
    offerController.filterApplicant,
    offerController.getAllOffers
  )
  .post(
    upload.single("OfferFileName"),
    authController.checkIfLoggedIn,
    offerController.filterApplicant,
    offerController.uploadOfferFile,
    offerController.createOffer
  )
  .delete(
    authController.checkIfLoggedIn,
    offerController.filterApplicant,
    offerController.deleteOffer
  )
  .patch(
    upload.single("OfferFileName"),
    authController.checkIfLoggedIn,
    offerController.filterApplicant,
    offerController.uploadOfferFile,
    offerController.updateOffer
  );

// router
// .route("/my-offers")
// .get(authController.checkIfLoggedIn,
//     offerController.filterApplicant,
//     offerController.getAllApplicantOffers);

// leaving this here in case auth doesn't work
/* 
router.route("/details")
.post(offerController.createOffer)
.delete(offerController.deleteOffer)
.put(offerController.updateOffer);
*/

module.exports = router;
