import { FileInTrashError, FileNotFoundError } from "../errors/index.js";
import { Bucket } from "../helpers/bucketHelper.js";
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

    async getById(id, ownerId) {
        const file = await File.findOne({ _id: id, ownerId });
        if (!file) throw new FileNotFoundError();
        return file;
    }

    async getByParentId(parentId, trashed, ownerId, metadata=true) {
        const query = File.find({ parentId, ownerId, trashed }).linkMetadata(metadata);
        return await query.exec();
    }

    async getFiltered(parentId, ownerId, filterOption) {
        const files = await File.find({ parentId, ownerId, ...filterOption });
        return files;
    }

    async #updateName(file, name) {
        await Bucket.rename(file.metadata, name);
    }

    async #updateTrashed(file, trashed, ownerId) {
        file.set({ trashed });
        if (trashed)
            file.set({
                prevParentId: file.parentId,
                parentId: ownerId,
            });
        else {
            const parentFolderIsExist = await FolderService.isExist(
                file.prevParentId,
                ownerId
            );
            file.set({
                parentId: parentFolderIsExist ? file.prevParentId : ownerId,
                prevParentId: null,
            });
        }
        return file;
    }

    async update(id, trashed, name, ownerId) {
        const file = await this.getById(id, ownerId);
        
        if (name !== undefined) {
            if (file.trashed && trashed !== false)
                throw new FileInTrashError();
            await this.#updateName(file, name);
        }
        if (trashed !== undefined && file.trashed !== trashed)
            await this.#updateTrashed(file, trashed, ownerId);

        const updatedFile = await file.save();
        return updatedFile;
    }

    async deleteById(id, ownerId) {
        const file = await this.getById(id, ownerId);
        await Bucket.delete(file.metadata);
        await file.deleteOne();
    }
}

export default new FileService();