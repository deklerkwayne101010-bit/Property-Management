-- Check the actual structure of your users table
-- Run this FIRST to see what columns actually exist

-- Check users table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check if users table exists and show sample data
SELECT * FROM users LIMIT 5;