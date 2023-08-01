import Folder from "../models/Folder.js";
import File from "../models/File.js";
import mongoose from "mongoose";

class FolderController {
    async create(req, res) {
        const { name, parentId } = req.body;

        const parentFolder = await Folder.findById(parentId);
        if (!parentFolder)
            return res.status(404).send({message: "Folder not found"});
        if (!parentFolder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});

        const folder = await Folder.create({ ownerId: req.user._id, name, parentId });
        res.status(201).send(folder);
    };

    async getByIdOrToken(req, res) {
        const folderId = req.params.id ? req.params.id : req.user._id;
        const folder = await Folder.findById(folderId);
        if (!folder)
            return res.status(404).send({message: "Folder not found"});
        if (!folder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});

        const folders = await Folder.find({ parentId: folderId });
        const files = await File.find({ parentId: folderId }).populate('metadata', '-_id -chunkSize');
        res.send({ folder, folders, files });
    };

    async update(req, res) {
        // TODO: добавить валидаторы
        // При перемещении в корзину
        // Присваиваем trashed = true и делаем parentId = user.id при этом нахо хранить id старого родителя
        // Для всех внутренних папок и файлов, делаем trashed = true и оставляем того же родителя
        // При восстановлении если папки со старым id не найдено, то присваиваем parentId = user.id и trashed = true
        const { id, trashed, name } = req.body;
        if (!id)
            return res.status(400).send({message: 'Invalid folder id'});
        if (trashed !== undefined && trashed !== false && trashed !== true)
            return res.status(400).send({message: 'Invalid trashed value'});

        const folder = await Folder.findById(id);
        if (!folder)
            return res.status(404).send({message: "Folder not found"});
        if (!folder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});
            
        const parentFolder = await Folder.findById(folder.parentId);
        if (parentFolder && parentFolder.trashed)
            return res.status(403).send({message: "Folder in trashed folder and cannot be changed"});

        if (folder.trashed !== trashed && trashed !== undefined) {
            folder.set({ 
                parentId: parentFolder && !trashed ? parentFolder.id : null, 
                prevParentId: trashed ? folder.parentId : null, 
                trashed
            });
        }

        if (name !== undefined)
            folder.set({ name });

        folder.save().then(savedFolder => res.send(savedFolder));
    }

    async delete(req, res) {
        const { id } = req.params;

        const folder = await Folder.findById(id);
        if (!folder)
            return res.status(404).send({message: "Folder not found"});
        if (!folder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});

        await folder.deleteOne();
        res.sendStatus(200);
    }
}

export default new FolderController();