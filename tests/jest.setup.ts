import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "../src/client";
import { stopServer } from "../src";

// Mock de PrismaClient
jest.mock("../src/client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Mock de jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn((token) => {
    if (token === "mockedToken") {
      return { userId: "mockedUserId" };
    }
    throw new Error("Invalid token");
  }),
  sign: jest.fn(() => "mockedToken"),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: jest.fn((password) => {
    if (password === "truePassword") {
      return true;
    }
    return false;
  }),
}));

beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});

afterAll(() => {
  stopServer();
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
