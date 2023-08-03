import { FolderInTrashError, FolderNotFoundError } from "../errors/index.js";
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

    async getByParentId(parentId, ownerId, trashed = false) {
        const query = { parentId, ownerId };
        if (trashed) query[trashed] = true;

        const folders = await Folder.find(query);
        return folders;
    }

    async isExist(id, ownerId) {
        return !(await Folder.findOne({ _id: id, ownerId }));
    }

    async update(id, trashed, name, ownerId) {
        const folder = await this.getById(id, ownerId);

        if (trashed !== undefined && folder.trashed !== trashed) {
            if (trashed) {
                folder.set({
                    prevParentId: folder.parentId,
                    parentId: ownerId,
                    trashed: true,
                });
            } else {
                folder.set({
                    parentId: await this.isExist(folder.prevParentId, ownerId)
                        ? folder.prevParentId
                        : ownerId,
                    prevParentId: null,
                    trashed: false,
                });
            }
        }

        if (name !== undefined) {
            if (folder.trashed) throw new FolderInTrashError();
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
