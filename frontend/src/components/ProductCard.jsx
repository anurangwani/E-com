import React from "react";
import { Card, Button, Typography } from "antd";

const { Text } = Typography;

export default function ProductCard({ p, onAdd }) {
  const price = Number(p.price ?? 0) || 0;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 24,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 6px 16px rgba(123,61,140,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      bodyStyle={{ padding: 14, display: "flex", flexDirection: "column", flex: 1 }}
    >
      <img
        src={p.image || `https://picsum.photos/seed/${p._id || p.id}/400/300`}
        alt={p.name}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: 16,
          marginBottom: 12,
        }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: "#3b2a4a" }}>{p.name}</div>
        <Text style={{ color: "#6b5a74", fontSize: 13 }}>
          {(p.description || "").slice(0, 80)}...
        </Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16, color: "#7b3d8c" }}>
          ₹ {price.toFixed(2)}
        </div>
        <Button
          type="primary"
          style={{
            background: "#7b3d8c",
            borderColor: "#7b3d8c",
            borderRadius: 12,
            padding: "4px 14px",
            fontWeight: 600,
            boxShadow: "0 4px 10px rgba(123,61,140,0.18)",
          }}
          onClick={() => onAdd({ product: p })}
        >
          Add
        </Button>
      </div>
    </Card>
  );
}
