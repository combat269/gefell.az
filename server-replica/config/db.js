const { Pool } = require('pg');

// Setting up the pool for postgres
// Using a pool is better for handling multiple requests at once
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL might be needed for production databases like Supabase or AWS
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // max number of connections we allow
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// basic error handling for the idle clients
pool.on('error', (err, client) => {
    console.error('Database connection error on idle client:', err);
    process.exit(-1);
});

module.exports = {
    // helper function for single queries
    query: (text, params) => pool.query(text, params),
    // export the pool if we need it for something more complex like transactions
    pool 
};