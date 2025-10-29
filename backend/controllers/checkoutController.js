const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");


exports.checkout = async (req, res) => {
  try {
    const { userId, cartItems, name, email } = req.body;

    if (!userId || !cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty or user is missing" });
    }

    
    const normalizedItems = cartItems.map((i) => ({
      productId: i.productId,
      qty: i.quantity || i.qty || 1,
    }));

    let total = 0;
    for (const i of normalizedItems) {
      const prod = await Product.findById(i.productId);
      if (prod) total += prod.price * i.qty;
    }

  
    const newOrder = await Order.create({
      userId,
      items: normalizedItems,
      total,
      customerName: name,
      customerEmail: email,
      timestamp: new Date(),
    });

    await Cart.deleteMany({ userId });

   res.json({
  receipt: {
    orderId: newOrder._id,
    total,
    timestamp: newOrder.timestamp,
    name,
    email,
  }
});
  } catch (e) {
    console.error("CHECKOUT ERROR:", e);
    res.status(500).json({ message: "Checkout failed" });
  }
};
