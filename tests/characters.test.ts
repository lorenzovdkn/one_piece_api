import request from "supertest";
import { app } from "../src";
import { prismaMock } from "./jest.setup";

describe("Characters API", () => {
  /**
   * Tests pour la route GET /characters
   */
  describe("GET /characters", () => {
    it("should fetch all characters when data exists", async () => {
      const mockCharacters = [
        {
          id: 1,
          name: "Monkey D. Luffy",
          affiliationId: 1,
          lifePoints: 1000,
          size: 1.74,
          age: 19,
          weight: 70,
          imageUrl: "",
        },
        {
          id: 2,
          name: "Baggy",
          affiliationId: 2,
          lifePoints: 100,
          size: 1.92,
          age: 39,
          weight: 50,
          imageUrl: "",
        },
      ];
      prismaMock.character.findMany.mockResolvedValue(mockCharacters);

      const response = await request(app).get("/characters");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCharacters);
    });

    it("should return 204 when no characters are found", async () => {
      prismaMock.character.findMany.mockResolvedValue([]);

      const response = await request(app).get("/characters");

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

    it("should handle server errors and return 500", async () => {
      prismaMock.character.findMany.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app).get("/characters");

      expect(response.status).toBe(500);
    });
  });

  /**
   * Tests pour la route GET /characters/:id
   */
  describe("GET /characters/:id", () => {
    it("should fetch a character by valid ID", async () => {
      const mockCharacter = {
        id: 1,
        name: "Monkey D. Luffy",
        affiliationId: 1,
        lifePoints: 1000,
        size: 1.74,
        age: 19,
        weight: 70,
        imageUrl: "",
      };

      prismaMock.character.findUnique.mockResolvedValue(mockCharacter);

      const response = await request(app).get("/characters/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCharacter);
    });

    it("should return 400 for an invalid ID format", async () => {
      const response = await request(app).get("/characters/a");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "ID Invalid. Must be a number.",
      });
    });

    it("should return 404 when character is not found", async () => {
      prismaMock.character.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/characters/1");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Character not found." });
    });

    it("should handle server errors and return 500 on get by id", async () => {
      prismaMock.character.findUnique.mockRejectedValue(new Error("Get error"));

      const response = await request(app).get("/characters/1");

      expect(response.status).toBe(500);
    });
  });

  /**
   * Tests pour la route PATCH /characters/:id
   */
  describe("PATCH /characters/:id", () => {
    it("should update a character by valid ID", async () => {
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
        ...character,
        name: "Monkey D. Luffy (Updated)",
        affiliation: {
          id: 1,
          name: "Straw Hat Pirates",
        },
      };

      prismaMock.character.findUnique.mockResolvedValue(character);
      prismaMock.character.update.mockResolvedValue(updatedCharacter);

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send({ name: "Monkey D. Luffy (Updated)" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCharacter);
    });

    it("should return 400 when no data is provided to update", async () => {
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

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "No data provided to update or invalid.",
      });
    });

    it("should return 400 for invalid ID format", async () => {
      const response = await request(app)
        .patch("/characters/a")
        .set("Authorization", "Bearer mockedToken")
        .send({ name: "Some Name" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "ID invalid. Must be a number." });
    });

    it("should return 404 for character not found", async () => {
      const response = await request(app)
        .patch("/characters/4")
        .set("Authorization", "Bearer mockedToken")
        .send({});

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Character not found." });
    });

    it("should update a character with affiliation.connectOrCreate when affiliation is provided", async () => {
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
        ...character,
        name: "Monkey D. Luffy Updated",
        affiliation: {
          id: 2,
          name: "New Affiliation",
        },
      };

      prismaMock.character.findUnique.mockResolvedValue(character);
      prismaMock.character.update.mockResolvedValue(updatedCharacter);

      const dataToSend = {
        name: "Monkey D. Luffy Updated",
        affiliation: { name: "New Affiliation" },
      };

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send(dataToSend);

      expect(prismaMock.character.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "Monkey D. Luffy Updated",
          affiliation: {
            connectOrCreate: {
              where: { name: "New Affiliation" },
              create: { name: "New Affiliation" },
            },
          },
        },
        include: { affiliation: true },
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCharacter);
    });

    it("should return 400 when affiliation name is incorrect", async () => {
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

      const dataToSend = {
        name: "Monkey D. Luffy Updated",
        affiliation: { test: "New Affiliation" },
      };

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send(dataToSend);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Invalid affiliation. Name is required.",
      );
    });

    it("should return 400 if no update data provided and affiliation is invalid (missing name)", async () => {
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

      const dataToSend = {
        affiliation: { test: "New Affiliation" },
      };

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send(dataToSend);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "No data provided to update or invalid.",
      });
    });

    it("should handle server errors and return 500 on update", async () => {
      prismaMock.character.findUnique.mockRejectedValue(
        new Error("Update error"),
      );

      const response = await request(app)
        .patch("/characters/1")
        .set("Authorization", "Bearer mockedToken")
        .send({ name: "Monkey D. Luffy Updated" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  /**
   * Test pour la route DELETE /characters/:id
   */
  describe("DELETE /characters/:id", () => {
    it("should delete a character by valid ID", async () => {
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

      const response = await request(app)
        .delete("/characters/1")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(character);
    });

    it("should return 400 for invalid Id", async () => {
      const response = await request(app)
        .delete("/characters/a")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "ID invalid. Must be a number." });
    });

    it("should return 404 not found character ", async () => {
      const response = await request(app)
        .delete("/characters/9")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Character not found." });
    });

    it("should handle server errors and return 500 on update", async () => {
      prismaMock.character.findUnique.mockRejectedValue(
        new Error("Update error"),
      );

      const response = await request(app)
        .delete("/characters/1")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  /**
   * Tests pour la route POST /characters
   */
  describe("POST /characters", () => {
    it("should create a new character when valid data is sent", async () => {
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
        affiliation: { name: "Straw Hat Pirates" },
      };

      const createdCharacter = {
        ...dataSent,
        id: 1,
        affiliation: affiliation,
        affiliationId: affiliation.id,
      };

      prismaMock.affiliation.findUnique.mockResolvedValue(affiliation);
      prismaMock.affiliation.create.mockResolvedValue(affiliation);
      prismaMock.character.create.mockResolvedValue(createdCharacter);

      const response = await request(app)
        .post("/characters")
        .set("Authorization", "Bearer mockedToken")
        .send(dataSent);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdCharacter);
    });

    it("should return 409 when character already exists", async () => {
      prismaMock.character.findFirst.mockResolvedValue({
        id: 1,
        name: "Monkey D. Luffy",
        affiliationId: 1,
        lifePoints: 1000,
        size: 1.74,
        age: 19,
        weight: 70,
        imageUrl: "",
      });

      const dataSent = {
        name: "Monkey D. Luffy",
        lifePoints: 1000,
        size: 1.74,
        age: 19,
        weight: 70,
        imageUrl: "",
        affiliation: { name: "Straw Hat Pirates" },
      };

      const response = await request(app)
        .post("/characters")
        .set("Authorization", "Bearer mockedToken")
        .send(dataSent);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "Character is already exisiting",
      });
    });

    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/characters")
        .set("Authorization", "Bearer mockedToken")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should handle server errors and return 500", async () => {
      const dataSent = {
        name: "Monkey D. Luffy",
        lifePoints: 1000,
        size: 1.74,
        age: 19,
        weight: 70,
        imageUrl: "",
        affiliation: { name: "Straw Hat Pirates" },
      };

      prismaMock.affiliation.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .post("/characters")
        .set("Authorization", "Bearer mockedToken")
        .send(dataSent);

      expect(response.status).toBe(500);
    });
  });
});
