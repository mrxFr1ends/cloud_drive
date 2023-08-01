import mongoose from 'mongoose';

const FileMetadata = new mongoose.Schema({}, { collection: 'files.files' });
mongoose.model('FileMetadata', FileMetadata);

const File = new mongoose.Schema({
    ownerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId, 
        ref: 'Folder', 
        default: null, 
        required: true
    },
    metadata: { 
        type: mongoose.Types.ObjectId, 
        ref: 'FileMetadata',
        required: true,
        unique: true
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
});

export default mongoose.model('File', File);