import fastify from "fastify";
import fastifyAutoload from "fastify-autoload";
import path from "path";
import dotenv from "dotenv";
import middiePlugin from "middie";
import dbConnection from "./config/databaseConfig"
import fastifyCors from "fastify-cors";
import fastifyCookie, { FastifyCookieOptions } from "fastify-cookie"

const app = fastify({
    logger: true
});

dotenv.config();

app.register(fastifyCookie, {
    secret: "my-secret", // for cookies signature
    parseOptions: {}     // options for parsing cookies
} as FastifyCookieOptions)
app.register(fastifyCors, {
    origin: "http://localhost:3000"
});
app.register(dbConnection);
app.register(middiePlugin);
app.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes")
});

app.listen(4000);
