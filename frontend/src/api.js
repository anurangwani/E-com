import axios from "axios";
import { getUserId } from "./user";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});


export const fetchProducts = () => API.get("/products");


export const fetchCart = () =>
  API.get(`/cart?userId=${getUserId()}`);

export const addToCart = (product) =>
  API.post("/cart", {
    userId: getUserId(),
    product: product,   
    qty: 1             
  });


export const updateCartItem = (cartItemId, qty) =>
  API.patch(`/cart/${cartItemId}?userId=${getUserId()}`, { qty });


export const removeCartItem = (cartItemId) =>
  API.delete(`/cart/${cartItemId}?userId=${getUserId()}`);


export const checkout = (cartItems, name, email) =>
  API.post("/checkout", {
    userId: getUserId(),
    cartItems,
    name,
    email,
  });

export default {
  fetchProducts,
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  checkout
};
