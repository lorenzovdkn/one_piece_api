import { Router } from "express";
import { login, register } from "./users.controller"

const usersRouter = Router();

usersRouter.post('/login', login)
usersRouter.post('/', register)

export { usersRouter };