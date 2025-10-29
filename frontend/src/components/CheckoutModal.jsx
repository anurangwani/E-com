import React, { useState } from "react";
import { checkout } from "../api";
import OrderSuccess from "./OrderSuccess";

export default function CheckoutModal({ items = [], total = 0, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter name and email.");
      return;
    }

    setProcessing(true);
    try {
     
      const formattedItems = items.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await checkout(formattedItems, name.trim(), email.trim());
      const data = res && res.data ? res.data : res;
      const received = data.order || data || {};
      setReceipt(received);
    } catch (e) {
      console.error("Checkout failed:", e);
      setError(
        (e.response && e.response.data && e.response.data.message) ||
          e.message ||
          "Checkout failed"
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleClose() {
    setReceipt(null);
    setName("");
    setEmail("");
    setError("");
    onClose && onClose();
  }

  return (
    <div className="modal" style={modalWrap}>
      <div className="content" style={modalBox}>
        {!receipt ? (
          <>
            <h3 style={{ marginTop: 0 }}>Checkout — ₹ {Number(total).toFixed(2)}</h3>

            <div style={{ display: "grid", gap: 8 }}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                disabled={processing}
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                disabled={processing}
              />

              {error && (
                <div style={{ color: "crimson", fontSize: 13, marginTop: 4 }}>
                  {error}
                </div>
              )}

              <div style={{ textAlign: "right", marginTop: 8 }}>
                <button
                  className="btn"
                  onClick={submit}
                  disabled={processing}
                  style={{ marginRight: 8 }}
                >
                  {processing ? "Processing..." : "Pay (mock)"}
                </button>
                <button onClick={handleClose} disabled={processing}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <OrderSuccess
           orderId={receipt.orderId || receipt.id || receipt._id}
            total={Number(receipt.total || total || 0).toFixed(2)}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}


const modalWrap = {
  position: "fixed",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.35)",
  zIndex: 9999,
  padding: 16,
};

const modalBox = {
  width: 480,
  maxWidth: "100%",
  borderRadius: 14,
  padding: 18,
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};
