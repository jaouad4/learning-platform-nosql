const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student routes
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudent);
router.post('/:studentId/enroll/:courseId', studentController.enrollInCourse);

module.exports = router;