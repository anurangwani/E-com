const mongoose = require("mongoose");
const axios = require("axios");
const Product =require("./models/Product.js"); 
const dotenv =require("dotenv");

dotenv.config();

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const resp = await axios.get("https://fakestoreapi.com/products");
    const items = resp.data.map((p) => ({
      name: p.title,
      price: Math.round(p.price * 100) / 100,
      image: p.image,
      description: p.description,
    }));

    await Product.deleteMany({});
    console.log("🗑️ Old products cleared");

    await Product.insertMany(items);
    console.log("✅ Products seeded successfully");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    mongoose.disconnect();
  }
}

seedProducts();
