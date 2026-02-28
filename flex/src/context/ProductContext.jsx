"use client";

import React, { createContext, useContext } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  return (
    <ProductContext.Provider value={{}}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
