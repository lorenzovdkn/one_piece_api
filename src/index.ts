import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { charactersRouter } from "./characters/characters.route";
import { usersRouter } from "./users/users.route";
import { decksRouter } from "./decks/decks.route";
import path from "path";
import cors from "cors";

console.log(__dirname);

export const app = express();
const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.join(__dirname, "./swagger.yaml"));

app.use(express.json());
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type, Authorization",
  }),
);

app.use("/characters", charactersRouter);
app.use("/users", usersRouter);
app.use("/decks", decksRouter);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}
