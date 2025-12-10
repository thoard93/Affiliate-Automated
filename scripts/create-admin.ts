/**
 * Create Admin User Script
 * 
 * Usage: npx ts-node scripts/create-admin.ts
 * 
 * Creates the initial admin user for the platform.
 * Credentials are taken from environment variables.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@affiliateautomated.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const name = process.env.ADMIN_NAME || 'Admin';

  console.log('🔧 Creating admin user...\n');

  try {
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists.`);
      
      // Update to admin if not already
      if (existingUser.role !== 'SUPER_ADMIN') {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { 
            role: 'SUPER_ADMIN',
            status: 'APPROVED',
          },
        });
        console.log('✅ Updated existing user to SUPER_ADMIN role.');
      }
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        status: 'APPROVED',
        emailVerified: new Date(),
      },
    });

    // Create admin profile
    await prisma.admin.create({
      data: {
        userId: user.id,
        canApproveCreators: true,
        canManageProducts: true,
        canSendNotifications: true,
        canViewAnalytics: true,
      },
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
