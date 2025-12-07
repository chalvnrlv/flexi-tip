const express = require('express');
const {
  getJastipServices,
  getJastipService,
  createJastipService,
  updateJastipService,
  deleteJastipService,
  addRating,
} = require('../controllers/jastipController');
const { protect, isJastiper } = require('../middleware/auth');

const router = express.Router();

router.get('/', getJastipServices);
router.get('/:id', getJastipService);
router.post('/', protect, isJastiper, createJastipService);
router.put('/:id', protect, isJastiper, updateJastipService);
router.delete('/:id', protect, isJastiper, deleteJastipService);
router.post('/:id/rating', protect, addRating);

module.exports = router;
