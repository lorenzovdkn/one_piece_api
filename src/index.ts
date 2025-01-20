import express from 'express';
import { router } from './characters/characters.route';

export const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use('/characters', router);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
