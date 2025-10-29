import React from "react";
import ProductsGrid from "../components/ProductsGrid";

export default function Home({ onAdd }) {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ProductsGrid products={products} onAdd={onAdd} />
    </div>
  );
}
