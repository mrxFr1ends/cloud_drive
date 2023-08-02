class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = statusCode || 500;
    }
}

export class FolderNotFoundError extends AppError {
    constructor() { super('Folder not found', 404); }
}

export class FolderInTrashError extends AppError {
    constructor() { super('Folder in trash', 403); }
}

export class RootFolderError extends AppError {
    constructor() { super('Root folder cannot be changed/deleted', 403); }
}

export class FileNotFoundError extends AppError {
    constructor() { super('File not found', 404); }
}

export class FileInTrashError extends AppError {
    constructor() { super('File in trash', 403); }
}