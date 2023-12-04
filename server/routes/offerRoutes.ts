const express = require("express");
const offerController = require("../controllers/offerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/details")
.post(authController.checkIfLoggedIn, offerController.createOffer)
.delete(authController.checkIfLoggedIn, offerController.deleteOffer)
.put(authController.checkIfLoggedIn, offerController.updateOffer)
.get(authController.checkIfLoggedIn, 
    offerController.filterApplicantFile,
    offerController.getOffer);

router
.route("")
.get(offerController.getAllOffers);

router
.route("/my-offers")
.get(authController.checkIfLoggedIn, 
    offerController.filterApplicant, 
    offerController.getAllApplicantOffers);

// leaving this here in case auth doesn't work
/* 
router.route("/details")
.post(offerController.createOffer)
.delete(offerController.deleteOffer)
.put(offerController.updateOffer);
*/

module.exports = router;