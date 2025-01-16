const db = require('../config/db');

async function cacheData(key, data, ttl = 3600) {
  try {
    const redisClient = db.getRedisClient();
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis cache error:', error);
    // Don't throw - cache errors shouldn't break the application
  }
}

async function getCachedData(key) {
  try {
    const redisClient = db.getRedisClient();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

async function getCachedCourse(courseId) {
  return await getCachedData(`course:${courseId}`);
}

async function invalidateCourseCache() {
  try {
    const redisClient = db.getRedisClient();
    const keys = await redisClient.keys('course:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis invalidation error:', error);
  }
}

module.exports = {
  cacheData,
  getCachedData,
  getCachedCourse,
  invalidateCourseCache
};