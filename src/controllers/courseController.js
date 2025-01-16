const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
    try {
        const courseData = req.body;

        // Validation basique
        if (!courseData.title || !courseData.description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        // Ajouter des timestamps
        courseData.createdAt = new Date();
        courseData.updatedAt = new Date();

        // Insérer dans MongoDB
        const result = await mongoService.insertOne('courses', courseData);

        // Mettre en cache
        const cacheKey = redisService.generateCacheKey('course', result.insertedId.toString());
        await redisService.cacheData(cacheKey, courseData);

        res.status(201).json({
            _id: result.insertedId,
            ...courseData
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
}

async function getCourse(req, res) {
    try {
        const { id } = req.params;
        const cacheKey = redisService.generateCacheKey('course', id);

        // Vérifier le cache
        const cachedCourse = await redisService.getCachedData(cacheKey);
        if (cachedCourse) {
            return res.json(cachedCourse);
        }

        // Si pas en cache, chercher dans MongoDB
        const course = await mongoService.findOneById('courses', id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Mettre en cache pour les prochaines requêtes
        await redisService.cacheData(cacheKey, course);

        res.json(course);
    } catch (error) {
        console.error('Error getting course:', error);
        res.status(500).json({ error: 'Failed to get course' });
    }
}

async function getCourseStats(req, res) {
    try {
        const db = require('../config/db').getMongoDb();
        const stats = await db.collection('courses').aggregate([
            {
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            }
        ]).toArray();

        res.json(stats[0] || { totalCourses: 0, averageRating: 0 });
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