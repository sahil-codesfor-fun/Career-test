const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { appendDynamicPages } = require('./utils/pdfReportGenerator');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function debug() {
  try {
    const newStudent = { id: 3, name: 'Himangshu Kumar Das' };
    const existingPdfBytes = fs.readFileSync('uploads/1784878216300.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // We will NOT draw a white rectangle since the new template has no hardcoded name.
    // Instead, we will center the name in the middle of the bottom white banner.
    // Banner appears to be around Y: 50 to 150. Center X is around 250 to 300.
    
    firstPage.drawText(`Candidate: ${newStudent.name} (ID: ${newStudent.id})`, {
      x: 250,
      y: 100,
      size: 16,
      color: rgb(0, 0, 0)
    });
    
    const finalPdfDoc = await appendDynamicPages(pdfDoc, newStudent, 'Commerce', 85);
    const pdfBytes = await finalPdfDoc.save();
    
    fs.writeFileSync('test_output.pdf', pdfBytes);
    console.log('Saved test_output.pdf successfully with pages:', finalPdfDoc.getPageCount());
  } catch(e) {
    console.error('DEBUG ERROR:', e);
  } finally {
    await prisma.$disconnect();
  }
}
debug();
