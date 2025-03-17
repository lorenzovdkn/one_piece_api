import { Router } from "express";
import {
  login,
  register,
  updateUser,
  deleteUser,
  getUserById,
  validateToken,
} from "./users.controller";
import { verifyJWT } from "../common/auth.middleware";

const usersRouter = Router();

usersRouter.post("/login", login);
usersRouter.get("/:id", verifyJWT, getUserById);
usersRouter.patch("/:id", verifyJWT, updateUser);
usersRouter.delete("/:id", verifyJWT, deleteUser);
usersRouter.post("/", register);
usersRouter.post("/validateToken", verifyJWT, validateToken);

export { usersRouter };
