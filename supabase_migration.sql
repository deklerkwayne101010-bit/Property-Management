-- Property Buddy AI - Supabase Migration Script
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "UserRole" AS ENUM ('admin', 'client');
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE "MaintenanceType" AS ENUM ('cleaning', 'maintenance');
CREATE TYPE "MaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE "PackageType" AS ENUM ('flat_fee', 'percentage_per_booking', 'check_in_only');
CREATE TYPE "MessageType" AS ENUM ('general', 'maintenance_alert', 'booking_notification');
CREATE TYPE "UploadType" AS ENUM ('monthly_update', 'inspection', 'property_photos');

-- Create users table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Create properties table
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "description" TEXT,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "amenities" TEXT[],
    "photos" TEXT[],
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- Create bookings table
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- Create maintenance table
CREATE TABLE "maintenance" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" "MaintenanceType" NOT NULL DEFAULT 'maintenance',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "assignedTo" TEXT,
    "photos" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "maintenance_pkey" PRIMARY KEY ("id")
);

-- Create photo_galleries table
CREATE TABLE "photo_galleries" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "photos" TEXT[] NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadType" "UploadType" NOT NULL DEFAULT 'monthly_update',
    "month" INTEGER,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "photo_galleries_pkey" PRIMARY KEY ("id")
);

-- Create packages table
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PackageType" NOT NULL DEFAULT 'flat_fee',
    "flatFeeAmount" DECIMAL(10,2),
    "percentageRate" DECIMAL(5,2),
    "checkInFee" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- Create messages table
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "messageType" "MessageType" NOT NULL DEFAULT 'general',
    "relatedPropertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "maintenance" ADD CONSTRAINT "maintenance_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "packages" ADD CONSTRAINT "packages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "messages" ADD CONSTRAINT "messages_relatedPropertyId_fkey" FOREIGN KEY ("relatedPropertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX "properties_ownerId_idx" ON "properties"("ownerId");
CREATE INDEX "bookings_propertyId_idx" ON "bookings"("propertyId");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "bookings_checkIn_idx" ON "bookings"("checkIn");
CREATE INDEX "maintenance_propertyId_idx" ON "maintenance"("propertyId");
CREATE INDEX "maintenance_status_idx" ON "maintenance"("status");
CREATE INDEX "maintenance_scheduledDate_idx" ON "maintenance"("scheduledDate");
CREATE INDEX "messages_recipientId_idx" ON "messages"("recipientId");
CREATE INDEX "messages_isRead_idx" ON "messages"("isRead");
CREATE INDEX "photo_galleries_propertyId_idx" ON "photo_galleries"("propertyId");

-- Insert seed data
-- Create admin user
INSERT INTO "users" ("id", "email", "password", "role", "firstName", "lastName", "phone", "isActive", "createdAt", "updatedAt") VALUES 
('admin_user_123', 'admin@propertybuddy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9PU.jJ1vx2', 'admin', 'Admin', 'User', '+1234567890', true, NOW(), NOW());

-- Create client user
INSERT INTO "users" ("id", "email", "password", "role", "firstName", "lastName", "phone", "isActive", "createdAt", "updatedAt") VALUES 
('client_user_123', 'client@propertybuddy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj9PU.jJ1vx2', 'client', 'John', 'Doe', '+1234567891', true, NOW(), NOW());

-- Create properties
INSERT INTO "properties" ("id", "name", "address", "city", "country", "description", "bedrooms", "bathrooms", "maxGuests", "amenities", "photos", "ownerId", "isActive", "createdAt", "updatedAt") VALUES 
('prop1', 'Beachfront Villa', '123 Ocean Drive', 'Cape Town', 'South Africa', 'Luxury beachfront villa with stunning ocean views', 4, 3, 8, ARRAY['WiFi', 'Pool', 'Beach Access', 'Parking', 'Air Conditioning'], ARRAY['/placeholder-beachfront-1.jpg', '/placeholder-beachfront-2.jpg', '/placeholder-beachfront-3.jpg'], 'client_user_123', true, NOW(), NOW()),
('prop2', 'Mountain Cabin', '456 Drakensberg Way', 'Drakensberg', 'South Africa', 'Cozy mountain retreat with fireplace and hot tub', 3, 2, 6, ARRAY['WiFi', 'Fireplace', 'Hot Tub', 'Mountain Views', 'Kitchen'], ARRAY['/placeholder-cabin-1.jpg', '/placeholder-cabin-2.jpg'], 'client_user_123', true, NOW(), NOW()),
('prop3', 'City Apartment', '789 Cape Town CBD', 'Cape Town', 'South Africa', 'Modern apartment in the heart of the city', 2, 1, 4, ARRAY['WiFi', 'Air Conditioning', 'Gym Access', 'Concierge', 'Balcony'], ARRAY['/placeholder-city-1.jpg', '/placeholder-city-2.jpg'], 'client_user_123', true, NOW(), NOW());

-- Create bookings
INSERT INTO "bookings" ("id", "propertyId", "guestName", "guestEmail", "guestPhone", "checkIn", "checkOut", "guests", "totalAmount", "status", "notes", "createdAt", "updatedAt") VALUES 
('booking1', 'prop1', 'John Smith', 'john@example.com', '+1234567892', '2025-01-15', '2025-01-20', 4, 22000.00, 'confirmed', 'Special requests for beach equipment', NOW(), NOW()),
('booking2', 'prop2', 'Sarah Johnson', 'sarah@example.com', '+1234567893', '2025-01-18', '2025-01-25', 2, 18000.00, 'pending', 'First-time visitor to Drakensberg', NOW(), NOW()),
('booking3', 'prop3', 'Mike Davis', 'mike@example.com', '+1234567894', '2025-01-22', '2025-01-24', 1, 5500.00, 'confirmed', NULL, NOW(), NOW());

-- Create maintenance records
INSERT INTO "maintenance" ("id", "propertyId", "type", "title", "description", "scheduledDate", "status", "assignedTo", "photos", "notes", "createdAt", "updatedAt") VALUES 
('maintenance1', 'prop1', 'cleaning', 'Deep Cleaning', 'Complete deep cleaning after guest checkout', '2025-01-14', 'scheduled', 'Clean Team A', ARRAY['/inspection-1.jpg', '/inspection-2.jpg'], NULL, NOW(), NOW()),
('maintenance2', 'prop2', 'maintenance', 'HVAC Maintenance', 'Monthly HVAC system check and filter replacement', '2025-01-16', 'scheduled', 'Tech Services', ARRAY['/maintenance-1.jpg'], NULL, NOW(), NOW()),
('maintenance3', 'prop3', 'cleaning', 'Window Cleaning', 'Professional window cleaning for all windows', '2025-01-18', 'scheduled', NULL, ARRAY['/cleaning-1.jpg', '/cleaning-2.jpg'], NULL, NOW(), NOW());

-- Create package
INSERT INTO "packages" ("id", "ownerId", "name", "type", "percentageRate", "isActive", "createdAt", "updatedAt") VALUES 
('package1', 'client_user_123', 'Standard Management', 'percentage_per_booking', 15.0, true, NOW(), NOW());

-- Create messages
INSERT INTO "messages" ("id", "senderId", "recipientId", "subject", "content", "messageType", "relatedPropertyId", "createdAt") VALUES 
('message1', 'admin_user_123', 'client_user_123', 'Welcome to Property Buddy AI', 'Your account has been set up successfully. You can now manage your properties through our platform.', 'general', NULL, NOW()),
('message2', 'admin_user_123', 'client_user_123', 'New Booking Request', 'You have received a new booking request for Beachfront Villa. Please review and respond within 24 hours.', 'booking_notification', 'prop1', NOW());

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updatedAt
CREATE TRIGGER update_users_updatedAt BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
CREATE TRIGGER update_properties_updatedAt BEFORE UPDATE ON "properties" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
CREATE TRIGGER update_bookings_updatedAt BEFORE UPDATE ON "bookings" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
CREATE TRIGGER update_maintenance_updatedAt BEFORE UPDATE ON "maintenance" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
CREATE TRIGGER update_packages_updatedAt BEFORE UPDATE ON "packages" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();

-- Success message
SELECT 'Property Buddy AI database schema created successfully!' as status;
SELECT 'Admin user: admin@propertybuddy.com / admin123' as admin_login;
SELECT 'Client user: client@propertybuddy.com / client123' as client_login;