import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { charactersRouter } from './characters/characters.route';
import { usersRouter } from './users/users.route';
import path from 'path';

export const app = express();
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/characters', charactersRouter);
app.use('/users', usersRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
