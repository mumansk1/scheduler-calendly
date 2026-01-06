import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Check if test user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'john@doe.com' },
  });

  if (!existingUser) {
    // Create test user with admin privileges
    const hashedPassword = await bcrypt.hash('johndoe123', 12);
    
    await prisma.user.create({
      data: {
        email: 'john@doe.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Test user created successfully');
  } else {
    console.log('Test user already exists');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
