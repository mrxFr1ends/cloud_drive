import Folder from '../models/Folder.js';

class FolderService {
    async create(name, parentId, ownerId) {
        const folder = await Folder.create({ name, parentId, ownerId });
        return folder;
    }

    async getById(id, userId) {
        const folder = await Folder.findOne({ _id: id, ownerId: userId });
        return folder;
    }

    async getByParentId(parentId, userId, trashed) {
        const folders = await Folder.find({ 
            parentId, 
            ownerId: userId ,
            trashed
        });
        return folders;
    }

    async update(folder, trashed, name, userId) {
        if (folder.trashed !== trashed && trashed !== undefined) {
            if (trashed) {
                folder.set({
                    prevParentId: folder.parentId,
                    parentId: userId,
                    trashed: true
                });
            }
            else {
                const prevParentFolder = await this.getById(folder.prevParentId);
                folder.set({
                    parentId: prevParentFolder ? folder.prevParentId : userId,
                    prevParentId: null,
                    trashed: false
                });
            }
        } 

        if (name !== undefined)
            folder.set({ name });

        return await folder.save();
    }
}

export default new FolderService();