import React, { useState, useEffect } from "react";
import { getMyProducts, deleteProduct, updateProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    async function fetchMyProducts() {
      const data = await getMyProducts();
      console.log("My products:", data);
      setProducts(data);
    }
    fetchMyProducts();
  }, []);

  async function handleDelete(id) {
    await deleteProduct(id);
    setProducts(products.filter(p => p.id !== id));
  }

  async function handleUpdate(updatedData) {
    await updateProduct(editingProduct.id, updatedData);
    setProducts(products.map(p => (p.id === editingProduct.id ? { ...p, ...updatedData } : p)));
    setEditingProduct(null);
  }

  return (
    <div>
      <h2>My Listings</h2>

      {editingProduct ? (
        <div>
          <h3>Edit Product</h3>
          <ProductForm product={editingProduct} onSubmit={handleUpdate} />
          <button onClick={() => setEditingProduct(null)}>Cancel</button>
        </div>
      ) : null}

      <div>
        {products.length === 0 && <p>No listings yet.</p>}
        {products.map(product => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => setEditingProduct(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)} style={{ marginLeft: "1rem" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
