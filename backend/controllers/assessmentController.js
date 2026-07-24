const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateResultPDF } = require('../utils/pdfGenerator');
const { appendDynamicPages } = require('../utils/pdfReportGenerator');

exports.getTests = async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
      orderBy: {
        id: 'asc'
      },
      include: {
        questions: true
      }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tests' });
  }
};

exports.getQuestions = async (req, res) => {
  const { testId } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { testId: parseInt(testId) }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
};

const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');

exports.submitAssessment = async (req, res) => {
  const { student, testId, answers } = req.body;
  
  try {
    // 1. Calculate Score
    let totalScore = 0;
    let maxScore = Object.keys(answers).length * 5; 
    Object.values(answers).forEach(answer => {
      totalScore += answer.weight || 0;
    });
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 85;

    // 2. Determine Outcome
    let outcome = "Based on your responses, you show strong potential in this discipline.";
    if (percentage > 80) outcome = "Excellent aptitude detected. Highly recommended.";

    // 3. Save Student
    const newStudent = await prisma.student.create({
      data: {
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        gender: student.gender,
        state: student.state,
        district: student.district,
        city: student.city,
        school: student.school,
        dob: student.dob,
        fatherName: student.fatherName,
        motherName: student.motherName,
        address: student.address
      }
    });

    // 4. Save Result
    const newResult = await prisma.result.create({
      data: {
        studentId: newStudent.id,
        testId: parseInt(testId),
        score: percentage,
        outcome: outcome
      }
    });

    const test = await prisma.test.findUnique({ where: { id: parseInt(testId) } });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${newStudent.name.replace(/\s+/g, '_')}_Result.pdf"`);

    if (test && test.pdfTemplatePath && fs.existsSync(test.pdfTemplatePath)) {
      // 5a. Modify Existing PDF Template
      const existingPdfBytes = fs.readFileSync(test.pdfTemplatePath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      // Helper to title case names
      const toTitleCase = (str) => {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      };
      const studentName = toTitleCase(newStudent.name);

      // Draw a white rectangle at the bottom of the first page to hide any existing static names (e.g. 'Sahil')
      firstPage.drawRectangle({
        x: 0,
        y: 0,
        width: firstPage.getWidth(),
        height: 125, 
        color: rgb(1, 1, 1) // Solid white
      });

      // Draw the student name and ID at the bottom of the first page (as per the uploaded image format)
      // The new template has a white banner at the bottom.
      firstPage.drawText(`Candidate: ${studentName}`, {
        x: 250,
        y: 100,
        size: 16,
        color: rgb(0, 0, 0)
      });
      firstPage.drawText(`ID: ${newStudent.id}`, {
        x: 250,
        y: 80,
        size: 14,
        color: rgb(0.4, 0.4, 0.4) // Gray color for ID
      });

      // 2. Truncate the original template to keep ONLY the first 8 pages (indices 0 to 7)
      const pageCount = pdfDoc.getPageCount();
      // Remove pages from the end backwards to avoid index shifting issues
      for (let i = pageCount - 1; i >= 8; i--) {
        pdfDoc.removePage(i);
      }

      // 3. Append the 3 dynamic analytics & recommendation pages
      const finalPdfDoc = await appendDynamicPages(pdfDoc, newStudent, test.title, percentage);

      const pdfBytes = await finalPdfDoc.save();
      return res.end(Buffer.from(pdfBytes));
    } else {
      // 5b. Fallback to basic pdfkit generation if no template exists
      generateResultPDF(newStudent, test || { title: 'Career Assessment' }, percentage, outcome, res);
    }
    
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: error.message || 'Error processing assessment submission' });
  }
};
