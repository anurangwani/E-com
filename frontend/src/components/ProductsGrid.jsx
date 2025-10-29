import React from "react";
import ProductCard from "./ProductCard";

export default function ProductsGrid({ products, onAdd }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "20px",
        padding: "10px",
      }}
    >
      {products.map((p) => (
        <ProductCard key={p._id || p.id} p={p} onAdd={onAdd} />
      ))}
    </div>
  );
}
