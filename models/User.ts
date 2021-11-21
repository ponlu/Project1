import mongoose, { ObjectId } from "mongoose";
const { Schema, model } = mongoose;

export interface IUser {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
};

export const User = model<IUser>("user", new Schema<IUser>({
    username: { type: String, required: false },
    password: { type: String, required: false },
    email: { type: String, required: false }
}));
