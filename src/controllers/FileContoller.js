class FileController {
    async create(req, res) {
        res.send("Create empty file: ");
    }

    async getOne(req, res) {
        res.send('Info about file: ' + req.params.id);
    }

    async moveToTrash(req, res) {
        res.send('Move file to trash: ' + req.params.id);
    }

    async delete(req, res) {
        res.send('Delete file' + req.params.id);
    }
}

export default new FileController();