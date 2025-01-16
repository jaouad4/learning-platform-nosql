const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

async function connectMongo(retries = 5, delay = 2000) {
    while (retries > 0) {
        try {
            mongoClient = new MongoClient(config.mongodb.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10
            });

            await mongoClient.connect();
            db = mongoClient.db(config.mongodb.dbName);
            console.log('MongoDB connected successfully');
            return db;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            retries -= 1;
            console.log(`Retrying MongoDB connection. Remaining attempts: ${retries}`);
            if (retries === 0) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

async function connectRedis(retries = 5, delay = 2000) {
    while (retries > 0) {
        try {
            redisClient = redis.createClient({
                url: config.redis.uri
            });

            redisClient.on('error', (err) => console.error('Redis Client Error', err));
            await redisClient.connect();

            console.log('Redis connected successfully');
            return redisClient;
        } catch (error) {
            console.error('Redis connection error:', error);
            retries -= 1;
            console.log(`Retrying Redis connection. Remaining attempts: ${retries}`);
            if (retries === 0) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

async function closeConnections() {
    if (mongoClient) await mongoClient.close();
    if (redisClient) await redisClient.quit();
    console.log('Database connections closed');
}

module.exports = {
    connectMongo,
    connectRedis,
    closeConnections,
    getMongoDb: () => db,
    getRedisClient: () => redisClient
};
