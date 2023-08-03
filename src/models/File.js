import mongoose from "mongoose";

const POPULATE_SELECT = "-_id -chunkSize";
const FileMetadata = new mongoose.Schema({}, { collection: "files.files" });
mongoose.model("FileMetadata", FileMetadata);

const FileSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "Folder",
        default: null,
        required: true,
    },
    metadata: {
        type: mongoose.Types.ObjectId,
        ref: "FileMetadata",
        required: true,
        unique: true,
    },
    trashed: {
        type: Boolean,
        default: false,
    },
    prevParentId: {
        type: mongoose.Types.ObjectId,
        ref: "Folder",
        default: null,
    },
});

FileSchema.query.linkMetadata = function (isLink) {
    return isLink ? this.populate("metadata", POPULATE_SELECT) : this;
};

FileSchema.methods.linkMetadata = function () {
    return this.populate("metadata", POPULATE_SELECT);
};

const File = mongoose.model("File", FileSchema);

export default File;
