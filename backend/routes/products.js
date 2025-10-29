const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const axios = require("axios");

router.get("/", async (req, res) => {
  const useFake = process.env.USE_FAKESTORE === "true";
  try {
    if (useFake) {
      
      const resp = await axios.get("https://fakestoreapi.com/products?limit=10");
      const items = resp.data.map((p) => ({
        _id: String(p.id),
        name: p.title,
        price: Math.round(p.price * 100) / 100,
        image: p.image,
        description: p.description,
      }));

      return res.json(items);
    }
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get products" });
  }
});

module.exports = router;
