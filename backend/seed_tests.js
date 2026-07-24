const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function seed() {
  const tests = [
    { id: 1, title: 'Engineering' },
    { id: 2, title: 'Commerce' },
    { id: 3, title: 'Medical & Life Sciences' },
    { id: 4, title: 'Humanities' },
    { id: 5, title: '10+1 / 10+2' },
    { id: 6, title: 'Diploma Courses' },
    { id: 7, title: 'Class 1st - 10th' }
  ];
  for (const t of tests) {
    await prisma.test.upsert({
      where: { id: t.id },
      update: { title: t.title },
      create: { id: t.id, title: t.title, description: '' }
    });
  }
  console.log('Seeded tests!');
}
seed().finally(() => prisma.$disconnect());
