// src/services/mock/products.js
const PRODUCTS_KEY = "ecom_products";

export const getAllProducts = async () => {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || []);
};

export const getMyProducts = async () => {
  const currentUser = JSON.parse(localStorage.getItem("ecom_current_user"));
  if (!currentUser) return [];
  
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return products.filter(p => p.owner === currentUser.email);
};

export const getProductById = async (id) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  return products.find(p => p.id === id) || null;
};

export const addProduct = async (product) => {
  const currentUser = JSON.parse(localStorage.getItem("ecom_current_user"));
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    owner: currentUser?.email || 'demo@user.com',
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = async (id, updates) => {
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  products = products.map(p => 
    p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  );
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const deleteProduct = async (id) => {
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");
  products = products.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};