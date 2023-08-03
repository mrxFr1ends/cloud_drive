import FileService from "../services/FileService.js";

class FileController {
    async getById(req, res) {
        const id = req.params.id;
        const file = await FileService.getById(id, req.user._id);
        await file.linkMetadata();
        res.send({ file });
    }

    async update(req, res) {
        const { id, trashed, name } = req.body;
        const file = await FileService.update(id, trashed, name, req.user._id);
        await file.linkMetadata();
        res.send({ file });
    }

    async deleteById(req, res) {
        const id = req.params.id;
        await FileService.deleteById(id, req.user._id);
        res.sendStatus(200);
    }
}

export default new FileController();
