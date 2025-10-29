import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Button,
  InputNumber,
  Popconfirm,
  Typography,
  Divider,
} from "antd";
import { fetchCart, updateCartItem, removeCartItem } from "../api";
import CheckoutModal from "./CheckoutModal";

const { Title, Text } = Typography;

export default function CartView({ onCartUpdate }) {
  const [items, setItems] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  async function refresh() {
    try {
      setShowLoading(true);
      const res = await fetchCart();
      const payloadItems = (res.data && res.data.items) || [];
      setItems(payloadItems);
      if (onCartUpdate) onCartUpdate();
    } catch (e) {
      console.error("refresh cart error:", e);
    } finally {
      setShowLoading(false);
    }
  }

  useEffect(() => {
    refresh();
   
  }, []);

  async function updateQty(cartItemId, qty) {
    try {
      await updateCartItem(cartItemId, qty);
      await refresh();
    } catch (e) {
      console.error("updateQty failed", e);
    }
  }

  async function removeItem(cartItemId) {
    try {
      await removeCartItem(cartItemId);
      await refresh();
    } catch (e) {
      console.error("remove failed", e);
    }
  }

  
  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      const product = it.product?.product || it.product || {};
      const price = Number(product.price ?? product?.price ?? 0) || 0;
      return sum + price * (Number(it.qty) || 0);
    }, 0);
  }, [items]);

  if (!items) return null;

  return (
    <div style={{ maxWidth: 980, margin: "24px auto", padding: 12 }}>
      <Title level={3} style={{ marginBottom: 12, color: "#3b2a4a" }}>
        Your Cart
      </Title>
      {showCheckout && (
        <CheckoutModal
          items={items}
          total={total}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {items.length === 0 ? (
        <Card
          style={{
            borderRadius: 24,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 6px 18px rgba(59,42,74,0.08)",
          }}
        >
          <Text type="secondary">Your cart is empty</Text>
        </Card>
      ) : (
        <>
          <div>
            {items.map((it) => {
              const product = it.product?.product || it.product || {};
              const price = Number(product.price ?? 0) || 0;

              return (
                <Card
                  key={it._id}
                  bodyStyle={{ padding: 12 }}
                  style={{
                    marginBottom: 14,
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(123,61,140,0.08)",
                    boxShadow: "0 6px 18px rgba(59,42,74,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <img
                      src={
                        product.image ||
                        `https://picsum.photos/seed/${
                          product._id || product.id
                        }/160/120`
                      }
                      alt={product.name}
                      style={{
                        width: 120,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 12,
                        boxShadow: "0 6px 14px rgba(59,42,74,0.06)",
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: "#2b2136",
                              lineHeight: 1.2,
                            }}
                          >
                            {product.name}
                          </div>
                          <div
                            style={{
                              color: "#6b5a74",
                              marginTop: 6,
                              fontSize: 13,
                            }}
                          >
                            {product.description
                              ? product.description.slice(0, 120)
                              : ""}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 16,
                              color: "#4b2e68",
                            }}
                          >
                            ₹ {price}
                          </div>
                          <div
                            style={{
                              color: "#8b7b93",
                              fontSize: 12,
                              marginTop: 6,
                            }}
                          >
                            each
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <InputNumber
                          min={1}
                          value={it.qty}
                          onChange={(v) => updateQty(it._id, v)}
                          parser={(value) => value.replace(/[^\d]/g, "")}
                          style={{
                            width: 96,
                            borderRadius: 10,
                            border: "1px solid rgba(123,61,140,0.12)",
                          }}
                        />

                        <div
                          style={{
                            marginLeft: 6,
                            color: "#6b5a74",
                            fontSize: 14,
                          }}
                        >
                          Total:{" "}
                          <span style={{ fontWeight: 700, color: "#2b2136" }}>
                            ₹ {(price * it.qty).toFixed(2)}
                          </span>
                        </div>

                        <div style={{ marginLeft: "auto" }}>
                          <Popconfirm
                            title="Remove this item?"
                            okText="Remove"
                            onConfirm={() => removeItem(it._id)}
                          >
                            <Button danger style={{ borderRadius: 10 }}>
                              Remove
                            </Button>
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <div style={{ height: 96 }} /> {/* spacing for sticky bar */}
        </>
      )}

      {/* Sticky checkout glass bar */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 20,
          width: "min(920px, calc(100% - 28px))",
          borderRadius: 20,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(123,61,140,0.09)",
          boxShadow: "0 8px 30px rgba(59,42,74,0.06)",
          padding: 18,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#6b5a74", fontSize: 14 }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#3b2a4a" }}>
              ₹ {total.toFixed(2)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Button
              onClick={() => setShowCheckout(true)}
              type="primary"
              style={{
                background: "#7b3d8c",
                borderColor: "#7b3d8c",
                borderRadius: 12,
                padding: "8px 22px",
                fontWeight: 700,
                boxShadow: "0 6px 18px rgba(123,61,140,0.18)",
              }}
            >
              Checkout
            </Button>

            <Button
              onClick={() => {
                
                refresh();
              }}
              style={{ borderRadius: 12 }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

    
      <button
        data-checkout-btn
        style={{ display: "none" }}
        onClick={() => {
          const event = new CustomEvent("openCheckout");
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
