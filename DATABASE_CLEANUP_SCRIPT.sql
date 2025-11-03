-- Database Cleanup Script
-- Run this FIRST if you get "type already exists" errors

-- Drop all existing tables (ignore errors if they don't exist)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS photo_galleries CASCADE;
DROP TABLE IF EXISTS maintenance CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all existing types (ignore errors if they don't exist)
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "BookingStatus" CASCADE;
DROP TYPE IF EXISTS "MaintenanceType" CASCADE;
DROP TYPE IF EXISTS "MaintenanceStatus" CASCADE;
DROP TYPE IF EXISTS "PackageType" CASCADE;
DROP TYPE IF EXISTS "MessageType" CASCADE;
DROP TYPE IF EXISTS "UploadType" CASCADE;

-- Drop function if it exists
DROP FUNCTION IF EXISTS update_updatedAt_column() CASCADE;

-- Success message
SELECT 'Database cleaned up successfully! Now run the supabase_migration.sql script.' as status;