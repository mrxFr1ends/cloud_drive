import mongoose from 'mongoose';
import File from '../models/File.js';
import Folder from '../models/Folder.js';

class FileController {
    async create(req, res) {
        res.send("Create empty file: ");
    }

    async getOne(req, res) {
        res.send('Info about file: ' + req.params.id);
    }

    async update(req, res) {
        const { id, trashed, name } = req.body;
        if (!id)
            return res.status(400).send({message: 'Invalid file id'});
        if (trashed !== undefined && trashed !== false && trashed !== true)
            return res.status(400).send({message: 'Invalid trashed value'});

        const file = await File.findById(id);
        if (!file)
            return res.status(404).send({message: "File not found"});
        if (!file.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to file"});

        const parentFolder = await Folder.findById(file.parentId);
        if (parentFolder && parentFolder.trashed)
            return res.status(403).send({message: "File in trashed folder and cannot be changed"});

        if (file.trashed !== trashed && trashed !== undefined) {
            if (trashed) {
                await file.updateOne({
                    prevParentId: file.parentId,
                    parentId: req.user._id,
                    trashed: true
                });
            }
            else {
                const prevParentFolder = await Folder.findById(file.prevParentId);
                await file.updateOne({
                    parentId: prevParentFolder ? file.prevParentId : req.user._id,
                    prevParentId: null,
                    trashed: false
                });
            }
        } 

        if (name !== undefined) {
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {        
                bucketName: 'files'
            });
            await bucket.rename(file.metadata, name);
        }

        res.send(await File.findById(id).populate('metadata', '-_id -chunkSize'));
    }

    async delete(req, res) {
        const { id } = req.params;

        const file = await File.findById(id);
        if (!file)
            return res.status(404).send({message: "File not found"});
        if (!file.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to file"});

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {        
            bucketName: 'files'
        });
        await bucket.delete(file.metadata);
        await file.deleteOne();
        res.sendStatus(200);
    }
}

export default new FileController();