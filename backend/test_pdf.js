const fs = require('fs');

async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentData: {
          name: 'Test Student',
          phone: '1234567890',
          email: 'test@student.com',
          class: '12',
          school: 'Geeta School'
        },
        testId: 1, // Engineering
        answers: [{ questionId: 1, optionIndex: 0 }]
      })
    });
    const buffer = await res.arrayBuffer();
    fs.writeFileSync('test_report.pdf', Buffer.from(buffer));
    console.log('Saved test_report.pdf with size:', buffer.byteLength);
  } catch(e) {
    console.error(e);
  }
}
test();
