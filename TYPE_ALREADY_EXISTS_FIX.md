# 🚨 **FIX: "type already exists" Error**

## **What Happened:**
You ran the migration script but it failed partway through, leaving some database objects (like the UserRole enum) while others are missing. This creates a broken database state.

## **✅ IMMEDIATE FIX (3 steps):**

### **Step 1: Clean Database**
1. Go to Supabase Dashboard → Your Project → SQL Editor
2. Copy and paste the **`DATABASE_CLEANUP_SCRIPT.sql`** from the repository
3. Run it (this will reset everything safely)

### **Step 2: Run Migration**
4. Copy and paste the **`supabase_migration.sql`** file from the repository
5. Run it (this will create everything fresh and complete)

### **Step 3: Test**
6. Visit `/api/seed` - should show "Database seeded successfully"
7. Login with: admin@propertybuddy.com / admin123

## **🎯 Why This Works:**

The cleanup script:
- **Safely drops** all existing tables and types (ignores errors)
- **Resets database** to completely empty state
- **Prevents conflicts** when running migration

The migration script:
- **Creates fresh** database schema from scratch
- **Adds demo data** with proper relationships
- **Sets up performance** indexes and triggers

## **⚠️ Important Notes:**

1. **This will DELETE any existing data** in your database
2. **This is normal** for fixing broken migrations
3. **Your demo data will be restored** after the cleanup
4. **This is the standard way** to fix "type already exists" errors

## **🎯 Expected Result:**

After running both scripts:
- ✅ Database is clean
- ✅ Migration completes successfully  
- ✅ Demo users created
- ✅ `/api/seed` works
- ✅ Login works perfectly

This is the standard fix for partial migration failures!