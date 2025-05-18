import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../services/productService";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");  
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser(); // Either use this variable
    if (!currentUser) {
        navigate("/login");
    }
    
    // Or remove the assignment if not needed:
    if (!getCurrentUser()) {
        navigate("/login");
    }
    }, [navigate]);

  useEffect(() => {
    // Ideally, filtering & search logic handled externally
    async function fetchProducts() {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    }
    fetchProducts();
  }, []);

  // Filtering example (Member 3 handles actual logic)
  const filteredProducts = products.filter(p => 
    (!categoryFilter || p.category === categoryFilter) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select onChange={e => setCategoryFilter(e.target.value)} value={categoryFilter}>
        <option value="">All Categories</option>
        <option value="books">Books</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        {/* Add categories as needed */}
      </select>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  );
}
