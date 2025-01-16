const { ObjectId } = require('mongodb');
const db = require('../config/db');

async function findOneById(collection, id) {
    try {
        const objectId = new ObjectId(id);
        return await db.getDb().collection(collection).findOne({ _id: objectId });
    } catch (error) {
        console.error(`Error finding document in ${collection}:`, error);
        throw error;
    }
}

async function insertOne(collection, document) {
    try {
        const result = await db.getDb().collection(collection).insertOne(document);
        return { ...document, _id: result.insertedId };
    } catch (error) {
        console.error(`Error inserting document into ${collection}:`, error);
        throw error;
    }
}

async function updateOne(collection, id, update) {
    try {
        const objectId = new ObjectId(id);
        return await db.getDb().collection(collection).updateOne(
            { _id: objectId },
            update
        );
    } catch (error) {
        console.error(`Error updating document in ${collection}:`, error);
        throw error;
    }
}

async function getCollectionStats(collection) {
    try {
        const stats = await db.getDb().collection(collection).stats();
        return {
            documentCount: stats.count,
            totalSize: stats.size,
            avgDocumentSize: stats.avgObjSize
        };
    } catch (error) {
        console.error(`Error getting stats for ${collection}:`, error);
        throw error;
    }
}

module.exports = {
    findOneById,
    insertOne,
    updateOne,
    getCollectionStats
};