import express from "express";
import DownloadController from "../../controllers/DownloadController.js";
import FileController from "../../controllers/FileController.js";
import FolderController from "../../controllers/FolderController.js";
import UploadController from "../../controllers/UploadController.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import UserService from "../../services/UserService.js";
import * as ValidationRules from "../../validators/disk.validator.js";
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
    validateMiddleware(ValidationRules.getById),
    asyncHandler(FileController.getById)
);
diskRouter.put(
    "/file",
    validateMiddleware(ValidationRules.update),
    asyncHandler(FileController.update)
);
diskRouter.delete(
    "/file/:id",
    validateMiddleware(ValidationRules.deleteById),
    asyncHandler(FileController.deleteById)
);

diskRouter.post(
    "/folder",
    validateMiddleware(ValidationRules.create),
    asyncHandler(FolderController.create)
);
diskRouter.get(
    "/folder",
    validateMiddleware(ValidationRules.getByToken),
    asyncHandler(FolderController.getByToken)
);
diskRouter.get(
    "/folder/:id",
    validateMiddleware(ValidationRules.getById),
    asyncHandler(FolderController.getById)
);
diskRouter.put(
    "/folder",
    validateMiddleware(ValidationRules.update),
    asyncHandler(FolderController.update)
);
diskRouter.delete(
    "/folder/:id",
    validateMiddleware(ValidationRules.deleteById),
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
