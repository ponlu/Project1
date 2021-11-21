import { FastifyReply, FastifyRequest } from "fastify";
import { User, IUser } from "../models/User";
import { validateUser } from "../validations/userValidation";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { hashPassword } from "../helpers/encryption";
import mongoose from "mongoose";
import { Response } from "../interfaces/types/Response";

export default {
    getUser: async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: mongoose.Schema.Types.ObjectId };
        const user = await User.findById(id);
        if (user === null) {
            reply.code(404).send("Cannot find user with id: " + id);
        }
        reply.send(user);
    },

    getUsers: async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await User.find().sort({ username: "asc" });
        reply.send(users);
    },

    register: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const credentials = request.body as IUser;

            const validationData = validateUser(credentials);
            if (validationData.error) {
                return reply.code(400).send(validationData.error.message);
            }

            const userWithEmailOrUsername = await User.find({ $or: [{ email: credentials.email }, { username: credentials.username }] });
            if (userWithEmailOrUsername.length > 0) {
                return reply.code(400).send("An account with that email or username already exists");
            }

            const newUser = await User.create({
                username: credentials.username,
                password: await hashPassword(credentials.password),
                email: credentials.email
            });

            reply.code(200).send(newUser);
        } catch (error) {
            reply.code(500).send(error);
        }
    },

    login: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const credentials = request.body as IUser;

            const user = await User.findOne({ $or: [{ email: credentials.email }, { username: credentials.username }] });
            if (!user) {
                return reply.code(400).send("Cannot find user");
            }

            const passwordIsValid = await bcrypt.compare(
                credentials.password,
                user.password);
            if (!passwordIsValid) {
                reply.code(400).send("Invalid password");
            }

            const token = jwt.sign(
                { _id: user._id },
                process.env.TOKEN_SECRET!
            );

            const response: Response<IUser> = { token: token, value: user };
            reply.code(200).send(response);
        } catch (error) {
            reply.code(500).send(error);
        }
    },

    deleteUser: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { id } = request.params as { id: mongoose.Schema.Types.ObjectId };
            const deleteResult = await User.deleteOne({ _id: id });
            if (deleteResult.deletedCount === 1) {
                reply.code(200).send("User deleted");
            }
            reply.code(404).send("Cannot find user with id: " + id);
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    updateUser: async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const credentials = request.body as IUser;

            let newValues = {} as IUser;
            if (credentials.username != null) newValues.username = credentials.username;
            if (credentials.password != null) newValues.password = await hashPassword(credentials.password);
            if (credentials.email != null) newValues.email = credentials.email;

            const updatedUser = await User.findByIdAndUpdate(credentials._id, newValues, { new: true });

            reply.code(200).send(updatedUser);
        } catch (error) {
            reply.code(400).send(error);
        }
    },
}
