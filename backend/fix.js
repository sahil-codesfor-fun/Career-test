const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function fix() {
  const test1 = await prisma.test.findUnique({ where: { id: 1 }});
  
  if (test1.pdfTemplatePath) {
    await prisma.test.update({
      where: { id: 4 },
      data: { pdfTemplatePath: test1.pdfTemplatePath }
    });
    await prisma.test.update({
      where: { id: 1 },
      data: { pdfTemplatePath: null }
    });
  }
  
  await prisma.question.updateMany({
    where: { testId: 1 },
    data: { testId: 4 }
  });
  
  console.log('Fixed!');
}
fix().finally(() => prisma.$disconnect());
