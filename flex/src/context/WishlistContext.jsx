"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const WishlistContext = createContext();

const API_URL = "http://localhost:4000/wishlist";

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist items for current user
  const fetchWishlist = useCallback(async () => {
    if (!user?.email) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      // User requested to use http://localhost:4000/wishlist/:id (using user.email as id)
      const response = await axios.get(`${API_URL}/${user.email}`);
      setWishlistItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      // Handle 404 or empty list gracefully
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    if (!user?.email) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }

    if (isWishlisted(product._id)) {
      await removeFromWishlist(product._id);
      return;
    }

    try {
      const item = {
        email: user.email,
        productId: product._id,
        name: product.name,
        image: product.image || "",
        price: product.price || 45.0,
        color: product.color || "",
        tagline: product.tagline || "",
        inStock: product.inStock !== false,
      };

      const response = await axios.post(API_URL, item);
      
      // Backend likely returns MongoDB insert result { acknowledged: true, insertedId: ... }
      // We need to construct the item for state, using the new ID if available
      const addedItem = {
        ...item,
        _id: response.data.insertedId || response.data._id || Date.now().toString(),
      };

      setWishlistItems((prev) => [...prev, addedItem]);
      toast.success(`${product.name} added to wishlist!`);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("Failed to add to wishlist.");
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user?.email) return;

    // We need to find the _id of the wishlist entry, not just the productId
    // Assuming backend returns _id for the wishlist item
    // But typically we might only have productId here from the UI
    // So we search our local state to find the wishlist item ID
    const wishlistItem = wishlistItems.find(item => item.productId === productId || item._id === productId); 
    // ^ check both in case we passed the direct _id or product id

    if (!wishlistItem) return;

    // Use query param delete if backend supports it by productId, OR delete by unique _id
    // But standard JSON server usually deletes by ID. 
    // If the item in state has a database _id, we use that.
    
    try {
      // If we have a database ID for the wishlist entry, use that. 
      // If the backend expects deletion by productId + userEmail query, that's different.
      // Standard approach: DELETE /wishlist/:id
      
      const idToDelete = wishlistItem._id || wishlistItem.id;

      await axios.delete(`${API_URL}/${idToDelete}`);
      
      setWishlistItems((prev) => prev.filter((item) => item._id !== idToDelete && item.productId !== productId));
      toast.success("Removed from wishlist.");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove from wishlist.");
    }
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.productId === productId || item._id === productId);
  };

  const clearWishlist = async () => {
    if (!user?.email) return;

    // Delete all one by one (JSON server limitation usually) or specific endpoint
    // For safety/speed with standard REST, we might filter client side if backend doesn't support bulk delete
    // But let's try to clear state and assume users won't clear often.
    // If backend supports DELETE /wishlist?userEmail=... that would be great.
    // Otherwise loop delete.
    try {
      const deletePromises = wishlistItems.map(item => axios.delete(`${API_URL}/${item._id}`));
      await Promise.all(deletePromises);
      setWishlistItems([]);
      toast.success("Wishlist cleared.");
    } catch (err) {
      console.error("Error clearing wishlist:", err);
      toast.error("Failed to clear wishlist.");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
