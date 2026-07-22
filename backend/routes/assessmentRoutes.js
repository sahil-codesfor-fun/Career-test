const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

router.get('/tests', assessmentController.getTests);
router.get('/tests/:testId/questions', assessmentController.getQuestions);
router.post('/submit', assessmentController.submitAssessment);

module.exports = router;
