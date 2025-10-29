const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

function extractProductFromBody(body) {
 
  if (body.product) {
   
    if (body.product.product) return body.product.product;
    return body.product;
  }
  if (body.productId) {
    
    return { _id: String(body.productId) }; 
  }
  return null;
}


exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const items = await Cart.find({ userId }).lean();

    const formatted = items.map(it => {
      
      const product = it.product && it.product.product ? it.product.product : it.product;
      return {
        _id: it._id,
        product,
        qty: it.qty
      };
    });

    const total = formatted.reduce((sum, it) => {
      const price = Number(it.product && it.product.price ? it.product.price : 0);
      return sum + price * it.qty;
    }, 0);

    res.json({ items: formatted, total });
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const qty = typeof req.body.qty !== "undefined" ? Number(req.body.qty) : (typeof req.body.quantity !== "undefined" ? Number(req.body.quantity) : 1);

    const product = extractProductFromBody(req.body);
    if (!userId || !product) return res.status(400).json({ message: "userId & product required" });

   
    let existing = null;
    if (product._id) {
      existing = await Cart.findOne({ userId, "product._id": String(product._id) });
    } else {
      existing = await Cart.findOne({ userId, "product.name": product.name });
    }

    if (existing) {
      existing.qty = (existing.qty || 0) + (qty || 1);
      await existing.save();
      return res.json(existing);
    }

    const newItem = await Cart.create({ userId, product, qty: qty || 1 });
    return res.status(201).json(newItem);
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: "Add to cart failed" });
  }
};

exports.updateQty = async (req, res) => {
  try {
    const { userId } = req.query;
    const { qty } = req.body;
    const cartId = req.params.id;

    if (!userId) return res.status(400).json({ message: "userId required" });
    if (!qty || qty < 1) return res.status(400).json({ message: "qty required and must be >=1" });

    const updated = await Cart.findOneAndUpdate({ _id: cartId, userId }, { qty }, { new: true });
    if (!updated) return res.status(404).json({ message: "Cart item not found" });
    res.json(updated);
  } catch (err) {
    console.error("UPDATE QTY ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId } = req.query;
    const cartId = req.params.id;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const deleted = await Cart.findOneAndDelete({ _id: cartId, userId });
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ message: "Remove failed" });
  }
};
