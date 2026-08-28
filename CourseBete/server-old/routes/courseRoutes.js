const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware'); 


router.get('/', auth, courseController.getAllCourses);


router.get('/:id', auth, courseController.getCourseById);


router.post('/', auth, courseController.createCourse);


router.delete('/:id', auth, courseController.deleteCourse);


router.post('/:courseId/lessons', auth, courseController.addLesson);
module.exports = router;