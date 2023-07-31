import mongoose from 'mongoose';

export const Folder = new mongoose.Schema({
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
    // subFolders: [{type: mongoose.Types.ObjectId, ref: 'Folder'}],
    // files: [{type: mongoose.Types.ObjectId, ref: 'File'}],
});

export default mongoose.model('Folder', Folder);