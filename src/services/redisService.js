const db = require('../config/db');

async function cacheData(key, data, ttl = 3600) {
  try {
    const redisClient = db.getRedisClient();
    const serializedData = JSON.stringify(data);
    await redisClient.set(key, serializedData, { EX: ttl });
  } catch (error) {
    console.error(`Error in cacheData: ${error}`);
    throw error;
  }
}

async function getCachedData(key) {
  try {
    const redisClient = db.getRedisClient();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error in getCachedData: ${error}`);
    throw error;
  }
}

async function invalidateCache(key) {
  try {
    const redisClient = db.getRedisClient();
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error in invalidateCache: ${error}`);
    throw error;
  }
}

function generateCacheKey(prefix, identifier) {
  return `${prefix}:${identifier}`;
}

module.exports = {
  cacheData,
  getCachedData,
  invalidateCache,
  generateCacheKey
};
