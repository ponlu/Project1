import Joi from "joi";
import { IUser } from "../models/User";

export const validateUser = (data: IUser) => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
    });
    return schema.validate(data);
}
