-- ==============================================================================
-- gefell.az database schema replica
-- set up for window and door accessories inventory
-- ==============================================================================

-- table for admin users (jwt access)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- product categories (like door handles, window hinges)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_az VARCHAR(100) NOT NULL, -- supporting multiple languages
    name_en VARCHAR(100),
    name_ru VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

-- main products table linked to categories
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    title_az VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ru VARCHAR(255),
    description_az TEXT,
    description_en TEXT,
    description_ru TEXT,
    -- using jsonb for flexible hardware specs
    technical_specs JSONB, 
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- indexing for faster queries (handling 1000+ records)
-- ==============================================================================

-- faster category lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- quick sku search for the admin panel
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- filtering for active categories only
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);