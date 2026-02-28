const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const productController = require('../controllers/productController');

// ==============================================================================
// public routes
// these are used by the gefell.az frontend to show the products
// ==============================================================================

// get all products for the catalog page
router.get('/', productController.getAllProducts);

// get a specific product using its sku
router.get('/:sku', productController.getProductBySku);


// ==============================================================================
// admin routes
// need jwt and admin role to access these
// ==============================================================================

// add a new item to the inventory
router.post('/', verifyToken, requireAdmin, productController.createProduct);

// update existing product details
router.put('/:id', verifyToken, requireAdmin, productController.updateProduct);

// delete a product from the database
router.delete('/:id', verifyToken, requireAdmin, productController.deleteProduct);

module.exports = router;