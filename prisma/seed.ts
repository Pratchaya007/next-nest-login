import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/database/generated/prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// console.log('tttttttttttttt',adapter)

const main = async () => {
  await prisma.user.createMany({
    data: [
      {
        email: 'superBell01@mail.com',
        name: 'super01',
        password: await bcrypt.hash('222222', 12),
        role: 'SUPERADMIN',
      },
      {
        email: 'superBell02@mail.com',
        name: 'super02',
        password: await bcrypt.hash('333333', 12),
        role: 'SUPERADMIN',
      },
    ],
  });
};

main().catch((error) => console.log(error))
