import { Users } from "@prisma/client";

export type LoginType = Pick<Users, "email" | "password">;
export type UsersType = Partial<Users>;
export type CrudUserParamsType = { id: string };

// deck types
export type DeckCreateType = { name: string; characterIds?: number[] };
export type DeckUpdateType = { name?: string; characterIds?: number[] };
export type CrudDeckParamsType = { id: string };
