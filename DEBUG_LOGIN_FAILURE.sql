-- Debug Login Failure - Check if SQL worked and user exists

-- Step 1: Check if user was created in auth.users table
SELECT 
    id, 
    email, 
    created_at,
    email_confirmed_at,
    confirmed_at,
    raw_user_meta_data,
    encrypted_password
FROM auth.users 
WHERE email = 'admin@propertybuddy.com';

-- Step 2: Check all users in auth.users (to see what exists)
SELECT 
    email, 
    created_at, 
    email_confirmed_at,
    confirmed_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: If no admin user exists, create a simple one
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@propertybuddy.com',
    '$2a$10$example_hash_replace_with_real_bcrypt_hash',
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"firstName": "Admin", "lastName": "User"}'
)
ON CONFLICT (email) DO NOTHING;

-- Step 4: Check if user exists after insert
SELECT 
    email, 
    created_at, 
    confirmed_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'admin@propertybuddy.com';

-- Step 5: Simple success message
SELECT 'Debug check completed - see results above' as status;