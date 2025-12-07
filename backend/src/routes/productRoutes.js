const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, isJastiper } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, isJastiper, createProduct);
router.put('/:id', protect, isJastiper, updateProduct);
router.delete('/:id', protect, isJastiper, deleteProduct);

module.exports = router;
