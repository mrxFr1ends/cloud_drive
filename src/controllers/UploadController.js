import mongoose from 'mongoose';
import stream from 'stream';
import FolderService from '../services/FolderService.js';
import FileService from '../services/FileService.js';

class UploadController {
    async uploadFiles(req, res) {
        if (!req.files || !req.files.uploadedFiles) 
            return res.status(400).send({message: "No files for upload"});

        const { body: { folderId }, files: { uploadedFiles } } = req;
        await FolderService.getById(folderId, req.user._id);
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
    
        const uploadFile = (file) => new Promise((resolve, reject) => {
            const readStream = stream.PassThrough();
            readStream.end(file.data); 
            const uploadStream = bucket.openUploadStream(file.name);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', async () => {
                try {
                    resolve(await FileService.create(
                        folderId, uploadStream.id, req.user._id
                    ));
                }
                catch (err) { reject(err); }
            });

            uploadStream.on('error', reject);
        });

        const files = (Array.isArray(uploadedFiles) 
            ? await Promise.all(uploadedFiles.map(file => uploadFile(file)))
            : [await uploadFile(uploadedFiles)])

        res.status(201).send({ 
            files: await FileService.getManyById(files.map(file => file.id), req.user._id) 
        });
    }

    async uploadFolder(req, res) {
        res.send("Upload folder");
    }
}

export default new UploadController();