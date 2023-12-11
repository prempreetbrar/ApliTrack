const express = require("express");
const offerController = require("../controllers/offerController");
const authController = require("../controllers/authController");

const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "./uploads/offers",
  filename: function (req, file, cb) {
    fs.readdir("./uploads/offers", (err, files) => {
      const fileName =
        file.originalname.split(".")[0] +
        " - [" +
        (files.length + 1) +
        "]." +
        file.originalname.split(".")[1];
      cb(null, fileName);
    });
  },
});
const upload = multer({ storage: storage });

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
    offerController.uploadFile,
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
    offerController.uploadFile,
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
