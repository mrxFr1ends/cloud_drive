import Folder from '../models/Folder.js';
import { FolderInTrashError, FolderNotFoundError } from '../errors/index.js';
import FolderService from './FolderService.js';

class FolderService {
    async create(name, parentId, ownerId) {
        const folder = await Folder.create({ name, parentId, ownerId });
        return folder;
    }

    async getById(id, ownerId) {
        const folder = await Folder.findOne({ _id: id, ownerId });
        if (!folder) throw new FolderNotFoundError();
        return folder;
    }

    async getByParentId(parentId, trashed, ownerId) {
        const folders = await Folder.find({ parentId, ownerId, trashed });
        return folders;
    }

    async update(id, trashed, name, ownerId) {
        const folder = await this.getById(id, ownerId);

        if (trashed !== undefined && folder.trashed !== trashed) {
            if (trashed) {
                folder.set({
                    prevParentId: folder.parentId,
                    parentId: ownerId,
                    trashed: true
                });
            }
            else {
                const prevParentFolder = await this.getById(folder.prevParentId).then(folder => folder).catch(_ => null);
                folder.set({
                    parentId: prevParentFolder ? folder.prevParentId : ownerId,
                    prevParentId: null,
                    trashed: false
                });
            }
        } 

        if (name !== undefined) {
            if (folder.trashed)
                throw new FolderInTrashError();
            folder.set({ name });
        }

        return await folder.save();
    }

    async deleteById(id, ownerId) {
        const folder = await this.getById(id, ownerId);
        await folder.deleteOne();
    }
}

export default new FolderService();