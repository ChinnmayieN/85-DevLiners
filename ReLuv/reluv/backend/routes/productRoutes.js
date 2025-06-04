const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const authMiddleware = require('../middleware/authMiddleware'); // Middleware to verify JWT & set req.user

// Public route: Get all products with optional filters/search
router.get('/', getAllProducts);

// Public route: Get product by ID
router.get('/:id', getProductById);

// Protected route: Create a new product (user must be logged in)
router.post('/', authMiddleware, createProduct);

// Protected route: Update product (only owner can update)
router.put('/:id', authMiddleware, updateProduct);

// Protected route: Delete product (only owner can delete)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
