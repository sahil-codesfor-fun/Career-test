const fs = require('fs');
const file = 'src/pages/Home.jsx';
let content = fs.readFileSync(file, 'utf8');

// The original pattern is: {engineeringTest?.description || "This test is not added yet, please come back later."}
// We want it to be: {engineeringTest ? (engineeringTest.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}

content = content.replace(/\{(\w+Test)\?\.description \|\| "This test is not added yet, please come back later\."\}/g,
  '{$1 ? ($1.description || "Take this assessment to discover your strengths and the best career paths for you.") : "This test is not added yet, please come back later."}');

fs.writeFileSync(file, content);
console.log('Fixed Home.jsx descriptions');
