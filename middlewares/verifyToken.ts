import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        // request.headers["auth-token"]
        const token = request.headers["auth-token"] as string;
        try {
            jwt.verify(token, process.env.TOKEN_SECRET!);
        } catch (error) {
            reply.code(401).send(error);
        }
    } catch (error) {
        reply.code(500).send(error);
    }
};
