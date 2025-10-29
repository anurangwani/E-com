const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartController");

router.get("/", cartCtrl.getCart);
router.post("/", cartCtrl.addToCart);
router.patch("/:id", cartCtrl.updateQty);
router.delete("/:id", cartCtrl.removeFromCart);

module.exports = router;
