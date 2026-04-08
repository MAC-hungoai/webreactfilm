import { prisma } from '../libs/prismadb';

const parseAdminEmails = (): string[] => {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

async function seedUserRoles() {
  console.log('🌱 Starting user role seed...');
  
  try {
    const adminEmails = parseAdminEmails();
    
    if (adminEmails.length === 0) {
      console.log('⚠️  No admin emails configured in ADMIN_EMAILS env var');
      return;
    }

    console.log(`📧 Admin emails configured: ${adminEmails.join(', ')}`);

    // Get all users
    const allUsers = await prisma.user.findMany();
    console.log(`👥 Total users in database: ${allUsers.length}`);

    let adminCount = 0;
    let userCount = 0;

    // Update user roles based on ADMIN_EMAILS
    for (const user of allUsers) {
      if (!user.email) {
        console.log(`⏭️  Skipping user ${user.id} (no email)`);
        continue;
      }

      const email = user.email.toLowerCase();
      const shouldBeAdmin = adminEmails.includes(email);
      const newRole = shouldBeAdmin ? 'ADMIN' : 'USER';

      // Check if role needs to change
      if (user.role !== newRole) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });
        console.log(`✅ Updated ${user.email}: ${user.role} → ${newRole}`);
      } else {
        console.log(`ℹ️  ${user.email} already has role ${newRole}`);
      }

      if (newRole === 'ADMIN') {
        adminCount++;
      } else {
        userCount++;
      }
    }

    console.log(`\n📊 Role Update Summary:`);
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Regular users: ${userCount}`);
    console.log(`\n✨ Seed completed!`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedUserRoles().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
