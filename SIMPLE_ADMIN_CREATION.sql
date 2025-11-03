-- SIMPLE ADMIN CREATION - Much simpler approach
-- This creates a working admin user with proper password

-- First, let's check if any users exist
SELECT email, created_at FROM auth.users LIMIT 5;

-- Create admin user with proper Supabase password hashing
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@propertybuddy.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"firstName": "Admin", "lastName": "User", "role": "admin"}',
    false,
    '',
    '',
    '',
    ''
);

-- Verify the user was created
SELECT 'Admin user created. Check if email_confirmed_at and confirmed_at are not null.' as result;
SELECT email, email_confirmed_at, confirmed_at, created_at FROM auth.users WHERE email = 'admin@propertybuddy.com';