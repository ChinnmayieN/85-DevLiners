import React, { useState} from "react";

export default function ProductForm({ product, onSubmit }) {
  const [title, setTitle] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(product?.price || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, description, category, price: Number(price) });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} required />

      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="">Select category</option>
        <option value="books">Books</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <label>Price</label>
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" />

      <button type="submit">Submit</button>
    </form>
  );
}
