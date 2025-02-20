import { Router } from "express";
import { getDecks, getDeckById, createDeck, updateDeck, deleteDeck } from "./decks.controller"
import { verifyJWT } from '../common/auth.middleware';

const decksRouter = Router();

decksRouter.get('/', getDecks);
decksRouter.get('/:id', getDeckById);

decksRouter.post('/', verifyJWT, createDeck);
decksRouter.patch('/:id', verifyJWT, updateDeck);
decksRouter.delete('/:id', verifyJWT, deleteDeck);

export { decksRouter };