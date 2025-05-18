// src/services/productService.js
import { 
  getAllProducts as mockGetAll,
  getMyProducts as mockGetMine,
  getProductById as mockGetById,
  addProduct as mockAdd,
  updateProduct as mockUpdate,
  deleteProduct as mockDelete
} from './mock/products';

import { 
  getAllProducts as firebaseGetAll,
  getMyProducts as firebaseGetMine,
  getProductById as firebaseGetById,
  addProduct as firebaseAdd,
  updateProduct as firebaseUpdate,
  deleteProduct as firebaseDelete
} from './firebase/products';

import { BACKEND_TYPE } from '../config';

const productImpl = BACKEND_TYPE === 'firebase' ? {
  getAllProducts: firebaseGetAll,
  getMyProducts: firebaseGetMine,
  getProductById: firebaseGetById,
  addProduct: firebaseAdd,
  updateProduct: firebaseUpdate,
  deleteProduct: firebaseDelete
} : {
  getAllProducts: mockGetAll,
  getMyProducts: mockGetMine,
  getProductById: mockGetById,
  addProduct: mockAdd,
  updateProduct: mockUpdate,
  deleteProduct: mockDelete
};

export const getAllProducts = productImpl.getAllProducts;
export const getMyProducts = productImpl.getMyProducts;
export const getProductById = productImpl.getProductById;
export const addProduct = productImpl.addProduct;
export const updateProduct = productImpl.updateProduct;
export const deleteProduct = productImpl.deleteProduct;