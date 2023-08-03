import express from "express";
import DownloadController from "../../controllers/DownloadController.js";
import FileController from "../../controllers/FileController.js";
import FolderController from "../../controllers/FolderController.js";
import UploadController from "../../controllers/UploadController.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import UserService from "../../services/UserService.js";
import * as FileRules from "../../validators/file.validator.js";
import * as FolderRules from "../../validators/folder.validator.js";
const diskRouter = new express.Router();

diskRouter.use(
    asyncHandler(async (req, res, next) => {
        req.user = await UserService.getById(req.tokenData._id);
        if (!req.user)
            return res.status(404).send({ message: "User not found" });
        next();
    })
);

diskRouter.get(
    "/file/:id",
    validateMiddleware(FileRules.getFileValidationRules),
    asyncHandler(FileController.getOne)
);
diskRouter.put(
    "/file",
    validateMiddleware(FileRules.updateFileValidationRules),
    asyncHandler(FileController.update)
);
diskRouter.delete(
    "/file/:id",
    validateMiddleware(FileRules.deleteFileValidationRules),
    asyncHandler(FileController.delete)
);

diskRouter.post(
    "/folder",
    validateMiddleware(FolderRules.create),
    asyncHandler(FolderController.create)
);
diskRouter.get(
    "/folder",
    validateMiddleware(FolderRules.getByToken),
    asyncHandler(FolderController.getByToken)
);
diskRouter.get(
    "/folder/:id",
    validateMiddleware(FolderRules.getById),
    asyncHandler(FolderController.getById)
);
diskRouter.put(
    "/folder",
    validateMiddleware(FolderRules.update),
    asyncHandler(FolderController.update)
);
diskRouter.delete(
    "/folder/:id",
    validateMiddleware(FolderRules.deleteById),
    asyncHandler(FolderController.deleteById)
);

diskRouter.post("/upload/file", asyncHandler(UploadController.uploadFiles));
diskRouter.post("/upload/folder", asyncHandler(UploadController.uploadFolder));

diskRouter.get(
    "/download/file/:id",
    asyncHandler(DownloadController.downloadFile)
);
diskRouter.get(
    "/download/folder/:id",
    asyncHandler(DownloadController.downloadFolder)
);

export default diskRouter;
