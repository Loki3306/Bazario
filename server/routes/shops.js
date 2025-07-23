const express = require('express');
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getMyShops
} = require('../controllers/shopController');
const { auth, requireMerchant } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/merchant/my-shops', auth, requireMerchant, getMyShops); // Moved this up
router.get('/', getShops);
router.get('/:id', getShop);

// Protected routes (merchants only)
router.post('/', auth, requireMerchant, createShop);
router.put('/:id', auth, requireMerchant, updateShop);
router.delete('/:id', auth, requireMerchant, deleteShop);

module.exports = router;
