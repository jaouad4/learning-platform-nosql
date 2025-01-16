const { ObjectId } = require('mongodb');
const db = require('../config/db');

async function findOneById(collection, id) {
    try {
        const objectId = new ObjectId(id);
        return await db.getMongoDb().collection(collection).findOne({ _id: objectId });
    } catch (error) {
        console.error(`Error in findOneById: ${error}`);
        throw error;
    }
}

async function insertOne(collection, document) {
    try {
        return await db.getMongoDb().collection(collection).insertOne(document);
    } catch (error) {
        console.error(`Error in insertOne: ${error}`);
        throw error;
    }
}

async function updateOne(collection, id, update) {
    try {
        const objectId = new ObjectId(id);
        return await db.getMongoDb().collection(collection)
            .updateOne({ _id: objectId }, { $set: update });
    } catch (error) {
        console.error(`Error in updateOne: ${error}`);
        throw error;
    }
}

async function deleteOne(collection, id) {
    try {
        const objectId = new ObjectId(id);
        return await db.getMongoDb().collection(collection)
            .deleteOne({ _id: objectId });
    } catch (error) {
        console.error(`Error in deleteOne: ${error}`);
        throw error;
    }
}

module.exports = {
    findOneById,
    insertOne,
    updateOne,
    deleteOne
};