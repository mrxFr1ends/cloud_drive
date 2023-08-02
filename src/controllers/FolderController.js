import File from "../models/File.js";
import { FolderNotFoundError, FolderInTrashError } from "../errors/index.js";
import FolderService from "../services/FolderService.js";

// TODO: добавить валидаторы

class FolderController {
    async create(req, res) {
        const { name, parentId } = req.body;

        const parentFolder = await FolderService.getById(parentId, req.user._id);
        if (!parentFolder) throw new FolderNotFoundError();
        if (parentFolder.trashed) throw new FolderInTrashError();

        const folder = await FolderService.create(name, parentId, req.user._id);
        res.status(201).send(folder);
    };

    async getByIdOrToken(req, res) {
        const id = req.params.id ? req.params.id : req.user._id;

        const folder = await FolderService.getById(id, req.user._id);
        if (!folder) throw new FolderNotFoundError();

        const trashed = req.query.filter === 'trashed';
        const folders = await FolderService.getByParentId(id, req.user._id, trashed);
        const files = await File.find({ parentId: id, trashed }).populate('metadata', '-_id -chunkSize');
        res.send({ folder, folders, files });
    };

    async update(req, res) {
        const { id, trashed, name } = req.body;
        
        const folder = await FolderService.getById(id, req.user._id);
        if (!folder) throw new FolderNotFoundError();

        const updatedFolder = await FolderService.update(folder, trashed, name, req.user._id);
        res.send(updatedFolder);
    }

    async delete(req, res) {
        const id = req.params.id;

        const folder = await FolderService.getById(id, req.user._id);
        if (!folder) throw new FolderNotFoundError();

        await folder.deleteOne();
        res.sendStatus(200);
    }
}

export default new FolderController();