import React, { useEffect } from "react";
import { Card, Button } from "antd";
import confetti from "canvas-confetti";

export default function OrderSuccess({ orderId, total, timestamp, onClose }) {
  useEffect(() => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <div className="success-wrapper">
      <Card className="glass-card" bordered={false}>
        <h2 className="success-title">✅ Order Placed Successfully</h2>

        <p className="success-info"><strong>Total:</strong> ₹{total}</p>

        <p className="success-info">
          <strong>Time:</strong>{" "}
          {timestamp
            ? new Date(timestamp).toLocaleString()
            : new Date().toLocaleString()}
        </p>

        <p
          className="success-info copy-text"
          onClick={handleCopy}
          title="Click to copy"
        >
          <strong>Order ID:</strong> {orderId}
          <br />
          <small>(click to copy)</small>
        </p>

        <Button
          type="primary"
          style={{ background: "#7b3d8c", borderColor: "#7b3d8c" }} 
          className="success-btn"
          onClick={onClose || (() => (window.location.href = "/products"))}
        >
          Continue Shopping
        </Button>
      </Card>
    </div>
  );
}
