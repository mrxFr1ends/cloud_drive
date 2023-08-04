import archiver from 'archiver';
import FileService from '../services/FileService.js';
import FolderService from '../services/FolderService.js';
import { Bucket } from '../helpers/bucketHelper.js';

class DownloadController {
    async downloadFile(req, res) {
        const id = req.params.id;
        const file = await FileService.getById(id, req.user._id, false);
        Bucket.openDownloadStream(file.metadata).pipe(res);
    }


    // TODO: Скачивание происходит только файлов в текущей папке. А не всей папки с подпапками.
    async downloadFolder(req, res) {
        const id = req.params.id;
        const folder = await FolderService.getById(id, req.user._id);
        const metadataIds = await FileService.getByParentId(id, false, req.user._id, false)
            .then(files => files.map(file => file.metadata));
        const files = await Bucket.find({ _id: { $in: metadataIds } }).toArray();
            
        res.set("Content-Type", "application/zip");
        res.set("Content-Disposition", `attachment; filename=${folder.name}.zip`);
        res.set("Access-Control-Allow-Origin", "*");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);
        for (const file of files) {
            const downloadStream = Bucket.openDownloadStream(file._id);
            archive.append(downloadStream, { name: file.filename });
        }
        archive.finalize();
    }
}

export default new DownloadController();