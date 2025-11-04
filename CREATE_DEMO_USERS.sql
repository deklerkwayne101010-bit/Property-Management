-- CREATE DEMO USERS IN SUPABASE AUTH
-- Run this in Supabase SQL Editor to create the actual demo users

-- Step 1: Create admin user in auth.users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin-user-uuid-123',
    'authenticated',
    'authenticated',
    'admin@propertybuddy.com',
    '$2a$10$YourHashedPasswordHere1234567890123456789012345678901234567890',
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"firstName":"Admin","lastName":"User","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Step 2: Create client user in auth.users table
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'client-user-uuid-123',
    'authenticated',
    'authenticated',
    'client@propertybuddy.com',
    '$2a$10$YourHashedPasswordHere1234567890123456789012345678901234567890',
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"firstName":"John","lastName":"Doe","role":"client"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Step 3: Create user profiles in public.users table (if it exists)
-- This step ensures the users table also has the profile data
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
    'admin-user-uuid-123',
    'admin@propertybuddy.com',
    'demo-password-hash',
    'admin',
    'Admin',
    'User',
    '+1234567890',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

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
    'client-user-uuid-123',
    'client@propertybuddy.com',
    'demo-password-hash',
    'client',
    'John',
    'Doe',
    '+1234567891',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify users were created
SELECT 
    'Admin user created: admin@propertybuddy.com' as status,
    'Client user created: client@propertybuddy.com' as status2,
    'Demo credentials: admin@propertybuddy.com / admin123' as credentials,
    'Demo credentials: client@propertybuddy.com / client123' as credentials2;