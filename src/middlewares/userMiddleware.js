import { asyncHandler } from "../helpers/asyncHandler.js";
import UserService from "../services/UserService.js";
import { authMiddleware } from "./authMiddleware.js";

export const userMiddleware = asyncHandler(async (req, res, next) => {
    authMiddleware(req, res, async () => {
        req.user = await UserService.getById(req.tokenData._id);
        if (!req.user)
            return res.status(404).send({ message: "User not found" });
        next();
    });
});