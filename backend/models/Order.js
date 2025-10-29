const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true },
      }
    ],
    total: { type: Number, required: true },
    customer: {
      name: String,
      email: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
