import mongoose from 'mongoose';

const User = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    // diskSpace: {type: Number, default: 1024**3*10},
    // usedSpace: {type: Number, default: 0},
    // avatar: {type: String},
});

export default mongoose.model('User', User);