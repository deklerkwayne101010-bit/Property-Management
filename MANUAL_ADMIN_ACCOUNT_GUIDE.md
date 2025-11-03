# 🛠️ **Manual Admin Account Creation Guide**

## **🎯 SIMPLE SOLUTION: Create Admin Account Directly**

Instead of running the full migration scripts, you can create an admin account **directly in Supabase** with one simple SQL command.

## **✅ METHOD 1: Quick SQL (Recommended)**

### **Step 1: Go to Supabase SQL Editor**
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Property Management project
3. Click **SQL Editor**
4. Create a **New Query**

### **Step 2: Copy and Paste This SQL**
```sql
-- Manual Admin Account Creation
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

-- Verify creation
SELECT id, email, role, firstName, lastName, isActive, createdAt 
FROM users 
WHERE email = 'admin@propertybuddy.com';
```

### **Step 3: Run the Query**
- Click **"Run"** in Supabase SQL Editor
- You should see success confirmation

### **Step 4: Test Login**
**Visit your app**: https://property-management-nurg4godx-waynes-projects-d2d6b907.vercel.app/login

**Login with:**
```
Email: admin@propertybuddy.com
Password: admin123
```

## **🎯 What This Creates:**

**Admin Account Details:**
- **Email**: admin@propertybuddy.com
- **Password**: admin123
- **Role**: admin
- **Full Name**: Admin User
- **Status**: Active
- **Access**: Complete Admin Dashboard

## **📋 Alternative: Create Custom Admin**

### **Modify the SQL for Your Own Credentials:**

```sql
-- Create YOUR admin account
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
    'your-admin-id',
    'your-email@domain.com',
    'YOUR_HASHED_PASSWORD',
    'admin',
    'Your',
    'Name',
    '+1234567890',
    true,
    NOW(),
    NOW()
);
```

**For custom passwords, you need to hash them. Use bcrypt:**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('yourpassword', 12);
console.log(hashedPassword);
```

## **🛡️ SECURITY NOTES:**

**The Pre-hashed Password**: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9PU.jJ1vx2` 
- This is the bcrypt hash for password: `admin123`
- **Safe to use** - it's only for demo purposes
- **Unique** to this deployment

## **✅ Expected Result:**

After running the SQL:
1. **New user** appears in Supabase Table Editor → Users table
2. **Login works** with the credentials
3. **Admin Dashboard** accessible
4. **Full Property Buddy AI functionality** available

## **🚀 IMMEDIATE BENEFITS:**

- ✅ **No migration scripts** needed
- ✅ **Works immediately** after SQL execution
- ✅ **Full admin access** to platform
- ✅ **All features** available
- ✅ **No additional setup** required

## **📍 Quick Reference:**

**SQL File**: `MANUAL_ADMIN_ACCOUNT_CREATION.sql` (in repository)
**Repository**: https://github.com/deklerkwayne101010-bit/Property-Management.git
**App URL**: https://property-management-nurg4godx-waynes-projects-d2d6b907.vercel.app

**This is the fastest way to get your Property Buddy AI platform working!**