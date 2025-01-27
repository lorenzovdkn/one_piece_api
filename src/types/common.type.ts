import { Users } from "@prisma/client";

export type LoginType = Pick<Users, 'email' | 'password'>;
export type UsersType = Partial<Users>;
export type CrudUserParamsType = {id : string}