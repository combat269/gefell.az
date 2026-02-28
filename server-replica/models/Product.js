const db = require('../config/db');

/**
 * product model 
 * separating the database logic from the controller
 * using raw sql here because it's faster than using an orm
 */
class Product {
    // checking if a sku is already in the database
    static async exists(sku) {
        const query = 'SELECT id FROM products WHERE sku = $1 LIMIT 1';
        const { rows } = await db.query(query, [sku]);
        return rows.length > 0;
    }

    // getting stats for the inventory (like count per category)
    static async getInventoryStats() {
        const query = `
            SELECT 
                c.slug as category, 
                COUNT(p.id) as total_items,
                SUM(CASE WHEN p.stock_status = 'out_of_stock' THEN 1 ELSE 0 END) as out_of_stock_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            GROUP BY c.id
        `;
        const { rows } = await db.query(query);
        return rows;
    }
}

module.exports = Product;