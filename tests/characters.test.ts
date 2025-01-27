import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import jwt from 'jsonwebtoken';
import { response } from 'express';


describe('Characters API', () => {
  describe('GET /characters', () => {
    it('should fetch all PokemonCards', async () => {
      const mockCharacters = [
        {
          "id": 1,
          "name": "Monkey D. Luffy",
          "affiliationId": 1,
          "lifePoints": 1000,
          "size": 1.74,
          "age": 19,
          "weight": 70,
          "imageUrl": ""
        },
        {
          "id": 2,
          "name": "Baggy",
          "affiliationId": 2,
          "lifePoints": 100,
          "size": 1.92,
          "age": 39,
          "weight": 50,
          "imageUrl": ""
        }
      ];

      prismaMock.character.findMany.mockResolvedValue(mockCharacters);

      const response = await request(app).get('/characters');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCharacters);
    });
  })
});

it('should return 204 when no characters are found', async () => {
  const mockCharacters: any[] = [];

  prismaMock.character.findMany.mockResolvedValue(mockCharacters);

  const response = await request(app).get('/characters');

  expect(response.status).toBe(204);
  expect(response.body).toEqual({}); 
});

it('should handle server errors and return 500', async () => {
  const errorMessage = 'Database error';

  prismaMock.character.findMany.mockRejectedValue(new Error(errorMessage));

  const response = await request(app).get('/characters');

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('error', errorMessage);
});

describe('GET /characters/:id', () => {
  it('should fetch a character by ID', async () => {
    const mockCharacter = {
      "id": 1,
      "name": "Monkey D. Luffy",
      "affiliationId": 1,
      "lifePoints": 1000,
      "size": 1.74,
      "age": 19,
      "weight": 70,
      "imageUrl": ""
    };

    prismaMock.character.findUnique.mockResolvedValue(mockCharacter);

    const response = await request(app).get('/characters/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCharacter);
  })
})

describe('GET /characters/:id', () => {
  it('should return a 400 for invalid ID ', async () => {
    const mockCharacter = {
      "id": 1,
      "name": "Monkey D. Luffy",
      "affiliationId": 1,
      "lifePoints": 1000,
      "size": 1.74,
      "age": 19,
      "weight": 70,
      "imageUrl": ""
    };

    prismaMock.character.findUnique.mockResolvedValue(mockCharacter);

    const response = await request(app).get('/characters/a');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      "error": "ID Invalid. Must be a number."
    });
  })
})

describe('GET /characters/:id', () => {
  it('should return 404 for character not found', async () => {
    const mockCharacter = {
      "id": 1,
      "name": "Monkey D. Luffy",
      "affiliationId": 1,
      "lifePoints": 1000,
      "size": 1.74,
      "age": 19,
      "weight": 70,
      "imageUrl": ""
    };

    const response = await request(app).get('/characters/1');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({"error": 'Character not found.'});
  })
})

describe('PATCH /characters/:id', () => {
  it('should update a character by ID', async () => {

    const character = {
      id: 1,
      name: "Monkey D. Luffy",
      affiliationId: 1,
      lifePoints: 1000,
      size: 1.74,
      age: 19,
      weight: 70,
      imageUrl: "",
    };

    const updatedCharacter = {
      id: 1,
      name: "Monkey D. Luffy (Updated)",
      affiliationId: 1,
      lifePoints: 1000,
      size: 1.74,
      age: 19,
      weight: 70,
      imageUrl: "",
      affiliation: {
        id: 1,
        name: "Straw Hat Pirates",
      },
    };    

    prismaMock.character.findUnique.mockResolvedValue(character);
    prismaMock.character.update.mockResolvedValue(updatedCharacter);

    const response = await request(app).patch('/characters/1').set('Authorization', `Bearer mockedToken`).send({ name: 'Monkey D. Luffy (Updated)' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedCharacter);
  })
})

describe('DELETE /character/:id', () => {
  it('should delete a character by ID', async () => {

    const character = {
      id: 1,
      name: "Monkey D. Luffy",
      affiliationId: 1,
      lifePoints: 1000,
      size: 1.74,
      age: 19,
      weight: 70,
      imageUrl: "",
    };

    prismaMock.character.findUnique.mockResolvedValue(character);
    prismaMock.character.delete.mockResolvedValue(character);

    const response = await request(app).delete('/characters/1').set('Authorization', `Bearer mockedToken`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(character);
  })
})

describe('POST /characters', () => { 
  it('should create a new character', async () => {
    const affiliation = {
      id: 1,
      name: "Straw Hat Pirates",
    };

    const dataSent = {
      name: "Monkey D. Luffy",
      lifePoints: 1000,
      size: 1.74,
      age: 19,
      weight: 70,
      imageUrl: "",
      affiliation: {
        name: "Straw Hat Pirates",
      },
    };

    const createdCharacter = {
      ...dataSent,
      id:1,
      affiliation: affiliation,
      affiliationId: affiliation.id,

    };

    prismaMock.affiliation.findUnique.mockResolvedValue(affiliation);
    prismaMock.affiliation.create.mockResolvedValue(affiliation);
    prismaMock.character.create.mockResolvedValue(createdCharacter);

    const response = await request(app)
      .post('/characters')
      .set('Authorization', `Bearer mockedToken`)
      .send(dataSent);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdCharacter);
  });
});
