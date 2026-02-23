import type { RequestHandler } from "express";
import { User, type UserInstance } from "../models/user.model.js";
import { getCredentialsOrThrow } from "../helpers/auth-request.helper.js";
import { createUser } from "../auth/services/user.service.js";
import type { CreateUserResult } from "../types/create-user-result.type.js";
import type { ParseEmailAndPasswordResult } from "../interfaces/parse-email-and-password-result.interface.js";
import { HttpError } from "../errors/http.error.js";
import type { PublicUser } from "../interfaces/public-user.interface.js";

export const ping: RequestHandler = (_req, res): void => {
    res.status(200).json({ message: "pong" });
};

export const login: RequestHandler = (req, res, next): void => {
    const user: PublicUser | undefined = req.user as PublicUser | undefined;

    if (!user) {
        next(new HttpError(401, "Não autorizado"));
        return;
    }

    res.status(200).json({ message: "Login realizado com sucesso.", user });
};

export const register: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const data: ParseEmailAndPasswordResult = getCredentialsOrThrow(req);
        const { email, password }: ParseEmailAndPasswordResult = data;
        const response: CreateUserResult = await createUser(email, password);

        if (!response.isValid) {
            throw new HttpError(response.status, response.message);
        }

        res.status(response.status).json({ message: response.message, user: response.data });
    } catch (error) {
        next(error);
    }
};

export const list: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const users: UserInstance[] = await User.findAll();

        if (users.length === 0) {
            res.status(200).json({ list: [] });
            return;
        }

        const emails: string[] = users.map((user: UserInstance): string => user.email);
        res.status(200).json({ list: emails });
    } catch (error) {
        next(error);
    }
};