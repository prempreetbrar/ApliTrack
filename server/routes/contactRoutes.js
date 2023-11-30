const express = require("express");
const contactController = require("../controllers/contactController");

const router = express.Router();

router.post("/details", contactController.createContact);
router.post("/emails", contactController.createContactEmail);
router.post("/phones", contactController.createContactPhone);

router.delete("/details", contactController.deleteContact);
router.delete("/phones", contactController.deleteContactPhone);
router.delete("/emails", contactController.deleteContactEmail);

router.put("/details", contactController.updateContact);

module.exports = router;