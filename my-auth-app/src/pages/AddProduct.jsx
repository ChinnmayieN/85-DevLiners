import React, { useState } from "react";
import { addProduct } from '../services/productService';
import ProductForm from '../components/ProductForm';
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  async function handleSubmit(productData) {
    try {
      await addProduct(productData);
      console.log("Product added successfully");
      navigate("/mylistings");
    } catch (error) {
      alert("Failed to add product");
    }
  }

  return (
    <div>
      <h2>Add Product</h2>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
