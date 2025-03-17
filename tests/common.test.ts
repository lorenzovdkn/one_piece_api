import request from "supertest";
import { app } from "../src";
import { prismaMock } from "./jest.setup";

describe("verifyJWT Middleware - No token provided", () => {
  it("should send a 401 status if no token is provided", async () => {
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

    const response = await request(app).post("/characters").send(dataSent);

    expect(response.status).toBe(401);
  });
});
