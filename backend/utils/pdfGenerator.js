const PDFDocument = require('pdfkit');

const generateResultPDF = (student, test, score, outcome, res) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Stream directly to the response
  doc.pipe(res);

  // Colors based on Geeta University palette requested
  const brandBlue = '#1c3150';
  const brandOrange = '#e33827';
  const grayText = '#4b5563';

  // --- Header ---
  doc.rect(0, 0, doc.page.width, 120).fill(brandBlue);
  
  doc.fillColor('#ffffff')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('CAREER ASSESSMENT REPORT', 50, 45, { align: 'center' });

  // --- Student Details Box ---
  doc.rect(50, 150, 495, 120)
     .lineWidth(1)
     .strokeColor('#e5e7eb')
     .stroke();

  doc.fillColor(brandBlue)
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('STUDENT INFORMATION', 70, 165);

  doc.fillColor(grayText)
     .fontSize(11)
     .font('Helvetica');

  // Left Column
  doc.text(`Name: ${student.name}`, 70, 195);
  doc.text(`Email: ${student.email}`, 70, 215);
  doc.text(`Mobile: ${student.mobile}`, 70, 235);
  
  // Right Column
  doc.text(`Test: ${test.title}`, 300, 195);
  doc.text(`School: ${student.school}`, 300, 215);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 300, 235);

  // --- Results Section ---
  doc.moveDown(4);
  
  doc.fillColor(brandOrange)
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('ASSESSMENT OUTCOME', 50, 310, { align: 'center' });

  doc.rect(150, 350, 295, 100)
     .fillAndStroke('#fef2f2', brandOrange); // Light red/orange background

  doc.fillColor(brandOrange)
     .fontSize(36)
     .font('Helvetica-Bold')
     .text(`${score}%`, 150, 370, { align: 'center', width: 295 });
  
  doc.fillColor(grayText)
     .fontSize(12)
     .font('Helvetica')
     .text('Total Score', 150, 415, { align: 'center', width: 295 });

  doc.moveDown(3);

  // Recommendation
  doc.fillColor(brandBlue)
     .fontSize(16)
     .font('Helvetica-Bold')
     .text('Recommended Career Path:', 50, 480);
     
  doc.fillColor(grayText)
     .fontSize(14)
     .font('Helvetica')
     .text(outcome, 50, 505, { lineGap: 6 });

  // --- Footer ---
  const bottomPosition = doc.page.height - 80;
  doc.rect(0, bottomPosition, doc.page.width, 80).fill(brandBlue);
  
  doc.fillColor('#ffffff')
     .fontSize(10)
     .font('Helvetica')
     .text('This is a computer-generated career assessment report based on the selected answers.', 50, bottomPosition + 35, { align: 'center' });

  // Finalize PDF file
  doc.end();
};

module.exports = { generateResultPDF };
