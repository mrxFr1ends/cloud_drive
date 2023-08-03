import express from "express";
import DiskController from "../../controllers/DiskController.js";
import DownloadController from "../../controllers/DownloadController.js";
import UploadController from "../../controllers/UploadController.js";
import { asyncHandler } from "../../helpers/asyncHandler.js";
import { validateMiddleware } from "../../middlewares/validateMiddleware.js";
import * as ValidationRules from "../../validators/disk.validator.js";
const diskRouter = new express.Router();

diskRouter.post(
    "/",
    validateMiddleware(ValidationRules.create),
    asyncHandler(DiskController.create)
);
diskRouter.get(
    "/",
    validateMiddleware(ValidationRules.getRoot),
    asyncHandler(DiskController.getRoot)
);
diskRouter.get(
    "/:id",
    validateMiddleware(ValidationRules.getById),
    asyncHandler(DiskController.getById)
);
diskRouter.put(
    "/",
    validateMiddleware(ValidationRules.updateById),
    asyncHandler(DiskController.updateById)
);
diskRouter.delete(
    "/:id",
    validateMiddleware(ValidationRules.deleteById),
    asyncHandler(DiskController.deleteById)
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
