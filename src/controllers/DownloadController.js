import mongoose from 'mongoose';
import archiver from 'archiver';
import File from '../models/File.js';
import Folder from '../models/Folder.js';

class DownloadController {
    async downloadFile(req, res) {
        const _id = new mongoose.Types.ObjectId(req.params.id);
        const file = await File.findById(_id);
        if (!file)
            return res.status(404).send({message: 'File not found'});
        if (!file.ownerId.equals(req.user._id))
            return res.status(403).send({message: 'No access to file'});

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
        bucket.openDownloadStream(file.metadata).pipe(res);
    }

    async downloadFolder(req, res) {
        const folderId = req.params.id;
        const folder = await Folder.findById(folderId);
        if (!folder)
            return res.status(404).send({message: 'Folder not found'});
        if (!folder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});

        const metadataIds = await File.find({ parentId: folderId }).select('metadata')
            .then(ids => ids.map(id => id.metadata));
        // if (metadataIds.length === 0)
        //     return res.status(404).send("Files not found");

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
        const files = await bucket.find({ _id: {$in: metadataIds} }).toArray();
            
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