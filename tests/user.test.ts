import request from "supertest";
import { app } from "../src";
import { prismaMock } from "./jest.setup";

describe("User API", () => {
  describe("Post /login", () => {
    it("should login a user and return a token", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "truePassword",
      };

      const token = "mockedToken";

      prismaMock.users.create.mockResolvedValue(mockUser);
      prismaMock.users.findUnique.mockResolvedValue(mockUser);

      const response = await request(app).post("/users/login").send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token,
        userId: 1,
      });
    });

    it("should return 201 with error if user is not found", async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post("/users/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ error: "Invalid identifiers" });
    });

    it("should return 400 with error if password is invalid", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
        password: "truePassword",
      };
      prismaMock.users.findUnique.mockResolvedValue(user);

      const response = await request(app)
        .post("/users/login")
        .send({ email: "test@example.com", password: "wrongPassword" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid identifiers" });
    });

    it("should handle server errors and return 500", async () => {
      const mockUser = {
        email: "test@example.com",
        password: "truePassword",
      };

      prismaMock.users.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app).post("/users/login").send(mockUser);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /users - Missing required fields", () => {
    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "d@d.d" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Please enter all required information",
      });
    });

    it("should return 409 when email already exists", async () => {
      prismaMock.users.findUnique.mockResolvedValue({
        id: 1,
        email: "existing@example.com",
        password: "hashedPassword",
      });

      const response = await request(app).post("/users").send({
        email: "existing@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });

    it("should create a new user and return 201", async () => {
      const mockUser = {
        email: "test@example.com",
        password: "truePassword",
      };

      prismaMock.users.findUnique.mockResolvedValue(null);

      prismaMock.users.createMany.mockResolvedValue({ count: 1 });

      const response = await request(app).post("/users").send(mockUser);

      expect(response.status).toBe(201);
    });

    it("should return 500 if an internal server error occurs", async () => {
      prismaMock.users.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .post("/users")
        .send({ email: "error@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /users/:id - Update user", () => {
    it("should return 400 if User ID is invalid", async () => {
      const response = await request(app)
        .patch("/users/abc")
        .set("Authorization", "Bearer mockedToken")
        .send({ email: "updated@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid User ID" });
    });

    it("should return 404 if user is not found", async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch("/users/1")
        .set("Authorization", "Bearer mockedToken")
        .send({ email: "updated@example.com" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });

    it("should return 400 if no update data is provided", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "truePassword",
      };
      prismaMock.users.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .patch("/users/1")
        .set("Authorization", "Bearer mockedToken")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "No data provided to update" });
    });

    it("should update a user and return 200", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };
      const updatedUser = {
        id: 1,
        email: "updated@example.com",
        password: "newHashedPassword",
      };

      prismaMock.users.findUnique.mockResolvedValue(mockUser);
      prismaMock.users.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .patch("/users/1")
        .set("Authorization", "Bearer mockedToken")
        .send({ email: "updated@example.com", password: "newPassword" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it("should return 500 if an internal server error occurs", async () => {
      prismaMock.users.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .patch("/users/1")
        .set("Authorization", "Bearer mockedToken")
        .send({ email: "updated@example.com" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /users/:id - Delete User", () => {
    it("should return 400 if User ID is invalid", async () => {
      const response = await request(app)
        .delete("/users/abc")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid User ID" });
    });

    it("should return 404 if user is not found", async () => {
      prismaMock.users.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete("/users/1")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });

    it("should delete a user and return 200", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      };
      prismaMock.users.findUnique.mockResolvedValue(mockUser);
      prismaMock.users.delete.mockResolvedValue(mockUser);

      const response = await request(app)
        .delete("/users/1")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should return 500 if an internal server error occurs", async () => {
      prismaMock.users.findUnique.mockRejectedValue(
        new Error("Database error"),
      );

      const response = await request(app)
        .delete("/users/1")
        .set("Authorization", "Bearer mockedToken");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
