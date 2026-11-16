import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';

async function seedInitial() {
  const email = (process.env.OWNER_EMAIL || 'owner@singajimediclinic.com').toLowerCase().trim();
  const password = process.env.OWNER_PASSWORD || 'owner123password';
  const name = process.env.OWNER_NAME || 'Dr. Singaji';

  console.log(`Seeding Owner account for: ${email}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const owner = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      name,
      isActive: true,
      isApproved: true,
      role: 'OWNER',
    },
    create: {
      firebaseUid: `owner_${Date.now()}`,
      name,
      email,
      passwordHash: hashedPassword,
      role: 'OWNER',
      designation: 'Owner & Chief Physician / Pharmacist',
      isActive: true,
      isApproved: true,
    },
  });

  console.log('✅ Owner account seeded successfully!');
  console.log(`ID: ${owner.id}`);
  console.log(`Email: ${owner.email}`);
  console.log(`Role: ${owner.role}`);

  // Seed / update Pharmacy Profile
  console.log('Seeding Pharmacy Profile for Shri Singaji mediclinic...');
  const profile = await prisma.pharmacyProfile.upsert({
    where: { id: 'default' },
    update: {
      name: 'Shri Singaji mediclinic',
      tagline: 'Clinic & Pharmacy',
      addressLine: '78, Main Rd, Sector A, Slice 2, Aranya Nagar, Scheme 78, Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452010',
      phone: '098262 68222',
      invoiceFooter: 'Thank you for choosing Shri Singaji mediclinic!',
    },
    create: {
      id: 'default',
      name: 'Shri Singaji mediclinic',
      tagline: 'Clinic & Pharmacy',
      addressLine: '78, Main Rd, Sector A, Slice 2, Aranya Nagar, Scheme 78, Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452010',
      phone: '098262 68222',
      invoiceFooter: 'Thank you for choosing Shri Singaji mediclinic!',
    },
  });

  console.log('✅ Pharmacy Profile seeded successfully!');
  console.log(`Name: ${profile.name}`);
  console.log(`Address: ${profile.addressLine}, ${profile.city}, ${profile.state} ${profile.pincode}`);
  console.log(`Phone: ${profile.phone}`);
}

seedInitial()
  .catch((err) => {
    console.error('❌ Error seeding initial data:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
