"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CartContext = createContext();

const API_URL = "http://localhost:4000/cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items for current user
  const fetchCart = useCallback(async () => {
    if (!user?.email) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      // Filter by user email on client side in case backend doesn't support query filtering
      const allItems = Array.isArray(response.data) ? response.data : [];
      const userItems = allItems.filter((item) => item.userEmail === user.email);
      setCartItems(userItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!user?.email) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // Check if item already exists in cart
    const existing = cartItems.find((item) => item.productId === product._id);
    if (existing) {
      // Update quantity instead
      const newQty = (existing.quantity || 1) + quantity;
      await updateQuantity(existing._id, newQty);
      toast.success(`Updated quantity for ${product.name}`);
      return;
    }

    try {
      const cartItem = {
        userEmail: user.email,
        productId: product._id,
        name: product.name,
        image: product.image || "",
        color: product.color || "",
        price: product.price || 45.0,
        quantity,
      };
      await axios.post(API_URL, cartItem);
      // Re-fetch to get the server-generated _id
      await fetchCart();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart.");
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_URL}/${cartItemId}`);
      // Remove from local state immediately
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast.error("Failed to remove item.");
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${API_URL}/${cartItemId}`, {
        quantity: newQuantity,
      });
      // Update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity.");
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await Promise.all(cartItems.map((item) => axios.delete(`${API_URL}/${item._id}`)));
      setCartItems([]);
      toast.success("Cart cleared.");
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
