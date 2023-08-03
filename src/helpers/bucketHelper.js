import mongoose from "mongoose";

export let Bucket = null;

export const initBucket = (db, bucketName) => {
    Bucket = new mongoose.mongo.GridFSBucket(db, { bucketName });
};
