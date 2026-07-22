const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/submissions', adminController.getSubmissions);
router.post('/tests', adminController.createTest);
router.put('/tests/:testId', adminController.editTest);
router.delete('/tests/:testId', adminController.deleteTest);
router.post('/tests/:testId/template', upload.single('pdfTemplate'), adminController.uploadPdfTemplate);
router.post('/tests/:testId/questions', adminController.addQuestionsToTest);
router.put('/questions/:questionId', adminController.editQuestion);
router.delete('/questions/:questionId', adminController.deleteQuestion);

module.exports = router;
