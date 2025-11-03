# 🚀 Manual Supabase Migration Guide

## **Option 1: Run SQL in Supabase Dashboard (Recommended)**

### Step 1: Open SQL Editor
1. Go to your Supabase dashboard: https://wbjwpbaecgfnodcmheex.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Execute Migration Script
1. Copy the entire content from `supabase_migration.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute

### Step 3: Verify Success
You should see success messages:
```
status: "Property Buddy AI database schema created successfully!"
admin_login: "Admin user: admin@propertybuddy.com / admin123"
client_login: "Client user: client@propertybuddy.com / client123"
```

## **What This Script Does:**

### ✅ **Creates Complete Database Schema**
- All tables: users, properties, bookings, maintenance, etc.
- PostgreSQL enums for type safety
- Foreign key relationships
- Indexes for performance
- Automatic timestamp triggers

### ✅ **Inserts Sample Data**
- **Admin User**: admin@propertybuddy.com / admin123
- **Client User**: client@propertybuddy.com / client123  
- 3 Properties in Cape Town/Drakensberg
- Sample bookings with ZAR amounts (R22,000, R18,000, etc.)
- Maintenance schedules
- Messages between admin and client

### ✅ **Optimized for South Africa**
- ZAR currency formatting
- South African cities (Cape Town, Drakensberg)
- Realistic pricing for SA market

## **After Running the SQL Script:**

### Step 4: Update Your Application
The `.env.local` already contains your Supabase credentials, so your app is ready!

### Step 5: Test the Connection
1. **Start the development server**:
   ```bash
   cd property-buddy-ai-2025
   npm run dev
   ```

2. **Test login**:
   - Visit: http://localhost:3000/login
   - Admin: admin@propertybuddy.com / admin123
   - Client: client@propertybuddy.com / client123

### Step 6: Verify Functionality
- Navigate between admin and client dashboards
- Check that ZAR currency displays correctly
- Verify all features work with live database

## **Benefits of This Approach:**

✅ **Direct SQL Execution** - No CLI connection issues
✅ **Complete Schema** - All tables, enums, indexes, triggers
✅ **Sample Data** - Immediate testing capability  
✅ **Production Ready** - Optimized for PostgreSQL
✅ **South African Localized** - ZAR amounts, SA cities

## **Troubleshooting:**

If you get any errors during SQL execution:
1. Check that your project is active (not paused)
2. Verify the password is correct
3. Try running the script in smaller chunks
4. Check the SQL Editor for any specific error messages

**Your Property Buddy AI will then be running on production Supabase with all features intact!**