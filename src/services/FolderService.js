import { FolderInTrashError, FolderNotFoundError, RootFolderError } from "../errors/index.js";
import Folder from "../models/Folder.js";

class FolderService {
    async create(name, parentId, ownerId) {
        const folder = await Folder.create({ name, parentId, ownerId });
        return folder;
    }

    async createRoot(ownerId) {
        const folder = await Folder.create({
            _id: ownerId,
            name: "root",
            ownerId,
        });
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

    async getFiltered(parentId, ownerId, filterOption) {
        const folders = await Folder.find({ parentId, ownerId, ...filterOption });
        return folders;
    }

    async isExist(id, ownerId, trashed) {
        return !!(await Folder.findOne({ _id: id, ownerId, trashed }));
    }

    async update(id, trashed, name, ownerId) {
        if (id === ownerId.toString())
            throw new RootFolderError();

        const folder = await this.getById(id, ownerId);

        if (name !== undefined) {
            if (folder.trashed) throw new FolderInTrashError();
            folder.set({ name });
        }

        if (trashed !== undefined && folder.trashed !== trashed) {
            if (trashed) {
                folder.set({
                    prevParentId: folder.parentId,
                    parentId: ownerId,
                    trashed: true,
                });
            } else {
                folder.set({
                    parentId: await this.isExist(folder.prevParentId, ownerId, false)
                        ? folder.prevParentId
                        : ownerId,
                    prevParentId: null,
                    trashed: false,
                });
            }
        }

        return await folder.save();
    }
    
    async deleteById(id, ownerId) {
        if (id === ownerId.toString())
            throw new RootFolderError();
        const folder = await this.getById(id, ownerId);
        await folder.deleteOne();
    }
}

export default new FolderService();
