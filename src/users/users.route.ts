import { Router } from "express";
import { login, register, updateUser, deleteUser } from "./users.controller"
import { verifyJWT } from "../common/auth.middleware";

const usersRouter = Router();

usersRouter.post('/login', login)
usersRouter.patch('/:id', verifyJWT, updateUser);
usersRouter.delete('/:id', verifyJWT, deleteUser);
usersRouter.post('/', register)

export { usersRouter };