const db = require('../config/db');

// getting all active products for the website catalog
// added simple pagination so the page doesn't lag if we have many items
const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        // main query to pull products and their categories
        const query = `
            SELECT p.sku, p.title_az, p.title_en, p.title_ru, c.slug as category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE c.active = true
            ORDER BY p.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        
        // using params to keep the queries safe
        const { rows } = await db.query(query, [limit, offset]);
        
        res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error('failed to fetch inventory:', error);
        res.status(500).json({ success: false, message: 'Database query failed' });
    }
};

// adding a new product (admin dashboard only)
const createProduct = async (req, res) => {
    try {
        const { category_id, sku, title_az, description_az, technical_specs } = req.body;

        // making sure we have the basics before trying to save
        if (!sku || !title_az) {
            return res.status(400).json({ success: false, message: 'SKU and primary title are required.' });
        }

        const query = `
            INSERT INTO products (category_id, sku, title_az, description_az, technical_specs)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, sku;
        `;
        
        const values = [category_id, sku, title_az, description_az, JSON.stringify(technical_specs)];
        const { rows } = await db.query(query, values);

        res.status(201).json({ success: true, data: rows[0], message: 'Product added successfully' });
    } catch (error) {
        // error check for duplicate skus
        if (error.code === '23505') {
            return res.status(409).json({ success: false, message: 'A product with this SKU already exists.' });
        }
        console.error('error while adding product:', error);
        res.status(500).json({ success: false, message: 'Internal server error during insertion.' });
    }
};

// placeholder functions for routes we might add later
const getProductBySku = async (req, res) => { res.status(200).json({ message: "Not implemented in replica" }); };
const updateProduct = async (req, res) => { res.status(200).json({ message: "Not implemented in replica" }); };
const deleteProduct = async (req, res) => { res.status(200).json({ message: "Not implemented in replica" }); };

module.exports = {
    getAllProducts,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct
};