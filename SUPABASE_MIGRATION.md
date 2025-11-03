# Supabase Migration Guide for Property Buddy AI

This guide will help you migrate your Property Buddy AI application from SQLite to Supabase PostgreSQL.

## Prerequisites
- Supabase project created (your "property management" project)
- Project running on `http://localhost:3000`
- Terminal access to the project directory

## Step 1: Get Your Supabase Credentials

From your Supabase dashboard (https://supabase.com/dashboard), navigate to your "property management" project:

1. **Project URL**: 
   - Go to Settings → API
   - Copy the "Project URL" (looks like: `https://xxxxx.supabase.co`)

2. **API Keys**:
   - Go to Settings → API
   - Copy "anon public" key
   - Copy "service_role" key (keep this secret!)

## Step 2: Update Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# NextAuth (keep existing)
NEXTAUTH_SECRET="your-nextauth-secret-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: Generate New Prisma Client

Stop the development server first, then generate the new client:

```bash
# Stop the dev server (Ctrl+C if running)
npm run db:generate
```

## Step 4: Deploy Database Schema

Push the schema to your Supabase database:

```bash
npm run db:push
```

## Step 5: Seed Database (Optional)

If you want to populate with sample data:

```bash
npm run db:seed
```

## Step 6: Start Development Server

```bash
npm run dev
```

## Migration Benefits

### ✅ **Enhanced PostgreSQL Features**
- **Proper Enums**: Instead of string arrays, now uses PostgreSQL enum types
- **Array Support**: Direct support for arrays (amenities, photos)
- **Decimal Precision**: Currency amounts use precise Decimal types
- **Indexes**: Optimized for production performance

### 🚀 **Production Ready**
- **Connection Pooling**: Supabase handles connection management
- **Scalability**: PostgreSQL can handle thousands of concurrent users
- **Real-time**: Optional real-time subscriptions for live updates
- **Backups**: Automated database backups included

### 🔒 **Security**
- **Row Level Security**: Built-in RLS policies available
- **API Security**: Encrypted connections, API rate limiting
- **User Management**: Supabase Auth integration ready

## Database Schema Changes

### Tables Created:
- `users` - Property managers and clients
- `properties` - Rental properties with location details
- `bookings` - Guest bookings with payment amounts
- `maintenance` - Cleaning and maintenance schedules
- `photo_galleries` - Property photos and inspections
- `packages` - Management fee structures
- `messages` - Communication system

### Key Improvements:
1. **Currency**: All amounts in ZAR with proper Decimal precision
2. **Arrays**: Properties use PostgreSQL arrays for amenities/photos
3. **Enums**: Status fields use proper PostgreSQL enums
4. **Relations**: Proper foreign key relationships with cascades

## Troubleshooting

### Common Issues:

1. **Connection Errors**:
   - Verify your DATABASE_URL format
   - Check your Supabase project password
   - Ensure project is not paused

2. **Permission Errors**:
   - Double-check service role key
   - Verify user has correct database permissions

3. **Schema Issues**:
   - Run `npx prisma db push --force-reset` to reset
   - Ensure no conflicting tables exist

### Getting Help:
- Check Supabase logs in dashboard
- Review Prisma migration logs
- Verify environment variable names match exactly

## Next Steps

After migration:
1. Test all functionality in both admin and client dashboards
2. Consider enabling Supabase Auth for user management
3. Set up Cloudinary integration for photo uploads
4. Deploy to Vercel or your preferred platform

Your Property Buddy AI is now ready for production with a robust PostgreSQL database!