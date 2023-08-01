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

const Folder = mongoose.model('Folder', FolderSchema);
export default Folder;