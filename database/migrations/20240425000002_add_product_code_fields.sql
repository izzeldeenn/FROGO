-- Add code fields to developer_products table for executable products
ALTER TABLE developer_products 
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS code_type TEXT DEFAULT 'javascript' CHECK (code_type IN ('javascript', 'css', 'html')),
ADD COLUMN IF NOT EXISTS code_version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS sandbox_config JSONB DEFAULT '{}';

-- Add index for code_type
CREATE INDEX IF NOT EXISTS idx_developer_products_code_type 
ON developer_products (code_type) 
WHERE code IS NOT NULL;

-- Add comment
COMMENT ON COLUMN developer_products.code IS 'Executable code for the product (JavaScript, CSS, or HTML)';
COMMENT ON COLUMN developer_products.code_type IS 'Type of code: javascript, css, or html';
COMMENT ON COLUMN developer_products.code_version IS 'Version of the product code';
COMMENT ON COLUMN developer_products.sandbox_config IS 'Configuration for sandbox execution (permissions, limits, etc.)';
