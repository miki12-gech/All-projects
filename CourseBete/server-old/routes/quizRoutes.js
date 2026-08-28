const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/authMiddleware'); 

router.get('/:lessonId', quizController.getQuiz);
router.post('/submit', auth, quizController.submitQuiz); 

module.exports = router;