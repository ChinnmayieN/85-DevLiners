// src/services/firebase/products.js

// Export with the exact names expected by productService.js
export const firebaseGetAll = async () => {
  throw new Error("Firebase products not implemented yet");
};

export const firebaseGetMine = async () => {
  throw new Error("Firebase products not implemented yet");
};

export const firebaseGetById = async (id) => {
  throw new Error("Firebase products not implemented yet");
};

export const firebaseAdd = async (product) => {
  throw new Error("Firebase products not implemented yet");
};

export const firebaseUpdate = async (id, updates) => {
  throw new Error("Firebase products not implemented yet");
};

export const firebaseDelete = async (id) => {
  throw new Error("Firebase products not implemented yet");
};

// Add these aliases to match the imports
export const getAllProducts = firebaseGetAll;
export const getMyProducts = firebaseGetMine;
export const getProductById = firebaseGetById;
export const addProduct = firebaseAdd;
export const updateProduct = firebaseUpdate;
export const deleteProduct = firebaseDelete;