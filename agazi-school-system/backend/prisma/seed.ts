import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'mikialegetachew@agazi.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AgaziAdmin@123';

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // eslint-disable-next-line no-console
  console.log(`[seed] Ensured admin user exists: ${adminEmail}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

