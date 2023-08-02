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