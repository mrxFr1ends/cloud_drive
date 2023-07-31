import mongoose from 'mongoose';
import stream from 'stream';
import File from '../models/File.js';
import Folder from '../models/Folder.js';

class UploadController {
    async uploadFiles(req, res) {
        if (!req.files || !req.files.uploadedFiles) 
            return res.status(400).send({message: "No files for upload"});

        const { body: { folderId }, files: { uploadedFiles } } = req;
        const folder = await Folder.findById(folderId);
        if (!folder)
            return res.status(404).send({ message: "Folder not found" });
        if (!folder.ownerId.equals(req.user._id))
            return res.status(403).send({message: "No access to folder"});

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'files'
        });
    
        const uploadFile = async (file) => {
            const readStream = stream.PassThrough();
            readStream.end(file.data); 
            const uploadStream = bucket.openUploadStream(file.name);
            readStream.pipe(uploadStream);
            return await File.create({ 
                ownerId: req.user._id, 
                parentId: folderId, 
                metadata: uploadStream.id 
            });
        }
    
        const filesMetadata = Array.isArray(uploadedFiles) 
            ? uploadedFiles.map(async file => await uploadFile(file)) 
            : [await uploadFile(uploadedFiles)];
    
        res.send({ 
            files: await File.find({
                _id: { $in: [filesMetadata.map(data => data.id)]}
            }).populate('metadata', '-_id -chunkSize')
        });
    }

    async uploadFolder(req, res) {
        res.send("Upload folder");
    }
}

export default new UploadController();