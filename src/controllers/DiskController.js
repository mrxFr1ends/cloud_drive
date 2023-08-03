import { FolderInTrashError } from "../errors/index.js";
import FileService from "../services/FileService.js";
import FolderService from "../services/FolderService.js";

const Service = type => (type === "file" ? FileService : FolderService);

class DiskController {
    async create(req, res) {
        const { name, parentId, type } = req.body;

        if (type === "file")
            return res.status(403).send({message: "At the moment, file creation is not implemented."});

        const parentFolder = await FolderService.getById(
            parentId,
            req.user._id
        );
        if (parentFolder.trashed) throw new FolderInTrashError();

        const folder = await FolderService.create(name, parentId, req.user._id);
        res.status(201).send(folder);
    }

    async getById(req, res) {
        const id = req.params.id;
        const type = req.query.type;
        const diskObject = await Service(type).getById(id, req.user._id);

        if (type === "file")
            res.send(await diskObject.linkMetadata());
        else
            res.send({
                folder: diskObject,
                subfolders: await FolderService.getByParentId(id, req.user._id, diskObject.trashed),
                files: await FileService.getByParentId(id, req.user._id, diskObject.trashed),
            });
    }

    async getRoot(req, res) {
        const id = req.user._id;
        const filterOption = { };
        const filter = req.query.filter;
        if (filter == undefined || filter === "trashed")
            filterOption.trashed = req.query.filter === "trashed";
        res.send({ 
            folders: await FolderService.getFiltered(id, id, filterOption),
            files: await FileService.getFiltered(id, id, filterOption)
        });
    }

    async updateById(req, res) {
        const { id, trashed, name, type } = req.body;
        const diskObject = await Service(type).update(
            id,
            trashed,
            name,
            req.user._id
        );
        if (type === "file")
            res.send(await diskObject.linkMetadata());
        else res.send(diskObject);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        Service(req.query.type).deleteById(id, req.user._id);
        res.sendStatus(200);
    }
}

export default new DiskController();

// async getById(req, res) {
//     const id = req.params.id;
//     const service = this.#getServiceByType(req.query.type);
//     const response = await service.getById(id, req.user._id);
//     res.send(response);
// }

// async updateById(req, res) {
//     const { id, trashed, name, type } = req.body;
//     const service = this.#getServiceByType(type);
//     const response = await service.update(id, trashed, name, req.user._id);
//     res.send(response);
// }
