import File from "../models/File.js";
import { FolderInTrashError, RootFolderError } from "../errors/index.js";
import FolderService from "../services/FolderService.js";

// TODO: добавить валидаторы

class FolderController {
    async create(req, res) {
        const { name, parentId } = req.body;

        const parentFolder = await FolderService.getById(parentId, req.user._id);
        if (parentFolder.trashed) throw new FolderInTrashError();

        const folder = await FolderService.create(name, parentId, req.user._id);
        res.status(201).send(folder);
    };

    async getByIdOrToken(req, res) {
        const id = req.params.id ? req.params.id : req.user._id;
        const folder = await FolderService.getById(id, req.user._id);
        const trashed = req.query.filter === 'trashed';
        const folders = await FolderService.getByParentId(id, req.user._id, trashed);
        const files = await File.find({ parentId: id, trashed }).populate('metadata', '-_id -chunkSize');
        res.send({ folder, folders, files });
    };

    async update(req, res) {
        const { id, trashed, name } = req.body;
        if (id === req.user._id.toString())
            throw new RootFolderError();

        const updatedFolder = await FolderService.update(id, trashed, name, req.user._id);
        res.send(updatedFolder);
    }

    async delete(req, res) {
        const id = req.params.id;
        if (id === req.user._id.toString())
            throw new RootFolderError();

        const folder = await FolderService.getById(id, req.user._id);
        await folder.deleteOne();
        res.sendStatus(200);
    }
}

export default new FolderController();