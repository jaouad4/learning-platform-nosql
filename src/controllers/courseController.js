const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
    try {
        const courseData = req.body;

        // Validate course data
        if (!courseData.title || !courseData.description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const course = {
            ...courseData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await mongoService.insertOne('courses', course);
        await redisService.invalidateCourseCache();

        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
}

async function getCourse(req, res) {
    try {
        const { id } = req.params;

        // Try to get from cache first
        const cachedCourse = await redisService.getCachedCourse(id);
        if (cachedCourse) {
            return res.json(cachedCourse);
        }

        // If not in cache, get from MongoDB
        const course = await mongoService.findOneById('courses', id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Cache the result
        await redisService.cacheData(`course:${id}`, course, 3600);
        res.json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ error: 'Failed to get course' });
    }
}

async function getCourseStats(req, res) {
    try {
        const stats = await mongoService.getCollectionStats('courses');
        res.json(stats);
    } catch (error) {
        console.error('Error getting course stats:', error);
        res.status(500).json({ error: 'Failed to get course statistics' });
    }
}

module.exports = {
    createCourse,
    getCourse,
    getCourseStats
};