import FileService from '../services/FileService.js';

class FileController {
    async create(req, res) {
        res.send("Create empty file");
    }

    async getOne(req, res) {
        const id = req.params.id;
        const file = await FileService.getById(id);
        res.send({ file });
    }

    async update(req, res) {
        const { id, trashed, name } = req.body;
        const updatedFile = await FileService.update(id, trashed, name, req.user._id);
        res.send({ file: updatedFile });
    }

    async delete(req, res) {
        const id = req.params.id;
        await FileService.deleteById(id, req.user._id);
        res.sendStatus(200);
    }
}

export default new FileController();