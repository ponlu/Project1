import { FastifyInstance } from "fastify";
import FastifyPlugin from "fastify-plugin";
import userController from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyToken";

const userRoutes = async (fastify: FastifyInstance) => {
    fastify.get("/getUser/:id", userController.getUser);
    fastify.get("/getUsers", userController.getUsers);
    fastify.post("/register", userController.register);
    fastify.post("/login", userController.login);
    fastify.delete("/deleteUser/:id", { onRequest: verifyToken }, userController.deleteUser);
    fastify.patch("/updateUser", { onRequest: verifyToken }, userController.updateUser);
};

export default FastifyPlugin(userRoutes);