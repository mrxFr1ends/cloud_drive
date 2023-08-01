import mongoose from 'mongoose';
import File from './File.js';

const FolderSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    ownerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Folder', 
        default: null
    },
    trashed: {
        type: Boolean,
        default: false
    },
    prevParentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Folder',
        default: null
    }
    // subFolders: [{type: mongoose.Types.ObjectId, ref: 'Folder'}],
    // files: [{type: mongoose.Types.ObjectId, ref: 'File'}],
});

FolderSchema.pre('save', async function(next) {
    if (!this.isModified('trashed'))
        return next();
        
    Folder.find({ parentId: this.id }).then(folders => {
        folders.forEach(folder => {
            folder.set({ trashed: this.trashed });
            folder.save();
        })
    });

    File.find({ parentId: this.id }).then(files => {
        files.forEach(file => {
            file.set({ trashed: this.trashed });
            file.save();
        })
    });

    return next();
});

FolderSchema.pre('deleteOne', { document: true }, async function(next) {
    console.log('deleteOne', this.name);
    
    await Folder.find({ parentId: this.id }).then(async (folders) => {
        await Promise.all(folders.map(async (folder) => {
            console.log(folder.name);
            await folder.deleteOne();
        }));
    });

    await File.find({ parentId: this.id }).then(async (files) => {
        if (files.length === 0)
            return;
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {        
            bucketName: 'files'
        });
        await Promise.all(files.map(async (file) => {
            await bucket.delete(file.metadata)
            console.log('delete file', file.id);
            await file.deleteOne();
        }));
    });

    console.log('delete return', this.name);
    return next();
});

const Folder = mongoose.model('Folder', FolderSchema);

export default Folder;