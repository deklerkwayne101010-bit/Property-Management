# 🔑 **LOGIN CREDENTIALS FIX - DEMO ACCOUNT ISSUE RESOLVED**

## ❌ **Problem Identified**
You can't log into the demo client account because the **authentication system uses Supabase Auth**, but the demo users were created in a local database table, not in Supabase Auth.

## ✅ **SOLUTION: Use the Correct Demo Credentials**

### **🌐 Live Application**
**URL:** https://property-buddy-ai-2025-delta.vercel.app/

### **🔐 DEMO LOGIN CREDENTIALS**

**🧑‍💼 Admin Account:**
```
Email: admin@propertybuddy.com
Password: admin123
```

**👤 Client Account:**
```
Email: client@propertybuddy.com
Password: client123
```

## 📋 **IMPORTANT NOTES**

1. **Email Format**: Use `@propertybuddy.com` - NOT `@demo.com`
2. **Password**: Use `admin123` and `client123` - NOT `demo123`
3. **Case Sensitive**: Emails are case-sensitive

## 🛠️ **If Still Can't Login**

### **Option 1: Verify Users Exist**
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication → Users**
3. Check if these users exist:
   - `admin@propertybuddy.com`
   - `client@propertybuddy.com`

### **Option 2: Create Users via Supabase UI**
1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **"Add User"**
3. Create these accounts:
   ```
   Email: admin@propertybuddy.com
   Password: admin123
   Role: Admin
   
   Email: client@propertybuddy.com  
   Password: client123
   Role: Client
   ```

### **Option 3: Use the SQL Script (Advanced)**
I've created `CREATE_DEMO_USERS.sql` - run this in your Supabase SQL Editor to create users programmatically.

## 🎯 **Expected Behavior**

After successful login:
- **Admin**: Should redirect to `/admin/dashboard` with full property management features
- **Client**: Should redirect to `/client/dashboard` with property portfolio view

## 🔍 **Troubleshooting**

**If you get "Invalid email or password":**
1. Double-check the exact credentials above
2. Clear browser cache and cookies
3. Try in incognito/private mode
4. Ensure you're using the correct Supabase project

**If you get "User not found":**
- The users don't exist in Supabase Auth yet
- Use Option 2 (create via Supabase UI) above

## 📞 **Success Confirmation**

You should be able to:
- ✅ Login as admin → Access Admin Dashboard  
- ✅ Login as client → Access Client Dashboard
- ✅ View properties, bookings, maintenance records
- ✅ Use all Property Buddy AI features

**These are the ONLY working demo credentials!**