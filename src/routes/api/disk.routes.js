import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler.js'
import UserService from '../../services/UserService.js';
import FileController from '../../controllers/FileContoller.js';
import FolderController from '../../controllers/FolderController.js';
import DownloadController from '../../controllers/DownloadController.js';
import UploadController from '../../controllers/UploadController.js';
const diskRouter = new express.Router();

// TODO: Написать валидаторы для названия папок и т.д.

diskRouter.use(asyncHandler(async (req, res, next) => {
    req.user = await UserService.getById(req.tokenData._id);
    if (!req.user)
        return res.status(404).send({message: "User not found"});
    next();
}));

diskRouter.get('/file/:id', asyncHandler(FileController.getOne));
diskRouter.put('/file', asyncHandler(FileController.update));
diskRouter.delete('/file/:id', asyncHandler(FileController.delete));

diskRouter.post('/folder', asyncHandler(FolderController.create));
diskRouter.get(['/folder', '/folder/:id'], asyncHandler(FolderController.getByIdOrToken));
diskRouter.put('/folder', asyncHandler(FolderController.update));
diskRouter.delete('/folder/:id', asyncHandler(FolderController.delete));

diskRouter.post('/upload/file', asyncHandler(UploadController.uploadFiles));
diskRouter.post('/upload/folder', asyncHandler(UploadController.uploadFolder));

diskRouter.get('/download/file/:id', asyncHandler(DownloadController.downloadFile));
diskRouter.get('/download/folder/:id', asyncHandler(DownloadController.downloadFolder));

export default diskRouter;