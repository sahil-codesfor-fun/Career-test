const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateResultPDF } = require('../utils/pdfGenerator');

exports.getTests = async (req, res) => {
  try {
    const tests = await prisma.test.findMany({
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
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

function getRecommendedCourses(testType) {
  switch (testType) {
    case 'Non-Medical':
    case 'Engineering':
      return [
        'B.Tech (CSE, AI & ML, Data Science)',
        'BCA (General, Cyber Security)',
        'B.Architecture',
        'B.Design',
        'BBA AI',
        'BSc Mathematics'
      ];
    case 'Medical':
      return [
        'MBBS & BDS',
        'BPT & Nursing',
        'Pharmacy',
        'Nutrition & Dietetics',
        'Agriculture',
        'Forensics Sciences'
      ];
    case 'Commerce':
      return [
        'BBA Hons (Digital Marketing, HR)',
        'BCom Hons International Accounting',
        'BA/BBA LLB',
        'Hotel Management',
        'Event Management',
        'Business Analytics'
      ];
    case 'Humanities':
    case 'Arts':
      return [
        'BA LLB',
        'Psychology',
        'Economics',
        'Journalism & Mass Communication',
        'Fashion Design',
        'Fine Arts & Performing Arts'
      ];
    default:
      return [
        'BCA (General, AI & ML)',
        'BBA Hons',
        'BCom Hons',
        'BA LLB',
        'Hotel Management',
        'Multimedia & Graphic Design'
      ];
  }
}

exports.submitAssessment = async (req, res) => {
  try {
    const studentName = req.body.studentName || (req.body.student && req.body.student.name) || 'Student';
    const testType = req.body.stream || req.body.testType || 'General';
    const answers = req.body.answers || [];
    const testId = req.body.testId;

    // Simulate 1 second latency after he hits the submit button
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 1: The Brain (Calculation & Insights)
    const score = Math.floor(Math.random() * 41) + 60; // Dummy score between 60 and 100
    const strengths = ["Analytical Thinking", "Problem Solving", "Adaptability"];
    const weaknesses = ["Time Management", "Public Speaking"];
    const nature = "You exhibit a balanced mix of creative and logical thinking, leaning towards structured environments.";
    const courseRecommendations = getRecommendedCourses(testType).slice(0, 8);

    // Step 2: Template Loading & Dimensions Extraction
    let templatePath = null;
    const specificTemplatePath = path.join(__dirname, '..', 'templates', 'Geeta university Presentation.pdf');
    const specificUploadsPath = path.join(__dirname, '..', 'uploads', 'Geeta university Presentation template.pdf');

    if (testId) {
      const test = await prisma.test.findUnique({ where: { id: parseInt(testId) } });
      if (test && test.pdfTemplatePath && fs.existsSync(test.pdfTemplatePath)) {
        templatePath = test.pdfTemplatePath;
      }
    }

    if (!templatePath && fs.existsSync(specificTemplatePath)) templatePath = specificTemplatePath;
    if (!templatePath && fs.existsSync(specificUploadsPath)) templatePath = specificUploadsPath;

    if (!templatePath) {
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf'));
        if (files.length > 0) {
          files.sort((a, b) => fs.statSync(path.join(uploadsDir, b)).mtime.getTime() - fs.statSync(path.join(uploadsDir, a)).mtime.getTime());
          templatePath = path.join(uploadsDir, files[0]);
        }
      }
    }

    let mainDoc;
    let width = 960;
    let height = 540;

    if (templatePath && fs.existsSync(templatePath)) {
      const templateBytes = await fs.promises.readFile(templatePath);
      mainDoc = await PDFDocument.load(templateBytes);
      const pages = mainDoc.getPages();
      if (pages.length > 0) {
        const size = pages[0].getSize();
        width = size.width;
        height = size.height;
      }
    } else {
      mainDoc = await PDFDocument.create();
    }

    // Step 3: Append 3 completely blank pages with exact extracted dimensions
    const page1 = mainDoc.addPage([width, height]);
    const page2 = mainDoc.addPage([width, height]);
    const page3 = mainDoc.addPage([width, height]);

    // Step 4: The Artist (pdf-lib drawing primitives)
    const helvetica = await mainDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await mainDoc.embedFont(StandardFonts.HelveticaBold);

    const brandNavy = rgb(0.04, 0.10, 0.17);
    const brandOrange = rgb(0.95, 0.44, 0.13);
    const lightSlate = rgb(0.97, 0.98, 0.99);
    const subtleBorders = rgb(0.88, 0.91, 0.94);
    const white = rgb(1, 1, 1);

    const drawHeader = (page, title) => {
      page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: brandNavy });
      page.drawRectangle({ x: 0, y: height - 85, width, height: 5, color: brandOrange });
      page.drawText(title, { x: 50, y: height - 50, font: helveticaBold, size: 28, color: white });
    };

    // --- PAGE 1 (Slide 9): Executive Summary & Visual Score ---
    drawHeader(page1, "Personalized Career Assessment");

    const welcomeText = `Welcome, ${studentName}`;
    const welcomeWidth = helveticaBold.widthOfTextAtSize(welcomeText, 40);
    page1.drawText(welcomeText, { x: (width - welcomeWidth) / 2, y: height - 160, font: helveticaBold, size: 40, color: brandNavy });

    // Visual Chart (Progress Bar)
    const barWidth = 300;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height / 2 - 50;

    page1.drawRectangle({ x: barX, y: barY, width: barWidth, height: barHeight, color: subtleBorders });
    page1.drawRectangle({ x: barX, y: barY, width: barWidth * (score / 100), height: barHeight, color: brandOrange });
    page1.drawText(`${score}%`, { x: barX + barWidth + 15, y: barY + 4, font: helveticaBold, size: 18, color: brandNavy });

    // --- PAGE 2 (Slide 10): Psychological Insights & Profile Analysis ---
    drawHeader(page2, "Psychological Insights & Profile Analysis");

    const cardYTop = height - 140;
    const cardWidth = (width - 150) / 2;
    const cardHeight = 180;
    const card1X = 50;
    const card2X = 50 + cardWidth + 50;
    const cardYBottom = cardYTop - cardHeight;

    // Card 1 (Key Strengths)
    page2.drawRectangle({ x: card1X, y: cardYBottom, width: cardWidth, height: cardHeight, color: lightSlate, borderColor: subtleBorders, borderWidth: 1 });
    page2.drawText("Key Strengths", { x: card1X + 20, y: cardYBottom + cardHeight - 40, font: helveticaBold, size: 20, color: brandNavy });
    let sy = cardYBottom + cardHeight - 75;
    strengths.forEach(s => {
      page2.drawRectangle({ x: card1X + 20, y: sy + 4, width: 6, height: 6, color: brandOrange });
      page2.drawText(s, { x: card1X + 35, y: sy, font: helvetica, size: 14, color: brandNavy });
      sy -= 25;
    });

    // Card 2 (Areas for Growth)
    page2.drawRectangle({ x: card2X, y: cardYBottom, width: cardWidth, height: cardHeight, color: lightSlate, borderColor: subtleBorders, borderWidth: 1 });
    page2.drawText("Areas for Growth", { x: card2X + 20, y: cardYBottom + cardHeight - 40, font: helveticaBold, size: 20, color: brandNavy });
    let wy = cardYBottom + cardHeight - 75;
    weaknesses.forEach(w => {
      page2.drawRectangle({ x: card2X + 20, y: wy + 4, width: 6, height: 6, color: brandOrange });
      page2.drawText(w, { x: card2X + 35, y: wy, font: helvetica, size: 14, color: brandNavy });
      wy -= 25;
    });

    // Card 3 (Your Nature)
    const card3Y = cardYBottom - 30;
    const card3Height = 100;
    const card3YBottom = card3Y - card3Height;
    page2.drawRectangle({ x: 50, y: card3YBottom, width: width - 100, height: card3Height, color: lightSlate, borderColor: subtleBorders, borderWidth: 1 });
    page2.drawText("Your Nature", { x: 70, y: card3YBottom + card3Height - 35, font: helveticaBold, size: 20, color: brandNavy });
    page2.drawText(nature, { x: 70, y: card3YBottom + card3Height - 65, font: helvetica, size: 14, color: brandNavy });

    // --- PAGE 3 (Slide 11): Tailored Academic Roadmap ---
    drawHeader(page3, "Tailored Academic Roadmap");

    const startY = height - 160;
    const colWidth = (width - 150) / 2;
    const leftCol = 50;
    const rightCol = 50 + colWidth + 50;
    const rowHeight = 45;
    const rowSpacing = 15;

    for (let i = 0; i < courseRecommendations.length; i++) {
      const isLeft = i % 2 === 0;
      const colIndex = Math.floor(i / 2);
      const x = isLeft ? leftCol : rightCol;
      const y = startY - (colIndex * (rowHeight + rowSpacing));

      page3.drawRectangle({ x, y, width: colWidth, height: rowHeight, color: lightSlate, borderColor: subtleBorders, borderWidth: 1 });
      page3.drawRectangle({ x: x + 15, y: y + (rowHeight / 2) - 3, width: 6, height: 6, color: brandOrange });

      const cName = courseRecommendations[i];
      page3.drawText(cName.length > 55 ? cName.substring(0, 52) + "..." : cName, { x: x + 30, y: y + (rowHeight / 2) - 4, font: helveticaBold, size: 12, color: brandNavy });
    }

    // Footer
    const footerHeight = 50;
    page3.drawRectangle({ x: 0, y: 0, width, height: footerHeight, color: brandNavy });
    const footerText = "Contact Geeta University Counselors Today to Shape Your Future! | +91 92787 68000";
    const footerWidth = helveticaBold.widthOfTextAtSize(footerText, 16);
    page3.drawText(footerText, { x: (width - footerWidth) / 2, y: 18, font: helveticaBold, size: 16, color: white });

    // Step 5: The Delivery
    const finalPdfBytes = await mainDoc.save();
    const safeName = studentName.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_Geeta_University_Result.pdf"`);
    return res.send(Buffer.from(finalPdfBytes));

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Error processing assessment submission' });
  }
};
