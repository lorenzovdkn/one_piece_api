import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('Decks API', () => {
  describe('GET /decks', () => {
    it('should fetch all decks when data exists', async () => {
      const mockDecks = [
        {
          id: 1,
          name: "Pirate Deck",
          ownerId: 1,
          characters: [{ id: 1, name: "Monkey D. Luffy" }],
        },
      ];

      prismaMock.deck.findMany.mockResolvedValue(mockDecks);

      const response = await request(app).get('/decks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDecks);
    });

    it('should return 204 when no decks are found', async () => {
      prismaMock.deck.findMany.mockResolvedValue([]);

      const response = await request(app).get('/decks');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should handle server errors and return 500', async () => {
      prismaMock.deck.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/decks');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /decks/:id', () => {
    it('should fetch a deck by valid ID', async () => {
      const mockDeck = {
        id: 1,
        name: "Pirate Deck",
        ownerId: 1,
        characters: [{ id: 1, name: "Monkey D. Luffy" }],
      };

      prismaMock.deck.findUnique.mockResolvedValue(mockDeck);

      const response = await request(app).get('/decks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDeck);
    });

    it('should return 400 for an invalid ID format', async () => {
      const response = await request(app).get('/decks/a');

      expect(response.status).toBe(400);
    });

    it('should return 404 when deck is not found', async () => {
      prismaMock.deck.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/decks/99');

      expect(response.status).toBe(404);
    });

    it('should handle server errors and return 500', async () => {
      prismaMock.deck.findUnique.mockRejectedValue(new Error("Get error"));

      const response = await request(app).get('/decks/1');

      expect(response.status).toBe(500);
    });
  });

  describe('POST /decks', () => {

    it('should create a new deck when valid data is sent', async () => {
      const dataSent = {
        name: "Pirate Deck",
        characterIds: [1, 2],
      };

      const createdDeck = {
        id: 1,
        name: "Pirate Deck",
        ownerId: 1,
        characters: [
          { id: 1, name: "Monkey D. Luffy" },
          { id: 2, name: "Zoro" },
        ],
      };

      prismaMock.deck.create.mockResolvedValue(createdDeck);

      const response = await request(app)
        .post('/decks')
        .set('Authorization', 'Bearer mockedToken')
        .send(dataSent);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdDeck);
    });

    it("should return 500 if database error occurs while creating a deck", async () => {
        prismaMock.deck.create.mockRejectedValue(new Error("Database error"));
    
        const response = await request(app)
          .post("/decks")
          .set("Authorization", "Bearer mockedToken")
          .send({ name: "New Deck", characterIds: [1, 2] });
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Database error" });
      });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/decks')
        .set('Authorization', 'Bearer mockedToken')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /decks/:id', () => {
    it("should update deck characters correctly", async () => {
        const existingDeck = {
          id: 1,
          name: "Pirate Deck",
          ownerId: 1,
          characters: [{ id: 1, name: "Monkey D. Luffy" }],
        };
      
        const updatedDeck = {
          id: 1,
          name: "Pirate Deck",
          ownerId: 1,
          characters: [{ id: 2, name: "Zoro" }], 
        };
      
        prismaMock.deck.findUnique.mockResolvedValue(existingDeck);
        prismaMock.deck.update.mockResolvedValue(updatedDeck); 
      
        const response = await request(app)
          .patch("/decks/1")
          .set("Authorization", "Bearer mockedToken")
          .send({ characterIds: [2] });
      
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDeck);
      });    
      
    it("should return 404 if deck does not exist", async () => {
        prismaMock.deck.findUnique.mockResolvedValue(null);
    
        const response = await request(app)
          .patch("/decks/99")
          .set("Authorization", "Bearer mockedToken")
          .send({ name: "Updated Deck" });
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Deck not found." });
      });

    it("should update deck name correctly", async () => {
        const existingDeck = {
          id: 1,
          name: "Pirate Deck",
          ownerId: 1,
          characters: [],
        };
    
        const updatedDeck = {
          ...existingDeck,
          name: "Updated Deck",
        };
    
        prismaMock.deck.findUnique.mockResolvedValue(existingDeck);
        prismaMock.deck.update.mockResolvedValue(updatedDeck);
    
        const response = await request(app)
          .patch("/decks/1")
          .set("Authorization", "Bearer mockedToken")
          .send({ name: "Updated Deck" });
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDeck);
      });
    
      it("should return 500 if database error occurs while updating a deck", async () => {
        prismaMock.deck.findUnique.mockResolvedValue({ 
          id: 1, 
          name: "Pirate Deck",
          ownerId: 1, 
        });
    
        prismaMock.deck.update.mockRejectedValue(new Error("Database error"));
    
        const response = await request(app)
          .patch("/decks/1")
          .set("Authorization", "Bearer mockedToken")
          .send({ name: "Updated Deck" });
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Database error" });
    });

    it('should return 400 if ID is invalid', async () => {
    const response = await request(app)
        .patch('/decks/a')
        .set('Authorization', 'Bearer mockedToken')
        .send({ name: "Updated Deck" });

    expect(response.status).toBe(400);
    });
  });

  describe('DELETE /decks/:id', () => {
    it('should delete a deck by valid ID', async () => {
        const mockDeletedDeck = {
          id: 1,
          name: "Deleted Deck",
          ownerId: 1,
        };
    
        prismaMock.deck.findUnique.mockResolvedValue(mockDeletedDeck);
        prismaMock.deck.delete.mockResolvedValue(mockDeletedDeck);
    
        const response = await request(app)
          .delete('/decks/1')
          .set('Authorization', 'Bearer mockedToken');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockDeletedDeck);
      });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/decks/a')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(400);
    });

    it('should return 404 if deck not found', async () => {
      prismaMock.deck.delete.mockRejectedValue(new Error("Deck not found"));

      const response = await request(app)
        .delete('/decks/99')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
    });

    it("should return 500 if database error occurs while deleting a deck", async () => {
        prismaMock.deck.findUnique.mockResolvedValue({ 
          id: 1, 
          name: "Pirate Deck",
          ownerId: 1 
        }); 
    
        prismaMock.deck.delete.mockRejectedValue(new Error("Database error"));
    
        const response = await request(app)
          .delete("/decks/1")
          .set("Authorization", "Bearer mockedToken");
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Database error" });
    });
    

    it('should handle server errors and return 500', async () => {
        prismaMock.deck.findUnique.mockResolvedValue({ id: 1, name: "Test Deck", ownerId: 1 }); // Mock findUnique pour éviter 404
        prismaMock.deck.delete.mockRejectedValue(new Error("Database error"));
      
        const response = await request(app)
          .delete('/decks/1')
          .set('Authorization', 'Bearer mockedToken');
      
        expect(response.status).toBe(500);
      });      
  });
});