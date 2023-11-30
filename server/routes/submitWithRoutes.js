const express = require("express");
const submitWithController = require("../controllers/submitWithController");

const router = express.Router();

router.post("/create-submitWith", submitWithController.createSubmitWith);
router.delete("/delete-submitWith", submitWithController.deleteSubmitWith);

module.exports = router;