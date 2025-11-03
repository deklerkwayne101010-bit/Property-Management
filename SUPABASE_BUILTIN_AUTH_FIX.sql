-- Use Supabase Built-in Auth Instead of Custom Users Table
-- This is actually BETTER than custom auth!

-- Step 1: Create admin user using Supabase's built-in auth
-- This creates user in auth.users table with all Supabase features

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
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
    '{"provider": "email", "providers": ["email"]}',
    '{"firstName": "Admin", "lastName": "User", "role": "admin", "isActive": true}',
    false,
    '',
    '',
    '',
    ''
);

-- Step 2: Verify user was created
SELECT id, email, raw_user_meta_data->>'role' as role, created_at
FROM auth.users
WHERE email = 'admin@propertybuddy.com';

-- Step 3: Success message
SELECT 'Admin user created successfully using Supabase Auth!' as status;