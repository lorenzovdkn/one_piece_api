import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import { response } from 'express';
import bcrypt from 'bcrypt';

describe('User API', () => {
    describe('Post /login', () => {
        it('should login a user and return a token', async () => {
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: 'truePassword',
            };

            const token = 'mockedToken';

            prismaMock.users.create.mockResolvedValue(mockUser);
            prismaMock.users.findUnique.mockResolvedValue(mockUser);

            const response = await request(app).post('/users/login').send(mockUser);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                token,});
        });
    })
})

// describe('User API', () => {
//   describe('POST /users', () => {
//     it('should create a new user', async () => {
//       const createdUser = {};

//       expect(response.status).toBe(201);
//       expect(response.body).toEqual(createdUser);
//     });
//   });

//   describe('POST /login', () => {
//     it('should login a user and return a token', async () => {
//       const user = {};
//       const token = 'mockedToken';

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({
//         token,
//         message: 'Connexion réussie',
//       });
//     });
//   });
// });
