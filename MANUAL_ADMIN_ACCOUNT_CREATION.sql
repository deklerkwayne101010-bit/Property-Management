-- Manual Admin Account Creation
-- Run this in Supabase SQL Editor to create an admin account

-- Create admin user directly
INSERT INTO users (
    id, 
    email, 
    password, 
    role, 
    firstName, 
    lastName, 
    phone, 
    isActive, 
    createdAt, 
    updatedAt
) VALUES (
    'admin-user-manual',
    'admin@propertybuddy.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9PU.jJ1vx2',
    'admin',
    'Admin',
    'User',
    '+1234567890',
    true,
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT id, email, role, firstName, lastName, isActive, createdAt 
FROM users 
WHERE email = 'admin@propertybuddy.com';

-- Success message
SELECT 'Admin account created successfully!' as status;