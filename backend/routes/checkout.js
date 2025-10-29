const express = require("express");
const router = express.Router();
const checkoutCtrl = require("../controllers/checkoutController");

router.post("/", checkoutCtrl.checkout);

module.exports = router;
