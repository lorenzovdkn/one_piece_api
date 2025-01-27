import { Character } from '@prisma/client';
import { Request, Response } from 'express';
import prisma from '../client';
import _ from 'lodash';


export const getCharacters = async (req:Request, res:Response): Promise<void> => {
    try {

        const characters = await prisma.character.findMany();
        if (characters.length === 0) {
            res.status(204).send([])
            return;
        }
        res.status(200).send(characters);
    }catch(error : any) {
        res.status(500).send( {error: error.message})
    }
};

export const getCharacterById = async (req:Request, res:Response): Promise<void> => {
    try {
        const characterId = parseInt(req.params.id, 10);

        if (isNaN(characterId)) {
            res.status(400).json({ error: 'ID Invalid. Must be a number.' });
            return;
        }

        const character = await prisma.character.findUnique({
            where: { id: characterId}, 
            include: { affiliation:true }, 
        });

        if (!character) {
            res.status(404).json({ error: 'Character not found.' });
            return;
        }
        res.status(200).send(character);
    }catch(error) {
        res.status(500).send( {error: error} )
    }
};

export const createCharacter = async (req:Request, res:Response): Promise<void> => {
    try {
        const { name, affiliation, lifePoints, size, age, weight, imageUrl } = req.body;

        if (!name || !affiliation || !lifePoints) { 
            const missingFields = [];
            if (!name) missingFields.push('name');
            if (!affiliation) missingFields.push('affiliation');
            if (!lifePoints) missingFields.push('lifePoints');
            res.status(400).send({ error: `Missing fields: ${missingFields.join(', ')}` });
            return;
        }
        

        // search affiliation Id for the character
        let searchedAffiliation = await prisma.affiliation.findUnique({
        where: { name : affiliation.name },
        })

        if (!searchedAffiliation) {
        searchedAffiliation = await prisma.affiliation.create({
            data: {name: affiliation.name },
        });}

        // check if character already exists
        const exisitingCharacter = await prisma.character.findFirst({
            where: { name : name },
        })

        if (exisitingCharacter) {
            res.status(409).send({error : 'Character is already exisiting'});
            return;
        }

        // Create a new character
        const newCharacter = await prisma.character.create({
            data: {
            name,
            affiliationId: searchedAffiliation.id,
            lifePoints,
            size,
            age,
            weight,
            imageUrl,
            },
            include: { affiliation: true },
        });
        
        res.status(201).send(newCharacter);
          
    }catch(error : any) { 
        res.status(500).send( {error: error.message} );
    }
};

export const updateCharacter = async (req:Request, res:Response): Promise<void> => {
    try {
        const characterId = parseInt(req.params.id, 10);

        if (isNaN(characterId)) {
            res.status(400).send({ error: 'ID invalid. Must be a number.' });
            return;
        }


        debugger
        const character = await prisma.character.findUnique({
            where: { id: characterId },
            include: { affiliation: true },
        });

        if (!character) {
            res.status(404).send({ error: 'Character not found.' });
            return;
        }

        const { name, affiliation, lifePoints, size, age, weight, imageUrl } = req.body;

        // Prepare datas for the update
        const updateData: any = {};

        if (name !== undefined) {
            updateData.name = name;
        }

        if (lifePoints !== undefined) {
            updateData.lifePoints = lifePoints;
        }

        if (size !== undefined) {
            updateData.size = size;
        }

        if (age !== undefined) {
            updateData.age = age;
        }

        if (weight !== undefined) {
            updateData.weight = weight;
        }

        if (imageUrl !== undefined) {
            updateData.imageUrl = imageUrl;
        }

        if(_.isEmpty(updateData)) {
            res.status(400).send({ error: 'No data provided to update or invalid.' });
            return;
        }

        // Managing afiliation
        if (affiliation && affiliation.name) {
            updateData.affiliation = {
                connectOrCreate: {
                    where: { name: affiliation.name },
                    create: { name: affiliation.name },
                },
            };
        }

        const updatedCharacter = await prisma.character.update({
            where: { id: characterId },
            data: updateData,
            include: { affiliation: true },
        });

        res.status(200).send(updatedCharacter);
    }catch (error : any) {
        res.status(500).send( {error: error.message} )
    }
};

export const deleteCharacter = async (req:Request, res:Response): Promise<void> => {
    try {
        const characterId = parseInt(req.params.id, 10);

        if (isNaN(characterId)) {
            res.status(400).send({ error: 'ID invalid. Must be a number.' });
            return;
        }

        const character = await prisma.character.findUnique({
            where: { id: characterId },
        });

        if (!character) {
            res.status(404).send({ error: 'Character not found.' })
        }else {

        const deleteCharacter = await prisma.character.delete({
            where: {
                id : characterId
            },
        });

        res.status(200).send(deleteCharacter);
        }
    }catch(error : any) {
        res.status(500).send( {error: error.message} )
    }
}