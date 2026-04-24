const express = require("express");
const router = express.Router();
const bfhlController = require("../controllers/bfhl.controller");

router.get("/", bfhlController.getHomePage);
router.post("/bfhl", bfhlController.handleBfhlPost);

module.exports = router;
