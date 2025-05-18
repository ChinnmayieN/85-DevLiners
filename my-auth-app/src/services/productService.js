// productService.js

let PRODUCTS_KEY = "products";

// Get all products
export const getAllProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
};

// Get products for current user
export const getMyProducts = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return products.filter((p) => p.owner === currentUser.email);
};

// Add a new product
export const addProduct = (product) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    owner: currentUser.email,
  };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Get a product by ID
export const getProductById = (id) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return products.find((p) => p.id === id);
};

// Update a product
export const updateProduct = (updatedProduct) => {
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  products = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

// Delete a product
export const deleteProduct = (id) => {
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  products = products.filter((p) => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};
