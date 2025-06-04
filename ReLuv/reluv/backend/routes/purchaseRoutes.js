const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');

// ✅ Checkout Route
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    const purchase = new Purchase({
      user: req.user.id,
      items: cart.items
    });

    await purchase.save();
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json({ msg: 'Purchase completed successfully', purchase });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 📜 Get Past Purchases
router.get('/', authMiddleware, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user.id })
      .populate('items.product')
      .sort({ purchasedAt: -1 });

    res.json(purchases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
