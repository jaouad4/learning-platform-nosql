const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createStudent(req, res) {
    try {
        const studentData = req.body;

        // Validate student data
        if (!studentData.name || !studentData.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const student = {
            ...studentData,
            enrolledCourses: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await mongoService.insertOne('students', student);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Failed to create student' });
    }
}

async function getStudent(req, res) {
    try {
        const { id } = req.params;
        const student = await mongoService.findOneById('students', id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error getting student:', error);
        res.status(500).json({ error: 'Failed to get student' });
    }
}

async function enrollInCourse(req, res) {
    try {
        const { studentId, courseId } = req.params;

        // Verify course exists
        const course = await mongoService.findOneById('courses', courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Update student's enrolled courses
        const result = await mongoService.updateOne('students', studentId, {
            $addToSet: { enrolledCourses: new ObjectId(courseId) }
        });

        if (!result.modifiedCount) {
            return res.status(404).json({ error: 'Student not found or already enrolled' });
        }

        res.json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
}

module.exports = {
    createStudent,
    getStudent,
    enrollInCourse
};