import fastifyPlugin from "fastify-plugin";
import { connect } from "mongoose";

async function dbConnector() {
    connect(process.env.DB_CONNECTION!);
}

export default fastifyPlugin(dbConnector);