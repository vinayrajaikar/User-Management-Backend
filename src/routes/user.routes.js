import { Router } from "express";
import { getAllUsers, getUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router= Router();

router.route("").get(verifyJWT,getAllUsers);
router.route("/:id").get(verifyJWT,getUser);
router.route("/:id").post(verifyJWT,updateUser);
router.route("/:id").delete(verifyJWT,deleteUser);

export default router