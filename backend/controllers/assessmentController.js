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
const { PDFDocument, rgb } = require('pdf-lib');
const PDFKitDocument = require('pdfkit');

function getCourseRecommendations(testType) {
  switch (testType) {
    case 'Non-Medical':
    case 'Engineering':
      return [
        'B.Tech (CSE, AI & ML, Data Science, Cyber Security, Quantum Computing, Electronics & Comm, Mechanical EV, Civil, AI & Robotics, Block Chain, IoT)',
        'BCA (General, AI & ML, Data Science, Cyber Security)',
        'Pharmacy',
        'BSc Agriculture',
        'B.Sc (Multimedia, Graphics & Web Designing)',
        'B.Architecture',
        'B.Design',
        'BBA AI',
        'BBA Data Science',
        'BSc Mathematics',
        'BSc Statistics'
      ];
    case 'Medical':
      return [
        'MBBS', 'BDS', 'BPT', 'Forensics Sciences', 'Nutrition & Dietetics',
        'Agriculture', 'Pharmacy', 'Food technology', 'Nursing', 'MLT',
        'AT & OT', 'Radio Imaging Technology', 'BSc Microbiology',
        'BCA Hons AI', 'BBA Hons'
      ];
    case 'Commerce':
      return [
        'BBA LLB',
        'BBA Hons (General, Digital Marketing, Business Analytics, International Accounting ACCA, HR, Import Export Management)',
        'BCom Hons', 'BCom Hons International Accounting', 'BCom Auditing and Taxation',
        'BA LLB', 'Hotel Management', 'Multimedia & Web Design', 'BBA with AI',
        'Event Management', 'Fashion Design', 'Communication Design',
        'BBA travel & Tourism', 'Interior & furniture Design'
      ];
    case 'Humanities':
    case 'Arts':
      return [
        'BA LLB', 'Psychology', 'Economics', 'Political Science', 'English',
        'Hotel Management', 'BCA Hons AI', 'BBA Hons Digital Marketing',
        'Fashion Design', 'Travel & Tourism', 'Performing Arts', 'Fine Arts',
        'TV & Film Production', 'Journalism & Mass Communication', 'Gaming',
        'Multimedia & Graphic Design'
      ];
    default:
      return [];
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
    const percentage = `${score}%`;

    const strengths = ["Analytical Thinking", "Problem Solving", "Adaptability"];
    const weaknesses = ["Time Management", "Public Speaking"];
    const nature = "You exhibit a balanced mix of creative and logical thinking, leaning towards structured environments.";

    const courseRecommendations = getCourseRecommendations(testType);

    // Step 2: The Artist (Drawing the Dynamic Pages matching the template styling)
    const pdfkitBuffer = await new Promise((resolve, reject) => {
      // Presentation size (16:9 standard, e.g., 960x540)
      const doc = new PDFKitDocument({ 
        size: [960, 540], 
        layout: 'landscape', 
        margin: 0 
      });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const brandNavy = '#0B192C';
      const brandOrange = '#F37021';
      const cardBg = '#F8FAFC';
      const white = '#FFFFFF';

      const drawHeader = (title) => {
        // Orange top strip
        doc.rect(0, 0, 960, 10).fill(brandOrange);
        // Header Banner
        doc.rect(0, 10, 960, 70).fill(brandNavy);
        doc.fillColor(white).font('Helvetica-Bold').fontSize(28).text(title, 50, 32, { width: 860, align: 'left' });
        doc.fillColor(brandOrange).font('Helvetica-Bold').fontSize(16).text('GEETA UNIVERSITY', 50, 42, { width: 860, align: 'right' });
      };

      const drawFooter = () => {
        doc.rect(0, 500, 960, 40).fill(brandNavy);
        doc.fillColor(white).font('Helvetica').fontSize(12).text('Your Path to Excellence', 50, 515, { align: 'left' });
        doc.fillColor(brandOrange).text('www.geetauniversity.edu.in', 50, 515, { align: 'right', width: 860 });
      };

      // --- PAGE 9 (Slide 9): The Reveal ---
      doc.rect(0, 0, 960, 540).fill(white);
      drawHeader('Personalized Career Assessment');

      doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(40).text(`Welcome, ${studentName}`, 50, 140, { align: 'center', width: 860 });
      doc.fillColor(brandOrange).font('Helvetica').fontSize(22).text('Here are the results of your assessment', 50, 195, { align: 'center', width: 860 });

      // Score Badge Circle
      doc.circle(480, 340, 80).fill(cardBg);
      doc.circle(480, 340, 80).lineWidth(4).stroke(brandOrange);
      doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(46).text(percentage, 400, 320, { width: 160, align: 'center' });
      doc.fillColor(brandNavy).font('Helvetica').fontSize(16).text('Overall Fit', 400, 375, { width: 160, align: 'center' });

      // Metric Blocks
      doc.roundedRect(150, 290, 200, 100, 10).fill(cardBg).lineWidth(2).stroke(brandNavy);
      doc.fillColor(brandOrange).font('Helvetica-Bold').fontSize(20).text('Profile Mapping', 160, 310, { width: 180, align: 'center' });
      doc.fillColor(brandNavy).font('Helvetica').fontSize(18).text(testType, 160, 345, { width: 180, align: 'center' });

      doc.roundedRect(610, 290, 200, 100, 10).fill(cardBg).lineWidth(2).stroke(brandNavy);
      doc.fillColor(brandOrange).font('Helvetica-Bold').fontSize(20).text('Aptitude Rating', 620, 310, { width: 180, align: 'center' });
      doc.fillColor(brandNavy).font('Helvetica').fontSize(18).text('Highly Recommended', 620, 345, { width: 180, align: 'center' });

      drawFooter();

      // --- PAGE 10 (Slide 10): Insights ---
      doc.addPage();
      doc.rect(0, 0, 960, 540).fill(white);
      drawHeader('Psychological Insights');

      // Strengths Card
      doc.roundedRect(50, 110, 410, 220, 10).fill(cardBg).lineWidth(1).stroke(brandNavy);
      doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(24).text('Key Strengths', 80, 130);
      doc.moveTo(80, 165).lineTo(430, 165).lineWidth(2).stroke(brandOrange);
      doc.font('Helvetica').fontSize(16);
      let sy = 190;
      strengths.forEach(s => {
        doc.fillColor(brandOrange).text('•', 80, sy);
        doc.fillColor(brandNavy).text(s, 100, sy);
        sy += 30;
      });

      // Growth Card
      doc.roundedRect(500, 110, 410, 220, 10).fill(cardBg).lineWidth(1).stroke(brandNavy);
      doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(24).text('Areas for Growth', 530, 130);
      doc.moveTo(530, 165).lineTo(880, 165).lineWidth(2).stroke(brandOrange);
      doc.font('Helvetica').fontSize(16);
      let wy = 190;
      weaknesses.forEach(w => {
        doc.fillColor(brandOrange).text('•', 530, wy);
        doc.fillColor(brandNavy).text(w, 550, wy);
        wy += 30;
      });

      // Nature Card
      doc.roundedRect(50, 350, 860, 120, 10).fill(cardBg).lineWidth(1).stroke(brandNavy);
      doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(24).text('Your Nature', 80, 370);
      doc.moveTo(80, 405).lineTo(880, 405).lineWidth(2).stroke(brandOrange);
      doc.fillColor(brandNavy).font('Helvetica').fontSize(18).text(nature, 80, 425, { width: 800, align: 'left', lineGap: 5 });

      drawFooter();

      // --- PAGE 11 (Slide 11): Courses ---
      doc.addPage();
      doc.rect(0, 0, 960, 540).fill(white);
      drawHeader('Recommended Pathways');

      doc.fillColor(brandNavy).font('Helvetica').fontSize(22).text(`Top Courses matching your `, 50, 110, { continued: true });
      doc.fillColor(brandOrange).font('Helvetica-Bold').text(testType).font('Helvetica').fillColor(brandNavy).text(' profile:', { continued: false });

      // Grid for courses
      let cx = 50;
      let cy = 160;
      const colWidth = 415;

      courseRecommendations.forEach((course, i) => {
        doc.roundedRect(cx, cy, colWidth, 45, 8).fill(cardBg).lineWidth(1).stroke(brandOrange);
        doc.fillColor(brandNavy).font('Helvetica-Bold').fontSize(14).text(course, cx + 15, cy + 15, { width: colWidth - 30, height: 20, lineBreak: false });

        cy += 60;
        if (cy > 400) {
          cy = 160;
          cx += 445; // move to second column
        }
      });

      // CTA Footer (instead of standard footer)
      doc.rect(0, 480, 960, 60).fill(brandOrange);
      doc.fillColor(white).font('Helvetica-Bold').fontSize(24).text('Contact Geeta University Counselors Today to Shape Your Future!', 0, 498, { align: 'center', width: 960 });

      doc.end();
    });

    // Step 3: The Merger (Appending pages as requested)
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

    let finalPdfBytes;
    if (templatePath && fs.existsSync(templatePath)) {
      const templateBytes = await fs.promises.readFile(templatePath);

      const mainDoc = await PDFDocument.load(templateBytes);
      const resultDoc = await PDFDocument.load(pdfkitBuffer);

      const copiedPages = await mainDoc.copyPages(resultDoc, resultDoc.getPageIndices());

      copiedPages.forEach((page) => {
        mainDoc.addPage(page);
      });

      finalPdfBytes = await mainDoc.save();
    } else {
      console.warn("Template missing, returning dynamic pages only");
      finalPdfBytes = pdfkitBuffer;
    }

    // Step 4: The Delivery
    const safeName = studentName.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}_Geeta_University_Result.pdf"`);

    return res.send(Buffer.from(finalPdfBytes));

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Error processing assessment submission' });
  }
};
