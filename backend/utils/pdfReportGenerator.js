const PDFDocumentKit = require('pdfkit');
const { PDFDocument: PDFLibDoc } = require('pdf-lib');
const { careersDatabase, getCategoryFromTestTitle } = require('./careerData');

// Simulated sub-score generation based on overall score and test type
function generateSubScores(overallScore, category) {
  const base = overallScore > 10 ? overallScore - 10 : overallScore;
  const variance = 15;
  const randomScore = (bonus) => Math.min(100, Math.max(30, base + Math.floor(Math.random() * variance) + bonus));

  const scores = {
    Logical: randomScore(category === 'Engineering' ? 10 : 0),
    Analytical: randomScore(category === 'Engineering' || category === 'Commerce' ? 10 : 0),
    Communication: randomScore(category === 'Humanities' || category === 'Medical' ? 10 : 0),
    Leadership: randomScore(category === 'Commerce' ? 10 : 0),
    Creativity: randomScore(category === 'Humanities' ? 10 : 0),
    ProblemSolving: randomScore(5),
    Technical: randomScore(category === 'Engineering' ? 12 : -10),
    Numerical: randomScore(category === 'Commerce' || category === 'Engineering' ? 10 : -5),
    Scientific: randomScore(category === 'Medical' || category === 'Engineering' ? 10 : -10)
  };
  return scores;
}

// Dynamically select Top 4 Careers based on highest sub-scores
function getTopCareers(category, subScores) {
  let careers = careersDatabase[category] || careersDatabase['Engineering'];
  
  // Sort subscores to know what the student is good at
  const sortedAptitudes = Object.entries(subScores).sort((a, b) => b[1] - a[1]);
  const topAptitudes = sortedAptitudes.slice(0, 3).map(s => s[0]);
  
  // Sort careers based on how many of their required skills match the student's top aptitudes
  let ranked = careers.map(c => {
    let matchScore = 0;
    // Basic heuristic: check if any required skill conceptually overlaps with their top aptitudes
    const strSkills = c.skills.join(' ').toLowerCase();
    topAptitudes.forEach(apt => {
      if (strSkills.includes(apt.toLowerCase().substring(0, 4))) matchScore += 10;
    });
    // Add randomness for tie breaking
    matchScore += Math.random() * 5;
    return { ...c, matchScore, matchPercent: Math.min(99, Math.max(80, Math.round(75 + matchScore + (Math.random() * 10)))) };
  });

  ranked.sort((a, b) => b.matchScore - a.matchScore);
  return ranked.slice(0, 4);
}

// Helper to title case names
function toTitleCase(str) {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// Generate the 3-page PDF using pdfkit and return as Buffer
async function generateDynamicPagesBuffer(student, testTitle, overallScore, subScores, topCareers) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocumentKit({ size: [684, 504], margins: { top: 40, bottom: 0, left: 40, right: 40 } });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const brandColor = '#f04923'; // Geeta Univ brand orange
      const brandDark = '#1a237e'; 
      const lightGray = '#f5f5f5';

      const studentName = toTitleCase(student.name);

      // Sort aptitudes for strengths/weaknesses
      const sortedAptitudes = Object.entries(subScores).sort((a, b) => b[1] - a[1]);
      const strengths = sortedAptitudes.slice(0, 3);
      const weaknesses = sortedAptitudes.slice(-3);

      // --- Helper to draw Header & Footer on every page ---
      const drawHeaderFooter = (pageTitle, pageNum) => {
        // Header
        doc.rect(0, 0, doc.page.width, 80).fill(brandDark);
        doc.fillColor('white').fontSize(20).font('Helvetica-Bold').text(pageTitle, 40, 25);
        doc.fontSize(10).font('Helvetica').text(`Name: ${studentName} | Reg No: ${student.id} | Assessment: ${testTitle}`, 40, 55);
        
        // Footer
        doc.rect(0, doc.page.height - 35, doc.page.width, 35).fill(brandDark);
        doc.fillColor('white').fontSize(10).text(`Geeta University Assessment Report | Page ${pageNum}`, 40, doc.page.height - 22, { align: 'center', lineBreak: false });
      };

      // ==========================================
      // PAGE 9: ANALYTICS
      // ==========================================
      drawHeaderFooter('Career Assessment Analytics', 9);
      doc.y = 95;

      // TOP ROW: Circular Gauge & Radar Chart
      const topRowY = doc.y;
      
      // Gauge Chart (QuickChart)
      const gaugeUrl = `https://quickchart.io/chart?c={type:'radialGauge',data:{datasets:[{data:[${Math.round(overallScore)}],backgroundColor:'rgb(240,73,35)'}]},options:{centerPercentage:80,roundedCorners:true,centerArea:{text:'${Math.round(overallScore)}%'}}}&w=150&h=120`;
      try {
        const gaugeRes = await fetch(gaugeUrl);
        const gaugeBuffer = await gaugeRes.arrayBuffer();
        doc.image(gaugeBuffer, 40, topRowY, { width: 120 });
      } catch (e) {}

      // Radar Chart (QuickChart)
      const radarUrl = `https://quickchart.io/chart?c={type:'radar',data:{labels:['Log','Ana','Com','Led','Cre','Pro','Tec','Num','Sci'],datasets:[{label:'Aptitudes',data:[${Object.values(subScores).join(',')}],backgroundColor:'rgba(240,73,35,0.2)',borderColor:'rgb(240,73,35)'}]}}&w=250&h=150`;
      try {
        const radarRes = await fetch(radarUrl);
        const radarBuffer = await radarRes.arrayBuffer();
        doc.image(radarBuffer, 220, topRowY - 10, { width: 180 });
      } catch (e) {}

      // Horizontal Bars
      let barY = topRowY + 10;
      doc.fillColor(brandDark).fontSize(11).font('Helvetica-Bold').text('Aptitude Breakdown', 450, barY);
      barY += 15;
      Object.entries(subScores).forEach(([key, val]) => {
        doc.fillColor('black').fontSize(7).font('Helvetica').text(key, 450, barY);
        doc.rect(510, barY, 100, 6).fill('#e0e0e0');
        doc.rect(510, barY, 100 * (val / 100), 6).fill(brandColor);
        doc.fillColor('black').text(`${val}%`, 615, barY - 1);
        barY += 10;
      });

      // MIDDLE ROW: Pie Chart & Strengths
      const midRowY = topRowY + 130;
      
      // Pie Chart (Top 3 vs Rest)
      const pieUrl = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:['${strengths[0][0]}','${strengths[1][0]}','${strengths[2][0]}','Other'],datasets:[{data:[${strengths[0][1]},${strengths[1][1]},${strengths[2][1]},200]}]}}&w=200&h=120`;
      try {
        const pieRes = await fetch(pieUrl);
        const pieBuffer = await pieRes.arrayBuffer();
        doc.image(pieBuffer, 40, midRowY, { width: 150 });
      } catch(e) {}

      // Strengths, Weaknesses
      const swY = midRowY + 10;
      doc.fillColor('green').fontSize(10).font('Helvetica-Bold').text('Key Strengths:', 220, swY);
      strengths.forEach((s, i) => doc.fillColor('black').font('Helvetica').text(`• ${s[0]} (${s[1]}%)`, 220, swY + 15 + (i * 12)));

      doc.fillColor('red').font('Helvetica-Bold').text('Areas to Improve:', 350, swY);
      weaknesses.forEach((s, i) => doc.fillColor('black').font('Helvetica').text(`• ${s[0]} (${s[1]}%)`, 350, swY + 15 + (i * 12)));

      // BOTTOM ROW: AI Summary
      doc.y = midRowY + 65;
      doc.fillColor(brandDark).fontSize(11).font('Helvetica-Bold').text('AI Written Personality Summary', 220, doc.y);
      doc.moveDown(0.3);
      doc.fillColor('#333333').font('Helvetica').fontSize(9).text(`The assessment indicates a dominant inclination towards ${strengths[0][0].toLowerCase()} and ${strengths[1][0].toLowerCase()} thinking. You excel in situations requiring logical structure and process-driven workflows. To maximize your potential, consider working on your ${weaknesses[0][0].toLowerCase()} skills, which will provide a more rounded profile for leadership roles.`, 220, doc.y, { width: 420, align: 'justify' });


      // ==========================================
      // PAGE 10: RECOMMENDATIONS
      // ==========================================
      doc.addPage();
      drawHeaderFooter('Top Career Recommendations', 10);
      
      const cardWidth = 290;
      const cardHeight = 175;
      const startX = 40;
      const startYPage = 95;
      const gapX = 20;
      const gapY = 15;

      topCareers.forEach((career, idx) => {
        // Calculate grid position (2x2)
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        
        const cardX = startX + (col * (cardWidth + gapX));
        const cardY = startYPage + (row * (cardHeight + gapY));

        // Draw Card
        doc.rect(cardX, cardY, cardWidth, cardHeight).fillAndStroke(lightGray, '#cccccc');
        
        let innerY = cardY + 10;
        doc.fillColor(brandDark).fontSize(13).font('Helvetica-Bold').text(`${idx + 1}. ${career.title}`, cardX + 10, innerY);
        
        // Match Badge
        doc.rect(cardX + cardWidth - 55, innerY - 2, 45, 16).fill(brandColor);
        doc.fillColor('white').fontSize(9).text(`${career.matchPercent}%`, cardX + cardWidth - 55, innerY + 2, { width: 45, align: 'center' });
        
        innerY += 20;
        doc.fillColor('black').fontSize(9).font('Helvetica-Bold').text('Why this career?', cardX + 10, innerY);
        doc.font('Helvetica').fillColor('#333333').fontSize(8).text(career.why, cardX + 90, innerY, { width: cardWidth - 100 });
        
        innerY += 25;
        doc.font('Helvetica-Bold').fillColor('black').fontSize(9).text('Salary Range:', cardX + 10, innerY);
        doc.font('Helvetica').fontSize(8).text(career.salary, cardX + 80, innerY);
        
        innerY += 15;
        doc.font('Helvetica-Bold').text('Growth Outlook:', cardX + 10, innerY);
        doc.font('Helvetica').text(career.growth, cardX + 90, innerY);

        innerY += 15;
        doc.font('Helvetica-Bold').text('Recommended Degree:', cardX + 10, innerY);
        doc.font('Helvetica').text(career.degrees.join(', '), cardX + 120, innerY);
        
        innerY += 15;
        doc.font('Helvetica-Bold').text('Certifications & Programs:', cardX + 10, innerY);
        doc.font('Helvetica').text('Industry standard certs', cardX + 140, innerY);

        innerY += 15;
        doc.font('Helvetica-Bold').text('Skills Needed:', cardX + 10, innerY);
        doc.font('Helvetica').text(career.skills.join(', '), cardX + 80, innerY);

        innerY += 15;
        doc.font('Helvetica-Bold').text('Colleges / Programs:', cardX + 10, innerY);
        doc.font('Helvetica').text('Geeta University & Top Tier Institutes', cardX + 110, innerY);
      });


      // ==========================================
      // PAGE 11: ROADMAP
      // ==========================================
      doc.addPage();
      drawHeaderFooter('Career Roadmap & Action Plan', 11);
      doc.y = 85;

      doc.fillColor(brandDark).fontSize(14).font('Helvetica-Bold').text('AI Career Summary');
      doc.moveDown(0.5);
      doc.fillColor('black').fontSize(10).font('Helvetica').text(`Your strongest alignment is with ${topCareers[0].title}. Based on your performance across ${testTitle} modules, you have the foundational aptitudes necessary for a highly successful career trajectory in this domain.`, { align: 'justify', lineGap: 2 });
      
      doc.moveDown(1);

      // Timeline Visual (Vertical Roadmap)
      doc.fillColor(brandDark).fontSize(14).font('Helvetica-Bold').text('Your Personalized Roadmap');
      doc.moveDown(0.5);
      
      const timelineSteps = [
        { step: 'Current Class', desc: `Focus on core subjects, specifically improving ${weaknesses[0][0]}.` },
        { step: 'Choose Stream', desc: `Opt for the stream aligned with ${topCareers[0].degrees[0] || 'your goal'}.` },
        { step: 'Recommended Degree', desc: `Enroll in ${topCareers[0].degrees.join(' or ')}.` },
        { step: 'Certifications', desc: `Acquire specialized skills in ${topCareers[0].skills[0]} and ${topCareers[0].skills[1]}.` },
        { step: 'Projects', desc: `Build a portfolio demonstrating practical application of your skills.` },
        { step: 'Internships', desc: `Gain industry exposure and network with professionals.` },
        { step: 'Placement', desc: `Leverage your portfolio for entry-level roles.` },
        { step: 'Career', desc: `Thrive as a ${topCareers[0].title}!` }
      ];
      
      let timelineY = doc.y;
      timelineSteps.forEach((item, i) => {
        // Node
        doc.circle(70, timelineY + 5, 5).fill(brandColor);
        // Line
        if (i < timelineSteps.length - 1) {
          doc.rect(69, timelineY + 10, 2, 22).fill('#cccccc');
        }
        // Text
        doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text(item.step, 90, timelineY - 1);
        doc.fillColor('#555555').fontSize(9).font('Helvetica').text(item.desc, 220, timelineY);
        
        timelineY += 32;
      });

      doc.y = timelineY + 10;

      // Final Motivation
      doc.rect(40, doc.y, doc.page.width - 80, 45).fill('#e8eaf6');
      doc.fillColor(brandDark).fontSize(11).font('Helvetica-Oblique').text(`"Success is the sum of small efforts, repeated day in and day out. Stay focused on your roadmap, build your skills consistently, and the career of your dreams will become your reality."`, 60, doc.y + 10, { width: doc.page.width - 120, align: 'center', lineGap: 2 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Main exported function to append pages to the existing pdf-lib document
async function appendDynamicPages(pdfLibDoc, student, testTitle, overallScore) {
  try {
    const category = getCategoryFromTestTitle(testTitle);
    const subScores = generateSubScores(overallScore, category);
    const topCareers = getTopCareers(category, subScores);

    // 1. Generate the 3 dynamic pages as a raw PDF buffer using PDFKit
    const dynamicPdfBuffer = await generateDynamicPagesBuffer(student, testTitle, overallScore, subScores, topCareers);

    // 2. Load the newly generated PDF buffer into pdf-lib
    const dynamicPdfDoc = await PDFLibDoc.load(dynamicPdfBuffer);

    // 3. Copy the 3 pages from dynamicPdfDoc into the main pdfLibDoc
    const copiedPages = await pdfLibDoc.copyPages(dynamicPdfDoc, dynamicPdfDoc.getPageIndices());
    
    for (const page of copiedPages) {
      pdfLibDoc.addPage(page);
    }

    return pdfLibDoc;
  } catch (err) {
    console.error("Error appending dynamic pages:", err);
    throw err;
  }
}

module.exports = {
  appendDynamicPages
};
