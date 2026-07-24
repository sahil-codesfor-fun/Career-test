const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.test.findMany({orderBy: {id: 'asc'}}).then(console.log).finally(() => prisma.$disconnect());
