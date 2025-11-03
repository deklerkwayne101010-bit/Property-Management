-- FINAL FIX: Check what's in prisma.schema and verify user table structure
-- This will help diagnose why DATABASE_URL error persists

-- Check if there are any other prisma schema files
-- Look for any remaining PostgreSQL references in auth.ts or other files
-- The error suggests schema.prisma still has:
-- provider = "postgresql"
-- url = env("DATABASE_URL")

-- To fix this, the schema.prisma should have:
-- provider = "sqlite" 
-- url = "file:./dev.db"

-- If the file hasn't been updated yet, here's what it should contain:

-- Copy this to your prisma/schema.prisma file:
/*
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Application data only - NO user table for auth
model Property {
  id          String   @id @default(cuid())
  name        String
  address     String
  city        String
  country     String
  description String?
  bedrooms    Int
  bathrooms   Int
  maxGuests   Int
  amenities   String?   // JSON string
  photos      String?   // JSON array string
  ownerId     String    // References Supabase user ID
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  bookings     Booking[]
  maintenance  Maintenance[]
  photoGalleries PhotoGallery[]
  messages     Message[]

  @@map("properties")
}

model Booking {
  id         String   @id @default(cuid())
  propertyId String
  guestName  String
  guestEmail String
  guestPhone String?
  checkIn    DateTime
  checkOut   DateTime
  guests     Int
  totalAmount Float
  status     String   @default("pending")
  notes      String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  // Relations
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@map("bookings")
}

model Maintenance {
  id             String   @id @default(cuid())
  propertyId     String
  type           String   @default("maintenance")
  title          String
  description    String?
  scheduledDate  DateTime
  completedDate  DateTime?
  status         String   @default("scheduled")
  assignedTo     String?
  photos         String?
  notes          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  property Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@map("maintenance")
}

model PhotoGallery {
  id              String   @id @default(cuid())
  propertyId      String
  title           String
  description     String?
  photos          String
  uploadedBy      String   // Supabase user ID
  uploadType      String   @default("monthly_update")
  month           Int?
  year            Int?
  createdAt       DateTime @default(now())

  // Relations
  property  Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@map("photo_galleries")
}

model Package {
  id              String   @id @default(cuid())
  ownerId         String   // Supabase user ID
  name            String
  type            String   @default("flat_fee")
  flatFeeAmount   Float?
  percentageRate  Float?
  checkInFee      Float?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("packages")
}

model Message {
  id              String   @id @default(cuid())
  senderId        String   // Supabase user ID
  recipientId     String   // Supabase user ID
  subject         String
  content         String
  isRead          Boolean  @default(false)
  messageType     String   @default("general")
  relatedPropertyId String?
  createdAt       DateTime @default(now())

  // Relations
  sender          User         @relation("SentMessages", fields: [senderId], references: [id], onDelete: Cascade)
  recipient       User         @relation("ReceivedMessages", fields: [recipientId], references: [id], onDelete: Cascade)
  relatedProperty Property?    @relation(fields: [relatedPropertyId], references: [id])

  @@map("messages")
}
*/

-- Verify schema changes worked
SELECT 'Schema should now use SQLite, not PostgreSQL' as status;
SELECT 'No DATABASE_URL environment variable should be needed' as note;
SELECT 'Authentication should use Supabase, not Prisma' as auth_note;