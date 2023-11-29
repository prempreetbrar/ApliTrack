const express = require("express");
const offerController = require("../controllers/offerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/details")
.post(authController.checkIfLoggedIn, offerController.createOffer);


module.exports = router;