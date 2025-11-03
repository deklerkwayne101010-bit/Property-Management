# ⚡ **QUICK FIX: Get Login Working in 5 Minutes**

## **Most Likely Issue: Empty Database**

Your Supabase database probably doesn't have the demo users yet. Here's the fastest fix:

## **Option 1: Quick Database Seeding**

### **Step 1: Test Database Connection**
Visit this URL in your browser:
```
https://property-management-silk-seven.vercel.app/api/seed
```

### **Step 2: Expected Results**
- **Success**: Should show "Database seeded successfully"
- **Error**: Will show the exact problem (database connection, schema, etc.)

### **Step 3: If That Doesn't Work**

Try creating the admin user manually using your browser's network tab:

1. Go to your app: https://property-management-silk-seven.vercel.app
2. Right-click → Inspect → Network tab
3. Make a POST request to: `https://property-management-silk-seven.vercel.app/api/users`
4. With this body:
```json
{
  "email": "admin@propertybuddy.com",
  "password": "admin123",
  "role": "admin",
  "firstName": "Admin",
  "lastName": "User"
}
```

## **Option 2: Check Environment Variables**

### **Required Vercel Environment Variables:**
```
NEXTAUTH_SECRET=qBqz7hEBCuw0mpUargVN+10LpUZFtVXtSFqHHQg5rhw=
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
NEXTAUTH_URL=https://property-management-silk-seven.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

## **Option 3: Test Your Supabase Connection**

### **Quick Test:**
1. Go to your Supabase dashboard
2. Check if your tables exist (users, properties, bookings, etc.)
3. If tables are empty, that's the issue

## **Expected Demo Credentials**
Once database is working:
- **Admin**: admin@propertybuddy.com / admin123
- **Client**: client@propertybuddy.com / client123

## **What to Try First**
1. Visit `/api/seed` - This should solve 90% of issues
2. If that fails, check the error message and share it with me
3. If it works, try logging in with admin@propertybuddy.com

## **Still Having Issues?**
Share the exact error from `/api/seed` and I'll provide the specific fix!