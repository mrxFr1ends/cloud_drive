import File from '../models/File.js';
import { FileInTrashError, FileNotFoundError } from '../errors/index.js';
import FileService from './FileService.js';
import mongoose from 'mongoose';
import FolderService from './FolderService.js';

class FileService {
    async create(name, parentId, ownerId) { }

    async getById(id, ownerId, metadata=true) {
        const file = await File.findOne({ _id: id, ownerId });
        if (!file) throw new FileNotFoundError();
        if (metadata) await file.populate('metadata', '-_id -chunkSize');
        return file;
    }

    async getByParentId(parentId, trashed, ownerId, metadata=true) {
        const files = await File.find({ parentId, ownerId, trashed });
        if (metadata) await files.populate('metadata', '-_id -chunkSize');
        return files;
    }

    async update(id, trashed, name, ownerId) {
        const file = await this.getById(id, ownerId);

        if (trashed !== undefined && file.trashed !== trashed) {
            if (trashed) {
                file.set({
                    prevParentId: file.parentId,
                    parentId: ownerId,
                    trashed: true
                });
            }
            else {
                const prevParentFolder = await FolderService.getById(file.prevParentId).then(folder => folder).catch(_ => null);
                file.set({
                    parentId: prevParentFolder ? file.prevParentId : ownerId,
                    prevParentId: null,
                    trashed: false
                });
            }
        } 

        if (name !== undefined) {
            if (file.trashed)
                throw new FileInTrashError();
            const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {        
                bucketName: 'files'
            });
            await bucket.rename(file.metadata, name);
        }

        return await file.save();
    }

    async deleteById(id, ownerId) {
        const file = await this.getById(id, ownerId, false);
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {        
            bucketName: 'files'
        });
        await bucket.delete(file.metadata);
        await file.deleteOne();
    }
}

export default new FileService();