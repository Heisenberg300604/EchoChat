import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Handle graceful shutdowns
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;