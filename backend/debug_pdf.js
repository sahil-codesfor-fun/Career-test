const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { appendDynamicPages } = require('./utils/pdfReportGenerator');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function debug() {
  try {
    const newStudent = { id: 999, name: 'Debug User' };
    const test = await prisma.test.findUnique({ where: { id: 2 } }); // Commerce
    console.log('Test found:', test.title);

    const existingPdfBytes = fs.readFileSync(test.pdfTemplatePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    console.log('Appending dynamic pages...');
    const finalPdfDoc = await appendDynamicPages(pdfDoc, newStudent, test.title, 85);

    const pdfBytes = await finalPdfDoc.save();
    fs.writeFileSync('debug_report.pdf', pdfBytes);
    console.log('Saved debug_report.pdf successfully');
  } catch(e) {
    console.error('DEBUG ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
debug();
