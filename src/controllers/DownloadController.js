import mongoose from 'mongoose';
import archiver from 'archiver';
import FileService from '../services/FileService.js';
import FolderService from '../services/FolderService.js';

class DownloadController {
    async downloadFile(req, res) {
        const id = req.params.id;
        const file = await FileService.getById(id, req.user._id, false);
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
        bucket.openDownloadStream(file.metadata).pipe(res);
    }

    async downloadFolder(req, res) {
        const id = req.params.id;
        const folder = await FolderService.getById(id, req.user._id);
        const metadataIds = await FileService.getByParentId(id, req.user._id)
            .then(files => files.map(file => file.metadata));
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
        const files = await bucket.find({ _id: { $in: metadataIds } }).toArray();
            
        res.set("Content-Type", "application/zip");
        res.set("Content-Disposition", `attachment; filename=${folder.name}.zip`);
        res.set("Access-Control-Allow-Origin", "*");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);
        for (const file of files) {
            const downloadStream = bucket.openDownloadStream(file._id);
            archive.append(downloadStream, { name: file.filename });
        }
        archive.finalize();
    }
}

export default new DownloadController();