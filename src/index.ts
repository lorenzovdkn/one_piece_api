import express from 'express';
import { charactersRouter } from './characters/characters.route';
import { usersRouter } from './users/users.route';

export const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use('/characters', charactersRouter);
app.use('/users', usersRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
