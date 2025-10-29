import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import { addToCart, fetchCart } from "./api";

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const nav = useNavigate();

  async function handleAdd(p) {
    console.log("PRODUCT RECEIVED IN handleAdd:", p);
    await addToCart(p);
    fetchCartCount(); 
  }

  async function fetchCartCount() {
    try {
      const res = await fetchCart();
      const items = res.data.items || [];
      const count = items.reduce((s, i) => s + i.qty, 0);
      setCartCount(count);
    } catch (e) {
      console.error("fetchCartCount", e);
    }
  }

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <>
      <header className="glass-nav">
        <div className="brand">Vibe Commerce</div>
        <nav className="nav-links">
          <Link to="/">Products</Link>
          <button className="cart-btn" onClick={() => nav("/cart")}>
            <span>Cart</span>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home onAdd={handleAdd} />} />
          <Route
            path="/cart"
            element={<CartPage onCartChange={fetchCartCount} />}
          />
        </Routes>
      </div>
    </>
  );
}
