import stream from 'stream';
import { Bucket } from '../helpers/bucketHelper.js';
import FileService from '../services/FileService.js';
import FolderService from '../services/FolderService.js';

class UploadController {
    async uploadFiles(req, res) {
        if (!req.files || !req.files.uploadedFiles) 
            return res.status(400).send({message: "No files for upload"});

        const { body: { folderId }, files: { uploadedFiles } } = req;
        await FolderService.getById(folderId, req.user._id);

        const uploadFile = (file) => new Promise((resolve, reject) => {
            const readStream = stream.PassThrough();
            readStream.end(file.data); 
            const uploadStream = Bucket.openUploadStream(file.name);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', async () => {
                try {
                    resolve(await FileService.create(
                        folderId, uploadStream.id, req.user._id
                    ).then(file => file.linkMetadata()));
                }
                catch (err) { reject(err); }
            });

            uploadStream.on('error', reject);
        });

        const files = (Array.isArray(uploadedFiles) 
            ? await Promise.all(uploadedFiles.map(file => uploadFile(file)))
            : [await uploadFile(uploadedFiles)]);

        res.status(201).send({ files });
    }

    async uploadFolder(req, res) {
        res.send("Upload folder");
    }
}

export default new UploadController();