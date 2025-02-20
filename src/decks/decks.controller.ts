import { Request, Response } from 'express';
import prisma from '../client';
import _ from 'lodash';
import { CrudDeckParamsType, DeckCreateType, DeckUpdateType } from '../types/common.type';

export const getDecks = async (req: Request, res: Response): Promise<void> => {
  try {
    const decks = await prisma.deck.findMany({
      include: {
        owner: {
            select: {
              id: true,
            },
          },
        characters: true,
      },
    });
    if (decks.length === 0) {
      res.status(204).send([]);
      return;
    }
    res.status(200).send(decks);
  } catch (error: any) {
    res.status(500).send({ error: 'Database error' });
  }
};

export const getDeckById = async (req: Request<CrudDeckParamsType, any, {}>, res: Response): Promise<void> => {
  try {
    const deckId = parseInt(req.params.id, 10);
    if (isNaN(deckId)) {
      res.status(400).json({ error: 'ID invalid. Must be a number.' });
      return;
    }
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        owner: {
            select: {
              id: true,
            },
          },
        characters: true,
      },
    });
    if (!deck) {
      res.status(404).json({ error: 'Deck not found.' });
      return;
    }
    res.status(200).send(deck);
  } catch (error: any) {
    res.status(500).send({ error: 'Database error' });
  }
};

export const createDeck = async (req: Request<{}, any, DeckCreateType>, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
    }

    const { name, characterIds } = req.body;
    if (!name) {
      res.status(400).send({ error: 'Missing field: name' });
      return;
    }

    const deckData: any = {
      name,
      owner: { connect: { id: userId } },
    };

    if (characterIds && Array.isArray(characterIds)) {
      deckData.characters = {
        connect: characterIds.map((id: number) => ({ id })),
      };
    }

    const newDeck = await prisma.deck.create({
      data: deckData,
      include: {
        owner: true,
        characters: true,
      },
    });
    res.status(201).send(newDeck);
  } catch (error: any) {
    res.status(500).send({ error: 'Database error' });
  }
};

export const updateDeck = async (req: Request<CrudDeckParamsType, any, DeckUpdateType>, res: Response): Promise<void> => {
  try {
    const deckId = parseInt(req.params.id, 10);
    if (isNaN(deckId)) {
      res.status(400).send({ error: 'ID invalid. Must be a number.' });
      return;
    }

    const existingDeck = await prisma.deck.findUnique({ where: { id: deckId } });
    if (!existingDeck) {
      res.status(404).send({ error: 'Deck not found.' });
      return;
    }

    const { name, characterIds } = req.body;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (characterIds && Array.isArray(characterIds)) {
      updateData.characters = {
        set: characterIds.map((id: number) => ({ id })),
      };
    }

    const updatedDeck = await prisma.deck.update({
      where: { id: deckId },
      data: updateData,
      include: {
        owner: true,
        characters: true,
      },
    });
    res.status(200).send(updatedDeck);
  } catch (error: any) {
    res.status(500).send({ error: 'Database error' });
  }
};

export const deleteDeck = async (req: Request<CrudDeckParamsType, any, {}>, res: Response): Promise<void> => {
  try {
    const deckId = parseInt(req.params.id, 10);
    if (isNaN(deckId)) {
      res.status(400).send({ error: 'ID invalid. Must be a number.' });
      return;
    }

    const existingDeck = await prisma.deck.findUnique({ where: { id: deckId } });
    if (!existingDeck) {
      res.status(404).send({ error: 'Deck not found.' });
      return;
    }

    const deletedDeck = await prisma.deck.delete({
      where: { id: deckId },
    });
    res.status(200).send(deletedDeck);
  } catch (error: any) {
    res.status(500).send({ error: 'Database error' });
  }
};
