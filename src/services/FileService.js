import { FileInTrashError, FileNotFoundError } from "../errors/index.js";
import File from "../models/File.js";
import FolderService from "./FolderService.js";
import { Bucket } from "../helpers/bucketHelper.js";

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
        let query = File.findOne({ _id: id, ownerId });
        if (metadata) query.populate("metadata", "-_id -chunkSize");
        const file = await query.exec();
        if (!file) throw new FileNotFoundError();
        return file;
    }
    
    async getManyById(ids, ownerId, metadata = true) {
        let query = File.find({ _id: { $in: ids }, ownerId });
        if (metadata) query = query.populate("metadata", "-_id -chunkSize");
        return await query.exec();
    }

    async getByParentId(parentId, ownerId, trashed = false, metadata = true) {
        const queryParams = { parentId, ownerId };
        if (trashed) queryParams.trashed = true;

        let query = File.find(queryParams);
        if (metadata) query = query.populate("metadata", "-_id -chunkSize");
        return await query.exec();
    }

    async update(id, trashed, name, ownerId) {
        const file = await this.getById(id, ownerId);

        if (name !== undefined) {
            if (file.trashed) throw new FileInTrashError();
            await Bucket.rename(file.metadata, name);
        }

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

        return await file.save();
    }

    async deleteById(id, ownerId) {
        const file = await this.getById(id, ownerId, false);
        await Bucket.delete(file.metadata);
        await file.deleteOne();
    }
}

export default new FileService();
