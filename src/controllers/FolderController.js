import { FolderInTrashError, RootFolderError } from "../errors/index.js";
import FolderService from "../services/FolderService.js";
import FileService from "../services/FileService.js";

class FolderController {
    async create(req, res) {
        const { name, parentId } = req.body;

        const parentFolder = await FolderService.getById(parentId, req.user._id);
        if (parentFolder.trashed) throw new FolderInTrashError();

        const folder = await FolderService.create(name, parentId, req.user._id);
        res.status(201).send({ folder });
    };

    async getByIdOrToken(req, res) {
        const id = req.params.id ? req.params.id : req.user._id;
        const trashed = req.query.filter === 'trashed';
        res.send({ 
            folder: await FolderService.getById(id, req.user._id), 
            subfolders: await FolderService.getByParentId(id, trashed, req.user._id), 
            files: await FileService.getByParentId(id, trashed, req.user._d)
        });
    };

    async update(req, res) {
        const { id, trashed, name } = req.body;
        if (id === req.user._id.toString())
            throw new RootFolderError();

        const updatedFolder = await FolderService.update(id, trashed, name, req.user._id);
        res.send({ folder: updatedFolder });
    }

    async delete(req, res) {
        const id = req.params.id;
        if (id === req.user._id.toString())
            throw new RootFolderError();

        await FolderService.deleteById(id, req.user._id);
        res.sendStatus(200);
    }
}

export default new FolderController();