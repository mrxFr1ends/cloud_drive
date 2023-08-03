import mongoose from "mongoose";
import { FileInTrashError, FileNotFoundError } from "../errors/index.js";
import File from "../models/File.js";
import FolderService from "./FolderService.js";

class FileService {
    async create(parentId, metadataId, ownerId) {
        const file = await File.create({
            parentId,
            metadata: metadataId,
            ownerId,
        });
        return file;
    }

    async getById(id, ownerId, metadata = true) {
        const file = File.findOne({ _id: id, ownerId });
        if (metadata) file.populate("metadata", "-_id -chunkSize");
        if (!(await file)) throw new FileNotFoundError();
        return file;
    }

    async getByParentId(parentId, ownerId, trashed = false, metadata = true) {
        const query = { parentId, ownerId };
        if (trashed) query[trashed] = true;

        const files = File.find(query);
        if (metadata) files.populate("metadata", "-_id -chunkSize");
        return await files;
    }

    async getManyById(ids, ownerId, metadata = true) {
        const files = File.find({ _id: { $in: ids }, ownerId });
        if (metadata) files.populate("metadata", "-_id -chunkSize");
        return await files;
    }

    async update(id, trashed, name, ownerId) {
        const file = await this.getById(id, ownerId);

        if (trashed !== undefined && file.trashed !== trashed) {
            if (trashed) {
                file.set({
                    prevParentId: file.parentId,
                    parentId: ownerId,
                    trashed: true,
                });
            } else {
                const parentFolderIsExist = await FolderService.isExist(
                    file.prevParentId,
                    ownerId
                );
                file.set({
                    parentId: parentFolderIsExist ? file.prevParentId : ownerId,
                    prevParentId: null,
                    trashed: false,
                });
            }
        }

        if (name !== undefined) {
            if (file.trashed) throw new FileInTrashError();
            const bucket = new mongoose.mongo.GridFSBucket(
                mongoose.connection.db,
                {
                    bucketName: "files",
                }
            );
            await bucket.rename(file.metadata, name);
        }

        return await file.save();
    }

    async deleteById(id, ownerId) {
        const file = await this.getById(id, ownerId, false);
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "files",
        });
        await bucket.delete(file.metadata);
        await file.deleteOne();
    }
}

export default new FileService();
