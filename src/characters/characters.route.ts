import { Router } from "express";
import { getCharacters, getCharacterById , createCharacter, updateCharacter, deleteCharacter} from "./characters.controller";

const router = Router();

router.get('/', getCharacters)

router.post('/', createCharacter)
router.patch('/:id', updateCharacter);
router.get('/:id', getCharacterById)
router.delete('/:id', deleteCharacter);
export { router };
