import { Router } from "express";
import { getCharacters, getCharacterById , createCharacter, updateCharacter, deleteCharacter} from "./characters.controller";
import { verifyJWT } from '../common/auth.middleware';

const charactersRouter = Router();

charactersRouter.get('/', getCharacters)
charactersRouter.get('/:id', getCharacterById)

charactersRouter.post('/', verifyJWT, createCharacter)
charactersRouter.patch('/:id', verifyJWT, updateCharacter);
charactersRouter.delete('/:id', verifyJWT, deleteCharacter);
export { charactersRouter };
